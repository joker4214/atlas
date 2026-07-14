# The knowledge base — Atlas's shared brain

Every agent reads from and writes to this directory using the convention in the
`knowledge-base` skill. If a fact isn't here, the team doesn't know it. If work isn't written
here, it gets redone. That's the whole point of the shared brain: the team works off one
context and never re-does research it already has.

## Layout

```
seed/                  # operator-owned config (edit these to your business)
  icp.md               #   who we target        ← most important file
  voice.md             #   how we sound
  offer.md             #   what we sell
  sources.md           #   where leads come from
  scoring-weights.yaml #   how leads are scored (Analyst may tune)
leads/<id>.md          # one file per lead: frontmatter + stub → brief → score → contact log
content/<slug>.md      # drafted content + the content bank
analytics/<date>.md    # weekly syntheses, autoresearch findings, market notes
approvals/<id>.md      # pending/decided external actions (the gate's queue)
activity/<date>.md     # the append-only activity feed (event-logging)
health/<agent>.json    # per-agent heartbeats
index/                 # generated RAG index (gitignored)
```

The `seed/` files are yours to edit. Everything else the fleet fills in as it works. Runtime
dirs (`leads/`, `content/`, `analytics/`, `approvals/`, `activity/`, `health/`) are created by
`npm run seed:kb` and populated at runtime — they're gitignored except for the example lead so
the structure is visible.

## Seeding from an existing knowledge base

If you already keep brand/voice/CRM notes elsewhere, `npm run import:kronos` shows how to pull
them in (it maps a source folder's brand/voice/leads into these seed files). Edit it to point
at your source, or just fill in the `seed/` files by hand.
