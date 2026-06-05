#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
  cp ".env.example" ".env"
fi

if [ ! -d "node_modules" ] || [ ! -x "node_modules/.bin/tsx" ] || [ ! -x "node_modules/.bin/next" ]; then
  echo "[setup] Installing workspace dependencies..."
  npm install
fi

mkdir -p apps/api/.local

cleanup() {
  if [[ -n "${API_PID:-}" ]]; then
    kill "$API_PID" >/dev/null 2>&1 || true
  fi
  if [[ -n "${WEB_PID:-}" ]]; then
    kill "$WEB_PID" >/dev/null 2>&1 || true
  fi
}

trap cleanup EXIT INT TERM

echo "[start] API on http://localhost:4000"
npm run dev:api &
API_PID=$!

echo "[start] WEB on http://localhost:3000"
npm run dev:web &
WEB_PID=$!

wait "$API_PID" "$WEB_PID"
