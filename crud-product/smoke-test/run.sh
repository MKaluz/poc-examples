#!/usr/bin/env bash
# Smoke test: verifies that all services in the crud-product Compose Stack
# are reachable and that the full Product CRUD path works end-to-end.
#
# Usage:
#   ./smoke-test/run.sh
#
# Override defaults:
#   API_URL=http://localhost:5000 FRONTEND_URL=http://localhost:3000 ./smoke-test/run.sh

set -euo pipefail

API_URL="${API_URL:-http://localhost:5000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
MAX_WAIT=60   # seconds
INTERVAL=3

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

pass() { echo -e "${GREEN}PASS${NC} $1"; }
fail() { echo -e "${RED}FAIL${NC} $1"; exit 1; }

wait_for_url() {
  local url="$1"
  local name="$2"
  local elapsed=0
  printf "Waiting for %s at %s " "$name" "$url"
  until curl -sf "$url" > /dev/null 2>&1; do
    if [ "$elapsed" -ge "$MAX_WAIT" ]; then
      echo ""
      fail "$name did not become ready within ${MAX_WAIT}s"
    fi
    printf "."
    sleep "$INTERVAL"
    elapsed=$((elapsed + INTERVAL))
  done
  echo ""
  pass "$name is reachable"
}

echo "=== crud-product Smoke Test ==="
echo "API:      $API_URL"
echo "Frontend: $FRONTEND_URL"
echo ""

# ── Service reachability ─────────────────────────────────────────────────────
wait_for_url "$API_URL/health" "API /health"
wait_for_url "$FRONTEND_URL/" "Frontend /"

# ── Product CRUD path ────────────────────────────────────────────────────────
echo ""
echo "--- Product CRUD ---"

# Create
CREATED=$(curl -sf -X POST "$API_URL/api/products" \
  -H "Content-Type: application/json" \
  -d '{"name":"Smoke Widget","price":4.99,"category":"Test","stockCount":100}')
[ -n "$CREATED" ] || fail "POST /api/products returned empty response"
pass "POST /api/products"

# Extract id (portable; no jq dependency)
PRODUCT_ID=$(echo "$CREATED" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
[ -n "$PRODUCT_ID" ] || fail "Could not extract product id from response"

# Read list
LIST=$(curl -sf "$API_URL/api/products")
echo "$LIST" | grep -q "$PRODUCT_ID" || fail "GET /api/products does not contain created product"
pass "GET /api/products"

# Read single
curl -sf "$API_URL/api/products/$PRODUCT_ID" > /dev/null
pass "GET /api/products/$PRODUCT_ID"

# Update
curl -sf -X PUT "$API_URL/api/products/$PRODUCT_ID" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Widget","price":9.99,"category":"Test","stockCount":50}' > /dev/null
pass "PUT /api/products/$PRODUCT_ID"

# Delete
curl -sf -X DELETE "$API_URL/api/products/$PRODUCT_ID"
pass "DELETE /api/products/$PRODUCT_ID"

# Confirm deletion returns 404
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/products/$PRODUCT_ID")
[ "$STATUS" = "404" ] || fail "Expected 404 after delete, got $STATUS"
pass "Deleted product returns 404"

echo ""
echo "=== All smoke tests passed ==="
