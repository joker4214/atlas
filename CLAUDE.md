# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Atlas?

Atlas is a voice-driven, lead-generating AI employee — a single orchestrator agent you talk to, backed by a fleet of five specialist agents, a shared brain (memory + knowledge base), and an approval gate on every external action. It runs 24/7 on cortextOS (an open multi-agent framework) with a voice gateway bridging speech to the orchestrator.

**Single job:** generating leads. The fleet sources them, researches them, scores them, drafts outreach in your voice, and every message stops for your approval before it leaves the system.

**Core architecture:**
```
You → Voice Gateway → Orchestrator ("boss") → 5 specialists → shared brain + approval gate
                                                               (memory + file bus + RAG KB)
```

**The 6 agents:**
- **Orchestrator** (`boss`): decomposes goals, dispatches work, briefs morning/evening, holds approvals
- **Lead Research** (`researcher`): sources → briefs → scores → routes leads
- **Outreach** (`outreacher`): drafts first contact in your voice (approval-gated)
- **Content** (`content`): authority content that pulls inbound leads
- **Analytics** (`analyst`): market watch + weekly synthesis + tunes scoring weights
- **Ops/Health** (`ops`): keeps agents alive, manages credentials, nighttime cycles

## Project structure

```
atlas/
  cortextos/              # vendored cortextOS framework (bus, memory, RAG, PM2, dashboard)
  .cortextos/             # runtime state (org, agent instances, knowledge-base runtime)
  agents/                 # per-agent CLAUDE.md + skill declarations
    orchestrator/
    lead-research/
    outreach/
    content/
    analytics/
    ops-health/
  skills/                 # 26 lead-gen skills (signal-scoring, brief-generation, etc.)
  voice-gateway/
    src/
      server.mjs          # main HTTP + WebSocket server
      config.mjs          # read .env, expose config
      orchestrator-bridge.mjs   # bridge user utterance → bus → orchestrator reply
      bus.mjs             # file bus client (send/recv on cortextOS bus)
      stt/                # speech-to-text adapters (browser, deepgram, whisper)
      tts/                # text-to-speech adapters (browser, elevenlabs, cartesia)
      transport/twilio.mjs  # twilio phone transport (stub; browser is default)
    public/
      index.html          # browser voice app (mic, text input, hands-free wake-word)
    test/
      bridge.test.mjs     # voice gateway + bus tests
  knowledge-base/
    seed/                 # authored seed files (ICP, voice, offer, sources, scoring weights)
    leads/                # lead records (full lifecycle: stub → brief → score → log)
    activity/             # daily activity feeds
  scripts/
    lib/util.mjs          # shared helpers (run, has, ensureDir, copyDir, paths, FLEET)
    bootstrap.mjs         # clone cortextOS, create org, add agents, deploy skills, seed KB
    deploy.mjs            # deploy skills + CLAUDE.md into agent homes
    seed-kb.mjs           # initialize KB runtime directories
    import-kronos.mjs     # import docs from OneDrive vault into KB
    fleet.mjs             # thin wrapper for cortextOS + PM2 (start/status/stop)
  package.json            # npm scripts (bootstrap, fleet:start/status/stop, voice, test)
  .env.example            # documented config (STT/TTS/wake word/Twilio/model)
  .gitignore              # excludes .env, .cortextos, cortextos/, runtime writes
  README.md               # overview, what's in the box, requirements, zero-to-running
  ecosystem.config.cjs    # (generated) PM2 config for 24/7 running + auto-restart
  docs/
    SETUP.md              # long-form walkthrough (prerequisites, config, bootstrap, test)
    ARCHITECTURE.md       # how the pieces fit (layers, data model, goal flow)
```

## Development tasks

### Bootstrap & verify (first time)

```bash
cd atlas
cp .env.example .env        # fill in STT/TTS keys (can start with 'browser' for both)
npm install
npm run bootstrap           # idempotent: clones cortextOS, creates org, adds agents, deploys skills
npm run fleet:start         # boot 6 agents under PM2 (24/7)
npm run fleet:status        # check health
npm run voice               # http://localhost:5111 — click mic and talk to it
```

See `docs/SETUP.md` for the long-form walkthrough.

### Run and test

```bash
# Start/manage the 24/7 fleet
npm run fleet:start          # boot all 6 agents (survives reboot with pm2 startup)
npm run fleet:status         # health + log table
npm run fleet:stop           # shut down

# Voice gateway (bridges speech to orchestrator)
npm run voice                # run server on :5111 (production)
npm run voice:dev            # run with --watch for development

# Tests (voice gateway + bus)
npm test                     # runs all tests in test/**/*.test.mjs

# Knowledge-base initialization (usually automatic via bootstrap)
npm run seed:kb              # initialize KB runtime directories + activity feed
npm run import:kronos        # pull docs from OneDrive/Kronos into KB/imported/ (optional)
```

### Adjust configuration

All configuration is in `.env`. Copy `.env.example` and fill in:
- **STT_PROVIDER** (browser | deepgram | whisper-local | openai) — where speech-to-text happens
- **TTS_PROVIDER** (browser | elevenlabs | cartesia | openai) — where text-to-speech happens
- **WAKE_WORD** — hands-free wake word (default "Atlas"; set empty to disable)
- **VOICE_TRANSPORT** (browser | twilio) — how you talk to it
- **STT/TTS keys** and **TWILIO_*** for paid providers
- **ANTHROPIC_MODEL** — model the orchestrator runs on (default claude-opus-4-8)
- **CORTEXTOS_HOME** — where runtime state lives (default `./.cortextos`)
- Optional: **TELEGRAM** BOT_TOKEN/CHAT_ID for text fallback

### Tune the fleet (what makes Atlas *your* employee)

Each of these makes Atlas respond to *your* ICP, voice, and offer. Edit seed files and re-deploy:

```bash
# edit these:
#   knowledge-base/seed/icp.md           — who to target
#   knowledge-base/seed/voice.md         — how to sound
#   knowledge-base/seed/offer.md         — what you sell
#   knowledge-base/seed/sources.md       — where to hunt
#   knowledge-base/seed/scoring-weights.yaml  — lead scoring weights (tuned by analytics agent)

npm run seed:kb              # reinitialize KB after edits (doesn't overwrite seed files)
```

The Analytics agent (`analyst`) watches real conversions and tunes `scoring-weights.yaml` weekly; you can adjust it manually anytime.

### Understand the data model

Everything is files in `knowledge-base/`:
- **`leads/<id>.md`** — full lead lifecycle. Evolves: stub → research brief → scored → contact log
- **`activity/<date>.md`** — daily feed of what happened (approvals, sends, research done)
- **`approvals/<id>.md`** — pending approvals waiting on human yes/no
- **`content/<id>.md`** — published content pieces
- **`analytics/<id>.md`** — market signals, conversion data, scoring feedback

Agents coordinate by reading/writing state here + posting tasks to the cortextOS task board, so restarts resume exactly where they left off.

### Add or modify a skill

Skills are authored once and shared by agents. Each skill = one `SKILL.md` file in `skills/<name>/SKILL.md`.

**To add a skill:**
1. Create `skills/my-skill/SKILL.md` — write the skill's prompt (context, instructions, examples)
2. Add it to the agent's `skill-declarations.yaml` in its CLAUDE.md
3. Run `npm run bootstrap` (the `deploy` step copies skills into agent homes)

**To modify a skill:**
1. Edit `skills/<name>/SKILL.md`
2. Run `npm run bootstrap` to redeploy

See existing `skills/signal-scoring/SKILL.md` or `skills/brief-generation/SKILL.md` for examples of the structure.

### Modify an agent's behavior

Each agent has a `CLAUDE.md` in `agents/<agent-name>/CLAUDE.md`. This is the agent's system prompt — everything it knows about its role, skills, and constraints.

**To change agent behavior:**
1. Edit `agents/<agent-name>/CLAUDE.md`
2. Run `npm run bootstrap` to redeploy into the agent's home
3. Restart the agent: `npm run fleet:stop && npm run fleet:start` (or just that one via `pm2 restart <name>`)

Each agent's CLAUDE.md declares:
- Its role in the fleet + primary responsibilities
- List of skills it has access to
- Links to shared references (memory, bus, knowledge base conventions)
- Hard guardrails (approval gates, rate limits, never-do rules)

### Develop the voice gateway locally

The voice gateway is a Node.js HTTP + WebSocket service in `voice-gateway/src/`. It bridges speech ↔ orchestrator over the file bus.

```bash
npm run voice:dev            # run with --watch, auto-reload on file changes
```

**Key entry points:**
- `server.mjs` — HTTP + WebSocket server, serves `/config`, `/` (static), and `/ws` (live voice channel)
- `config.mjs` — reads `.env`, exports config object
- `orchestrator-bridge.mjs` — takes user utterance, writes to bus, polls for orchestrator reply (or returns mock)
- `bus.mjs` — file bus client (send utterance JSON, await reply JSON)
- `stt/` — speech-to-text adapters (pluggable, defaults to browser Web Speech)
- `tts/` — text-to-speech adapters (pluggable, defaults to browser speechSynthesis)
- `public/index.html` — browser UI (push-to-talk, hands-free wake-word mode, text fallback)

**To add a new STT/TTS provider:**
1. Create `src/stt/myprovider.mjs` or `src/tts/myprovider.mjs` implementing `{ transcribe(audio, mime): Promise<string> }` or `{ synthesize(text): Promise<{ audio: Buffer, mime: string }> }`
2. Register it in `stt/index.mjs` or `tts/index.mjs` (see existing Deepgram + ElevenLabs)
3. Add `STT_PROVIDER=myprovider` or `TTS_PROVIDER=myprovider` to `.env`

### Test the voice loop end-to-end

With fleet running (`npm run fleet:status` shows all healthy):

```bash
npm run voice
# open http://localhost:5111 in a browser
# say: "Good morning — what's on today?"
# → should see a ranked briefing + pending approvals read back by voice
# say: "Find 5 Shopify stores and line up outreach"
# → should see leads sourced, scored, briefs generated, outreach drafted
# → drafts should hit the approval gate and be read back by voice for your yes/no
```

If fleet isn't running, the gateway falls back to mock mode (stand-in briefing/approval responses).

### Debug an agent

```bash
npm run fleet:status         # see if it's running; if crashed, will show exit code
pm2 logs <agent-name>        # stream its console output (e.g., pm2 logs boss)
pm2 restart <agent-name>     # restart one agent
```

The Ops agent monitors health and will flag stuck/looping agents. See `skills/heartbeat/SKILL.md` and `skills/system-diagnostics/SKILL.md`.

## Architecture patterns

### How a goal flows through the fleet

1. You say *"Find 5 Shopify stores running ads with weak sites and prep outreach"*
2. Voice gateway transcribes and posts to the bus for `boss`
3. `boss` (`goal-management`) decomposes it:
   - `researcher`: source candidates, brief each, score signals, route qualified ones
   - `outreacher`: read relationship context, draft in your voice
4. Each draft hits the **approval gate** (`approvals` skill) and is read back by voice
5. You say yes → sends; no → revise or drop
6. `analyst` watches conversions, tunes scoring weights; `ops` monitors health
7. Everything is logged to `activity/` so nothing is lost across restarts

### The shared brain

**File bus** (cortextOS bus under `.cortextos/bus/`) — agents post work requests and replies here. Cheap, durable, survives restarts. `bus.mjs` is the client.

**Knowledge base** (cortextOS RAG under `.cortextos/kb/`) — every agent can read/write contextual facts. Seeded with ICP, voice, offer, sources. Lead briefs, contact logs, market signals, and scoring weights live here.

**Memory** (cortextOS memory) — cross-session state. Usually captured in the KB, but memory sketchpad is available for volatile work-in-progress.

Agents coordinate by **state**, not by chat — so a restart resumes exactly where it left off.

### Approval gates

The `approvals` skill is deployed into every agent. It wraps actions that touch the outside world:
- sending a message → must be approved first
- posting content → must be approved first
- writing to CRM → must be approved first

The orchestrator surfaces approvals **by voice** ("Should I send this email to Alice about Posh Pets?"), you say yes/no, and only then does it go.

See `skills/approvals/SKILL.md` and `skills/guardrails-reference/SKILL.md` for the guard rules and how to add new approval gates.

## Common gotchas

**Voice app opens but says "mock":** The fleet isn't running. Run `npm run fleet:start` and wait for all agents to be healthy (`npm run fleet:status`).

**Mic does nothing in the browser app:** Browser speech needs Chrome/Edge, mic permission, and HTTPS locally. Or: use the text box below (fallback), or move STT server-side with Deepgram (in `.env`, set `STT_PROVIDER=deepgram`).

**Agent won't stay up:** Run `npm run fleet:status` to see if it crashed. Check `pm2 logs <name>` for the error. The Ops agent will also monitor and escalate if it loops. Re-run `npm run bootstrap` if the CLAUDE.md or a skill changed.

**Changes to skills/agent config don't take effect:** After editing `skills/*/SKILL.md` or `agents/*/CLAUDE.md`, always run `npm run bootstrap` (specifically the `deploy` step) and then restart the fleet or that agent.

**"Bus not reachable" in voice gateway:** The fleet hasn't booted, or `CORTEXTOS_HOME` doesn't match. Defaults to `./.cortextos` in the atlas folder; make sure that's where the fleet lives (set via `cortextos init` or the `CORTEXTOS_HOME` env var).

## Further reading

- **SETUP.md** — long-form zero-to-running guide, prerequisites, troubleshooting
- **ARCHITECTURE.md** — deep dive on the layers, data model, how goals flow
- **README.md** — overview, what's in the box, core concepts
- **Each agent's CLAUDE.md** (`agents/*/`) — that agent's role, skills, guardrails
- **Each skill's SKILL.md** (`skills/*/`) — detailed instructions for that skill (what it does, examples, patterns)
- **cortextOS README** — the runtime framework (bus, memory, RAG, dashboard)
