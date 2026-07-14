# Atlas architecture

Atlas is one AI employee you talk to, backed by a fleet of specialist agents, a shared brain,
automatic lead scoring, and a human-approval gate — with a voice interface on the front.

```
        ┌─────────────────── VOICE GATEWAY ───────────────────┐
  You  ⇄ │  mic → STT → orchestrator (file bus) → TTS → speaker │
        └──────────────────────────────────────────────────────┘
                               │  writes the goal onto the bus
                               ▼
   ┌──────────────── Orchestrator ("boss") ────────────────┐
   │  decompose → dispatch → brief you → hold the approval line │
   └───────────────────────────────────────────────────────────┘
     │            │              │             │              │
 Lead Research  Outreach      Content       Analytics     Ops / Health
 (researcher)  (outreacher)   (content)      (analyst)      (ops)
     └──────── shared brain: memory + file bus + RAG knowledge base ────────┘
                    ▲ every external action → approval gate ▲
```

## The layers

**1. cortextOS (the runtime we build on).** Persistent Claude Code agents, a file message
bus, cross-session memory, a RAG knowledge base, the approvals subsystem, cron, a dashboard,
and PM2 auto-restart so agents survive crashes and reboots. We don't reinvent any of this —
we clone it (`cortextos/`) and configure it.

**2. The fleet (what we configure).** Six agents, each a cortextOS instance on a template with
a lead-gen `CLAUDE.md` and a set of skills:

| Instance | Template | Role |
|---|---|---|
| `boss` | orchestrator | the employee you talk to |
| `researcher` | agent | source → brief → score → route leads |
| `outreacher` | agent | draft first contact + follow-ups (gated) |
| `content` | agent | authority content that pulls inbound |
| `analyst` | analyst | market watch + weekly synthesis + scoring tuning |
| `ops` | agent | health, schedules, credentials, nighttime cycles |

**3. The skills (what we author).** 26 skills in `skills/`, deployed into each agent's
`.claude/skills/`. The lead-gen ones — `signal-scoring`, `brief-generation`,
`source-collection`, `crm-management`, `delivery-routing`, `approvals`, `knowledge-base` —
are the substance. See each `SKILL.md`.

**4. The voice gateway (the net-new layer).** cortextOS has no audio, so `voice-gateway/`
bridges speech to the orchestrator. It only transports voice; all reasoning stays in the
orchestrator agent, so approvals, briefings, and coordination work identically whether input
arrived by voice or text.

## How a goal flows

1. You say *"find pet-accessory Shopify stores running ads and line up outreach."*
2. The gateway transcribes it and drops it on the bus for `boss`.
3. `boss` (`goal-management`) decomposes it and dispatches: `researcher` sources
   (`source-collection`), briefs (`brief-generation`), scores (`signal-scoring`), and routes
   (`delivery-routing`).
4. Qualified leads cross to `outreacher`, which reads the relationship
   (`relationship-review`) and drafts in your voice (`comms`).
5. Each draft hits the **approval gate** (`approvals`) and is read back to you by voice.
6. You say yes → it sends and is logged. You say no → it's revised or dropped.
7. `analyst` watches what converts and tunes `scoring-weights.yaml`; `ops` keeps everyone
   alive. Nothing external ever ships without your yes.

## The data model (the shared brain)

Everything lives as files in `knowledge-base/` (see its README). Leads accumulate a full
lifecycle in one record (`leads/<id>.md`): stub → brief → score → contact log. Agents
coordinate by **state** (the KB + the task board), not by chat — so a restart resumes exactly
where it left off.

## The voice gateway, in detail

- **Default (zero keys):** the browser app does STT with the Web Speech API and TTS with
  `speechSynthesis`. Runs immediately, no telephony account.
- **Server-side upgrade:** set `STT_PROVIDER`/`TTS_PROVIDER` to move recognition/synthesis to
  Deepgram / ElevenLabs / Cartesia (lower latency, better voices).
- **Phone upgrade:** `VOICE_TRANSPORT=twilio` + a Twilio number turns Atlas into a number you
  call from anywhere (`src/transport/twilio.mjs`). Same bridge, different media framing.
- **Mock mode:** when the fleet isn't running, the bridge returns stand-in replies so the
  whole voice loop is testable standalone.
