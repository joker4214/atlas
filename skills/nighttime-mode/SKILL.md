---
name: nighttime-mode
description: Run quiet overnight cycles — sourcing, research, monitoring, self-improvement — without pinging the operator, holding non-urgent surfacing for the morning briefing. Use for after-hours operation. Primary skill of the Ops agent.
---

# nighttime-mode

The fleet works while the operator sleeps — but quietly. Overnight, the agents source,
research, monitor, and tidy, banking everything for the morning briefing. Nothing pings the
operator unless it's genuinely can't-wait urgent.

## What runs overnight

- Sourcing new leads (`source-collection`) and briefing them (`brief-generation`).
- `autoresearch` — testing angles and opportunities.
- `ecosystem-monitoring` — market watch.
- Housekeeping: re-index the KB, close finished tasks, verify schedules, flag stale work for
  the morning.

## The quiet rule

- **No operator notifications overnight** except a real emergency (system down and
  unrecoverable, or a time-critical reply that can't wait till morning). Define "urgent"
  narrowly.
- Everything else accumulates into `morning-review` — the operator wakes to a ranked
  briefing, not a night of pings.
- **No external actions ship overnight without prior approval.** Drafts and plans queue;
  they wait at the `approvals` gate for the operator's morning yes. The approval line does
  not relax just because it's dark out.

## Entering / leaving

- Enter on the operator's schedule (default 22:00) via `cron-management`; leave before the
  morning briefing so the briefing reflects a settled state.
- On exit, hand a clean summary of overnight work to `morning-review`.

## Guardrails

- Quiet ≠ unsafe. Overnight autonomy is real work, but the approval gate and guardrails are
  fully in force.
- If overnight work uncovers something the operator must decide before acting, hold it for
  the briefing — don't act on the guess.
