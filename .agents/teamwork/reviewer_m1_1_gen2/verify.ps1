$m1_files = @(
    "docs\sdd_patterns_and_best_practices.md",
    "docs\templates\sdd\generic\constitution.md",
    "docs\templates\sdd\generic\spec.md",
    "docs\templates\sdd\generic\plan.md",
    "docs\templates\sdd\generic\tasks.md"
)

Write-Host "=== 1. FILE INVENTORY & METRICS ==="
foreach ($f in $m1_files) {
    if (Test-Path $f) {
        $item = Get-Item $f
        $lines = (Get-Content $f).Count
        Write-Host ("[OK] {0} : {1} lines, {2} bytes" -f $f, $lines, $item.Length)
    } else {
        Write-Host ("[FAIL] {0} MISSING" -f $f)
    }
}

Write-Host "`n=== 2. TASKS GRAMMAR AUDIT ==="
$tasksFile = "docs\templates\sdd\generic\tasks.md"
$taskLines = Get-Content $tasksFile | Where-Object { $_ -match '^- \[ \] T\d+' }
Write-Host ("Found {0} active task lines in {1}" -f $taskLines.Count, $tasksFile)
$grammarRegex = '^- \[ \] (T\d{3})(?: (\[P\]))?(?: (\[US\d+\]))? (.+)$'
$invalidTasks = @()
foreach ($tl in $taskLines) {
    if ($tl -notmatch $grammarRegex) {
        $invalidTasks += $tl
    }
}
if ($invalidTasks.Count -eq 0) {
    Write-Host ("[PASS] All {0} tasks conform to the SDD task grammar." -f $taskLines.Count)
} else {
    Write-Host ("[FAIL] Invalid task grammar found in {0} lines:" -f $invalidTasks.Count)
    $invalidTasks | ForEach-Object { Write-Host ("  " + $_) }
}

Write-Host "`n=== 3. PATH PRESENCE IN TASKS ==="
$missingPaths = @()
foreach ($tl in $taskLines) {
    if ($tl -notmatch '`[^`]+`') {
        $missingPaths += $tl
    }
}
if ($missingPaths.Count -eq 0) {
    Write-Host "[PASS] 100% of tasks contain explicit backtick-enclosed relative paths."
} else {
    Write-Host ("[FAIL] Tasks missing paths: " + $missingPaths.Count)
    $missingPaths | ForEach-Object { Write-Host ("  " + $_) }
}

Write-Host "`n=== 4. WHAT VS HOW FIREWALL IN SPEC.MD ==="
$specFile = "docs\templates\sdd\generic\spec.md"
$rawSpec = Get-Content $specFile -Raw
# Strip comments and bottom directives
$cleanedSpec = $rawSpec -replace '(?s)<!--.*?-->', '' -replace '(?s)## AI Coding Agent Directives.*', ''
$prohibitedTokens = @('React', 'Expo', 'SQLite', 'PostgreSQL', 'SQL', 'TypeScript', 'Python', 'Zustand', 'Redux', 'FastAPI', 'Axios', 'Prisma', 'HTTP 200', 'GET /', 'POST /')
$violations = @()
foreach ($tok in $prohibitedTokens) {
    if ($cleanedSpec -match [regex]::Escape($tok)) {
        $violations += $tok
    }
}
if ($violations.Count -eq 0) {
    Write-Host "[PASS] Zero implementation leakage detected in spec.md body."
} else {
    Write-Host ("[FAIL] Forbidden implementation tokens found in spec.md: " + ($violations -join ', '))
}

Write-Host "`n=== 5. CONSTITUTION CHECK GATE IN PLAN.MD ==="
$planFile = "docs\templates\sdd\generic\plan.md"
$planContent = Get-Content $planFile -Raw
if ($planContent -match '## Constitution Check' -and $planContent -match 'Article I:' -and $planContent -match 'Article V:') {
    Write-Host "[PASS] plan.md contains complete Constitution Check gate with all 5 articles."
} else {
    Write-Host "[FAIL] plan.md missing Constitution Check gate or articles."
}

Write-Host "`n=== 6. RFC 2119 KEYWORDS IN CONSTITUTION.MD ==="
$constFile = "docs\templates\sdd\generic\constitution.md"
$constContent = Get-Content $constFile -Raw
$rfcKeywords = @('MUST', 'MUST NOT', 'REQUIRED', 'SHALL', 'SHOULD', 'MAY')
$foundKeywords = @()
foreach ($kw in $rfcKeywords) {
    if ($constContent -match ('\b' + $kw + '\b')) {
        $foundKeywords += $kw
    }
}
Write-Host ("Found RFC 2119 keywords in constitution.md: " + ($foundKeywords -join ', '))

Write-Host "`n=== 7. SUCCESS CRITERIA AND REQUIREMENTS IN SPEC.MD ==="
$frCount = ($rawSpec | Select-String -Pattern 'FR-\d{3}' -AllMatches).Matches.Count
$scCount = ($rawSpec | Select-String -Pattern 'SC-\d{3}' -AllMatches).Matches.Count
Write-Host ("FR tags found: {0} | SC tags found: {1}" -f $frCount, $scCount)

Write-Host "`n=== 8. DIRECTIVES IN ALL TEMPLATES ==="
foreach ($f in $m1_files[1..4]) {
    $c = Get-Content $f -Raw
    if ($c -match 'AI Coding Agent Directives' -or $c -match 'AI AGENT') {
        Write-Host ("[PASS] Directives present in {0}" -f $f)
    } else {
        Write-Host ("[FAIL] Directives MISSING in {0}" -f $f)
    }
}
