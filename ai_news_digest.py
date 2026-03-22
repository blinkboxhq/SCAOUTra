# /// script
# requires-python = ">=3.9"
# dependencies = [
#   "anthropic",
#   "requests",
#   "python-dotenv",
# ]
# ///
"""
AI News Digest Script

Modes:
  Daily  (default) — top 3 articles per topic, concise summaries
  Weekly (--weekly) — top 7 articles per topic, full week-in-review + trends

Scheduled automatically via Windows Task Scheduler:
  Daily  → every day at 12:00 PM
  Weekly → every Sunday at 12:00 PM

Run manually:
  uv run ai_news_digest.py
  uv run ai_news_digest.py --weekly
"""

import os
import sys
import smtplib
from pathlib import Path

from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent / ".env")
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime

import requests
import anthropic

# ── Config (loaded from environment variables) ────────────────────────────────
NEWS_API_KEY       = os.environ["NEWS_API_KEY"]
CLAUDE_API_KEY     = os.environ["ANTHROPIC_API_KEY"]
RECIPIENT_EMAIL    = os.environ.get("DIGEST_RECIPIENT_EMAIL", "ceoaaina1997@gmail.com")
SENDER_EMAIL       = os.environ.get("DIGEST_SENDER_EMAIL", "ceoaaina1997@gmail.com")
GMAIL_APP_PASSWORD = os.environ["GMAIL_APP_PASSWORD"]

# ── Topics ────────────────────────────────────────────────────────────────────
TOPICS = {
    "🤖 Artificial Intelligence": "artificial intelligence",
    "🧠 Claude & Anthropic":      "Claude AI Anthropic",
    "⚡ AI Agents & Agentic AI":  "AI agents agentic LLM",
}

DAILY_ARTICLES  = 3
WEEKLY_ARTICLES = 7


# ── Fetch ─────────────────────────────────────────────────────────────────────

def fetch_topic_news(query: str, n: int) -> list[dict]:
    response = requests.get(
        "https://newsapi.org/v2/everything",
        params={
            "q": query,
            "sortBy": "publishedAt",
            "pageSize": n,
            "language": "en",
            "apiKey": NEWS_API_KEY,
        },
        timeout=15,
    )
    response.raise_for_status()
    return response.json().get("articles", [])[:n]


def fetch_all_news(articles_per_topic: int) -> dict[str, list[dict]]:
    print("Fetching news from NewsAPI...")
    seen_urls: set[str] = set()
    results: dict[str, list[dict]] = {}
    for label, query in TOPICS.items():
        unique = []
        for a in fetch_topic_news(query, articles_per_topic):
            url = a.get("url", "")
            if url not in seen_urls:
                seen_urls.add(url)
                unique.append(a)
        results[label] = unique
        print(f"  ✓ {label}: {len(unique)} articles")
    return results


# ── Summarise ─────────────────────────────────────────────────────────────────

def _articles_block(articles: list[dict]) -> str:
    block = ""
    for i, a in enumerate(articles, 1):
        block += (
            f"--- Article {i} ---\n"
            f"Title:   {a.get('title', 'N/A')}\n"
            f"Source:  {a.get('source', {}).get('name', 'Unknown')}\n"
            f"Date:    {a.get('publishedAt', 'Unknown')}\n"
            f"URL:     {a.get('url', '')}\n"
            f"Preview: {a.get('description') or a.get('content') or 'No preview.'}\n\n"
        )
    return block


def summarize_daily(topic_articles: dict[str, list[dict]]) -> dict[str, str]:
    print("Summarizing (daily mode) with Claude Opus 4.6...")
    client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)
    summaries: dict[str, str] = {}
    for label, articles in topic_articles.items():
        if not articles:
            summaries[label] = "No articles found for this topic today."
            continue
        prompt = (
            f"You are an expert AI journalist. Summarize these {label} news articles "
            "into a concise daily digest section:\n\n"
            f"{_articles_block(articles)}"
            "For each article write:\n"
            "• 2-3 sentence summary\n"
            "• One 'Why it matters' insight\n\n"
            "End with a one-sentence takeaway for this topic.\n"
            "Plain text only, no markdown headers, executive-friendly tone."
        )
        with client.messages.stream(
            model="claude-opus-4-6",
            max_tokens=1024,
            thinking={"type": "adaptive"},
            messages=[{"role": "user", "content": prompt}],
        ) as stream:
            final = stream.get_final_message()
        for block in final.content:
            if block.type == "text":
                summaries[label] = block.text
                print(f"  ✓ {label}")
                break
    return summaries


def summarize_weekly(topic_articles: dict[str, list[dict]]) -> dict[str, str]:
    """Weekly mode: per-topic deep summary + trends + what to watch."""
    print("Summarizing (weekly mode) with Claude Opus 4.6...")
    client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)
    summaries: dict[str, str] = {}
    for label, articles in topic_articles.items():
        if not articles:
            summaries[label] = "No articles found for this topic this week."
            continue
        prompt = (
            f"You are a senior AI analyst writing the WEEKLY REVIEW for {label}.\n\n"
            f"Here are this week's top articles:\n\n{_articles_block(articles)}"
            "Write a comprehensive week-in-review section covering:\n\n"
            "1. TOP STORIES — 3-4 sentence summary of each article\n"
            "2. KEY TRENDS — 2-3 major trends visible across these stories\n"
            "3. KEY PLAYERS — notable companies, researchers, or products mentioned\n"
            "4. WHAT TO WATCH — 2-3 things to keep an eye on next week\n\n"
            "Plain text only, use ALL CAPS for section labels, no markdown. "
            "Executive-friendly, insightful, forward-looking tone."
        )
        with client.messages.stream(
            model="claude-opus-4-6",
            max_tokens=2048,
            thinking={"type": "adaptive"},
            messages=[{"role": "user", "content": prompt}],
        ) as stream:
            final = stream.get_final_message()
        for block in final.content:
            if block.type == "text":
                summaries[label] = block.text
                print(f"  ✓ {label}")
                break
    return summaries


# ── Build email ───────────────────────────────────────────────────────────────

def build_email(
    summaries: dict[str, str],
    topic_articles: dict[str, list[dict]],
    weekly: bool,
) -> MIMEMultipart:
    today = datetime.now().strftime("%B %d, %Y")
    mode_label = "Weekly Review" if weekly else "Daily Digest"
    subject = f"AI {mode_label} — {today}"
    header_icon = "📅" if weekly else "🤖"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = SENDER_EMAIL
    msg["To"]      = RECIPIENT_EMAIL

    # Plain text
    plain = f"AI {mode_label.upper()} — {today}\n{'=' * 60}\n\n"
    for label, summary in summaries.items():
        plain += f"{label}\n{'-' * 40}\n{summary}\n\nSources:\n"
        for i, a in enumerate(topic_articles.get(label, []), 1):
            plain += f"  {i}. {a.get('title','')}\n     {a.get('url','')}\n"
        plain += "\n"

    # HTML
    accent = "#7c3aed" if weekly else "#1a6b3c"
    sections_html = ""
    for label, summary in summaries.items():
        articles = topic_articles.get(label, [])
        sources_html = "".join(
            f'<li><a href="{a.get("url","")}" style="color:{accent};">{a.get("title","")}</a>'
            f' <span style="color:#999;font-size:13px;">— {a.get("source",{}).get("name","")}</span></li>'
            for a in articles
        )
        summary_html = summary.replace("\n", "<br>")
        sections_html += f"""
        <div style="margin-bottom:32px;">
          <h3 style="color:{accent};font-size:17px;margin-bottom:6px;">{label}</h3>
          <div style="line-height:1.8;font-size:15px;color:#333;">{summary_html}</div>
          <div style="margin-top:14px;background:#f9f9f9;padding:12px 16px;border-radius:6px;">
            <strong style="font-size:13px;color:#555;">SOURCE ARTICLES</strong>
            <ol style="margin:6px 0 0;line-height:1.9;font-size:14px;">{sources_html}</ol>
          </div>
        </div>
        <hr style="border:none;border-top:1px solid #eee;margin:8px 0 24px;">
        """

    badge = (
        '<span style="background:#7c3aed;color:#fff;font-size:11px;padding:3px 8px;'
        'border-radius:12px;margin-left:10px;vertical-align:middle;">WEEKLY</span>'
        if weekly else ""
    )

    html = f"""<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;max-width:700px;margin:auto;padding:28px;color:#222;">
  <h2 style="color:{accent};border-bottom:3px solid {accent};padding-bottom:10px;font-size:22px;">
    {header_icon} AI {mode_label} &nbsp;|&nbsp;
    <span style="font-weight:normal;font-size:0.8em;color:#555;">{today}</span>
    {badge}
  </h2>
  {sections_html}
  <p style="font-size:12px;color:#bbb;margin-top:36px;border-top:1px solid #eee;padding-top:12px;">
    Summarized by Claude Opus 4.6 · Powered by NewsAPI
  </p>
</body>
</html>"""

    msg.attach(MIMEText(plain, "plain"))
    msg.attach(MIMEText(html, "html"))
    return msg


# ── Send ──────────────────────────────────────────────────────────────────────

def send_email(msg: MIMEMultipart) -> None:
    print(f"Sending email to {RECIPIENT_EMAIL}...")
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(SENDER_EMAIL, GMAIL_APP_PASSWORD)
        server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
    print(f"  ✓ Email sent to {RECIPIENT_EMAIL}.")


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    weekly = "--weekly" in sys.argv
    mode   = "WEEKLY REVIEW" if weekly else "DAILY DIGEST"
    n      = WEEKLY_ARTICLES if weekly else DAILY_ARTICLES

    print(f"\n=== AI News {mode} ===")
    topic_articles = fetch_all_news(n)
    summaries      = summarize_weekly(topic_articles) if weekly else summarize_daily(topic_articles)
    msg            = build_email(summaries, topic_articles, weekly)
    send_email(msg)
    print(f"\nDone! AI {mode.lower()} delivered successfully.")


if __name__ == "__main__":
    main()
