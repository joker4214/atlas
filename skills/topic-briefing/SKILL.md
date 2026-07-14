---
name: topic-briefing
description: Shape a raw topic into a tight content brief — the angle, the audience pain it speaks to, the proof points from our own knowledge base, and the CTA — so drafting starts from a plan, not a blank page. Use before drafting any content. Used by the Content agent.
---

# topic-briefing

Content that pulls inbound leads starts from a brief, not a blank page. This skill turns a
topic into a plan the drafter can execute: the angle, who it's for, the real proof we can
cite, and the one action it drives.

## Inputs

- The topic (from the operator, `autoresearch`, or a market signal).
- `knowledge-base/seed/icp.md` + `voice.md` — who we're talking to and how.
- The KB itself — real briefs, real results, real market observations to cite. Content that
  pulls leads is built on real signal, not generic advice.

## The brief

```markdown
# Content brief: <topic>
Audience: <which slice of the ICP>
Their pain: <the specific problem this speaks to — in their words>
Angle: <the one non-obvious take that makes this worth reading>
Proof from our KB: <real examples/observations we can cite — link them>
Format + channel: <post / thread / short-form / digest>
CTA: <the single next step — value-first, never a hard pitch>
Voice notes: <anything specific from voice.md for this piece>
```

## Rules

- **Value first, never a pitch.** The content earns authority; the CTA is soft. A brief
  whose whole point is "buy now" won't pull leads.
- **Lead with the reader's pain**, reframed as visibility/strategy — never implying their
  work is bad (voice rule).
- **Cite real signal.** If we can't back the angle with something in the KB or sourced,
  pick a different angle.

## Hand-off

Bank the brief in `knowledge-base/content/`, then hand to `comms` for drafting. Publication
is still approval-gated.

## Guardrails

- One topic, one angle, one CTA. A brief that tries to say everything says nothing.
- Don't recycle an angle already used recently — check the content bank first.
