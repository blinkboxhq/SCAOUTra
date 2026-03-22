"""
Scoutra Research Agent — Web API

Tiny Flask server that exposes the research agent via HTTP.
Run:  uv run research_agent/server.py
Then open: http://localhost:5099/agent
"""

from __future__ import annotations

import json
import os
import sys
import traceback
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

# Ensure project root is importable
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

load_dotenv(ROOT / ".env")

from research_agent.agent import (  # noqa: E402
    analyse_with_claude,
    generate_report,
    log_research,
    scrape_website,
)

import anthropic  # noqa: E402

app = Flask(__name__, static_folder=str(ROOT / "reports"))
CORS(app)


# ── Serve the agent dashboard page ──────────────────────────────────────────

@app.route("/agent")
def agent_page():
    return send_from_directory(str(Path(__file__).resolve().parent), "dashboard.html")


# ── API: run the research agent ─────────────────────────────────────────────

@app.route("/api/research", methods=["POST"])
def run_research():
    data = request.get_json(force=True)
    business_name = (data.get("business") or "").strip()
    website = (data.get("website") or "").strip()

    if not business_name or not website:
        return jsonify({"error": "Both 'business' and 'website' are required."}), 400

    if not website.startswith("http"):
        website = "https://" + website

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return jsonify({"error": "ANTHROPIC_API_KEY not configured on server."}), 500

    try:
        # Step 1: Scrape
        scraped = scrape_website(website)

        # Step 2: Analyse
        client = anthropic.Anthropic(api_key=api_key)
        analysis = analyse_with_claude(business_name, website, scraped, "", client)

        # Step 3: Generate report
        report_path = generate_report(business_name, website, analysis)
        num_opps = len(analysis.get("opportunities", []))

        # Step 4: Log
        log_research(business_name, website, num_opps, report_path)

        return jsonify({
            "success": True,
            "business": business_name,
            "website": website,
            "opportunities": num_opps,
            "report_url": f"/reports/{report_path.name}",
            "analysis": analysis,
        })

    except Exception as exc:
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500


# ── Serve generated reports ─────────────────────────────────────────────────

@app.route("/reports/<path:filename>")
def serve_report(filename):
    return send_from_directory(str(ROOT / "reports"), filename)


# ── Main ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("\n  Scoutra Research Agent API")
    print("  Dashboard: http://localhost:5099/agent")
    print("  API:       http://localhost:5099/api/research\n")
    app.run(host="127.0.0.1", port=5099, debug=True)
