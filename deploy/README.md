# Déploiement VPS OVH — HiraKata

HiraKata cohabite avec **canopee.be**, **streamTv** et **RPG-CR** sur le même VPS.

| App | URL publique |
|-----|--------------|
| HiraKata | `https://vps-e09ed6db.vps.ovh.net/hirakana` |

Conteneur en **écoute locale** (`127.0.0.1:3020`) — seul **Nginx** est public (443).

## Installation sur le VPS

```bash
ssh root@vps-e09ed6db.vps.ovh.net
cd /chemin/vers/hirakana   # git clone ou rsync

# Build & démarrage
bash deploy/deploy.sh

# Nginx (une fois)
sudo cp deploy/nginx-hirakana.conf.example /etc/nginx/snippets/hirakana.conf
# Dans le server HTTPS vps-e09ed6db.vps.ovh.net :
#   include snippets/hirakana.conf;
sudo nginx -t && sudo systemctl reload nginx

# Vérification
bash deploy/check-vps.sh
curl -sI https://vps-e09ed6db.vps.ovh.net/hirakana/
```

## Mise à jour

```bash
git pull
bash deploy/deploy.sh
```

## Développement local

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # dist/
npm run preview      # http://localhost:3020
```

Pour simuler le chemin VPS en local :

```bash
VITE_BASE_PATH=/hirakana/ npm run build
npm run preview
# http://localhost:3020/hirakana/
```

## Architecture

```
HTTPS :443 (Nginx hôte)
  /hirakana/  → 127.0.0.1:3020/  (nginx:alpine, fichiers statiques Vite)
```

Pas de backend — progression sauvegardée dans `localStorage` du navigateur.
