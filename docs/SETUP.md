# Atlas setup — zero to a running employee

Atlas is a 24/7 employee, so it needs a machine that stays on — a Mac mini, a small VPS, or a
home box. It won't run on an ephemeral cloud sandbox. Plan for ~30 minutes the first time.

## 0. Prerequisites

```bash
node -v            # need 20+
```

You only need Node 20+ and git up front — `npm run bootstrap` (step 2) installs the
`claude` (Claude Code) and `pm2` CLIs globally if they're missing. If your npm prefix
needs elevated permissions, bootstrap will warn and you can install them yourself:
`npm install -g @anthropic-ai/claude-code pm2`. Either way, run `claude login` before
starting the fleet — cortextOS agents run on your Claude Code login.

## 1. Configure

```bash
cd atlas
cp .env.example .env
```

Fill in `.env`. To start with **zero API keys**, leave `STT_PROVIDER` and `TTS_PROVIDER` as
`browser` — the browser app does speech itself. For better voices/latency later, set:

- `STT_PROVIDER=deepgram` + `DEEPGRAM_API_KEY`
- `TTS_PROVIDER=elevenlabs` + `ELEVENLABS_API_KEY` + `ELEVENLABS_VOICE_ID`

## 2. Bootstrap

```bash
npm install
npm run bootstrap
```

This clones cortextOS into `cortextos/`, creates the `atlas` org, adds the six agents on their
templates, deploys the lead-gen skills + agent `CLAUDE.md`s into each agent, seeds the
knowledge base, and generates the PM2 config. It's **idempotent** — re-run it anytime. If a
cortextOS step needs an interactive prompt in your environment, finish it per the cortextOS
README and re-run `npm run bootstrap`.

## 3. Make it yours (the important 10 minutes)

Edit the seed files — this is what makes Atlas *your* employee, not a demo:

1. **`knowledge-base/seed/icp.md`** — who to target. Everything keys off this.
2. **`knowledge-base/seed/voice.md`** — how outreach and content should sound.
3. **`knowledge-base/seed/offer.md`** — what you sell, price anchors, real proof, daily cap.
4. **`knowledge-base/seed/sources.md`** — where the fleet is allowed to hunt.
5. **`knowledge-base/seed/scoring-weights.yaml`** — tune later; defaults are sensible.

Already keep a brand/voice/CRM vault somewhere? `IMPORT_SOURCE=/path npm run import:kronos`
pulls it into `seed/imported/` for you to fold in.

## 4. Start the fleet

```bash
npm run fleet:start     # boots the 6 agents under PM2 (24/7)
npm run fleet:status    # health table — every agent should be healthy
pm2 startup             # make it all survive a reboot (follow the printed command)
```

## 5. Talk to it

```bash
npm run voice           # http://localhost:5111 — open it, click the mic
```

Say *"Good morning — what's on today?"* Then try
*"Find five Shopify stores running ads with weak sites and prep outreach."* Watch the leads
show up scored, the drafts queue for approval, and the approval read back to you by voice.

## Going further

- **Phone number:** set `VOICE_TRANSPORT=twilio` + `TWILIO_*` + `VOICE_PUBLIC_URL`, point your
  Twilio number's voice webhook at `/twilio/incoming`, and finish the media bridge in
  `voice-gateway/src/transport/twilio.mjs`.
- **Dashboard:** `cortextos dashboard` for the task board + approval queue in a browser.
- **Schedules:** briefings, overnight sourcing, and the weekly review are pre-scheduled — see
  `skills/cron-management/SKILL.md` to adjust times to your timezone.

## Troubleshooting

- **Voice app opens but replies say "mock":** the fleet isn't running. `npm run fleet:start`.
- **Mic does nothing:** browser speech needs Chrome/Edge and mic permission, or use the text
  box, or move STT server-side with Deepgram.
- **An agent won't stay up:** `npm run fleet:status` and `pm2 logs`; the Ops agent will also
  flag and restart it, and escalate if it loops.
