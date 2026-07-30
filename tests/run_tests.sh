#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# run_tests.sh — Wait for the Cloudflare Worker to ship the latest deploy,
# then run the smoke-test suite against the live URL.
#
# How the deploy-wait works:
#   Poll BASE_URL/version.json (a Worker route returning the live
#   CF_VERSION_METADATA.id — a unique ID Cloudflare assigns per deploy) and
#   wait for it to report the SAME value for REQUIRED_STABLE consecutive
#   polls, then proceed. This is a "settled" check, not a "changed from
#   before" check — it works whether this script started before the new
#   deploy landed (the id will be seen changing, then settle) or after (the
#   id will already be stable, so it proceeds almost immediately).
#
#   /version.json exists *specifically* for this — the more obvious
#   /api/version is not usable here despite the name: /api/* is a Cloudflare
#   Access destination gated at the edge, so it 302s to an Access login page
#   for unauthenticated requests like this script's.
#
#   Older versions of this script hashed src/index.html and compared it to
#   the live response body — that only detected deploys that changed
#   index.html's bytes, so a Worker-only change (headers, routing, config)
#   would report "deploy landed" immediately without actually waiting,
#   and tests would run against stale code. version.json isn't tied to any
#   one file, so it catches every deploy regardless of what changed.
#
# Usage:
#   ./tests/run_tests.sh
#   BASE_URL=https://anthonybest.com ./tests/run_tests.sh
#
# Options (env vars):
#   BASE_URL         Target URL  (default: https://anthonybest.com)
#   WAIT_TIMEOUT     Max seconds to wait for deploy to land       (default: 300)
#   POLL_INTERVAL    Seconds between deploy probes                (default: 5)
#   REQUIRED_STABLE  Consecutive matching polls before proceeding (default: 3)
#   VERSION_PATH     URL path serving the version signal    (default: /version.json)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
BASE_URL="${BASE_URL:-https://anthonybest.com}"
WAIT_TIMEOUT="${WAIT_TIMEOUT:-300}"
POLL_INTERVAL="${POLL_INTERVAL:-5}"
REQUIRED_STABLE="${REQUIRED_STABLE:-3}"
VERSION_PATH="${VERSION_PATH:-/version.json}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_FILE="${SCRIPT_DIR}/test_site.py"

# ── Colours ───────────────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
  GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'
  CYAN='\033[0;36m';  BOLD='\033[1m';      RESET='\033[0m'
else
  GREEN=''; YELLOW=''; RED=''; CYAN=''; BOLD=''; RESET=''
fi

hr() { printf '%s\n' "──────────────────────────────────────────────────────────────"; }

# ── Sanity checks ─────────────────────────────────────────────────────────────
if ! command -v python3 &>/dev/null; then
  echo -e "${RED}✗ python3 not found — please install Python 3${RESET}"
  exit 1
fi

if [[ ! -f "${TEST_FILE}" ]]; then
  echo -e "${RED}✗ Test file not found: ${TEST_FILE}${RESET}"
  exit 1
fi

# ── Header ────────────────────────────────────────────────────────────────────
echo ""
hr
echo -e "${BOLD}  anthonybest.com · Site Test Runner${RESET}"
echo -e "  Target: ${CYAN}${BASE_URL}${RESET}"
hr
echo ""

# ── Deploy-wait — poll version.json until it reports a settled deploy ───────
echo -e "${BOLD}[1/2] Waiting for deploy to land...${RESET}"
echo -e "      target:   ${CYAN}${BASE_URL}${VERSION_PATH}${RESET}"
echo -e "      timeout:  ${WAIT_TIMEOUT}s · probe interval: ${POLL_INTERVAL}s · stable polls required: ${REQUIRED_STABLE}"
echo ""

elapsed=0
attempt=0
last_version=""
stable_count=0

while true; do
  attempt=$((attempt + 1))
  printf "  Probe %-3d  " "${attempt}"

  current_version=$(curl -s --max-time 10 --location "${BASE_URL}${VERSION_PATH}" 2>/dev/null \
                     | python3 -c "import sys,json; print(json.load(sys.stdin).get('version',''))" 2>/dev/null || echo "")

  if [[ -z "${current_version}" ]]; then
    echo -e "${YELLOW}(no response)  — not ready yet (${elapsed}s elapsed)${RESET}"
    stable_count=0
  elif [[ "${current_version}" == "${last_version}" ]]; then
    stable_count=$((stable_count + 1))
    echo -e "${CYAN}${current_version}${RESET}  — stable ${stable_count}/${REQUIRED_STABLE} (${elapsed}s elapsed)"
    if [[ ${stable_count} -ge ${REQUIRED_STABLE} ]]; then
      echo -e "${GREEN}✓  — deploy settled (${elapsed}s elapsed)${RESET}"
      break
    fi
  else
    echo -e "${YELLOW}${current_version}${RESET}  — changed, resetting stability count (${elapsed}s elapsed)"
    last_version="${current_version}"
    stable_count=1
  fi

  if [[ ${elapsed} -ge ${WAIT_TIMEOUT} ]]; then
    echo ""
    echo -e "${RED}✗ Timed out after ${WAIT_TIMEOUT}s waiting for ${BASE_URL}${VERSION_PATH} to settle${RESET}"
    echo ""
    exit 1
  fi

  sleep "${POLL_INTERVAL}"
  elapsed=$((elapsed + POLL_INTERVAL))
done

echo ""

# ── Run tests ─────────────────────────────────────────────────────────────────
echo -e "${BOLD}[2/2] Running test suite...${RESET}"
echo ""

if BASE_URL="${BASE_URL}" python3 "${TEST_FILE}"; then
  echo ""
  hr
  echo -e "${GREEN}${BOLD}  ✓ All tests passed${RESET}"
  hr
  echo ""
  exit 0
else
  echo ""
  hr
  echo -e "${RED}${BOLD}  ✗ Test suite failed${RESET}"
  hr
  echo ""
  exit 1
fi
