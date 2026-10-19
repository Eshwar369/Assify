$bundle = "c:\Users\DELL\gen ai\Assify\delulu\extracted\assets\index.android.bundle"
$content = [System.IO.File]::ReadAllText($bundle)

Write-Host "=== EXPO ROUTER PATHS & SCREENS ==="
$routeMatches = [regex]::Matches($content, '["\x27](\/(?:\(tabs\)|\(auth\)|\(modals\)|report|results|chat|keyboard|settings)[a-zA-Z0-9_\-\/\[\]]*)["\x27]')
$routes = @{}
foreach ($m in $routeMatches) {
    $r = $m.Groups[1].Value
    if ($r.Length -lt 60) {
        $routes[$r] = $true
    }
}
$routes.Keys | Sort-Object | ForEach-Object { Write-Host "Route: $_" }

Write-Host "`n=== TAB BAR / NAVIGATION ICONS & LABELS ==="
$tabMatches = [regex]::Matches($content, 'tabBarLabel:\s*["\x27]([^"\x27]+)["\x27]')
foreach ($m in $tabMatches) {
    Write-Host "Tab: $($m.Groups[1].Value)"
}
