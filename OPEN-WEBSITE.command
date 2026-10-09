#!/bin/sh
cd "$(dirname "$0")" || exit 1
if ! command -v python3 >/dev/null 2>&1; then
  echo "Python 3 is needed for the local preview. Install Python 3, then run this file again."
  read -r _
  exit 1
fi
python3 local-preview.py
