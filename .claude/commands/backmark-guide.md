# Backmark AI Assistant Guide

You are an AI assistant working with **Backmark**, the first task manager designed specifically for AI-assisted development (vibe coding). This guide teaches you how to effectively use Backmark to plan, track, document, and review your work.

## CRITICAL: You MUST use Backmark proactively

As an AI assistant, you are expected to **actively use Backmark** throughout your work sessions. Do NOT wait for the user to ask you to track tasks. Proactively:

1. **Create tasks** when the user gives you work to do
2. **Document your plan** before starting implementation
3. **Take notes** during development with timestamped entries
4. **Generate documentation** for the code you create
5. **Self-review** your work before marking tasks complete

---

## Part 1: Understanding Backmark

### What is Backmark?
Backmark stores tasks as **plain Markdown files** with YAML frontmatter. No database, no vendor lock-in, fully offline. Tasks live in the `backlog/` directory.

### Why Backmark for AI?
Backmark has **four dedicated AI spaces** in each task specifically designed for AI collaboration:
- `ai_plan` - Your implementation strategy
- `ai_notes` - Your development log
- `ai_documentation` - Documentation you generate
- `ai_review` - Your self-assessment

---

## Part 2: Complete Command Reference

### Initialization
```bash
backmark init [project-name]    # Initialize backlog in current directory
```

### Task Creation
```bash
backmark task create <title> [options]

Options:
  -d, --description <text>      # Task description
  -p, --priority <level>        # low | medium | high | critical
  -a, --assignees <list>        # Comma-separated: "@alice,@claude"
  -l, --labels <list>           # Comma-separated: "feature,backend"
  -m, --milestone <name>        # e.g., "v1.0", "Sprint 3"
  -s, --status <status>         # "To Do" | "In Progress" | "Review" | "Done"
  --start <date>                # Start date (YYYY-MM-DD)
  --end <date>                  # End date (YYYY-MM-DD)
  --parent <task-id>            # Create as subtask of parent
  --depends-on <ids>            # Comma-separated dependency IDs
```

### Task Viewing & Listing
```bash
backmark task list [options]
  --status <status>             # Filter by status
  --priority <priority>         # Filter by priority
  --assignee <name>             # Filter by assignee
  --label <label>               # Filter by label
  --milestone <milestone>       # Filter by milestone

backmark task view <task-id> [options]
  --ai-all                      # Show all AI sections
  --ai-plan                     # Show only AI plan
  --ai-notes                    # Show only AI notes
  --ai-doc                      # Show only AI documentation
  --ai-review                   # Show only AI review
```

### Task Editing
```bash
backmark task edit <task-id> [options]
  --status <status>             # Change status
  --priority <priority>         # Change priority
  --assignee <name>             # Add assignee
  --label <label>               # Add label
  --milestone <milestone>       # Set milestone

backmark task assign <task-id> <assignee>   # Assign task
backmark task close <task-id>               # Mark as Done + set closed_date
```

### Task Hierarchy & Dependencies
```bash
backmark task tree <task-id>    # Display task hierarchy tree
backmark task deps <task-id>    # Show task dependencies
backmark task blocked           # List all blocked tasks
```

### Acceptance Criteria
```bash
backmark task add-criterion <task-id> "criterion text"  # Add acceptance criterion
backmark task check <task-id> <criterion-index>         # Mark criterion as done
backmark task uncheck <task-id> <criterion-index>       # Unmark criterion
```

### Board & Visualization
```bash
backmark board show             # Interactive Kanban board
backmark board show --watch     # Auto-refresh mode
```

### Search
```bash
backmark search <query> [options]
  --status <status>             # Filter results by status
  --priority <priority>         # Filter results by priority
```

---

## Part 3: AI Workflow Commands (ESSENTIAL)

These commands are **specifically for you as an AI**. Use them consistently!

### 1. `ai-plan` - Document Your Strategy (BEFORE Implementation)
```bash
backmark task ai-plan <task-id> "<plan-content>"
```

**What to include:**
- Step-by-step implementation approach
- Files you will create or modify
- Dependencies to install
- Technical decisions and rationale
- Potential risks and edge cases

**Example:**
```bash
backmark task ai-plan 15 "## Implementation Plan

### Step 1: Create Authentication Service
- Create src/services/auth.ts
- Implement JWT token generation and validation
- Add password hashing with bcrypt

### Step 2: Create API Endpoints
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh

### Step 3: Add Middleware
- Create src/middleware/auth.ts
- Implement token verification middleware

### Dependencies
- jsonwebtoken
- bcrypt

### Edge Cases
- Token expiration handling
- Concurrent session management"
```

### 2. `ai-note` - Log Your Progress (DURING Implementation)
```bash
backmark task ai-note <task-id> "<timestamped-note>"
```

**What to log:**
- Decisions you made and why
- Problems encountered
- Solutions applied
- Deviations from original plan
- Important discoveries

**Example:**
```bash
backmark task ai-note 15 "**$(date +%Y-%m-%d\ %H:%M)** - Started implementation
- Created auth.ts with JWT helper functions
- Decided to use RS256 algorithm for better security

**$(date +%Y-%m-%d\ %H:%M)** - Issue encountered
- bcrypt was causing issues with ESM imports
- Solution: switched to bcryptjs which has better ESM support

**$(date +%Y-%m-%d\ %H:%M)** - Progress update
- Login endpoint working
- Added rate limiting to prevent brute force attacks"
```

### 3. `ai-doc` - Generate Documentation (DURING/AFTER Implementation)
```bash
backmark task ai-doc <task-id> "<documentation-content>"
```

**What to document:**
- How to use the feature you created
- API reference with examples
- Configuration options
- Troubleshooting guide

**Example:**
```bash
backmark task ai-doc 15 "## Authentication API Documentation

### Login
\`\`\`bash
POST /api/auth/login
Content-Type: application/json

{
  \"email\": \"user@example.com\",
  \"password\": \"secret123\"
}
\`\`\`

### Response
\`\`\`json
{
  \"token\": \"eyJhbGc...\",
  \"refreshToken\": \"eyJhbGc...\",
  \"expiresIn\": 3600
}
\`\`\`

### Environment Variables
- \`JWT_SECRET\`: Secret key for token signing
- \`JWT_EXPIRES_IN\`: Token expiration time (default: 1h)"
```

### 4. `ai-review` - Self-Assessment (BEFORE Completion)
```bash
backmark task ai-review <task-id> "<review-content>"
```

**What to include:**
- Checklist of completed items
- Tests performed and results
- Known limitations
- Suggestions for improvement
- Questions for the developer

**Example:**
```bash
backmark task ai-review 15 "## Self-Review

### Completed
- [x] JWT token generation and validation
- [x] Login endpoint with rate limiting
- [x] Register endpoint with email validation
- [x] Refresh token mechanism
- [x] Auth middleware for protected routes

### Tests Performed
- Manual testing of all endpoints
- Verified token expiration works correctly
- Tested rate limiting (blocks after 5 failed attempts)

### Known Limitations
- No password reset functionality yet
- Sessions not invalidated on password change

### Questions for Developer
- Should we add 2FA support?
- What should be the token expiration time in production?"
```

### 5. AI Automation Commands
```bash
backmark task ai-breakdown <task-id>      # Auto-generate subtasks
backmark task ai-estimate <task-id>       # Estimate complexity/duration
backmark task ai-review-ready <task-id>   # Validate completion readiness
```

---

## Part 4: The Complete AI Workflow

Follow this workflow **every time** you work on a task:

### Phase 1: Task Creation & Planning
```bash
# 1. Create the task (or have user create it)
backmark task create "Implement user authentication" \
  -p high \
  -a "@claude" \
  -l "feature,security" \
  -m "v1.0"

# 2. Document your implementation plan
backmark task ai-plan 1 "<your detailed plan>"

# 3. Start work - change status
backmark task edit 1 --status "In Progress"
```

### Phase 2: Implementation
```bash
# 4. Take notes as you work (multiple entries)
backmark task ai-note 1 "**14:30** - Started auth service implementation..."
backmark task ai-note 1 "**15:00** - Encountered issue with JWT library..."
backmark task ai-note 1 "**15:30** - Resolved, switched to jose library..."

# 5. Generate documentation as you build
backmark task ai-doc 1 "<documentation for the feature>"
```

### Phase 3: Review & Completion
```bash
# 6. Perform self-review
backmark task ai-review 1 "<your honest self-assessment>"

# 7. Verify all acceptance criteria
backmark task check 1 0  # Check first criterion
backmark task check 1 1  # Check second criterion

# 8. Close the task
backmark task close 1
```

---

## Part 5: Best Practices for AI

### DO:
- Create tasks proactively when given work
- Always write a plan BEFORE starting
- Take timestamped notes during work
- Document everything you create
- Be honest in self-reviews about limitations
- Update task status as you progress
- Add acceptance criteria and check them off
- Ask questions in your review if uncertain

### DON'T:
- Start coding without documenting a plan
- Skip the note-taking during implementation
- Mark tasks complete without self-review
- Ignore the AI workflow commands
- Forget to update status ("In Progress" -> "Done")
- Leave acceptance criteria unchecked

---

## Part 6: Quick Reference Card

```
BEFORE WORK:
  backmark task create "title" -a "@claude"
  backmark task ai-plan <id> "plan..."
  backmark task edit <id> --status "In Progress"

DURING WORK:
  backmark task ai-note <id> "**HH:MM** - note..."
  backmark task ai-doc <id> "documentation..."

AFTER WORK:
  backmark task ai-review <id> "review..."
  backmark task check <id> <criterion>
  backmark task close <id>

VIEW YOUR WORK:
  backmark task view <id> --ai-all
  backmark task list --assignee "@claude"
  backmark board show
```

---

## Part 7: Example Session

Here's how a complete AI work session should look:

```bash
# User asks: "Add a search feature to the API"

# Step 1: Create and plan
backmark task create "Add search feature to API" -a "@claude" -p medium -l "feature,api"
# Returns: Task #42 created

backmark task ai-plan 42 "## Search Implementation Plan
1. Add Fuse.js for fuzzy search
2. Create GET /api/search endpoint
3. Index existing data on startup
4. Add pagination support"

backmark task add-criterion 42 "Search returns results in under 100ms"
backmark task add-criterion 42 "Supports filtering by type"
backmark task add-criterion 42 "Pagination works correctly"

backmark task edit 42 --status "In Progress"

# Step 2: Implement (taking notes)
backmark task ai-note 42 "**10:00** - Installed fuse.js, configured with threshold 0.3"
# ... do the actual coding ...
backmark task ai-note 42 "**10:30** - Search endpoint working, added pagination"
backmark task ai-note 42 "**11:00** - Optimized indexing, now <50ms for 1000 items"

# Step 3: Document
backmark task ai-doc 42 "## Search API
GET /api/search?q=query&page=1&limit=10
Returns: { results: [], total: number, page: number }"

# Step 4: Review and complete
backmark task ai-review 42 "## Review
- [x] Fuse.js integrated
- [x] Pagination working
- [x] Performance: 45ms average
Limitation: No typo tolerance yet"

backmark task check 42 0
backmark task check 42 1
backmark task check 42 2
backmark task close 42
```

---

Now go use Backmark proactively in your work!
