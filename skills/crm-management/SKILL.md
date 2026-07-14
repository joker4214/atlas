---
name: crm-management
description: Keep each lead's record current as it moves through the pipeline — stage, contact history, replies, next action — so the state of every relationship is always visible and no conversation goes cold. Use whenever a lead's status changes. Used by the Outreach agent.
---

# crm-management

The lead record is the CRM. This skill keeps it current so anyone (agent or operator) can
see exactly where every relationship stands without asking. No lead silently rots.

## The pipeline

`stage` moves in one direction through:

```
sourced → researched → scored → outreach → replied → meeting → won | lost | nurture
```

Never skip a stage silently — if a lead jumps (e.g. an inbound reply on an unscored lead),
backfill the skipped stages' fields so the record stays coherent.

## What you maintain on each lead

```markdown
---
...existing frontmatter...
stage: outreach
next_action: "follow up if no reply by 2026-07-18"
next_action_due: 2026-07-18
owner: outreacher
---

## Contact log
- 2026-07-13 — drafted first outreach (see approval #A123). Status: awaiting approval.
- 2026-07-14 — sent (operator approved). Channel: email.
- 2026-07-16 — reply received: "interested, send pricing." → stage: replied.
```

## Rules

- **Every outbound and inbound touch gets a dated log line.** The log is the memory of the
  relationship — `relationship-review` reads it to ground the next message.
- **Always leave a `next_action` + due date.** A lead with no next action is a lead going
  cold; the Ops agent's stale-work check will flag it.
- **Approvals are part of the record.** When a message is queued, log the approval id;
  when it's approved/sent, update the same line. Never mark something "sent" that only got
  drafted.
- Keep it in the KB lead file — one source of truth. Don't fork state into a side sheet.

## Guardrails

- Do not advance a lead to `won`/`meeting` on the agent's own say-so — those reflect real
  outcomes the operator confirms.
- Sync, don't invent: if you're unsure whether a message actually sent, mark it
  `unconfirmed` and check, don't assume.
