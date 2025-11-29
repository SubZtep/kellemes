$repo = "SubZtep/kellemes"

Write-Host "Installing Kellemes CLI..."

$release = Invoke-RestMethod "https://api.github.com/repos/$repo/releases/latest"
$version = $release.tag_name

$asset = $release.assets | Where-Object { $_.name -eq "kellemes-win-x64.exe" }

$path = "$env:LOCALAPPDATA\Programs\kellemes"
New-Item -ItemType Directory -Force -Path $path | Out-Null

$exePath = Join-Path $path "kellemes.exe"

Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $exePath

Write-Host "Installed to: $exePath"

# Add to PATH
$envPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($envPath -notlike "*$path*") {
    [Environment]::SetEnvironmentVariable("Path", "$envPath;$path", "User")
    Write-Host "Added to PATH."
}

Write-Host "Done! Run: kellemes --help"
