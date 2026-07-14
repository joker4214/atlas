---
name: evening-review
description: Produce the evening wrap — what shipped today, what's blocked, and what runs overnight — short enough to say out loud. Runs on a schedule and on request. Primary skill of the Orchestrator.
---

# evening-review

The bookend to `morning-review`. A short spoken wrap so the operator ends the day knowing
exactly what happened and what the fleet will do while they sleep.

## What goes in

1. **Shipped today** — approvals the operator granted that went out, replies handled, leads
   advanced, content published. Concrete outcomes.
2. **Still open** — drafts awaiting approval, leads mid-pipeline, goals in progress.
3. **Blocked** — anything stuck, with the reason and what it needs.
4. **Overnight plan** — what the fleet will run while the operator is off: sourcing,
   research, market monitoring, the nighttime cycles. So nothing is a surprise at morning
   briefing.

## Shape it for voice

- Under ~40 seconds. Outcomes over activity: "shipped two outreach emails, three new leads
  briefed, one reply from Posh Pets I've queued a follow-up for."
- Flag the single most important thing for tomorrow.
- End open: *"Anything you want the team to prioritize overnight?"*

## Sources

The activity feed since this morning (`event-logging`), the task board, pending approvals,
and open goals.

## Guardrails

- Report faithfully — if something failed or a send was rejected, say so plainly.
- Distinguish "done" from "queued for overnight." Don't imply overnight work is already done.

## Schedule

Runs each evening via `cron-management` (operator-configurable) and on request.
