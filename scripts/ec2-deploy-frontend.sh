#!/usr/bin/env bash
set -euo pipefail

FRONTEND_REPO_PATH="${FRONTEND_REPO_PATH:-/opt/mts-finance-dashboard}"
FRONTEND_BRANCH="${FRONTEND_BRANCH:-main}"
FRONTEND_GIT_SYNC="${FRONTEND_GIT_SYNC:-true}"
FRONTEND_DEPLOY_PATH="${FRONTEND_DEPLOY_PATH:-/var/www/mts-finance-dashboard}"
FRONTEND_WEB_SERVICE="${FRONTEND_WEB_SERVICE:-nginx}"
FRONTEND_HEALTH_URL="${FRONTEND_HEALTH_URL:-http://127.0.0.1/}"
VALIDATE_NGINX="${VALIDATE_NGINX:-true}"

log() {
  printf '[deploy-frontend] %s\n' "$*"
}

deploy_frontend() {
  log "Deploying frontend from ${FRONTEND_REPO_PATH} (${FRONTEND_BRANCH})"
  cd "${FRONTEND_REPO_PATH}"

  if [[ "${FRONTEND_GIT_SYNC}" == "true" ]]; then
    git fetch origin "${FRONTEND_BRANCH}"
    git checkout "${FRONTEND_BRANCH}"
    git pull --ff-only origin "${FRONTEND_BRANCH}"
  else
    log "Skipping frontend git sync (FRONTEND_GIT_SYNC=${FRONTEND_GIT_SYNC})."
  fi

  sudo rsync -av --delete "${FRONTEND_REPO_PATH}/" "${FRONTEND_DEPLOY_PATH}/"

  if [[ "${FRONTEND_WEB_SERVICE}" == "nginx" && "${VALIDATE_NGINX}" == "true" ]]; then
    sudo nginx -t
  fi

  sudo systemctl restart "${FRONTEND_WEB_SERVICE}"
  sudo systemctl is-active --quiet "${FRONTEND_WEB_SERVICE}"

  if ! curl -fsS "${FRONTEND_HEALTH_URL}" >/dev/null; then
    echo "Frontend health check failed at ${FRONTEND_HEALTH_URL}" >&2
    if [[ "${FRONTEND_WEB_SERVICE}" == "nginx" ]]; then
      sudo journalctl -u nginx --since "10 min ago" --no-pager | tail -n 120 >&2 || true
    fi
    exit 1
  fi

  log "Frontend deployment finished successfully."
}

deploy_frontend
