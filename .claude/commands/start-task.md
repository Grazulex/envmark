# Start Task Workflow

You need to start working on a task using the Backmark AI workflow. Follow these steps:

## Step 1: Understand the Request
Analyze what the user is asking you to do. Identify:
- The main objective
- Key requirements
- Any constraints or preferences mentioned

## Step 2: Create the Task
```bash
backmark task create "<descriptive title>" \
  -a "@claude" \
  -p <low|medium|high|critical> \
  -l "<relevant,labels>" \
  -d "<brief description>"
```

## Step 3: Write Your Plan
Before ANY implementation, document your approach:
```bash
backmark task ai-plan <task-id> "## Implementation Plan

### Objective
<what you will accomplish>

### Steps
1. <first step>
2. <second step>
3. ...

### Files to Create/Modify
- <file1>
- <file2>

### Technical Approach
<your strategy and rationale>

### Edge Cases to Consider
- <edge case 1>
- <edge case 2>"
```

## Step 4: Add Acceptance Criteria
```bash
backmark task add-criterion <task-id> "<criterion 1>"
backmark task add-criterion <task-id> "<criterion 2>"
```

## Step 5: Start Work
```bash
backmark task edit <task-id> --status "In Progress"
```

Now you may begin implementation. Remember to use `backmark task ai-note` to log your progress!

---

**IMPORTANT**: Do not skip the planning phase. The plan helps both you and the developer track what will be done.
