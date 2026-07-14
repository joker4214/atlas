---
name: memory
description: Cross-session memory — write context as you work and reload it on restart so an agent picks up exactly where it left off. Use to persist working state across sessions and crashes. Used by every agent.
---

# memory

An agent's session can end — a restart, a crash, a context rotation. Memory is what makes
that a non-event: the agent writes its working context as it goes and reloads it on boot, so
it resumes mid-thought instead of starting cold. Nothing is forgotten because a session ended.

## What to persist

- **Working state** for the current task: what you're doing, what's done, what's next.
- **Decisions + rationale** that future-you (or another agent) needs to stay consistent.
- **Pointers, not payloads** — reference the lead/task/brief in the KB by id; don't duplicate
  its contents into memory.

## Where

- Durable, shared facts (leads, briefs, decisions that outlive the task) → the **knowledge
  base**. That's the team's long-term memory.
- Per-agent working state (my current place in a task) → the agent's own memory file, reloaded
  on start.

The rule of thumb: if another agent might need it, it goes in the KB. If only this agent needs
it to resume, it's working memory.

## On restart

Reload working memory first, reconcile against the task board and the KB (the world may have
moved while you were down), then continue. Don't re-do completed work — check `last_completed`.

## Guardrails

- Memory is context, not an audit log — keep it current, prune what's stale.
- No secrets in memory (`env-management`). No duplicating KB content — reference it.
- On resume, trust the KB/board over stale memory if they conflict; the shared state is truth.
