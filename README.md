# Atlas — your voice-driven, lead-generating AI employee

Atlas is a single AI "employee" you talk to out loud. You give it a goal like you'd
tell a chief of staff — *"find me ten Shopify stores running ads with weak sites and
line up outreach"* — and it runs a whole team behind the scenes to get it done.

It is built for one job: **generating leads.** It sources them, researches them, ranks
them so you only touch the real ones, drafts the outreach in your voice, and keeps a
shared brain so the same work never gets done twice. Every message that would leave the
system stops and waits for your **yes** — spoken back to you. The agents draft. You ship.

> Atlas is not one chatbot doing one trick. It's a fleet of specialist agents, each good
> at one thing, coordinated by one assistant you actually talk to, running around the clock.

---

## What's in the box

| Piece | What it is |
|---|---|
| **Orchestrator** | The employee you talk to by voice. Decomposes goals, dispatches work, briefs you morning and evening, holds the approval line. |
| **Lead Research** | Sources leads against your ICP, builds a structured brief on each, scores the signals, banks every brief so nothing is re-researched. |
| **Outreach** | Drafts first contact in your voice tuned to each person, tracks replies, drafts the next move. Every send is approval-gated. |
| **Content** | Turns what the system learns into authority content that pulls inbound leads. Value first, never a pitch. |
| **Analytics** | Tracks what's converting, watches the market, rolls it into a weekly synthesis, and tunes the lead-scoring weights. |
| **Ops / Health** | The quiet one. Keeps every agent alive across restarts, manages credentials, runs the overnight cycles. |
| **Voice Gateway** | The net-new layer. Bridges your speech to the orchestrator and speaks its answers back. Browser mic now; phone number later. |
| **Shared brain** | Cross-session memory + a file message bus + a RAG knowledge base every agent reads from and writes to. |

Atlas runs on **[cortextOS](https://github.com/grandamenium/cortextos)** — an open framework
for persistent Claude Code agents (the bus, memory, RAG, approvals, cron, and 24/7
auto-restart come from there). This project adds the **voice interface**, the
**lead-gen fleet configuration**, the **scoring model**, and the **seeded knowledge base**
on top.

---

## Requirements

- An **always-on host** — a Mac mini, a small VPS, or a home box. Atlas is a 24/7 employee;
  it needs a machine that stays on. (This does not run on ephemeral cloud sandboxes.)
- **Node.js 20+**, a **Claude Code login**, and **PM2** (`npm i -g pm2`).
- API keys for voice: an **STT** provider (Deepgram, or local Whisper) and a **TTS**
  provider (ElevenLabs or Cartesia). Optional **Twilio** for a phone number.
- Everything sensitive lives in `.env` and is never committed. Copy `.env.example` to
  start.

---

## Zero to running

```bash
# 1. Install prerequisites (Claude Code + PM2)
npm install -g @anthropic-ai/claude-code pm2
claude login

# 2. Bootstrap Atlas — clones cortextOS, creates the org, adds the 6 agents,
#    installs the authored skills, and seeds the knowledge base.
cd atlas
cp .env.example .env      # then fill in your keys
npm install
npm run bootstrap

# 3. Start the fleet (24/7, survives reboot)
npm run fleet:start
npm run fleet:status      # health table for every agent

# 4. Start talking to it
npm run voice             # opens the browser voice app on http://localhost:5111
```

Then just talk: *"Good morning — what's on the board today?"*

See **`docs/SETUP.md`** for the long-form walkthrough and **`docs/ARCHITECTURE.md`** for how
the pieces fit together.

---

## The approval line never moves

Every action that touches the outside world — an outbound message, a post, a CRM write
that emails someone — stops at an approval gate first. Atlas surfaces the decision to you
**by voice**, you say yes or no, and only then does it go. It works around the clock, but
your hand is on every button that matters.
