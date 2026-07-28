#!/usr/bin/env bash
#
# Build an installable WordPress plugin zip containing only the
# essential runtime files (main file, includes, views, vendor,
# assets, languages, readme).
#
# Usage: bin/build-zip.sh [--skip-build]
#   --skip-build  Skip composer/pnpm build, zip current build artifacts.
#
# Output: build/<slug>-<version>.zip

set -euo pipefail

PLUGIN_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SLUG="$(basename "$PLUGIN_DIR")"
BUILD_DIR="$PLUGIN_DIR/build/$SLUG"

cd "$PLUGIN_DIR"

MAIN_FILE="$(grep -l 'Plugin Name:' ./*.php | head -1)"
if [[ -z "$MAIN_FILE" ]]; then
    echo "Error: could not find main plugin file (no *.php with a Plugin Name header)" >&2
    exit 1
fi

VERSION="$(grep -oPm1 '^\s*\*?\s*Version:\s*\K[0-9.]+' "$MAIN_FILE")"
ZIP_FILE="$PLUGIN_DIR/build/$SLUG-$VERSION.zip"

if [[ "${1:-}" != "--skip-build" ]]; then
    if [[ -f composer.json ]]; then
        composer install --no-dev --optimize-autoloader
    fi
    if [[ -f package.json ]]; then
        pnpm install
        pnpm build
    fi
fi

rm -rf "$PLUGIN_DIR/build"
mkdir -p "$BUILD_DIR"

for item in vendor includes views assets languages readme.txt "$MAIN_FILE"; do
    if [[ -e "$item" ]]; then
        cp -r "$item" "$BUILD_DIR/"
    fi
done

cd "$PLUGIN_DIR/build"
zip -rq "$ZIP_FILE" "$SLUG"

echo "Created: $ZIP_FILE"
unzip -l "$ZIP_FILE" | tail -1
