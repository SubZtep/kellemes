#!/usr/bin/env bash
set -e

CLI_NAME="kellemes"

# Detect OS
OS="$(uname | tr '[:upper:]' '[:lower:]')"

# Detect Architecture
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64)
    ARCH_TAG="x64"
    ;;
  arm64|aarch64)
    ARCH_TAG="arm64"
    ;;
  *)
    echo "Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

# Determine installed file
if [[ "$OS" == "linux" || "$OS" == "darwin" ]]; then
    INSTALL_PATH="/usr/local/bin/$CLI_NAME"
    if [ -f "$INSTALL_PATH" ]; then
        sudo rm -f "$INSTALL_PATH"
        echo "$CLI_NAME removed from $INSTALL_PATH"
    else
        echo "$CLI_NAME not found at $INSTALL_PATH"
    fi
else
    # Windows
    powershell.exe -Command "
    \$InstallPath = Join-Path \$env:USERPROFILE 'bin\$CLI_NAME.exe'
    if (Test-Path \$InstallPath) {
        Remove-Item -Force \$InstallPath
        Write-Host '$CLI_NAME removed from \$InstallPath'
    } else {
        Write-Host '$CLI_NAME not found at \$InstallPath'
    }
    "
fi
