#!/usr/bin/env bash
# Usage: scripts/add-photos.sh <folder-of-photos>
# Makes a 1600px full image and a 700px square thumbnail for each photo,
# strips metadata (if exiftool is installed) and prints shirts.json stubs.
set -euo pipefail
src="${1:?Usage: $0 <folder-of-photos>}"
root="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$root/images/full" "$root/images/thumbs"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

shopt -s nullglob nocaseglob
for f in "$src"/*.{png,jpg,jpeg,heic}; do
  name="$(basename "${f%.*}")"
  name="${name#Vintage Tees - }"; name="${name% Mockup}"
  slug="$(echo "$name" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-|-$//g')"

  sips -s format jpeg -s formatOptions 80 -Z 1600 "$f" --out "$root/images/full/$slug.jpg" >/dev/null

  # Square centre crop at 70% of the short edge so the print fills the thumbnail
  w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$f" | awk '/pixelHeight/{print $2}')
  side=$(( (w < h ? w : h) * 70 / 100 ))
  sips -c "$side" "$side" "$f" --out "$tmp/crop.png" >/dev/null
  sips -s format jpeg -s formatOptions 75 -Z 700 "$tmp/crop.png" --out "$root/images/thumbs/$slug.jpg" >/dev/null

  if command -v exiftool >/dev/null; then
    exiftool -q -all= -overwrite_original "$root/images/full/$slug.jpg" "$root/images/thumbs/$slug.jpg"
  fi

  echo "    { \"name\": \"$name\", \"caption\": \"\", \"category\": \"\", \"image\": \"$slug.jpg\", \"new\": true },"
done

command -v exiftool >/dev/null || echo "Note: exiftool not installed (brew install exiftool); metadata was not stripped." >&2
