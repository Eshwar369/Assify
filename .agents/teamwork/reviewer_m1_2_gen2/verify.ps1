# Automated Validation Script for Milestone 1 Deliverables
$ErrorActionPreference = 'Stop'
$tests = [System.Collections.Generic.List[PSCustomObject]]::new()

# 1. File existence and size
$files = @(
    'docs\sdd_patterns_and_best_practices.md',
    'docs\templates\sdd\generic\constitution.md',
    'docs\templates\sdd\generic\spec.md',
    'docs\templates\sdd\generic\plan.md',
    'docs\templates\sdd\generic\tasks.md'
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $item = Get-Item $f
        $lines = (Get-Content $f).Count
        $tests.Add([PSCustomObject]@{
            Test = 'File Existence & Size'
            Target = $f
            Status = 'PASS'
            Detail = "$($item.Length) bytes, $lines lines"
        })
    } else {
        $tests.Add([PSCustomObject]@{
            Test = 'File Existence & Size'
            Target = $f
            Status = 'FAIL'
            Detail = 'File does not exist'
        })
    }
}

# 2. Check all 10 anti-patterns in sdd_patterns_and_best_practices.md
$patternsPath = 'docs\sdd_patterns_and_best_practices.md'
if (Test-Path $patternsPath) {
    $patternsContent = Get-Content $patternsPath -Raw
    $antiPatternTitles = @(
        'The Monolithic Task Trap',
        'The Keystroke Micro-Management Trap',
        'The Flat-List Fallacy',
        '"Waterfall Strikes Back" / Static Plan Rigidity',
        'Context Window Exhaustion & Attention Degradation',
        'Specification Theater & Green-Check Blindness',
        'Cognitive Surrender & Borrowed Confidence',
        'Comprehension Debt & The Illusion of Control',
        'The Maintenance Tax & Silent Spec Drift',
        '"Great Specs, No MVP" Paralysis'
    )
    for ($i = 0; $i -lt 10; $i++) {
        $idx = $i + 1
        $patName = $antiPatternTitles[$i]
        $patternRegex = "### 7\.$idx Anti-Pattern ${idx}:"
        $hasPattern = $patternsContent -match $patternRegex
        $tests.Add([PSCustomObject]@{
            Test = "Anti-Pattern $idx ($patName)"
            Target = 'docs/sdd_patterns'
            Status = if ($hasPattern) { 'PASS' } else { 'FAIL' }
            Detail = "Header match: $hasPattern"
        })
    }
}

# 3. Check Task grammar in tasks.md
$tasksPath = 'docs\templates\sdd\generic\tasks.md'
if (Test-Path $tasksPath) {
    $tasksLines = Get-Content $tasksPath
    $taskMatches = ($tasksLines | Select-String -Pattern '^- \[ \] T\d{3}').Count
    $tests.Add([PSCustomObject]@{
        Test = 'Task Grammar (- [ ] T###)'
        Target = 'tasks.md'
        Status = if ($taskMatches -ge 20) { 'PASS' } else { 'FAIL' }
        Detail = "Matched $taskMatches task items"
    })
    
    # Check phases
    $hasPhase1 = $tasksLines -match '## Phase 1: Setup'
    $hasPhase2 = $tasksLines -match '## Phase 2: Foundational'
    $hasPhase3 = $tasksLines -match '## Phase 3: User Story 1'
    $hasPhaseN = $tasksLines -match '## Phase N: Polish'
    $hasPhaseN1 = $tasksLines -match '## Phase N\+1: Append-Only Convergence'
    $tests.Add([PSCustomObject]@{
        Test = 'Tasks Phase Structure (1,2,3,N,N+1)'
        Target = 'tasks.md'
        Status = if ($hasPhase1 -and $hasPhase2 -and $hasPhase3 -and $hasPhaseN -and $hasPhaseN1) { 'PASS' } else { 'FAIL' }
        Detail = "Phases present: P1=$([bool]$hasPhase1), P2=$([bool]$hasPhase2), P3=$([bool]$hasPhase3), PN=$([bool]$hasPhaseN), PN+1=$([bool]$hasPhaseN1)"
    })
}

# 4. Check Ambiguity guard in spec.md
$specPath = 'docs\templates\sdd\generic\spec.md'
if (Test-Path $specPath) {
    $specContent = Get-Content $specPath -Raw
    $hasAmbGuard = $specContent -match 'AMBIGUITY GUARD' -and $specContent -match 'MAXIMUM of 3 `\[NEEDS CLARIFICATION\]`'
    $tests.Add([PSCustomObject]@{
        Test = 'Ambiguity Guard (Max 3 Tags)'
        Target = 'spec.md'
        Status = if ($hasAmbGuard) { 'PASS' } else { 'FAIL' }
        Detail = "Ambiguity guard found: $hasAmbGuard"
    })

    # 5. Check Four-Quadrant Edge Case Matrix in spec.md
    $q1 = $specContent -match 'Quadrant 1: Boundary & Limit'
    $q2 = $specContent -match 'Quadrant 2: Network & Transient'
    $q3 = $specContent -match 'Quadrant 3: Concurrency & Race'
    $q4 = $specContent -match 'Quadrant 4: Security & Permission'
    $tests.Add([PSCustomObject]@{
        Test = '4-Quadrant Edge Case Matrix'
        Target = 'spec.md'
        Status = if ($q1 -and $q2 -and $q3 -and $q4) { 'PASS' } else { 'FAIL' }
        Detail = "Q1=$q1, Q2=$q2, Q3=$q3, Q4=$q4"
    })

    # 6. Check What vs How Firewall
    $hasFirewall = $specContent -match 'THE "WHAT VS\. HOW" FIREWALL'
    $tests.Add([PSCustomObject]@{
        Test = 'What vs How Firewall'
        Target = 'spec.md'
        Status = if ($hasFirewall) { 'PASS' } else { 'FAIL' }
        Detail = "Firewall directive found: $hasFirewall"
    })
}

# 7. Check Reviewer Checkbox Ownership in constitution.md and sdd_patterns
$constPath = 'docs\templates\sdd\generic\constitution.md'
if (Test-Path $constPath) {
    $constContent = Get-Content $constPath -Raw
    $hasRevOwnership = $constContent -match 'Reviewer Ownership vs\. Machine Checklists' -and
                       $constContent -match 'EXCLUSIVELY OWNED BY HUMAN ARCHITECTS'
    $tests.Add([PSCustomObject]@{
        Test = 'Reviewer Checkbox Ownership (Constitution)'
        Target = 'constitution.md'
        Status = if ($hasRevOwnership) { 'PASS' } else { 'FAIL' }
        Detail = "Human reviewer ownership clause: $hasRevOwnership"
    })
}

# 8. Check Constitution Check Gate in plan.md
$planPath = 'docs\templates\sdd\generic\plan.md'
if (Test-Path $planPath) {
    $planContent = Get-Content $planPath -Raw
    $hasConstGate = $planContent -match '## Constitution Check' -and
                    $planContent -match '- \[ \] \*\*Article I:' -and
                    $planContent -match '- \[ \] \*\*Article V:'
    $tests.Add([PSCustomObject]@{
        Test = 'Constitution Check Gate'
        Target = 'plan.md'
        Status = if ($hasConstGate) { 'PASS' } else { 'FAIL' }
        Detail = "Constitution check gate & checkboxes: $hasConstGate"
    })
}

$tests | Format-Table -AutoSize
$failures = ($tests | Where-Object { $_.Status -ne 'PASS' }).Count
Write-Host "`nTotal Tests: $($tests.Count) | Passed: $($tests.Count - $failures) | Failed: $failures" -ForegroundColor $(if ($failures -eq 0){'Green'}else{'Red'})
if ($failures -gt 0) { exit 1 } else { exit 0 }
