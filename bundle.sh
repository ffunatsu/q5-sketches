#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

name="${1:-main}"
names=(minimal 3d-basic 3d-direct 3d-camera 3d-lights)

bundle() {
  local entry="$1.js"
  local output="bundle-$1.js"
  npx esbuild "$entry" --bundle --outfile="$output" --format=esm --platform=browser
}

if [[ "$name" == "all" ]]; then
  for item in "${names[@]}"; do
    bundle "$item"
  done
else
  bundle "$name"
fi