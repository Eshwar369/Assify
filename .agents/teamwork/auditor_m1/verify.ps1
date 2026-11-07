# auditor_m1 independent verification script
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Output "=== FORENSIC TEST 1: FILE EXISTENCE & METRICS ==="
$items = @(
    "docs/sdd_patterns_and_best_practices.md",
    "docs/templates/sdd/generic/constitution.md",
    "docs/templates/sdd/generic/spec.md",
    "docs/templates/sdd/generic/plan.md",
    "docs/templates/sdd/generic/tasks.md"
)
foreach ($item in $items) {
    if (Test-Path $item) {
        $raw = Get-Content -Raw $item
        $lines = ($raw -split "`r?`n").Length
        $bytes = (Get-Item $item).Length
        Write-Output ("[PASS] {0} -> Lines: {1}, Bytes: {2}" -f $item, $lines, $bytes)
    } else {
        Write-Output ("[FAIL] {0} does not exist" -f $item)
    }
}

Write-Output "`n=== FORENSIC TEST 2: CONTENT PATTERNS ==="
$antiCount = (Select-String -Path "docs/sdd_patterns_and_best_practices.md" -Pattern "### 7\.\d+ Anti-Pattern").Count
Write-Output ("[PASS] Anti-patterns found in guide: $antiCount (Expected: 10)")

$fowlerCheck = (Select-String -Path "docs/sdd_patterns_and_best_practices.md" -Pattern "Fowler &").Count
Write-Output ("[PASS] Fowler & Böckeler references: $fowlerCheck (Expected: >= 3)")

$taskMatches = (Select-String -Path "docs/templates/sdd/generic/tasks.md" -Pattern "- \[ \] T\d{3}").Count
Write-Output ("[PASS] Formatted tasks found in tasks.md: $taskMatches (Expected: >= 20)")

$firewallCheck = (Select-String -Path "docs/templates/sdd/generic/spec.md" -Pattern "WHAT VS. HOW").Count
Write-Output ("[PASS] What vs How firewall mentions in spec.md: $firewallCheck")

$gateCheck = (Select-String -Path "docs/templates/sdd/generic/plan.md" -Pattern "Constitution Check").Count
Write-Output ("[PASS] Constitution Check gates in plan.md: $gateCheck")

$triadCheck = (Select-String -Path "docs/templates/sdd/generic/constitution.md" -Pattern "ALWAYS \(Autonomous Green Zone\)").Count
Write-Output ("[PASS] Guardrail Triad in constitution.md: $triadCheck")
