#!/bin/bash

# Creates a GitHub release for ha-lucarne with automatic semantic versioning
# based on conventional commits since the last bump commit.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_error()   { echo -e "${RED}Error: $1${NC}" >&2; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_info()    { echo -e "${YELLOW}ℹ $1${NC}"; }

# ============================================================================
# 1. VALIDATION
# ============================================================================

log_info "Running validation checks..."

if [ -n "$(git status --porcelain)" ]; then
    log_error "Working tree is dirty. Commit or stash changes before creating a release."
    git status --short
    exit 1
fi

if ! command -v gh &> /dev/null; then
    log_error "GitHub CLI (gh) is not installed. Install: brew install gh"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    log_error "Not authenticated with GitHub CLI. Run: gh auth login"
    exit 1
fi

if [ ! -f "dist/ha-lucarne.js" ]; then
    log_error "dist/ha-lucarne.js not found. Run 'npm run build' first."
    exit 1
fi

log_success "All validation checks passed"

# ============================================================================
# 2. DETERMINE VERSION BUMP
# ============================================================================

log_info "Calculating version bump..."

CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "0.1.0")

# Prefer the latest bump: commit as the lower bound; fall back to the latest
# vX.Y.Z tag (covers the v0.1.0 "Release v0.1.0" commit that isn't bump:-prefixed).
LAST_BUMP_COMMIT=$(git log --grep="^bump:" --format="%H" -n 1 2>/dev/null || echo "")
if [ -z "$LAST_BUMP_COMMIT" ]; then
    LAST_TAG_COMMIT=$(git rev-list --tags --max-count=1 2>/dev/null || echo "")
    if [ -n "$LAST_TAG_COMMIT" ]; then
        LAST_BUMP_COMMIT="$LAST_TAG_COMMIT"
    fi
fi
if [ -z "$LAST_BUMP_COMMIT" ]; then
    COMMIT_RANGE="HEAD"
else
    COMMIT_RANGE="${LAST_BUMP_COMMIT}..HEAD"
fi

COMMITS=$(git log "$COMMIT_RANGE" --format="%s" --no-merges 2>/dev/null || echo "")
FILTERED_COMMITS=$(echo "$COMMITS" | grep -vE "^(bump|misc)(\([^)]*\))?:" || echo "")

if [ -z "$FILTERED_COMMITS" ]; then
    log_info "Nothing to release (no commits since last version)"
    exit 0
fi

BUMP_TYPE="patch"
if echo "$FILTERED_COMMITS" | grep -qE "^(breaking|BREAKING CHANGE)(\([^)]*\))?:"; then
    BUMP_TYPE="major"
elif echo "$FILTERED_COMMITS" | grep -qE "^(feat|feature)(\([^)]*\))?:"; then
    BUMP_TYPE="minor"
fi

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
case $BUMP_TYPE in
    major) NEW_VERSION="$((MAJOR + 1)).0.0" ;;
    minor) NEW_VERSION="${MAJOR}.$((MINOR + 1)).0" ;;
    patch) NEW_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))" ;;
esac

log_success "Version: $CURRENT_VERSION → $NEW_VERSION (bump type: $BUMP_TYPE)"

# ============================================================================
# 3. GENERATE CHANGELOG ENTRY
# ============================================================================

log_info "Generating changelog entry..."

CHANGELOG_DATE=$(date +"%Y-%m-%d")
CHANGELOG_ENTRY="## v${NEW_VERSION} — ${CHANGELOG_DATE}"

BREAKING=$(echo "$FILTERED_COMMITS" | grep -E "^(breaking|BREAKING CHANGE)(\([^)]*\))?:" || echo "")
if [ -n "$BREAKING" ]; then
    CHANGELOG_ENTRY="${CHANGELOG_ENTRY}

**Breaking Changes:**"
    while IFS= read -r c; do
        CHANGELOG_ENTRY="${CHANGELOG_ENTRY}
- $(echo "$c" | sed -E 's/^(breaking|BREAKING CHANGE)(\([^)]*\))?:\s*//')"
    done <<< "$BREAKING"
fi

FEATURES=$(echo "$FILTERED_COMMITS" | grep -E "^(feat|feature)(\([^)]*\))?:" || echo "")
if [ -n "$FEATURES" ]; then
    CHANGELOG_ENTRY="${CHANGELOG_ENTRY}

**Features:**"
    while IFS= read -r c; do
        CHANGELOG_ENTRY="${CHANGELOG_ENTRY}
- $(echo "$c" | sed -E 's/^(feat|feature)(\([^)]*\))?:\s*//')"
    done <<< "$FEATURES"
fi

FIXES=$(echo "$FILTERED_COMMITS" | grep -E "^(fix|bugfix)(\([^)]*\))?:" || echo "")
if [ -n "$FIXES" ]; then
    CHANGELOG_ENTRY="${CHANGELOG_ENTRY}

**Fixes:**"
    while IFS= read -r c; do
        CHANGELOG_ENTRY="${CHANGELOG_ENTRY}
- $(echo "$c" | sed -E 's/^(fix|bugfix)(\([^)]*\))?:\s*//')"
    done <<< "$FIXES"
fi

# Abort if no release-worthy content was generated (docs/chore/refactor-only commits
# should not produce a silent empty release).
if [ -z "$BREAKING" ] && [ -z "$FEATURES" ] && [ -z "$FIXES" ]; then
    log_info "No breaking changes, features, or fixes found — nothing release-worthy. Skipping."
    exit 0
fi

# ============================================================================
# 4. UPDATE FILES
# ============================================================================

log_info "Updating files..."

npm version --no-git-tag-version "$NEW_VERSION" --allow-same-version

# Insert the new entry below the "# Changelog" H1, preserving the header.
CHANGELOG_TEMP=$(mktemp)
# Emit the H1 header line (first line of CHANGELOG.md) and its trailing blank line.
head -n 1 CHANGELOG.md >> "$CHANGELOG_TEMP"
echo "" >> "$CHANGELOG_TEMP"
# Emit the new entry.
echo "$CHANGELOG_ENTRY" >> "$CHANGELOG_TEMP"
echo "" >> "$CHANGELOG_TEMP"
# Emit the rest of the existing changelog (skip the H1 line already written above).
tail -n +2 CHANGELOG.md >> "$CHANGELOG_TEMP"
mv "$CHANGELOG_TEMP" CHANGELOG.md

log_success "Files updated"

# ============================================================================
# 5. BUILD
# ============================================================================

log_info "Building dist/ha-lucarne.js..."
npm run build

if [ ! -f "dist/ha-lucarne.js" ]; then
    log_error "Build failed — dist/ha-lucarne.js not created"
    exit 1
fi

BUNDLE_SIZE=$(wc -c < "dist/ha-lucarne.js")
BUNDLE_SIZE_KB=$((BUNDLE_SIZE / 1024))
if [ "$BUNDLE_SIZE_KB" -gt 300 ]; then
    log_error "Bundle size ${BUNDLE_SIZE_KB} KB exceeds 300 KB limit"
    exit 1
fi
log_success "Build complete (${BUNDLE_SIZE_KB} KB)"

# ============================================================================
# 6. COMMIT AND PUSH
# ============================================================================

log_info "Committing changes..."

git add package.json package-lock.json CHANGELOG.md dist/ha-lucarne.js
git commit -m "bump: v${NEW_VERSION}"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push origin "$BRANCH"

log_success "Changes committed and pushed"

# ============================================================================
# 7. CREATE GITHUB RELEASE
# ============================================================================

log_info "Creating GitHub release..."

# Create and push an annotated tag pinned to the bump commit before gh release
# create runs, so the release tag targets the correct commit rather than the
# default-branch HEAD (which gh would use if no matching tag exists yet).
git tag -a "v${NEW_VERSION}" -m "v${NEW_VERSION}"
git push origin "v${NEW_VERSION}"

gh release create "v${NEW_VERSION}" \
    --verify-tag \
    --title "v${NEW_VERSION}" \
    --notes "$CHANGELOG_ENTRY" \
    dist/ha-lucarne.js

log_success "Release created!"
REPO_URL=$(gh repo view --json url -q '.url')
echo ""
echo "Release: ${REPO_URL}/releases/tag/v${NEW_VERSION}"
