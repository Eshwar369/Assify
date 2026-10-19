Add-Type -AssemblyName System.IO.Compression.FileSystem

$xapkPath = "$PSScriptRoot\com.dirtcube.deluluapp_2.1.1.xapk"
$outDir = "$PSScriptRoot"

$zip = [System.IO.Compression.ZipFile]::OpenRead($xapkPath)

# Extract main APK and manifest.json
foreach ($entry in $zip.Entries) {
    if ($entry.FullName -eq "com.dirtcube.deluluapp.apk" -or $entry.FullName -eq "manifest.json") {
        $destPath = Join-Path $outDir $entry.FullName
        [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $destPath, $true)
        Write-Host "Extracted: $($entry.FullName)"
    }
}

$zip.Dispose()
Write-Host "Done!"
