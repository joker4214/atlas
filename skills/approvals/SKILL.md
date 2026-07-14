---
name: approvals
description: The gate every external action passes through. Anything that would leave the system stops here, is surfaced to the operator (by voice), and only executes on an explicit yes. Use before any outbound send, post, or external write. Used by every agent that can act on the outside world.
---

# approvals

The line that never moves. Every action that touches the outside world — an outbound
message, a social post, a CRM write that emails someone, anything leaving the system —
stops here and waits for the operator. The agents draft, plan, and queue. The operator
ships. This is what makes running an autonomous team something you can actually trust.

## What requires approval

**External / irreversible** (always gated):
- Sending a message (email, DM, SMS) to anyone outside the team.
- Publishing content anywhere public.
- Any write to an external system that notifies a third party or spends money.
- Deleting or overwriting operator-owned data.

**Internal / reversible** (no gate): writing a draft, updating a lead record, moving a
task on the board, indexing the KB, posting to the internal activity feed.

When in doubt, gate it. A needless approval costs a tap; a wrongful send costs trust.

## The approval object

Create one file per pending action at `knowledge-base/approvals/<id>.md`:

```markdown
---
id: A123
created_by: outreacher
created_at: 2026-07-13T14:02:00Z
action: send-email
target: "Posh Pets <owner@poshpets.example>"
lead: posh-pets
status: pending        # pending -> approved -> executed | rejected
reversible: false
---
## What will happen if approved
Send the drafted first-touch email to Posh Pets.

## The exact payload
<the full message / content, verbatim — no surprises after approval>

## Why now
Active ad spend + zero sales; scored 82, route: outreach.
```

## The voice loop

Because the operator talks to Atlas, surface approvals **out loud**, tersely:

> "One thing to approve: first-touch email to Posh Pets — active ads, no sales, scored 82.
> Want me to read it, send it, or hold it?"

Accept spoken decisions: **yes/send**, **no/reject**, **hold**, **edit** (operator dictates
a change → re-draft → re-queue). Map the spoken decision to `status`. Never interpret
silence or ambiguity as approval.

## After a decision

- **approved** → hand back to the requesting skill to execute, then set `status: executed`
  and log it in the lead's contact log as actually sent.
- **rejected** → set `status: rejected` with the reason; the requesting agent revises or
  drops. Never re-queue the identical thing.
- Everything is written to the activity feed (`event-logging`).

## Guardrails

- **No self-approval.** An agent cannot approve its own action. Only the operator's
  decision moves `status` past `pending`.
- **Payload is frozen at approval.** What was shown is what sends. If it changes, it's a new
  approval.
- Check `guardrails-reference` before even queuing — some actions are never allowed,
  approval or not.
