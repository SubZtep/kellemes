#!/usr/bin/env bash
set -e

REPO="SubZtep/kellemes"
ASSET="kellemes"

echo "🟢 Installing Kellemes CLI…"

LATEST=$(curl -s https://api.github.com/repos/$REPO/releases/latest \
  | grep tag_name \
  | sed -E 's/.*"tag_name": "cli-v([^"]+)".*/\1/')

echo "Latest version: $LATEST"

OS=$(uname | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$OS" in
  linux)
    if [ "$ARCH" = "x86_64" ]; then FILE="kellemes-linux-x64"; fi
    if [ "$ARCH" = "aarch64" ]; then FILE="kellemes-linux-arm64"; fi
    ;;
  darwin)
    if [ "$ARCH" = "x86_64" ]; then FILE="kellemes-macos-x64"; fi
    if [ "$ARCH" = "arm64" ]; then FILE="kellemes-macos-arm64"; fi
    ;;
  *)
    echo "Unsupported OS: $OS"
    exit 1
    ;;
esac

URL="https://github.com/$REPO/releases/download/cli-v$LATEST/$FILE"
DEST="/usr/local/bin/kellemes"

echo "Downloading $FILE…"
curl -L "$URL" -o kellemes
chmod +x kellemes

echo "Moving to $DEST (sudo may be required)…"
sudo mv kellemes "$DEST"

echo "🎉 Installed!"
echo "Run: kellemes --help"
