#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [ -s "${NVM_DIR:-$HOME/.nvm}/nvm.sh" ]; then
  export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
  # Load nvm inside the script so bash execution can still select the project runtime.
  . "$NVM_DIR/nvm.sh"
  if [ -f ".nvmrc" ]; then
    nvm use >/dev/null
  fi
fi

if ! node -e "require('node:sqlite')" >/dev/null 2>&1; then
  CURRENT_NODE_VERSION="$(node -p "process.version")"
  echo "[error] This project requires a Node.js runtime with built-in node:sqlite support."
  echo "[error] Current Node.js: ${CURRENT_NODE_VERSION}"
  echo "[error] Use Node.js 22.13.0+ (or 23.4.0+) and run the script again."
  exit 1
fi

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
