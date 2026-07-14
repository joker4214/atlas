---
name: event-logging
description: Write every meaningful action to one shared, append-only activity feed so the whole team's work is visible in one place. Use after any state change worth seeing. Used by every agent.
---

# event-logging

One visible activity feed for the whole fleet. Every meaningful action lands here as a
one-line entry, so the operator (and the briefings, and the dashboard) can see what the team
did without chasing five agents. If it changed state and mattered, it gets a line.

## The feed

Append-only, at `knowledge-base/activity/feed.md` (one file per day is fine:
`activity/2026-07-13.md`). Never rewrite history — only append.

```
2026-07-13T14:02Z  researcher  scored  posh-pets → 82 (route: outreach)
2026-07-13T14:05Z  outreacher  drafted first-touch posh-pets → approval A123 (pending)
2026-07-13T15:10Z  boss        approval A123 → approved by operator → sent
2026-07-13T22:00Z  analyst     weekly synthesis written → 3 scoring weights adjusted
```

Format: `timestamp  agent  verb  object → outcome`. Terse, scannable, parseable.

## What to log

- Leads: sourced, briefed, scored, routed, contacted, replied, stage changes.
- Approvals: queued, approved, rejected, executed.
- Content: drafted, published (after approval).
- System: agent restarted, cron fired, weights tuned, stale item flagged.

## What not to log

- Internal reasoning, retries, or chatter. The feed is state changes, not a debug log.
- Secrets or full message payloads (those live on the lead/approval record).

## Guardrails

- Append-only. The feed is the audit trail; editing it destroys its value.
- One line per event. If you need more, the detail belongs on the record the line points to.
