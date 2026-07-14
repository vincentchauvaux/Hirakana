#!/usr/bin/env bash
# Diagnostic rapide sur le VPS — HiraKata /hirakana
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PUBLIC_HOST="${NGINX_PUBLIC_HOST:-https://vps-e09ed6db.vps.ovh.net}"
fail=0

echo "=== HiraKata — diagnostic VPS ==="

if command -v docker >/dev/null 2>&1; then
  echo "OK   Docker installé"
else
  echo "KO   Docker absent"
  fail=$((fail + 1))
fi

if docker compose -f docker-compose.prod.yml ps -q web 2>/dev/null | grep -q .; then
  echo "OK   Conteneur web actif"
else
  echo "KO   Conteneur web absent — bash deploy/deploy.sh"
  fail=$((fail + 1))
fi

if curl -sf http://127.0.0.1:3020/ >/dev/null; then
  echo "OK   http://127.0.0.1:3020/"
else
  echo "KO   Port 3020 injoignable"
  fail=$((fail + 1))
fi

if [[ -f /etc/nginx/snippets/hirakana.conf ]]; then
  echo "OK   Snippet Nginx /etc/nginx/snippets/hirakana.conf"
else
  echo "!!   Snippet Nginx manquant"
  fail=$((fail + 1))
fi

if curl -sf "${PUBLIC_HOST}/hirakana/" >/dev/null; then
  echo "OK   ${PUBLIC_HOST}/hirakana/"
else
  echo "!!   URL publique injoignable (Nginx ou DNS)"
fi

if [[ $fail -gt 0 ]]; then
  echo ""
  echo "=> ${fail} problème(s). Suivez deploy/README.md"
  exit 1
fi

echo ""
echo "Tout semble OK."
