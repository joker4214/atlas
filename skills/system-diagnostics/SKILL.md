---
name: system-diagnostics
description: Catch stuck agents, stale work, and broken schedules — investigate the cause and either recover it or surface it — so problems get noticed by the system, not by the operator wondering why nothing moved. Runs on a schedule. Used by the Orchestrator and Ops agents.
---

# system-diagnostics

The fleet's self-check. Runs on a schedule and after any anomaly to answer: is everything
actually moving, or is something silently stuck? If work is rotting, the system should notice
— not the operator.

## What it checks

- **Liveness** — any agent whose `heartbeat` has gone stale (down/wedged).
- **Stuck tasks** — `in_progress` tasks with no state change past a threshold.
- **Stale leads** — leads past their `next_action_due` with no movement.
- **Broken schedules** — a cron that should have fired and didn't.
- **Pending pileups** — approvals sitting unactioned (may just need the operator — surface,
  don't nag).

## What it does

1. **Diagnose** — down vs wedged vs waiting-on-human vs waiting-on-dependency. Different
   causes, different fixes.
2. **Recover what it can** — trigger a PM2 restart for a crashed agent, re-register a missing
   cron, re-dispatch a dropped task.
3. **Surface what it can't** — anything needing the operator goes into the briefing / by
   voice, with the diagnosis, not just "something's wrong."

## Output

```
[diag] researcher heartbeat stale 12m → restarted via pm2 (recovered)
[diag] lead petpal next_action overdue 2d → re-queued follow-up (owner: outreacher)
[diag] 3 approvals pending >1d → surfaced to operator in briefing
```

## Guardrails

- Recover conservatively — a restart is safe; silently re-sending an external message is not
  (that still needs `approvals`).
- Don't thrash: if an agent restarts repeatedly, stop auto-restarting and escalate to the
  operator with the crash reason.
