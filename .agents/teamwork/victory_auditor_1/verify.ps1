# verify.ps1 - Automated Forensic and Requirements Verification Script
$ErrorActionPreference = 'Stop'

Write-Host "=== STARTING INDEPENDENT VICTORY AUDIT CHECKS ===" -ForegroundColor Cyan

# 1. Timeline and File Provenance Check
Write-Host "`n[PHASE A] Checking Timeline and File Provenance..." -ForegroundColor Yellow
$artifacts = Get-ChildItem -Path '.agents\teamwork' -Recurse -File | Where-Object { 
    $_.Name -in @('DISPATCH.md','handoff.md','progress.md','findings.md','review.md','challenge_report.md','audit_report.md','spec_kit_research_report.md') 
} | Sort-Object LastWriteTime

foreach ($a in $artifacts) {
    Write-Host ("{0:yyyy-MM-dd HH:mm:ss} | {1,8} bytes | {2}" -f $a.LastWriteTime, $a.Length, $a.FullName.Replace((Get-Location).Path, ''))
}

# 2. Phase B: Integrity and Anti-Cheating Forensics
Write-Host "`n[PHASE B] Integrity and Anti-Cheating Forensics..." -ForegroundColor Yellow
$targetPath = "docs\spec_kit_research_report.md"
if (-not (Test-Path $targetPath)) {
    Write-Error "CRITICAL: Deliverable file $targetPath does NOT exist!"
}
$content = Get-Content -Path $targetPath -Raw
$lines = Get-Content -Path $targetPath

# Check 1: Forbidden / Placeholder Patterns
$prohibitedTokens = @('TODO', 'TBD', '[placeholder]', 'FIXME', 'Lorem ipsum', 'INSERT HERE', 'NEED CLARIFICATION')
$foundTokens = @()
foreach ($token in $prohibitedTokens) {
    $matches = Select-String -Path $targetPath -Pattern "\b$token\b" -SimpleMatch
    if ($matches) {
        $foundTokens += "$token ($($matches.Count) occurrences)"
    }
}
if ($foundTokens.Count -gt 0) {
    Write-Host "FAIL: Prohibited placeholder tokens found: $($foundTokens -join ', ')" -ForegroundColor Red
} else {
    Write-Host "PASS: Zero prohibited placeholder tokens found." -ForegroundColor Green
}

# Check 2: Code block balance (fences)
$fenceCount = (Select-String -Path $targetPath -Pattern '^```' | Measure-Object).Count
if ($fenceCount % 2 -ne 0) {
    Write-Host "FAIL: Unbalanced code block fences! Count: $fenceCount" -ForegroundColor Red
} else {
    Write-Host "PASS: Code block fences balanced (Total: $fenceCount fences, $($fenceCount/2) blocks)." -ForegroundColor Green
}

# Check 3: Workspace layout compliance (.agents/teamwork/ must contain NO source or tests)
$illegalFiles = Get-ChildItem -Path '.agents\teamwork' -Recurse -File | Where-Object {
    $_.Extension -in @('.go','.py','.ts','.js','.rs','.java','.c','.cpp')
}
if ($illegalFiles) {
    Write-Host "FAIL: Source code files found in .agents/teamwork/ : $($illegalFiles.FullName)" -ForegroundColor Red
} else {
    Write-Host "PASS: .agents/teamwork/ contains only agent metadata." -ForegroundColor Green
}

# 3. Phase C: Requirements and Acceptance Criteria Verification
Write-Host "`n[PHASE C] Requirements and Acceptance Criteria Verification..." -ForegroundColor Yellow

$wordCount = ($content -split '\s+').Count
Write-Host ("File statistics: {0} lines, {1} bytes, {2} words" -f $lines.Count, (Get-Item $targetPath).Length, $wordCount)

# Anchor Verification
Write-Host "`nTesting Table of Contents Anchor Integrity..."
$headings = @{}
$headingRegex = '^#+\s+(.+)$'
$lineNum = 0
foreach ($line in $lines) {
    $lineNum++
    if ($line -match $headingRegex) {
        $rawHeading = $matches[1].Trim()
        # GitHub slugify algorithm
        $charArray = $rawHeading.ToLower().ToCharArray()
        $cleanChars = $charArray | Where-Object { [char]::IsLetterOrDigit($_) -or $_ -eq ' ' -or $_ -eq '-' }
        $slug = (-join $cleanChars).Trim() -replace '\s+', '-'
        $slug = $slug -replace '-+', '-'
        $headings[$slug] = $rawHeading
    }
}

# Find all links in TOC
$tocLinks = Select-String -Path $targetPath -Pattern '\[([^\]]+)\]\(#([^\)]+)\)' -AllMatches
$brokenLinks = @()
$verifiedLinks = 0
foreach ($m in $tocLinks.Matches) {
    $title = $m.Groups[1].Value
    $anchor = $m.Groups[2].Value
    # check anchor
    # GitHub slug might remove umlaut or keep it, let's normalize
    $matched = $false
    if ($headings.ContainsKey($anchor)) {
        $matched = $true
    } else {
        # Check normalized without special chars
        foreach ($hSlug in $headings.Keys) {
            if ($hSlug -eq $anchor -or $hSlug.Replace('ö','o') -eq $anchor -or $anchor.Replace('ö','o') -eq $hSlug) {
                $matched = $true
                break
            }
        }
    }
    if ($matched) {
        $verifiedLinks++
    } else {
        $brokenLinks += "$title -> #$anchor"
    }
}

if ($brokenLinks.Count -eq 0) {
    Write-Host "PASS: All $verifiedLinks TOC links resolve to valid document headings!" -ForegroundColor Green
} else {
    Write-Host "FAIL: Found $($brokenLinks.Count) broken TOC links:" -ForegroundColor Red
    foreach ($bl in $brokenLinks) {
        Write-Host "  - $bl" -ForegroundColor Red
    }
}

# Coverage verification of key subjects from ORIGINAL_REQUEST.md
$requiredKeywords = @{
    'github/spec-kit' = 'Official GitHub Spec Kit repository';
    'specify-cli' = 'CLI utility and installation';
    'constitution' = 'Project Constitution and governance';
    'spec.md' = 'Feature specification contract';
    'plan.md' = 'Technical implementation plan';
    'tasks.md' = 'Task breakdown and ledger';
    'checklists' = 'Unit tests for English / requirements';
    'converge' = 'Convergence loop / gap detection';
    'clarify' = 'Ambiguity clarification scan';
    'Copilot' = 'GitHub Copilot integration';
    'Claude' = 'Claude / Claude Code integration';
    'Antigravity' = 'Gemini / Antigravity integration';
    'Cursor' = 'Cursor / Cursor Composer integration';
    'Reddit' = 'Reddit discussions & sentiment';
    'Hacker News' = 'Hacker News discussions';
    'Twitter' = 'X / Twitter discourse';
    'Vesely' = 'Tomas Vesely Go MCP server case study';
    'Delimarsky' = 'Den Delimarsky / launch article';
    'Fowler' = 'Martin Fowler & Birgitta Böckeler taxonomy';
    'Karpathy' = 'Andrej Karpathy vibe coding debate';
    'Willison' = 'Simon Willison AI agent analysis';
    'Swyx' = 'Shawn Wang / Latent Space analysis';
    '18,600' = '~18.6k token context tax';
    'Issue #1088' = 'GitHub Issue #1088 two-way sync disconnect';
    'Waterfall' = 'Waterfall / ceremony criticisms';
    'Brownfield' = 'Brownfield monolith playbook';
    'Greenfield' = 'Greenfield vs brownfield comparison';
    '<50 LOC' = '<50 LOC exemption rule';
    'What vs. How' = 'What vs How firewall';
    'Maker-Checker' = 'Maker-Checker protocol';
}

Write-Host "`nVerifying Specific Subject and Requirement Coverage..."
$missingKeywords = @()
foreach ($kw in $requiredKeywords.Keys) {
    if ($content -match [regex]::Escape($kw)) {
        Write-Host "  [OK] $($requiredKeywords[$kw]) ($kw)" -ForegroundColor Gray
    } else {
        $missingKeywords += "$($requiredKeywords[$kw]) ($kw)"
        Write-Host "  [MISSING] $($requiredKeywords[$kw]) ($kw)" -ForegroundColor Red
    }
}

if ($missingKeywords.Count -eq 0) {
    Write-Host "PASS: All $($requiredKeywords.Count) required technical domains, figures, and topics are verified in deliverable." -ForegroundColor Green
} else {
    Write-Host "FAIL: Missing required content: $($missingKeywords -join ', ')" -ForegroundColor Red
}

Write-Host "`n=== AUDIT VERIFICATION SCRIPT COMPLETE ===" -ForegroundColor Cyan
