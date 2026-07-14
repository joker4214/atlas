---
name: morning-review
description: Produce the morning briefing — what moved overnight, the ranked new leads, what needs the operator's call today — short enough to say out loud. Runs on a schedule and on request. Primary skill of the Orchestrator.
---

# morning-review

The operator wakes up to a ranked list, not a pile. This skill compiles the overnight state
of the whole fleet into a briefing tight enough to **speak** — because the operator talks to
Atlas. Lead with what needs a decision; everything else is context.

## What goes in (in this order)

1. **Decisions waiting** — pending approvals + `human-review` (borderline) leads. This is
   first because it's what only the operator can do. Each: name, one-line why, the ask.
2. **Top new leads, ranked** — the highest-scored leads sourced overnight, best first, with
   the one-line rationale from `signal-scoring`. Cap it (say top 5) — a briefing, not a dump.
3. **What moved** — replies received, tasks completed, content drafted, goals advanced.
4. **What's blocked** — anything `system-diagnostics` flagged as stuck or stale.
5. **Today's focus** — the one or two things that most move lead-gen forward, pulled from
   open goals and priorities.

## Shape it for voice

- Total under ~45 seconds spoken. If it's longer, you're including things that should be on
  the board, not in the briefing.
- Numbers the operator can act on: "three to approve, six new leads, top one scored 88."
- End with a single prompt: *"Want the approvals first, the new leads, or the blockers?"* —
  then drill in on request.

## Sources

Pull from: `knowledge-base/approvals/` (pending), `knowledge-base/leads/` (new + scored),
the task board (`tasks`), the activity feed (`event-logging`), and open goal records.

## Guardrails

- Rank honestly by score — don't bury a hot lead to lead with a pretty one.
- Never present a drafted-but-unsent message as sent. Draft ≠ shipped.
- If nothing material happened overnight, say that in one line. Don't manufacture a briefing.

## Schedule

Runs each weekday morning via `cron-management` (default 6am, operator-configurable) and
any time the operator asks "what's on today?"
