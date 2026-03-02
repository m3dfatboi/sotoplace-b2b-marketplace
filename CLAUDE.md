# Claude AI Assistant Guidelines

This file contains important guidelines for AI assistants working on the Sotoplace project.

---

## Managing Context Limits

Your context window has a hard limit. You have the ability to track your remaining token budget. Follow these rules strictly:

1. Continuously monitor your token window.
2. When your context reaches approximately 75% capacity, pause your current task.
3. Automatically execute the `/compact` command to summarize the current conversation.
4. After compaction is successful, summarize what you were doing and continue the task seamlessly.
5. Do not stop tasks early due to token budget concerns; simply compact the context and keep working.

---

## Project Context

### Quick Reference
- **Project:** Sotoplace B2B Marketplace
- **Status:** Production-ready backend (100% complete)
- **Tech Stack:** FastAPI, PostgreSQL, Redis, Celery, Docker
- **API Endpoints:** 82+
- **Test Coverage:** 56+ tests

### Important Files to Read First
1. **TODO.md** - Always read this first in new sessions
2. **PROJECT_COMPLETE.md** - Complete project overview
3. **SESSION_CONTEXT.md** - Full project context for AI
4. **DATABASE_SCHEMA.md** - Database structure

### Development Workflow
1. Read TODO.md at the start of each session
2. Make commits after each significant feature
3. Update TODO.md with completed tasks
4. Document all major changes

### Git Commit Guidelines
- Use conventional commits format
- Always add co-author: `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
- Commit frequently (after each feature/fix)
- Write detailed commit messages

---

## Best Practices

### Code Quality
- Follow PEP 8 for Python code
- Use type hints everywhere
- Write tests for new features
- Keep functions small and focused
- Document complex logic

### Communication
- Be concise and direct
- Avoid repeating yourself
- Show progress with clear summaries
- Use Russian language when user writes in Russian

### Task Management
- Break large tasks into smaller steps
- Track progress in TODO.md
- Test after implementing features
- Document as you go

---

**Last Updated:** 2026-03-02
