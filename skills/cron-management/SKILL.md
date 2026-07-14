---
name: cron-management
description: Put recurring work on a schedule that survives restarts — briefings, overnight sourcing, market monitoring, weekly review. Use to schedule or adjust any recurring job. Used by the Orchestrator, Analytics, and Ops agents.
---

# cron-management

Recurring work runs on a schedule, not on someone remembering. This skill registers,
adjusts, and lists the fleet's scheduled jobs — and the schedules survive restarts (the Ops
agent ensures they re-register on boot).

## The standing schedule (defaults, operator-configurable)

| Job | When | Owner | Skill |
|---|---|---|---|
| Morning briefing | weekdays 6:00 | boss | `morning-review` |
| Evening wrap | daily 18:00 | boss | `evening-review` |
| Overnight sourcing + research | nightly 01:00 | researcher | `source-collection`, `autoresearch` |
| Market monitoring | daily 07:00 | analyst | `ecosystem-monitoring` |
| Weekly review | Mon 08:00 | analyst | `weekly-review` |
| Health sweep | every 15 min | ops | `system-diagnostics` |
| Stale-lead check | daily 09:00 | ops | (flags overdue `next_action`s) |

## Rules

- **Schedules are durable.** Register them so a reboot re-establishes them (the Ops agent
  verifies on boot). A cron that dies with the process is a bug.
- **Respect nighttime mode.** Overnight jobs run quiet (`nighttime-mode`) — no operator pings
  unless something is urgent.
- Changing a schedule is an internal action (no approval); but log it to the feed so the
  change is visible.

## Guardrails

- Don't stack overlapping heavy jobs (e.g. sourcing + weekly review at the same minute) —
  stagger them.
- Keep the operator's timezone. Briefings at "6am" mean their 6am.
