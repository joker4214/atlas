---
name: fleet-coordinator
description: Sequence a multi-agent job end to end — dispatch each task to its owner over the bus, watch for the hand-off, and move the work down the line until the goal is met. Use to run a cascaded goal across specialists. Primary skill of the Orchestrator.
---

# fleet-coordinator

Once a goal is decomposed (`goal-management`), this skill runs it. It's the conductor: it
dispatches each task to the specialist that owns it, waits for the result to land on the
bus, and moves the next task when its dependency clears — so one goal flows cleanly through
five agents.

## How coordination works

- The **file bus** is the channel. Dispatching a task = writing a task message the owning
  agent picks up. A result = the owner writing back and updating the task/KB.
- Coordinate by **state, not by chat.** The truth is the task board (`tasks`) and the lead
  records (`knowledge-base`), not a conversation. Read state to decide the next move.
- Respect dependencies: don't dispatch the drafting task before scoring has routed leads to
  outreach.

## The loop

```
for each ready task (dependencies met):
    dispatch to owner over the bus
    log dispatch to the activity feed
watch the bus/board for completions:
    on completion  → mark done, release dependent tasks
    on stall       → system-diagnostics flags it → surface to operator
until all tasks done → report goal complete
```

## Hand-offs to get right

- **researcher → outreacher:** only leads `route: outreach` cross this line. Borderline
  ones go to the operator, not down the pipe.
- **any agent → operator:** anything external hits `approvals` first. The coordinator never
  routes around the gate.
- **analyst → researcher:** updated scoring weights flow back so future scoring improves.

## Keeping it healthy

- If an agent goes quiet mid-job, don't silently wait forever — `system-diagnostics` catches
  it and the coordinator re-dispatches or raises it.
- Parallelize independent tasks (sourcing two segments at once) instead of forcing a single
  file when there's no dependency.

## Guardrails

- The coordinator moves work; it does not do the specialists' work for them. If a task is
  mis-owned, reassign it — don't just do it inline and hide the gap.
- Never mark a goal complete while an approval is still pending — pending means not shipped.
