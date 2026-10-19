$bundle = "c:\Users\DELL\gen ai\Assify\delulu\extracted\assets\index.android.bundle"

# Search for key patterns in the JS bundle
$patterns = @(
    "api/analyze",
    "api/report",
    "api/ghostwriter",
    "api/check",
    "supabase",
    "/api/",
    "fetchReport",
    "analyzeChat",
    "uploadScreenshot",
    "ghostwrite",
    "deluluCheck",
    "deluluMeter",
    "red.?flag",
    "tokenBunny",
    "shareExtension",
    "expo-router",
    "createClient",
    "openai",
    "gpt",
    "claude",
    "anthropic",
    "gemini",
    "whisper",
    "speech.*text",
    "voice.*note",
    "ocr",
    "screenshot.*analy",
    "chat.*import",
    "whatsapp.*export",
    "instagram.*export"
)

foreach ($pat in $patterns) {
    Write-Host "=== PATTERN: $pat ==="
    $results = Select-String -Path $bundle -Pattern $pat -CaseSensitive:$false -AllMatches
    if ($results) {
        foreach ($r in $results) {
            foreach ($m in $r.Matches) {
                $start = [Math]::Max(0, $m.Index - 100)
                $len = [Math]::Min(300, $r.Line.Length - $start)
                $snippet = $r.Line.Substring($start, $len)
                Write-Host "  Found at offset $($m.Index): ...$snippet..."
                Write-Host ""
            }
        }
    } else {
        Write-Host "  (no matches)"
    }
    Write-Host ""
}
