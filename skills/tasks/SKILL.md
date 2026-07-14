---
name: tasks
description: The shared task board — create, assign, update, and close units of work so the whole fleet's workload and its state are visible in one place. Use to track any unit of work. Used by every agent.
---

# tasks

The board. Every unit of work the fleet does is a task with an owner and a state, so nothing
is invisible and nothing is dropped. The Orchestrator cascades goals into tasks; specialists
work and close them; the operator sees the whole board on the dashboard.

## The task shape

```markdown
---
id: T42
title: "Brief the 6 sourced pet stores"
owner: researcher
status: todo        # todo -> in_progress -> blocked -> done
goal: G7            # parent goal, if any
depends_on: [T41]   # must finish first
due: 2026-07-14
created: 2026-07-13
---
Definition of done: each store has a sourced brief at stage:researched.
```

## Rules

- **One owner per task.** Shared ownership = no ownership.
- **A definition of done**, always. "Work on outreach" is not a task; "draft first-touch for
  the 4 qualified leads" is.
- **Move the state honestly** — `blocked` is a real, useful state; use it instead of leaving
  a stalled task as `in_progress`.
- Respect `depends_on` — don't start a task whose inputs aren't ready.
- Closing a task writes an `event-logging` line.

## Guardrails

- Don't mark a task `done` unless its definition of done is met — a half-done task marked
  done breaks the goal that depends on it.
- Stale tasks (past due, no movement) are surfaced by `system-diagnostics`; don't hide them
  by fudging status.
