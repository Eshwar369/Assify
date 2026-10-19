$bundle = "c:\Users\DELL\gen ai\Assify\delulu\extracted\assets\index.android.bundle"
$content = [System.IO.File]::ReadAllText($bundle)

Write-Host "=== ALL REPORT SECTIONS (Act#) ==="
$actMatches = [regex]::Matches($content, '(Act\d+)[A-Z_]')
$actNumbers = @{}
foreach ($m in $actMatches) {
    $n = $m.Groups[1].Value
    if (-not $actNumbers.ContainsKey($n)) { $actNumbers[$n] = 0 }
    $actNumbers[$n]++
}
foreach ($r in ($actNumbers.GetEnumerator() | Sort-Object Name)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}

Write-Host ""
Write-Host "=== Act SECTION NAMES WITH CONTEXT ==="
# Find unique section names like Act5PowerPlays, Act2DeluluMeter, etc.
$sectionNames = [regex]::Matches($content, 'Act(\d+)([A-Z][a-zA-Z]+)')
$sections = @{}
foreach ($m in $sectionNames) {
    $s = "Act$($m.Groups[1].Value) $($m.Groups[2].Value)"
    if ($s.Length -lt 50) {
        if (-not $sections.ContainsKey($s)) { $sections[$s] = 0 }
        $sections[$s]++
    }
}
foreach ($r in ($sections.GetEnumerator() | Sort-Object Name | Select-Object -First 80)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}

Write-Host ""
Write-Host "=== FEATURE/MODULE KEYWORDS ==="
$keywords = @(
    "uploadChat",
    "uploadFile",
    "processChat",
    "analyzeChat", 
    "generateReport",
    "fetchReport",
    "streamChat",
    "sendMessage",
    "createConversation",
    "deleteConversation",
    "getMessages",
    "paywallShown",
    "RevenueCat",
    "Purchases",
    "purchase",
    "subscription",
    "entitlement",
    "provisioning",
    "keyboard",
    "shareExtension",
    "liveActivity",
    "quickAction",
    "notification",
    "deeplink",
    "mmkv",
    "SecureStore",
    "Sentry",
    "Mixpanel",
    "Google.*Sign"
)

foreach ($kw in $keywords) {
    $matches = [regex]::Matches($content, $kw)
    Write-Host "  $kw : $($matches.Count) matches"
}

Write-Host ""
Write-Host "=== BILLING & MONETIZATION ==="
$billingPatterns = [regex]::Matches($content, '(?:token|credit|unlock|paywall|premium|pro|subscription|billing|price|purchase|payment)[a-zA-Z_]*')
$billing = @{}
foreach ($m in $billingPatterns) {
    $b = $m.Value
    if ($b.Length -lt 40 -and $b.Length -gt 5) {
        if (-not $billing.ContainsKey($b)) { $billing[$b] = 0 }
        $billing[$b]++
    }
}
foreach ($r in ($billing.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 50)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}
