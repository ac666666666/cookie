$zipName = "ac-storage-manager-v1.0.0.zip"
$tempDir = "temp_build"

if (Test-Path $zipName) { Remove-Item $zipName }
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }

New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy files
Copy-Item "manifest.json" $tempDir
Copy-Item "*.html" $tempDir
Copy-Item "*.js" $tempDir
Copy-Item "*.css" $tempDir
Copy-Item "icons" $tempDir -Recurse

# Zip
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipName

# Cleanup
Remove-Item $tempDir -Recurse -Force

Write-Host "Build complete: $zipName"
