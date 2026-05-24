#!/usr/bin/env bash
# Deploy the dist/ bundle to a running Home Assistant instance over SSH/rsync.
# Config comes from environment variables, sourced from .env at the project
# root if present (see .env.example).
#
# Usage:
#   ./scripts/deploy.sh                  # build + rsync
#   ./scripts/deploy.sh --dry-run        # show what would change, no transfer
#   ./scripts/deploy.sh --skip-build     # rsync existing dist/ as-is
#   HA_SSH_HOST=ha.lan ./scripts/deploy.sh   # override per-invocation
#
# Required env vars (set in .env or your shell):
#   HA_SSH_HOST       SSH host or user@host (e.g. ha-vm or molant@ha-vm)
#   HA_REMOTE_PATH    Remote install path, must end in /www/lucarne
#                     (e.g. /homeassistant/www/lucarne)
#
# Optional:
#   HA_DASHBOARD_RESOURCE_ID   If set, prints an ha_config_set_dashboard_resource
#                              hint with the cache-busting hash after deploy.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ -f "$ROOT_DIR/.env" ]; then
  # Source .env, but don't overwrite vars already set in the environment, so
  # callers can override per-invocation: `HA_SSH_HOST=foo ./scripts/deploy.sh`.
  # The naive `set -a; . .env; set +a` pattern would clobber inline overrides,
  # which is dangerous combined with `rsync --delete` (could nuke the wrong host).
  while IFS='=' read -r key value || [ -n "$key" ]; do
    case "$key" in
      ''|\#*) continue ;;
    esac
    if [ -z "${!key:-}" ]; then
      # Strip surrounding quotes if present
      value="${value%\"}"; value="${value#\"}"
      value="${value%\'}"; value="${value#\'}"
      export "$key=$value"
    fi
  done < "$ROOT_DIR/.env"
fi

# Parse flags
DRY_RUN=0
SKIP_BUILD=0
for arg in "$@"; do
  case "$arg" in
    --dry-run)    DRY_RUN=1 ;;
    --skip-build) SKIP_BUILD=1 ;;
    -h|--help)
      awk 'NR==1{next} /^#/{sub(/^# ?/,""); print; next} {exit}' "$0"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown flag: $arg${NC}" >&2
      exit 2
      ;;
  esac
done

: "${HA_SSH_HOST:?Set HA_SSH_HOST in .env (see .env.example)}"
: "${HA_REMOTE_PATH:?Set HA_REMOTE_PATH in .env (see .env.example)}"

# Refuse to rsync --delete against a non-leaf path. Without this guard, a typo
# like `HA_REMOTE_PATH=/homeassistant/www` would wipe every other custom asset
# under /www on the remote. The bundle's install location is always
# .../www/lucarne; anything else is almost certainly a mistake.
case "$HA_REMOTE_PATH" in
  */www/lucarne|*/www/lucarne/) ;;
  *)
    echo -e "${RED}Refusing: HA_REMOTE_PATH must end in /www/lucarne${NC}" >&2
    echo "  got: $HA_REMOTE_PATH" >&2
    echo "  this guard exists because rsync --delete would otherwise nuke whatever lives at the wrong path." >&2
    exit 2
    ;;
esac

cd "$ROOT_DIR"

if [ "$SKIP_BUILD" = "1" ]; then
  echo -e "${YELLOW}==> Skipping build (--skip-build)${NC}"
else
  echo -e "${GREEN}==> Building${NC}"
  npm run build
fi

BUNDLE="dist/ha-lucarne.js"
if [ ! -f "$BUNDLE" ]; then
  echo -e "${RED}Build output not found: $BUNDLE${NC}" >&2
  exit 1
fi

echo -e "${GREEN}=========================================${NC}"
echo "Deploying dist/ to ${HA_SSH_HOST}:${HA_REMOTE_PATH}"
if [ "$DRY_RUN" = "1" ]; then
  echo -e "  ${YELLOW}(dry run — no files will be transferred)${NC}"
fi
echo -e "${GREEN}=========================================${NC}"

# rsync flags:
#   -a  archive (preserve perms, symlinks, etc.)
#   -v  verbose
#   -z  compress in transit
#   --delete                     prune files on remote that no longer exist locally
#   --exclude='.DS_Store'        macOS metadata files
RSYNC_ARGS=(-avz --delete --exclude='.DS_Store')
if [ "$DRY_RUN" = "1" ]; then
  RSYNC_ARGS+=(--dry-run)
fi

# Trailing slash on source is intentional: "rsync foo/ user@host:bar/" syncs
# the *contents* of foo into bar. Without it, foo itself would be created
# inside bar (one level too deep).
rsync "${RSYNC_ARGS[@]}" \
  dist/ \
  "${HA_SSH_HOST}:${HA_REMOTE_PATH}/"

if [ "$DRY_RUN" = "1" ]; then
  echo ""
  echo -e "${YELLOW}Dry run complete — no files transferred.${NC}"
  exit 0
fi

if command -v md5 >/dev/null 2>&1; then
  HASH=$(md5 -q "$BUNDLE")
else
  HASH=$(md5sum "$BUNDLE" | cut -d' ' -f1)
fi
SHORT=${HASH:0:8}

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Deploy complete! New bundle hash: $SHORT${NC}"
echo -e "${GREEN}=========================================${NC}"
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
