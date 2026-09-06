#!/usr/bin/env bash
# Push every KEY=value line of an env file into the linked Vercel project
# (production + preview). Usage:  bash scripts/push-env-to-vercel.sh secrets/vercel.env
# Requires: `npx vercel login` done and the project linked (`npx vercel link`).
set -euo pipefail
FILE="${1:-secrets/vercel.env}"
[ -f "$FILE" ] || { echo "env file not found: $FILE"; exit 1; }
while IFS= read -r line || [ -n "$line" ]; do
  case "$line" in ''|\#*) continue;; esac
  key="${line%%=*}"; value="${line#*=}"
  for env in production preview; do
    if printf "%s" "$value" | npx vercel env add "$key" "$env" --force >/dev/null 2>&1; then
      echo "  $key -> $env"
    else
      echo "  $key -> $env FAILED"
    fi
  done
done < "$FILE"
echo "Done. Redeploy with: npx vercel --prod"
