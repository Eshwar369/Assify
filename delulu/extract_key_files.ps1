Add-Type -AssemblyName System.IO.Compression.FileSystem

$apkPath = "$PSScriptRoot\com.dirtcube.deluluapp.apk"
$outDir = "$PSScriptRoot\extracted"

if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

$zip = [System.IO.Compression.ZipFile]::OpenRead($apkPath)

$targets = @(
    "assets/app.config",
    "assets/app.manifest",
    "AndroidManifest.xml",
    "res/xml/network_security_config.xml"
)

foreach ($entry in $zip.Entries) {
    $should_extract = $false
    foreach ($t in $targets) {
        if ($entry.FullName -eq $t) { $should_extract = $true; break }
    }
    # Also extract the JS bundle
    if ($entry.FullName -eq "assets/index.android.bundle") { $should_extract = $true }
    
    if ($should_extract) {
        $destPath = Join-Path $outDir ($entry.FullName -replace "/", "\")
        $destDir = Split-Path $destPath -Parent
        if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
        [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $destPath, $true)
        Write-Host "Extracted: $($entry.FullName) ($($entry.Length) bytes)"
    }
}

$zip.Dispose()
Write-Host "Done!"
