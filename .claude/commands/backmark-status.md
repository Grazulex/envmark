# Backmark Status Check

Check the current state of the backlog and your assigned tasks.

## Commands to Run

### 1. See All Your Tasks
```bash
backmark task list --assignee "@claude"
```

### 2. See Tasks In Progress
```bash
backmark task list --status "In Progress"
```

### 3. View the Board
```bash
backmark board show
```

### 4. Check Blocked Tasks
```bash
backmark task blocked
```

### 5. Search for Something
```bash
backmark search "<query>"
```

## After Checking Status

If you have tasks in progress:
- Continue working on them
- Add notes about your progress: `backmark task ai-note <id> "..."`

If you have no tasks:
- Wait for user instructions
- Or proactively create a task when given work

## Quick Stats
Run these to understand the project state:
```bash
backmark task list | head -20
backmark board show
```
