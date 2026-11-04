#!/usr/bin/env sh
# Setup Git Hooks for Assify
echo "Configuring Git hooks directory to .githooks..."
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit .githooks/commit-msg .githooks/pre-push 2>/dev/null || true
echo "Git hooks configured successfully!"
