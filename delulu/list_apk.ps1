Add-Type -AssemblyName System.IO.Compression.FileSystem

$apkPath = "$PSScriptRoot\com.dirtcube.deluluapp.apk"
$outDir = "$PSScriptRoot\extracted"

if (Test-Path $outDir) { Remove-Item -Recurse -Force $outDir }
New-Item -ItemType Directory -Path $outDir -Force | Out-Null

$zip = [System.IO.Compression.ZipFile]::OpenRead($apkPath)
foreach ($entry in $zip.Entries) {
    Write-Host "$($entry.FullName) | $($entry.Length) | $($entry.CompressedLength)"
}
$zip.Dispose()
