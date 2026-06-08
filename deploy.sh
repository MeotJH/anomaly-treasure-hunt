#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BACKEND_HOST="${BACKEND_HOST:-13.124.77.254}"
BACKEND_USER="${BACKEND_USER:-ec2-user}"
SSH_KEY_PATH="${SSH_KEY_PATH:-$ROOT_DIR/../chickenmap/LightsailDefaultKey-ap-northeast-2.pem}"
BACKEND_REMOTE_DIR="${BACKEND_REMOTE_DIR:-/home/ec2-user/anomaly-treasure-hunt-api}"
REMOTE_GIT_URL="${REMOTE_GIT_URL:-https://github.com/MeotJH/anomaly-treasure-hunt.git}"
REMOTE_GIT_BRANCH="${REMOTE_GIT_BRANCH:-master}"
BACKEND_CONTAINER_NAME="${BACKEND_CONTAINER_NAME:-anomaly-treasure-hunt-api}"
BACKEND_IMAGE_NAME="${BACKEND_IMAGE_NAME:-anomaly-treasure-hunt-api:latest}"
BACKEND_PORT_BIND="${BACKEND_PORT_BIND:-2028:4000}"
BACKEND_PUBLIC_URL="${BACKEND_PUBLIC_URL:-https://anomaly.${BACKEND_HOST}.nip.io}"
CADDYFILE_PATH="${CADDYFILE_PATH:-/home/ec2-user/caddy/Caddyfile}"
CONFIGURE_BACKEND_URL="${CONFIGURE_BACKEND_URL:-true}"
UPLOAD_BACKEND_ENV="${UPLOAD_BACKEND_ENV:-false}"
SKIP_API_LINT="${SKIP_API_LINT:-false}"

print_usage() {
  cat <<EOF
Usage: ./deploy.sh [--back]

Options:
  --back  Deploy backend to EC2 and provision the public URL (default)
  -h, --help

Env overrides:
  BACKEND_HOST
  BACKEND_USER
  SSH_KEY_PATH
  BACKEND_REMOTE_DIR
  REMOTE_GIT_URL
  REMOTE_GIT_BRANCH
  BACKEND_CONTAINER_NAME
  BACKEND_IMAGE_NAME
  BACKEND_PORT_BIND
  BACKEND_PUBLIC_URL
  CADDYFILE_PATH
  CONFIGURE_BACKEND_URL=true|false
  UPLOAD_BACKEND_ENV=true|false
  SKIP_API_LINT=true|false
EOF
}

if [[ $# -gt 0 ]]; then
  case "$1" in
    --back)
      ;;
    -h|--help)
      print_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      print_usage
      exit 1
      ;;
  esac
fi

if [[ ! -f "$SSH_KEY_PATH" ]]; then
  echo "SSH key not found: $SSH_KEY_PATH"
  exit 1
fi

if [[ "$SKIP_API_LINT" != true ]]; then
  echo "[deploy] API typecheck start"
  (
    cd "$ROOT_DIR"
    npm run lint:api
  )
  echo "[deploy] API typecheck passed"
else
  echo "[deploy] API typecheck skipped (SKIP_API_LINT=true)"
fi

echo "[deploy] Ensuring remote directory exists"
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "${BACKEND_USER}@${BACKEND_HOST}" \
  "mkdir -p '${BACKEND_REMOTE_DIR}' '${BACKEND_REMOTE_DIR}/apps/api/.local'"

if [[ "$UPLOAD_BACKEND_ENV" == true ]]; then
  if [[ ! -f "$ROOT_DIR/.env" ]]; then
    echo "Local .env not found: $ROOT_DIR/.env"
    exit 1
  fi

  echo "[deploy] Uploading root .env to remote backend directory"
  scp -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$ROOT_DIR/.env" \
    "${BACKEND_USER}@${BACKEND_HOST}:${BACKEND_REMOTE_DIR}/.env"
fi

echo "[deploy] Syncing backend code from origin/${REMOTE_GIT_BRANCH}"
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "${BACKEND_USER}@${BACKEND_HOST}" "
  set -euo pipefail
  REMOTE_DIR='${BACKEND_REMOTE_DIR}'
  REPO_URL='${REMOTE_GIT_URL}'
  REPO_BRANCH='${REMOTE_GIT_BRANCH}'
  TMP_DIR=\"\${REMOTE_DIR}.__clone\"
  BACKUP_DIR=\"\${REMOTE_DIR}.__backup\"

  if [ ! -d \"\${REMOTE_DIR}/.git\" ]; then
    rm -rf \"\${TMP_DIR}\" \"\${BACKUP_DIR}\"
    if [ -d \"\${REMOTE_DIR}\" ]; then
      mv \"\${REMOTE_DIR}\" \"\${BACKUP_DIR}\"
    fi

    git clone --branch \"\${REPO_BRANCH}\" --single-branch \"\${REPO_URL}\" \"\${TMP_DIR}\"
    mkdir -p \"\${TMP_DIR}/apps/api/.local\"

    if [ -f \"\${BACKUP_DIR}/.env\" ]; then
      cp \"\${BACKUP_DIR}/.env\" \"\${TMP_DIR}/.env\"
    fi

    if [ -d \"\${BACKUP_DIR}/apps/api/.local\" ]; then
      rm -rf \"\${TMP_DIR}/apps/api/.local\"
      cp -R \"\${BACKUP_DIR}/apps/api/.local\" \"\${TMP_DIR}/apps/api/.local\"
    fi

    rm -rf \"\${REMOTE_DIR}\"
    mv \"\${TMP_DIR}\" \"\${REMOTE_DIR}\"
    rm -rf \"\${BACKUP_DIR}\"
  fi

  cd \"\${REMOTE_DIR}\"
  git fetch origin \"\${REPO_BRANCH}\"
  git checkout \"\${REPO_BRANCH}\"
  git pull --ff-only origin \"\${REPO_BRANCH}\"
  mkdir -p apps/api/.local
"

if [[ "$CONFIGURE_BACKEND_URL" == true ]]; then
  echo "[deploy] Ensuring Caddy route exists"
  ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "${BACKEND_USER}@${BACKEND_HOST}" "
    set -euo pipefail
    mkdir -p \"\$(dirname '${CADDYFILE_PATH}')\"
    touch '${CADDYFILE_PATH}'
    if ! grep -q 'anomaly.${BACKEND_HOST}.nip.io' '${CADDYFILE_PATH}'; then
      cat <<'EOF' >> '${CADDYFILE_PATH}'

anomaly.3.36.208.227.nip.io, anomaly.13.124.77.254.nip.io {
    reverse_proxy host.docker.internal:2028
}
EOF
    fi
    docker exec chickenmap-caddy caddy reload --config /etc/caddy/Caddyfile
  "
fi

echo "[deploy] Building and restarting backend container"
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "${BACKEND_USER}@${BACKEND_HOST}" "
  set -euo pipefail
  cd '${BACKEND_REMOTE_DIR}'
  if [ ! -f .env ]; then
    echo '[deploy] Missing remote .env. Re-run with UPLOAD_BACKEND_ENV=true or create ${BACKEND_REMOTE_DIR}/.env on the server.'
    exit 1
  fi
  HOST_PORT='${BACKEND_PORT_BIND%%:*}'
  if [ \"\$HOST_PORT\" = \"${BACKEND_PORT_BIND}\" ]; then
    HOST_PORT='${BACKEND_PORT_BIND}'
  fi
  docker build -f Dockerfile.api -t '${BACKEND_IMAGE_NAME}' .
  docker rm -f '${BACKEND_CONTAINER_NAME}' || true
  docker run -d \
    --name '${BACKEND_CONTAINER_NAME}' \
    --restart unless-stopped \
    -p '${BACKEND_PORT_BIND}' \
    --env-file .env \
    -v '${BACKEND_REMOTE_DIR}/apps/api/.local:/app/apps/api/.local' \
    '${BACKEND_IMAGE_NAME}'
  HEALTH_URL=\"http://127.0.0.1:\${HOST_PORT}/api/cases\"
  ok=0
  for i in \$(seq 1 30); do
    if curl -fsS \"\${HEALTH_URL}\" >/dev/null; then
      ok=1
      break
    fi
    sleep 1
  done
  if [ \"\$ok\" -ne 1 ]; then
    echo \"[deploy] Health check failed: \${HEALTH_URL}\"
    docker logs --tail 120 '${BACKEND_CONTAINER_NAME}' || true
    exit 1
  fi
  docker ps --filter name='${BACKEND_CONTAINER_NAME}' --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
"

echo "[deploy] Backend done: ${BACKEND_PUBLIC_URL}/api/cases"
