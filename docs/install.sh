#!/usr/bin/env bash
set -e

REPO="SubZtep/kellemes"
CLI_NAME="kellemes"
CLI_VERSION="${CLI_VERSION:-latest}"

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

# Determine file to download
case "$OS" in
  linux)
    FILE="kellemes-cli-linux-$ARCH_TAG"
    ;;
  darwin)
    FILE="kellemes-cli-macos-$ARCH_TAG"
    ;;
  msys*|mingw*|cygwin*|windowsnt)
    FILE="kellemes-cli-windows-$ARCH_TAG.exe"
    ;;
  *)
    echo "Unsupported OS: $OS"
    exit 1
    ;;
esac

# Get release tag
if [ "$CLI_VERSION" = "latest" ]; then
    TAG=$(curl -s "https://api.github.com/repos/$REPO/releases/latest" \
        | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
else
    TAG="$CLI_VERSION"
fi

URL="https://github.com/$REPO/releases/download/$TAG/$FILE"
TMP_PATH="/tmp/$FILE"

echo "Downloading $URL ..."
curl -fsSL -o "$TMP_PATH" "$URL"

# Install
if [[ "$OS" == "linux" || "$OS" == "darwin" ]]; then
    chmod +x "$TMP_PATH"
    INSTALL_PATH="/usr/local/bin/$CLI_NAME"
    echo "Installing to $INSTALL_PATH ..."
    sudo mv "$TMP_PATH" "$INSTALL_PATH"
    echo "Done! Run '$CLI_NAME --help'"
else
    # Windows
    powershell.exe -Command "
    \$InstallDir = Join-Path \$env:USERPROFILE 'bin'
    if (!(Test-Path \$InstallDir)) { New-Item -ItemType Directory -Path \$InstallDir }
    Move-Item -Force '$TMP_PATH' (Join-Path \$InstallDir '$CLI_NAME.exe')
    if (-not (\$env:PATH -split ';' | Where-Object { \$_ -eq \$InstallDir })) {
        [Environment]::SetEnvironmentVariable('PATH', \"\$InstallDir;\"\$env:PATH, 'User')
        Write-Host 'Added \$InstallDir to PATH. Restart terminal if needed.'
    }
    "
    echo "Done! Run '$CLI_NAME.exe --help'"
fi
