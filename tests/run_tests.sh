#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# run_tests.sh — Wait for the Heroku app to be live, then run the test suite.
#
# Usage:
#   ./tests/run_tests.sh
#   BASE_URL=https://anthonybest.com ./tests/run_tests.sh
#
# Options (env vars):
#   BASE_URL        Target URL  (default: https://anthonybest-bf380286087d.herokuapp.com)
#   WAIT_TIMEOUT    Max seconds to wait for liveness  (default: 90)
#   POLL_INTERVAL   Seconds between liveness probes   (default: 5)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
BASE_URL="${BASE_URL:-https://anthonybest-bf380286087d.herokuapp.com}"
WAIT_TIMEOUT="${WAIT_TIMEOUT:-90}"
POLL_INTERVAL="${POLL_INTERVAL:-5}"
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

# ── Liveness poll ─────────────────────────────────────────────────────────────
echo -e "${BOLD}[1/2] Waiting for Heroku to be live...${RESET}"
echo -e "      (timeout: ${WAIT_TIMEOUT}s, probe interval: ${POLL_INTERVAL}s)"
echo ""

elapsed=0
attempt=0

while true; do
  attempt=$((attempt + 1))
  printf "  Probe %-3d  " "${attempt}"

  http_code=$(curl -s -o /dev/null -w "%{http_code}" \
    --max-time 10 \
    --location \
    "${BASE_URL}/" 2>/dev/null || echo "000")

  if [[ "${http_code}" == "200" ]]; then
    echo -e "${GREEN}HTTP ${http_code} ✓  — app is live (${elapsed}s elapsed)${RESET}"
    break
  fi

  echo -e "${YELLOW}HTTP ${http_code}  — not ready yet${RESET}"

  if [[ ${elapsed} -ge ${WAIT_TIMEOUT} ]]; then
    echo ""
    echo -e "${RED}✗ Timed out after ${WAIT_TIMEOUT}s waiting for ${BASE_URL} to return 200${RESET}"
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
