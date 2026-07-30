#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# run_tests.sh — Wait for the Cloudflare Worker to ship the locally-checked-out
# commit, then run the smoke-test suite against the live URL.
#
# How the deploy-wait works:
#   1. Hash src/index.html in the local working tree (= GITHUB_SHA in CI).
#   2. Poll BASE_URL/ and hash the response body.
#   3. When the hashes match, the deploy has landed — proceed to tests.
#
# The Worker serves src/ (copied into dist/ at build time) as static assets,
# so the response body should be identical to the source file.
#
# Usage:
#   ./tests/run_tests.sh
#   BASE_URL=https://anthonybest.com ./tests/run_tests.sh
#
# Options (env vars):
#   BASE_URL        Target URL  (default: https://anthonybest.com)
#   WAIT_TIMEOUT    Max seconds to wait for deploy to land  (default: 300)
#   POLL_INTERVAL   Seconds between deploy probes           (default: 5)
#   CANARY_FILE     Repo-relative file to compare           (default: src/index.html)
#   CANARY_PATH     URL path that should serve canary file  (default: /)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
BASE_URL="${BASE_URL:-https://anthonybest.com}"
WAIT_TIMEOUT="${WAIT_TIMEOUT:-300}"
POLL_INTERVAL="${POLL_INTERVAL:-5}"
CANARY_FILE="${CANARY_FILE:-src/index.html}"
CANARY_PATH="${CANARY_PATH:-/}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
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

# ── Deploy-wait — compare local canary file hash to live URL response ────────
CANARY_LOCAL="${REPO_ROOT}/${CANARY_FILE}"

if [[ ! -f "${CANARY_LOCAL}" ]]; then
  echo -e "${YELLOW}⚠ Canary file ${CANARY_FILE} not found; falling back to a 200-OK liveness check.${RESET}"
  echo ""
  CANARY_LOCAL=""
fi

echo -e "${BOLD}[1/2] Waiting for deploy to land...${RESET}"
echo -e "      target:   ${CYAN}${BASE_URL}${CANARY_PATH}${RESET}"
echo -e "      canary:   ${CYAN}${CANARY_FILE}${RESET}"
echo -e "      timeout:  ${WAIT_TIMEOUT}s · probe interval: ${POLL_INTERVAL}s"
echo ""

if [[ -n "${CANARY_LOCAL}" ]]; then
  LOCAL_HASH=$(shasum -a 256 "${CANARY_LOCAL}" | awk '{print $1}')
  echo -e "      local hash: ${LOCAL_HASH:0:16}…"
  echo ""
fi

elapsed=0
attempt=0

while true; do
  attempt=$((attempt + 1))
  printf "  Probe %-3d  " "${attempt}"

  if [[ -n "${CANARY_LOCAL}" ]]; then
    LIVE_HASH=$(curl -s --max-time 10 --location "${BASE_URL}${CANARY_PATH}" 2>/dev/null \
                | shasum -a 256 | awk '{print $1}')
    if [[ "${LIVE_HASH}" == "${LOCAL_HASH}" ]]; then
      echo -e "${GREEN}hash ${LIVE_HASH:0:16}… ✓  — deploy landed (${elapsed}s elapsed)${RESET}"
      break
    fi
    echo -e "${YELLOW}hash ${LIVE_HASH:0:16}…  — not yet (${elapsed}s elapsed)${RESET}"
  else
    http_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 --location "${BASE_URL}/" 2>/dev/null || echo "000")
    if [[ "${http_code}" == "200" ]]; then
      echo -e "${GREEN}HTTP ${http_code} ✓  — app is live (${elapsed}s elapsed)${RESET}"
      break
    fi
    echo -e "${YELLOW}HTTP ${http_code}  — not ready yet${RESET}"
  fi

  if [[ ${elapsed} -ge ${WAIT_TIMEOUT} ]]; then
    echo ""
    echo -e "${RED}✗ Timed out after ${WAIT_TIMEOUT}s waiting for ${BASE_URL}${CANARY_PATH} to match local${RESET}"
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
