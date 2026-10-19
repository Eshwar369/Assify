$bundle = "c:\Users\DELL\gen ai\Assify\delulu\extracted\assets\index.android.bundle"
$content = [System.IO.File]::ReadAllText($bundle)

Write-Host "=== ALL /api/ ROUTES ==="
$apiMatches = [regex]::Matches($content, '["\x27](/api/[a-zA-Z0-9/_\-\.]+)["\x27]')
$routes = @{}
foreach ($m in $apiMatches) {
    $route = $m.Groups[1].Value
    if (-not $routes.ContainsKey($route)) {
        $routes[$route] = 0
    }
    $routes[$route]++
}
foreach ($r in ($routes.GetEnumerator() | Sort-Object Name)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}

Write-Host ""
Write-Host "=== ALL engage/api/ ROUTES ==="
$engageMatches = [regex]::Matches($content, '(engage/api/[a-zA-Z0-9/_\-\.?=&]+)')
$engageRoutes = @{}
foreach ($m in $engageMatches) {
    $route = $m.Groups[1].Value
    if (-not $engageRoutes.ContainsKey($route)) {
        $engageRoutes[$route] = 0
    }
    $engageRoutes[$route]++
}
foreach ($r in ($engageRoutes.GetEnumerator() | Sort-Object Name)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}

Write-Host ""
Write-Host "=== URL ENDPOINTS (delulucheck.com) ==="
$urlMatches = [regex]::Matches($content, '(https?://[a-zA-Z0-9\.\-]+delulucheck\.com[a-zA-Z0-9/\-_\.?=&]*)')
$urls = @{}
foreach ($m in $urlMatches) {
    $url = $m.Groups[1].Value
    if (-not $urls.ContainsKey($url)) {
        $urls[$url] = 0
    }
    $urls[$url]++
}
foreach ($r in ($urls.GetEnumerator() | Sort-Object Name)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}

Write-Host ""
Write-Host "=== SCREEN NAMES (from route/screen patterns) ==="
$screenMatches = [regex]::Matches($content, 'name:\s*["\x27]([A-Z][a-zA-Z0-9]+(?:Screen|Tab|Modal|Page|View))["\x27]')
$screens = @{}
foreach ($m in $screenMatches) {
    $s = $m.Groups[1].Value
    if (-not $screens.ContainsKey($s)) { $screens[$s] = 0 }
    $screens[$s]++
}
foreach ($r in ($screens.GetEnumerator() | Sort-Object Name)) {
    Write-Host "  $($r.Name) (x$($r.Value))"
}
