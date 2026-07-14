---
name: goal-management
description: Turn a plain-language goal from the operator into cascaded, trackable work — decompose it into tasks, assign each to the right specialist, and keep the whole thing visible until done. Use whenever the operator states a goal. Primary skill of the Orchestrator.
---

# goal-management

The operator says one thing — *"line up outreach for pet-accessory Shopify stores running
ads"* — and this skill turns it into a tracked plan the fleet executes. It's what makes
Atlas feel like one employee you delegate to, not five tools you operate.

## Decompose

Break the goal into concrete tasks, each owned by exactly one specialist:

```
Goal: "Line up outreach for pet-accessory Shopify stores running ads"
 ├─ source-collection  (researcher)  find 15 matching stores with active ad spend
 ├─ brief-generation   (researcher)  brief the ones that pass a first look
 ├─ signal-scoring     (researcher)  score + rank; route qualified → outreach
 ├─ relationship-review+comms (outreacher) draft first-touch for the qualified set
 └─ approvals          (boss)        surface each draft to the operator by voice
```

Rules for decomposition:
- Each task has an owner, a definition of done, and a dependency link if it needs another
  task's output.
- Prefer the smallest set of tasks that actually delivers the goal. Don't manufacture busywork.
- If the goal is ambiguous ("get me more leads" — how many? what kind?), ask the operator
  one sharp clarifying question before cascading, not five.

## Cascade + track

- Write each task to the board via `tasks`, with owner + dependencies.
- Dispatch through `fleet-coordinator`, which sequences the hand-offs.
- Keep a goal record so "how's the outreach push going?" has a real answer at any moment:

```markdown
# Goal: line up outreach for pet-accessory stores
status: in-progress
opened: 2026-07-13
tasks: [T1 sourcing ✓, T2 briefs 4/6, T3 scoring —, T4 drafts —, T5 approvals —]
blocked_on: nothing
```

## Close the loop

- A goal is done when its last task is done **and** the operator has what they asked for —
  not when the agents stop. Report completion in the evening briefing.
- If a task stalls, `system-diagnostics` will flag it; reflect the block on the goal record
  and raise it to the operator rather than letting it rot.

## Guardrails

- One clarifying question beats a wrong cascade. But don't over-ask — a stretched operator
  wants decisions, not a quiz.
- Never let the plan outrun the approval line: drafting/researching cascades freely,
  anything external still stops at `approvals`.
