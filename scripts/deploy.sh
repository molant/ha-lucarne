#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$ROOT_DIR/.env"
  set +a
fi

: "${HA_SSH_HOST:?Set HA_SSH_HOST in .env (see .env.example)}"
: "${HA_REMOTE_PATH:?Set HA_REMOTE_PATH in .env (see .env.example)}"

cd "$ROOT_DIR"

echo "==> Building"
npm run build

BUNDLE="dist/ha-lucarne.js"
MAP="dist/ha-lucarne.js.map"

if [ ! -f "$BUNDLE" ]; then
  echo "Build output not found: $BUNDLE" >&2
  exit 1
fi

echo "==> Deploying to ${HA_SSH_HOST}:${HA_REMOTE_PATH}"
scp "$BUNDLE" "$MAP" "${HA_SSH_HOST}:${HA_REMOTE_PATH}"

if command -v md5 >/dev/null 2>&1; then
  HASH=$(md5 -q "$BUNDLE")
else
  HASH=$(md5sum "$BUNDLE" | cut -d' ' -f1)
fi
SHORT=${HASH:0:8}

echo ""
echo "==> Done. New bundle hash: $SHORT"
echo ""
echo "To bust the browser cache, bump the Lovelace resource URL to:"
echo "  /local/lucarne/ha-lucarne.js?v=$SHORT"

if [ -n "${HA_DASHBOARD_RESOURCE_ID:-}" ]; then
  echo ""
  echo "Ask Claude (with HA MCP) to run:"
  echo "  ha_config_set_dashboard_resource("
  echo "    resource_id=\"$HA_DASHBOARD_RESOURCE_ID\","
  echo "    url=\"/local/lucarne/ha-lucarne.js?v=$SHORT\","
  echo "    resource_type=\"module\""
  echo "  )"
fi
