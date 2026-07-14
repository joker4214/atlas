---
name: comms
description: Draft outbound messages and handle replies in the operator's voice, tuned to the specific person and the stage of the relationship. Always produces a draft for approval — never sends. Used by the Outreach and Content agents.
---

# comms

Turns a relationship note into an actual message in the operator's voice. This is the
drafting hand of the outreach loop. It **drafts; it never sends** — every message it
produces goes to the `approvals` gate first.

## Inputs

- The pre-draft note from `relationship-review`.
- `knowledge-base/seed/voice.md` — the voice rules. Non-negotiable.
- The lead brief for specifics to reference.

## How to draft

1. **Open on their pain, not our pitch.** First line earns the second.
2. **One idea, one ask.** A message that asks for three things gets zero.
3. **Specific to them.** Reference a real detail from the brief — proof you looked.
4. **Match the voice file exactly.** Short punchy sentences, no corporate-speak, no
   clichés ("game-changer", "unlock"), confidence reads calm not hyped. Never disparage
   their existing work.
5. **Make the next step tiny.** A yes/no or a 15-minute ask, not "hop on a call to explore
   synergies."

## Output — a draft ready for the gate

```markdown
### Draft: <lead id> — <channel> — <purpose>
To: <who>
Subject: <if email>

<the message>

--- draft meta ---
Voice-check: <one line confirming it matches voice.md>
Why this now: <the trigger>
Awaiting: approval
```

Then create an approval item via `approvals`. Log it in the lead's contact log
(`crm-management`) as "drafted, awaiting approval."

## Handling replies

When a reply comes in: record it in the contact log, update `stage`, run
`relationship-review` again, and draft the next move. Never let a reply sit with no next
action queued.

## Guardrails

- **Never sends.** Not email, not DM, not a post. Drafting is the ceiling of this skill's
  authority. The operator ships.
- If a draft would require claiming something not in the brief, don't — either source it or
  cut the claim.
- No volume blasting. Each message is individually grounded or it doesn't go out.
