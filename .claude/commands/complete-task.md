# Complete Task Workflow

You are finishing work on a task. Follow these steps to properly close it:

## Step 1: Document What You Built
If not already done, add comprehensive documentation:
```bash
backmark task ai-doc <task-id> "## Documentation

### Overview
<what was implemented>

### Usage
<how to use the feature>

### API/Interface
<code examples, endpoints, functions>

### Configuration
<any config options>

### Notes
<important information>"
```

## Step 2: Self-Review
Be honest about your work:
```bash
backmark task ai-review <task-id> "## Self-Review

### Completed
- [x] <item 1>
- [x] <item 2>
- [ ] <item not completed if any>

### Tests Performed
- <test 1 and result>
- <test 2 and result>

### Quality Assessment
- Code follows project conventions: Yes/No
- Error handling implemented: Yes/No
- Edge cases covered: Yes/No

### Known Limitations
- <limitation 1>
- <limitation 2>

### Suggestions for Future
- <improvement 1>
- <improvement 2>

### Questions for Developer
- <question if any>"
```

## Step 3: Verify Acceptance Criteria
Check each criterion that has been met:
```bash
backmark task view <task-id>  # See all criteria
backmark task check <task-id> <index>  # For each met criterion
```

## Step 4: Final Notes
Add any final notes about the implementation:
```bash
backmark task ai-note <task-id> "**COMPLETED** - <summary of what was accomplished>"
```

## Step 5: Close the Task
```bash
backmark task close <task-id>
```

---

**IMPORTANT**: Only close the task if ALL acceptance criteria are met. If some are not met, discuss with the user first.
