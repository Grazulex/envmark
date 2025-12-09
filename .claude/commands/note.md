# Add Development Note

Add a timestamped note to the current task's AI notes section.

## Usage
When you encounter something noteworthy during implementation, log it:

```bash
backmark task ai-note <task-id> "**$(date +%Y-%m-%d\ %H:%M)** - <your note>"
```

## What to Log

### Progress Updates
```
**HH:MM** - Completed user validation logic in auth.ts
```

### Decisions Made
```
**HH:MM** - DECISION: Using bcryptjs instead of bcrypt for better ESM compatibility
```

### Problems Encountered
```
**HH:MM** - ISSUE: TypeScript errors with generic types in repository pattern
```

### Solutions Applied
```
**HH:MM** - RESOLVED: Added explicit type parameters to Repository<T> class
```

### Deviations from Plan
```
**HH:MM** - DEVIATION: Adding middleware earlier than planned due to dependency
```

### Discoveries
```
**HH:MM** - FOUND: Existing utility function in utils/crypto.ts can be reused
```

---

**TIP**: Log frequently! These notes are invaluable for the developer to understand your thought process.
