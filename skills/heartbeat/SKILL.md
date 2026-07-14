---
name: heartbeat
description: Emit and check liveness signals so a silent or crashed agent is noticed immediately instead of letting work rot. Use as the continuous health signal for the fleet. Used by the Orchestrator and Ops agents.
---

# heartbeat

Each agent emits a periodic "I'm alive and here's what I'm doing" pulse. The Ops and
Orchestrator agents watch the pulses so a stuck or crashed agent is caught in minutes, not
discovered when the operator asks why nothing moved.

## The pulse

Each agent writes, on a short interval, to `knowledge-base/health/<agent>.json`:

```json
{ "agent": "researcher", "at": "2026-07-13T14:30:00Z", "status": "working",
  "current": "briefing posh-pets", "last_completed": "scored creativesignet" }
```

`status`: `idle` | `working` | `blocked`.

## Checking

- A pulse older than its interval × 3 = the agent is likely down or wedged → `system-
  diagnostics` investigates and PM2 restarts it.
- An agent stuck on the same `current` across many pulses = wedged on one task → flag it.

## Rules

- Pulse even when idle — "idle" is healthy; *silence* is the alarm.
- The pulse is cheap and frequent; keep it tiny (no payloads, just state).

## Guardrails

- Heartbeat detects; it doesn't fix. Recovery is `system-diagnostics` + PM2 auto-restart.
- Never treat a self-reported "working" as proof of progress — pair it with the `last_completed`
  delta and the task board.
