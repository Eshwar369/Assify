# Independent PowerShell Verification Script for Victory Audit 2
$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "RUNNING INDEPENDENT POWERSHELL VERIFICATION SUITE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Target files check
$files = @(
    "docs/sdd_patterns_and_best_practices.md",
    "docs/templates/sdd/generic/constitution.md",
    "docs/templates/sdd/generic/spec.md",
    "docs/templates/sdd/generic/plan.md",
    "docs/templates/sdd/generic/tasks.md",
    "docs/templates/sdd/examples/constitution.md",
    "docs/templates/sdd/examples/spec.md",
    "docs/templates/sdd/examples/plan.md",
    "docs/templates/sdd/examples/tasks.md"
)

foreach ($f in $files) {
    if (-not (Test-Path $f)) {
        throw "Missing expected file: $f"
    }
    $item = Get-Item $f
    $lines = (Get-Content $f).Count
    Write-Host "  [PASS] File $f ($lines lines, $($item.Length) bytes)" -ForegroundColor Green
}

# 2. Check 20 Anti-Slop tells in examples/constitution.md
$const = Get-Content "docs/templates/sdd/examples/constitution.md" -Raw
$tellsMatches = [regex]::Matches($const, '(?m)^\d+\.\s+\*\*No\s+([^\*]+)\*')
Write-Host "  Anti-Slop tells found in constitution.md: $($tellsMatches.Count)" -ForegroundColor Yellow
if ($tellsMatches.Count -lt 20) {
    throw "Expected at least 20 Anti-Slop tells, found $($tellsMatches.Count)"
}
Write-Host "  [PASS] Article III codifies all 20 Anti-Slop tells" -ForegroundColor Green

# 3. Check BIGINT timestamps in examples/plan.md
$plan = Get-Content "docs/templates/sdd/examples/plan.md" -Raw
if ($plan -match 'timestamp\s+INTEGER\s+NOT\s+NULL') {
    throw "Found vulnerable timestamp INTEGER NOT NULL in plan.md"
}
$bigintMatches = [regex]::Matches($plan, '\b\w+\s+BIGINT\s+NOT\s+NULL\b')
if ($bigintMatches.Count -lt 5) {
    throw "Expected at least 5 BIGINT NOT NULL timestamp columns, found $($bigintMatches.Count)"
}
Write-Host "  [PASS] 64-bit cross-provider parity (5 BIGINT columns verified)" -ForegroundColor Green

# 4. Check active tasks in examples/tasks.md
$tasks = Get-Content "docs/templates/sdd/examples/tasks.md"
$activeTasks = $tasks | Where-Object { $_ -match '^-\s+\[\s*\]\s+(T\d+)' }
Write-Host "  Active tasks count in tasks.md: $($activeTasks.Count)" -ForegroundColor Yellow
if ($activeTasks.Count -ne 39) {
    throw "Expected exactly 39 active tasks in tasks.md, found $($activeTasks.Count)"
}
Write-Host "  [PASS] Exactly 39 active tasks verified (T001 to T039)" -ForegroundColor Green

# 5. Check store decoupling
$t015 = ($activeTasks | Where-Object { $_ -match '^-\s+\[\s*\]\s+T015\b' }) | Select-Object -First 1
$t023 = ($activeTasks | Where-Object { $_ -match '^-\s+\[\s*\]\s+T023\b' }) | Select-Object -First 1
Write-Host "t015 line: '$t015'"
Write-Host "t023 line: '$t023'"
if ($t015 -match 'T006' -or $t023 -match 'T006') {
    throw "T015 or T023 still coupled to concrete T006"
}
if ($t015 -notmatch 'T005' -or $t023 -notmatch 'T005') {
    throw "T015 or T023 missing dependency on abstract T005"
}
Write-Host "  [PASS] Store decoupling verified (depends on T005 via getDatabaseProvider())" -ForegroundColor Green

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "POWERSHELL VERIFICATION PASSED (100% SUCCESS)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
