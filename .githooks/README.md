# Assify Repository Git Hooks (Layer 2)

This directory contains version-controlled Git hooks that protect the repository from accidental data leaks, constitution violations, and malformed commits.

## Configured Hooks

1. **`pre-commit`**:
   - **Privacy Guard:** Blocks commits of sensitive files (`.env`, `_chat.txt`, WhatsApp chat `.zip` archives, `.key`, `.pem`, `.sqlite`).
   - **Large File Blocker:** Rejects files exceeding 5MB.
   - **Placeholder Scanner:** Blocks commits with unresolved critical markers (`TODO(MUST)`, `FIXME(FATAL)`, `__MOCK_FACADE__`).
   - **Syntax Checks:** Validates all staged JSON and YAML files.
   - **Adaptive Linter / Typechecker:** Runs `npm run typecheck` and `npm run lint` if `package.json` exists.

2. **`commit-msg`**:
   - Enforces the Conventional Commits specification:
     `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `build:`, `ci:`, `chore:`, `revert:`.

3. **`pre-push`**:
   - Runs full test suites before pushing.
   - Warns when pushing directly to main/master.

## Setup Instructions

To enable these hooks on a new clone:
```powershell
# On Windows PowerShell:
.\.githooks\setup.ps1

# On Linux / macOS / Git Bash:
sh .githooks/setup.sh
```
Or directly via git:
```bash
git config core.hooksPath .githooks
```
