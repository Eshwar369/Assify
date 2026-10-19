$bundle = "c:\Users\DELL\gen ai\Assify\delulu\extracted\assets\index.android.bundle"

$patterns = @(
    "\/api\/",
    "engage\/api",
    "delulucheck\.com",
    "RevenueCat",
    "revenuecat",
    "paywall",
    "subscription",
    "premium",
    "tokenBunny",
    "Act\d+",
    "expo-router",
    "useRouter",
    "createStackNavigator",
    "Tab\.Screen",
    "Stack\.Screen",
    "NavigationContainer",
    "BiometricAuthentication",
    "biometric",
    "pinCode",
    "appLock",
    "shareExtension",
    "DeluluKeyboard",
    "keyboard.*extension",
    "LiveActivity",
    "widget",
    "sentry",
    "analytics",
    "mixpanel",
    "amplitude",
    "firebase",
    "fcm",
    "push.*notification",
    "deep.*link",
    "universal.*link",
    "zustand",
    "redux",
    "mmkv",
    "AsyncStorage",
    "SecureStore",
    "expo-secure-store",
    "expo-image-picker",
    "expo-camera",
    "expo-media-library",
    "react-native-vision-camera",
    "mlkit",
    "barcode",
    "textRecognition",
    "Doctor.?Delulu",
    "Ghostwriter",
    "Rizz",
    "decode.*message",
    "power.*play",
    "red.*flag",
    "delulu.*meter",
    "relationship.*coach",
    "chat.*analysis",
    "report.*card"
)

foreach ($pat in $patterns) {
    Write-Host "=== $pat ==="
    $results = Select-String -Path $bundle -Pattern $pat -CaseSensitive:$false -AllMatches
    $matchCount = 0
    if ($results) {
        foreach ($r in $results) { $matchCount += $r.Matches.Count }
        Write-Host "  Total matches: $matchCount"
        # Show first 3 snippets
        $shown = 0
        foreach ($r in $results) {
            foreach ($m in $r.Matches) {
                if ($shown -ge 3) { break }
                $start = [Math]::Max(0, $m.Index - 60)
                $len = [Math]::Min(250, $r.Line.Length - $start)
                $snippet = $r.Line.Substring($start, $len)
                Write-Host "  [$shown] ...$snippet..."
                Write-Host ""
                $shown++
            }
            if ($shown -ge 3) { break }
        }
    } else {
        Write-Host "  (0 matches)"
    }
    Write-Host ""
}
