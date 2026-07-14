#!/usr/bin/env bash
# Déploiement ou mise à jour HiraKata sur le VPS (Nginx /hirakana).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

COMPOSE_FILE="docker-compose.prod.yml"

echo "==> Build & démarrage Docker"
docker compose -f "${COMPOSE_FILE}" up -d --build

echo "==> Healthcheck local"
for i in {1..30}; do
  if curl -sf http://127.0.0.1:3020/ >/dev/null; then
    echo "OK   Conteneur hirakana-web répond sur :3020"
    break
  fi
  if [[ $i -eq 30 ]]; then
    echo "KO   Timeout healthcheck"
    docker compose -f "${COMPOSE_FILE}" logs --tail=40 web
    exit 1
  fi
  sleep 2
done

PUBLIC_HOST="${NGINX_PUBLIC_HOST:-https://vps-e09ed6db.vps.ovh.net}"

echo ""
echo "==> Déploiement Docker OK"
echo "Local  : http://127.0.0.1:3020/"
echo "Public : ${PUBLIC_HOST}/hirakana/  (si Nginx configuré)"
echo ""
echo "Nginx pas encore installé ?"
echo "  sudo cp deploy/nginx-hirakana.conf.example /etc/nginx/snippets/hirakana.conf"
echo "  # include snippets/hirakana.conf; dans le server HTTPS"
echo "  sudo nginx -t && sudo systemctl reload nginx"
