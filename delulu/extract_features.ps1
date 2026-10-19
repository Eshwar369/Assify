$bundle = "c:\Users\DELL\gen ai\Assify\delulu\extracted\assets\index.android.bundle"
$content = [System.IO.File]::ReadAllText($bundle)

Write-Host "=== REPORT SECTIONS (Act patterns) ==="
$actMatches = [regex]::Matches($content, 'Act(\d+)[A-Z_][a-zA-Z0-9_]+')
$acts = @{}
foreach ($m in $actMatches) {
    $act = $m.Value
    if ($act.Length -lt 80) {
        if (-not $acts.ContainsKey($act)) { $acts[$act] = 0 }
        $acts[$act]++
    }
}
foreach ($r in ($acts.GetEnumerator() | Sort-Object Name | Select-Object -First 100)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}

Write-Host ""
Write-Host "=== TRACKING EVENTS (track* patterns) ==="
$trackMatches = [regex]::Matches($content, 'track[A-Z][a-zA-Z0-9]+')
$tracks = @{}
foreach ($m in $trackMatches) {
    $t = $m.Value
    if (-not $tracks.ContainsKey($t)) { $tracks[$t] = 0 }
    $tracks[$t]++
}
foreach ($r in ($tracks.GetEnumerator() | Sort-Object Name)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}

Write-Host ""
Write-Host "=== API PATHS ==="
$apiPaths = [regex]::Matches($content, '/api/[a-zA-Z0-9/\-_\.]+')
$apis = @{}
foreach ($m in $apiPaths) {
    $a = $m.Value
    if (-not $apis.ContainsKey($a)) { $apis[$a] = 0 }
    $apis[$a]++
}
foreach ($r in ($apis.GetEnumerator() | Sort-Object Name)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}

Write-Host ""
Write-Host "=== SUPABASE TABLE REFERENCES ==="
$supTables = [regex]::Matches($content, '\.from\(["\x27]([a-z_]+)["\x27]\)')
$tables = @{}
foreach ($m in $supTables) {
    $t = $m.Groups[1].Value
    if (-not $tables.ContainsKey($t)) { $tables[$t] = 0 }
    $tables[$t]++
}
foreach ($r in ($tables.GetEnumerator() | Sort-Object Name)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}

Write-Host ""
Write-Host "=== NAVIGATION / ROUTING PATHS ==="
$navPaths = [regex]::Matches($content, '(?:push|navigate|replace|href)\(["\x27](/[a-zA-Z0-9/\-_\(\)]+)["\x27]')
$navs = @{}
foreach ($m in $navPaths) {
    $n = $m.Groups[1].Value
    if (-not $navs.ContainsKey($n)) { $navs[$n] = 0 }
    $navs[$n]++
}
foreach ($r in ($navs.GetEnumerator() | Sort-Object Name)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}
