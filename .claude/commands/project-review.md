# Project Code Review

Use the `project-review` skill to review code changes in this project.

If an argument is provided (e.g. a file path or `staged`), scope the review to that target. Otherwise review the full current diff: `git diff HEAD` plus any unstaged changes.

Invoke the skill, work through every checklist pass in order, then output findings:

```text
path:line: SEVERITY: problem. fix.
```

Severities: `CRITICAL` | `ERROR` | `WARNING` | `STYLE`

After all findings, print a one-line summary: total issues by severity. If none, confirm the diff is clean against project conventions.
