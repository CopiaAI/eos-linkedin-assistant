# Eos LinkedIn Response Assistant

A browser-based tool for Susan to manage LinkedIn outreach on Sara's behalf. Looks up prospects in Claudia (Notion CRM), generates copy-ready DM responses in Sara's voice using Claude AI, and saves conversation history back to Claudia automatically.

---

## Files in This Repo

| File | Purpose |
|---|---|
| `index.html` | The full app — HTML, CSS, and JavaScript in one file |
| `worker.js` | Cloudflare Worker that proxies Notion API calls (fixes CORS) |
| `README.md` | This document |

---

## One-Time Setup

### Step 1 — Deploy the Cloudflare Worker

Notion's API blocks direct browser requests (CORS). The worker sits in between and forwards calls server-side.

1. Go to dash.cloudflare.com and log in
2. In the left sidebar, click **Compute > Workers**
3. Click **Create** > **Create Worker**
4. Name it `eos-notion-proxy`
5. Delete all the default code in the editor
6. Paste the entire contents of `worker.js` from this repo
7. Click **Deploy**
8. Copy the worker URL shown — it looks like `https://eos-notion-proxy.YOURNAME.workers.dev`

9. Open `index.html` in a text editor
10. Find this line near the top of the script section:
    ```
    const PROXY_URL = 'https://eos-notion-proxy.YOURNAME.workers.dev';
    ```
11. Replace `YOURNAME` with your actual Cloudflare subdomain
12. Save and commit `index.html` back to this repo

---

### Step 2 — Connect GitHub to Cloudflare Pages (optional but recommended)

1. In Cloudflare dashboard, click **Workers & Pages** in the left sidebar
2. Click **Create** > **Pages** > **Connect to Git**
3. Connect your GitHub account and select the `eos-linkedin-assistant` repo
4. Leave build settings blank (no build command, no output directory)
5. Click **Save and Deploy**

App URL will be `https://eos-linkedin-assistant.pages.dev`

---

### Step 3 — Notion Integration Token

1. Go to notion.so/my-integrations
2. Click **New Integration**, name it `Eos LinkedIn Assistant`
3. Select the Eos workspace and copy the Internal Integration Token
4. Open the Claudia the Connector database in Notion
5. Click (...) > **Connections > Add connections** > find `Eos LinkedIn Assistant`

---

### Step 4 — API Keys in the App

Open the app. Click the two key badges in the top right.

- **Claude API:** from console.anthropic.com > API Keys
- **Notion:** the integration token from Step 3

Both save in the browser. Susan only does this once.

---

## How Susan Uses It

1. Paste Sales Navigator profile text into Quick Start box, click **Extract Info**
2. Click **Search Claudia** — loads existing record and history if found
3. Confirm or fill in their details
4. Pick the scenario button that matches where you are in the conversation
5. Paste exactly what they said
6. Click **Generate Sara's Response**, review it
7. Click **Copy to clipboard**, paste into LinkedIn, send
8. Click **Save to Claudia** — logs the conversation automatically

**Routing flag:** If you see an orange flag, the prospect is ready for Sara. Send: go.eoshr.com/ai-clarity-call

---

## Targeting Rules

**Connect with:** Founders, CEOs, COOs, VPs/Heads of People or HR at 10-200 employee companies. HR Managers at companies under 100 employees may be the solo HR person and worth connecting.

**Do not connect with:** Solo consultants, coaches, authors, podcast hosts, HR Managers at 100+ employee companies, pre-revenue startups, AI/GRC platform founders.

---

## Updating the App

Push updated files to the repo. Cloudflare Pages redeploys automatically. Susan just refreshes her browser.

---

## Key Links

- AI Clarity Call: go.eoshr.com/ai-clarity-call
- AI Policy tool (not-now timing only): go.eoshr.com/ai-policy
- Sara: sara@eoshr.com | (510) 269-6161

*Built by Sloane for Eos HR & AI Consulting. June 2026.*
