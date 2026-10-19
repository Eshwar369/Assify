$bundle = "c:\Users\DELL\gen ai\Assify\delulu\extracted\assets\index.android.bundle"
$content = [System.IO.File]::ReadAllText($bundle)

Write-Host "=== Act Component & Field Definitions ==="
# Look for Act components and their props/state
$actRegex = [regex]::Matches($content, 'function\s+Act\d+[A-Za-z0-9_]*\s*\([^)]*\)')
foreach ($m in $actRegex) {
    Write-Host $m.Value
}

Write-Host "`n=== Props / Keys in Acts ==="
$propsRegex = [regex]::Matches($content, 'Act\d+[A-Za-z0-9_]+')
$uniqueActs = @{}
foreach ($m in $propsRegex) {
    $uniqueActs[$m.Value] = $true
}
$uniqueActs.Keys | Sort-Object | ForEach-Object { Write-Host $_ }

Write-Host "`n=== Ghost Writer Modes & Keys ==="
$gwMatches = [regex]::Matches($content, 'ghostWriter[A-Za-z0-9_]+|ghost_writer[A-Za-z0-9_]+')
$uniqueGw = @{}
foreach ($m in $gwMatches) { $uniqueGw[$m.Value] = $true }
$uniqueGw.Keys | Sort-Object | ForEach-Object { Write-Host $_ }

Write-Host "`n=== Doctor Delulu Context & Endpoints ==="
$ddMatches = [regex]::Matches($content, 'doctorDelulu[A-Za-z0-9_]+|drDelulu[A-Za-z0-9_]+|chat/[a-zA-Z0-9_\-]+')
$uniqueDd = @{}
foreach ($m in $ddMatches) { $uniqueDd[$m.Value] = $true }
$uniqueDd.Keys | Sort-Object | ForEach-Object { Write-Host $_ }
