# Agent — HiraKata

> Dernière mise à jour : 2026-07-14

## Vision

Application web d'apprentissage des **hiragana** et **katakana** japonais, par quiz à choix multiples (romaji), avec progression par rangées (voyelles → K → S → T → N), déployable sur VPS OVH.

## Stack

| Couche | Techno |
|--------|--------|
| Front | React 18, TypeScript, Vite 5 |
| Styles | Tailwind CSS 3 |
| Icônes | lucide-react |
| Données | Statiques (`src/data/characters.ts`) |
| Persistance | `localStorage` (progression par script) |
| Déploiement | Docker (nginx:alpine) + Nginx hôte `/hirakana` |

## Structure

```
hirakana/
├── agent.md
├── README.md
├── package.json
├── vite.config.ts
├── Dockerfile
├── docker-compose.prod.yml
├── deploy/              # Scripts VPS OVH
├── public/
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── types.ts
    ├── data/characters.ts
    ├── utils/quiz.ts
    ├── hooks/useQuizGame.ts
    └── components/
```

## Jeu

- **Scripts** : hiragana (25 car.) / katakana (25 car.)
- **Niveaux** : 5 rangées débloquées progressivement (`ROW_ORDER`)
- **Quiz** : 6 réponses romaji (1 correcte + 5 leurres)
- **Progression** : chaque caractère du niveau doit être trouvé une fois ; passage au niveau suivant automatique
- **Fin** : écran de félicitations + bascule vers l'autre script
- **Reset** : bouton ↺ dans l'en-tête (script courant) ; panneau **Préférences** (⚙) pour reset par script ou global
- **Préférences** : nombre de propositions (4 ou 6), persistées dans `localStorage`

## Bugs corrigés (v1)

1. **Katakana** : rangées `s`/`t` → unifiées en `sh`/`ts` (comme hiragana)
2. **Progression** : comptage par caractères uniques maîtrisés (plus de doublons)
3. **Tailwind CDN** : supprimé (doublon avec PostCSS)
4. **Dépendances inutilisées** : firebase, git, react-scripts retirés
5. **CRA** : migré vers Vite + TypeScript

## Commandes

```bash
npm install
npm run dev          # dev :3000
npm run build        # production → dist/
npm run preview      # preview :3020
npm run docker:prod  # Docker VPS
```

## VPS OVH (prod)

Guide : **[deploy/README.md](deploy/README.md)** — cohabitation avec **canopee.be**, **streamTv** (`/app`), **RPG-CR** (`/rpg-cr`).

| Élément | Détail |
|---------|--------|
| URL publique | `https://vps-e09ed6db.vps.ovh.net/hirakana/` |
| Conteneur | `hirakana-web` — `127.0.0.1:3020` |
| Nginx | `deploy/nginx-hirakana.conf.example` → `include` dans server HTTPS |
| Déploiement | `bash deploy/deploy.sh` |
| Diagnostic | `bash deploy/check-vps.sh` |
| Base path build | `VITE_BASE_PATH=/hirakana/` |

**État VPS (2026-07-14)** : conteneur `hirakana-web` actif (`127.0.0.1:3020`). Snippet Nginx `hirakana.conf` inclus dans `streamtv`. Public : `https://vps-e09ed6db.vps.ovh.net/hirakana/` → **200**.

**Mise à jour sur le VPS** :

```bash
# Depuis la machine locale (rsync) :
rsync -avz --delete --exclude node_modules --exclude dist --exclude .git \
  ./ root@vps-e09ed6db.vps.ovh.net:~/hirakana/

# Sur le VPS :
ssh root@vps-e09ed6db.vps.ovh.net
cd ~/hirakana && bash deploy/deploy.sh
```

## Évolutions possibles

- Dakuten / handakuten (が, ぱ…)
- Mode inverse (romaji → kana)
- Dakuten combinés, yōon (きゃ, しゅ…)
- Statistiques détaillées, streak
- PWA offline complète
