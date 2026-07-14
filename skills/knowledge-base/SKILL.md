---
name: knowledge-base
description: Read from and write to the shared RAG knowledge base using one consistent convention, so every agent works off the same context and nothing is ever re-researched. Use whenever an agent needs stored context (ICP, voice, briefs, prior leads) or produces something worth keeping. Used by every agent.
---

# knowledge-base

The shared brain. Every agent reads from it and writes to it, so the team works off one
context instead of ten scattered ones. If a fact isn't in the KB, the team doesn't know it.
If a piece of work isn't written here, it will be redone. This skill is the read/write
convention that keeps that from happening.

## Layout

```
knowledge-base/
  seed/                 # operator-owned config, rarely changes
    icp.md              # who we target
    voice.md            # how we sound
    offer.md            # what we sell
    sources.md          # where leads come from
    scoring-weights.yaml# how leads are scored (tuned by Analytics)
  leads/<id>.md         # one file per lead: frontmatter + stub/brief/history
  content/<slug>.md     # drafted content + the content bank
  analytics/<date>.md   # weekly syntheses, metric snapshots
  index/                # RAG index (generated; gitignored)
```

## Reading

- For **structured lookups** (a specific lead, the ICP, the offer), read the file directly
  by its known path — it's faster and exact.
- For **"what do we know about X"** open questions, query the RAG index over the whole KB
  and cite the source files you used.
- Always prefer recalling an existing brief over re-researching. Check `leads/` first.

## Writing

- Keep the **frontmatter contract** (see `signal-scoring` and `brief-generation`) intact —
  other agents parse it. Never drop fields you don't understand.
- **Append, don't overwrite history.** A lead record accumulates: stub → brief → score →
  outreach log → replies. Add sections; don't clobber.
- Every write gets a one-line `event-logging` entry so the activity feed shows the KB
  changing.
- Re-index after a batch of writes so RAG stays fresh (`index/` rebuild).

## Guardrails

- The `seed/` files are the operator's source of truth — treat edits to them as needing
  approval, not something an agent changes on its own.
- No secrets in the KB. Credentials live in the environment (`env-management`), never here.
