---
name: relationship-review
description: Ground every outreach message in the real state of the relationship — what's been said, what they care about, what stage they're at — before it's drafted, so messages never feel generic or repeat themselves. Use before drafting any outbound message. Used by the Outreach agent.
---

# relationship-review

Before writing a single word of outreach, read the room. This skill pulls the full history
on a lead so the next message continues a real conversation instead of blasting a template.
The difference between outreach that works and spam is whether it remembers.

## What to read

1. The lead's **brief** (who they are, the angle) — `knowledge-base/leads/<id>.md`.
2. The **contact log** (`crm-management`) — every prior touch and their responses.
3. The **voice** file — how we sound (`knowledge-base/seed/voice.md`).
4. Any **new signal** since the last touch (did they just launch/complain/post?).

## What to output

A short pre-draft note the `comms` skill then turns into a message:

```
- Stage: <where they are>
- What they've told us: <their words / objections>
- Their live pain / angle: <the one thing to lead with>
- What NOT to repeat: <anything already said — don't say it twice>
- Tone for this person: <e.g. "she pushed back on harsh feedback before — go gentle">
- The ask: <the single next step this message is for>
```

## Rules

- **One relationship, one thread of logic.** The message must make sense as the *next* thing
  said, not a cold open, if there's prior contact.
- **Lead with their pain, not our pitch** (per voice rules). Reframe their problem as
  visibility/strategy, never as "your work is bad."
- **Respect prior friction.** If the log shows they bristled at something, adapt — the note
  must call it out so the drafter doesn't step on it again.
- If there's genuinely no history (true cold), say so — the drafter opens differently.

## Guardrails

- Never contradict something we told them before. Continuity is the whole point.
- If the relationship state is unclear or the last message's outcome is unknown, flag it
  rather than guessing — a wrong assumption about where things stand reads as careless.
