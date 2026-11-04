# Setup Git Hooks for Assify
Write-Host "Configuring Git hooks directory to .githooks..." -ForegroundColor Cyan
git config core.hooksPath .githooks
Write-Host "Git hooks configured successfully!" -ForegroundColor Green
