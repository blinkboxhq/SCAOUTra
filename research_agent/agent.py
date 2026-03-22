"""
Scoutra AI Research Agent
Scrapes a business website, enriches with external intel, analyses with Claude,
and generates a professional HTML opportunity report.

Usage:
    uv run research_agent/agent.py --business "Bakkerij De Molen" --website "https://bakkerijdemolen.nl"
    uv run research_agent/agent.py --demo
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

# Ensure the project root is on sys.path so `research_agent` is importable
# when this file is executed directly (e.g. uv run research_agent/agent.py)
_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))
from textwrap import dedent

import anthropic
import httpx
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from jinja2 import Environment, FileSystemLoader

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
REPORTS_DIR = ROOT / "reports"
LOG_FILE = ROOT / "research_log.csv"
TEMPLATE_DIR = Path(__file__).resolve().parent

# ---------------------------------------------------------------------------
# Web scraping
# ---------------------------------------------------------------------------

def scrape_website(url: str) -> dict:
    """Fetch a website and extract structured data."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/124.0.0.0 Safari/537.36"
        )
    }

    try:
        with httpx.Client(follow_redirects=True, timeout=20, headers=headers) as client:
            resp = client.get(url)
            resp.raise_for_status()
    except httpx.HTTPError as exc:
        print(f"  [!] Failed to fetch {url}: {exc}")
        return {"error": str(exc), "body_text": "", "title": "", "headings": [], "links": [], "contact_info": {}, "technologies": []}

    soup = BeautifulSoup(resp.text, "lxml")

    # Title
    title = soup.title.string.strip() if soup.title and soup.title.string else ""

    # Meta description
    meta_tag = soup.find("meta", attrs={"name": "description"})
    meta_desc = meta_tag["content"].strip() if meta_tag and meta_tag.get("content") else ""

    # Headings
    headings = []
    for tag in soup.find_all(re.compile(r"^h[1-3]$")):
        txt = tag.get_text(strip=True)
        if txt:
            headings.append(txt)

    # Body text (first ~3000 chars of visible text)
    for el in soup(["script", "style", "nav", "footer", "header", "noscript"]):
        el.decompose()
    body_text = soup.get_text(separator="\n", strip=True)[:3000]

    # Links
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("http"):
            links.append(href)
    links = list(dict.fromkeys(links))[:20]  # dedupe, cap at 20

    # Contact info
    contact: dict[str, str] = {}
    email_match = re.search(r"[\w.+-]+@[\w-]+\.[\w.-]+", body_text)
    if email_match:
        contact["email"] = email_match.group()
    phone_match = re.search(r"(\+?\d[\d\s\-()]{7,}\d)", body_text)
    if phone_match:
        contact["phone"] = phone_match.group().strip()

    # Technologies (from HTML hints)
    techs = []
    raw_html = resp.text.lower()
    tech_signals = {
        "WordPress": "wp-content",
        "Shopify": "shopify",
        "WooCommerce": "woocommerce",
        "Squarespace": "squarespace",
        "Wix": "wix.com",
        "React": "react",
        "Next.js": "_next/",
        "Vue": "vue",
        "Tailwind CSS": "tailwindcss",
        "Bootstrap": "bootstrap",
        "jQuery": "jquery",
        "Google Analytics": "google-analytics",
        "Google Tag Manager": "googletagmanager",
        "Mailchimp": "mailchimp",
        "HubSpot": "hubspot",
        "Stripe": "stripe",
        "Mollie": "mollie",
    }
    for name, signal in tech_signals.items():
        if signal in raw_html:
            techs.append(name)

    return {
        "title": title,
        "meta_description": meta_desc,
        "headings": headings,
        "body_text": body_text,
        "links": links,
        "contact_info": contact,
        "technologies": techs,
    }


# ---------------------------------------------------------------------------
# Claude AI analysis
# ---------------------------------------------------------------------------

ANALYSIS_SYSTEM_PROMPT = dedent("""\
    You are a senior business automation consultant working for Scoutra AI.
    Your job is to analyse scraped website data and additional intelligence about
    a business, then produce a structured opportunity analysis.

    Always respond with valid JSON matching the schema below — no markdown fences,
    no commentary outside the JSON object.
""")

ANALYSIS_SCHEMA = dedent("""\
    {
      "overview": "<HTML string — 2-3 paragraphs summarising the business: what they do, approximate size, market, key offerings. Use <p> tags.>",
      "operations_analysis": "<HTML string — 2-3 paragraphs analysing current operations: what appears manual, what's inefficient, digital maturity observations. Use <p> tags.>",
      "opportunities": [
        {
          "title": "<short name>",
          "description": "<1-2 sentences>",
          "time_saved": "<e.g. 5-8 hours>",
          "complexity": "Easy | Medium | Hard",
          "roi": "<e.g. 3x in 6 months>"
        }
      ],
      "recommended_first": {
        "title": "<same as one of the opportunities>",
        "reasoning": "<2-3 sentences on why to start here>"
      },
      "solution_summary": "<HTML string — 1-2 paragraphs on what Scoutra would build. Use <p> tags.>",
      "suggested_tools": [
        { "name": "<tool name>", "usage": "<one-line description>" }
      ]
    }
""")


def analyse_with_claude(
    business_name: str,
    website: str,
    scraped: dict,
    extra_intel: str,
    client: anthropic.Anthropic,
) -> dict:
    """Send data to Claude and get a structured analysis back."""

    user_prompt = dedent(f"""\
        Business name: {business_name}
        Website: {website}

        === SCRAPED WEBSITE DATA ===
        Title: {scraped.get('title', 'N/A')}
        Meta description: {scraped.get('meta_description', 'N/A')}
        Headings: {json.dumps(scraped.get('headings', []))}
        Technologies detected: {json.dumps(scraped.get('technologies', []))}
        Contact info: {json.dumps(scraped.get('contact_info', {}))}
        Links: {json.dumps(scraped.get('links', [])[:10])}

        Body text (truncated):
        {scraped.get('body_text', 'No text extracted.')[:2000]}

        === ADDITIONAL INTELLIGENCE ===
        {extra_intel if extra_intel else 'No additional intelligence available.'}

        Now produce the JSON analysis. Include exactly 3 opportunities.
        Respond ONLY with the JSON object matching this schema:
        {ANALYSIS_SCHEMA}
    """)

    print("  [>] Sending data to Claude for analysis …")
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system=ANALYSIS_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_prompt}],
    )

    raw = message.content[0].text.strip()
    # Strip markdown fences if Claude wraps them anyway
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)

    return json.loads(raw)


# ---------------------------------------------------------------------------
# Report generation
# ---------------------------------------------------------------------------

def generate_report(business_name: str, website: str, analysis: dict) -> Path:
    """Render the Jinja2 template and save the HTML report."""
    env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)), autoescape=False)
    template = env.get_template("template.html")

    html = template.render(
        business_name=business_name,
        website=website,
        date=datetime.now(timezone.utc).strftime("%d %B %Y"),
        overview=analysis["overview"],
        operations_analysis=analysis["operations_analysis"],
        opportunities=analysis["opportunities"],
        recommended_first=analysis["recommended_first"],
        solution_summary=analysis["solution_summary"],
        suggested_tools=analysis["suggested_tools"],
    )

    REPORTS_DIR.mkdir(exist_ok=True)
    safe_name = re.sub(r"[^\w]+", "_", business_name).strip("_")
    out_path = REPORTS_DIR / f"{safe_name}_Scoutra_Report.html"
    out_path.write_text(html, encoding="utf-8")
    return out_path


# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

def log_research(business_name: str, website: str, num_opps: int, report_path: Path):
    """Append a row to research_log.csv."""
    file_exists = LOG_FILE.exists()
    with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["date", "business_name", "website", "opportunities_found", "report_path"])
        writer.writerow([
            datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
            business_name,
            website,
            num_opps,
            str(report_path),
        ])


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Scoutra AI Research Agent - generate business opportunity reports",
    )
    parser.add_argument("--business", type=str, help="Business name")
    parser.add_argument("--website", type=str, help="Business website URL")
    parser.add_argument("--demo", action="store_true", help="Run with fake demo data (no API key needed for scraping)")
    args = parser.parse_args()

    if not args.demo and (not args.business or not args.website):
        parser.error("Provide --business and --website, or use --demo")

    load_dotenv(ROOT / ".env")

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY not found in .env file.")
        print("Create a .env file at the project root with your key. See .env.example.")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    if args.demo:
        from research_agent.demo_data import (
            DEMO_BUSINESS,
            DEMO_EXTRA_INTEL,
            DEMO_SCRAPED,
            DEMO_WEBSITE,
        )
        business_name = DEMO_BUSINESS
        website = DEMO_WEBSITE
        scraped = DEMO_SCRAPED
        extra_intel = DEMO_EXTRA_INTEL
        print(f"\n  *  DEMO MODE - using fake data for '{business_name}'\n")
    else:
        business_name = args.business
        website = args.website

        # Normalise URL
        if not website.startswith("http"):
            website = "https://" + website

        print(f"\n  *  Researching: {business_name}")
        print(f"     Website: {website}\n")

        # Step 1: Scrape
        print("  [1/3] Scraping website …")
        scraped = scrape_website(website)
        if scraped.get("error"):
            print(f"  [!] Scraping had errors but continuing with partial data.")

        # Step 2: Extra intel (placeholder — extend with real APIs later)
        print("  [2/3] Gathering additional intelligence …")
        extra_intel = ""  # No external search API configured yet

    # Step 3: Claude analysis
    print("  [3/3] Analysing with Claude AI …")
    try:
        analysis = analyse_with_claude(business_name, website, scraped, extra_intel, client)
    except json.JSONDecodeError as exc:
        print(f"  [!] Claude returned invalid JSON: {exc}")
        sys.exit(1)
    except anthropic.APIError as exc:
        print(f"  [!] Anthropic API error: {exc}")
        sys.exit(1)

    # Step 4: Generate report
    print("  [4/4] Generating report …")
    report_path = generate_report(business_name, website, analysis)
    num_opps = len(analysis.get("opportunities", []))

    # Step 5: Log
    log_research(business_name, website, num_opps, report_path)

    print(f"\n  [OK] Report saved: {report_path}")
    print(f"  [OK] Found {num_opps} automation opportunities")
    print(f"  [OK] Logged to {LOG_FILE}\n")


if __name__ == "__main__":
    main()
