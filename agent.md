# Agent — HiraKata

> Dernière mise à jour : 2026-09-01 (gojūon complet, 10 niveaux)

## Vision

Application web d'apprentissage des **hiragana** et **katakana** japonais, par quiz à choix multiples (romaji), avec progression par rangées du gojūon (voyelles → K → S → T → N → H → M → Y → R → W/ん), déployable sur VPS OVH.

## Stack

| Couche | Techno |
|--------|--------|
| Front | React 18, TypeScript, Vite 5 |
| Styles | Tailwind CSS 3 |
| Icônes UI | lucide-react |
| Données | Statiques (`src/data/characters.ts`) |
| Persistance | `localStorage` — progression (`hirakana-progress`), préférences (`hirakana-preferences`), erreurs (`hirakana-mistakes`) |
| Logo / favicon | SVG `public/icon.svg` (いカ) + PNG (`npm run icons:generate`) |
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
    ├── utils/mistakes.ts
    ├── hooks/useQuizGame.ts
    └── components/
```

## Jeu

- **Scripts** : hiragana (46 car.) / katakana (46 car.) — gojūon moderne (sans ゐ/ゑ obsolètes)
- **Niveaux** : 10 rangées débloquées progressivement (`ROW_ORDER`) : あかさたなはまやらわ/ん
- **Quiz** : choix multiples (4, 6, 8 ou 10 propositions, tirées des rangées déjà débloquées) ou **saisie libre** (romaji tapé + Valider / Entrée)
- **Progression** : chaque caractère du niveau doit être trouvé une fois ; passage au niveau suivant automatique ; seuls les caractères **pas encore maîtrisés** sont proposés ; limite de répétitions par caractère et par niveau (réglable, défaut 2)
- **Fin** : écran de félicitations + bascule vers l'autre script
- **Reset** : bouton ↺ dans l'en-tête (script courant) ; panneau **Préférences** (⚙) pour reset par script ou global
- **Préférences** : mode quiz (choix / saisie), nombre de propositions (4, 6, 8 ou 10 en mode choix), **répétitions max par niveau** (1, 2, 3, 5 ou illimité), persistées dans `localStorage` ; panneau plein écran mobile avec bouton **Retour au quiz** (en-tête + pied de page)
- **Erreurs pondérées** : chaque erreur incrémente un compteur par romaji/script ; sélection du prochain caractère via `pickWeightedCharacter` (poids = `1 + erreurs × 2`)
- **Points difficiles** : top 5 visible dans Préférences (⚙) ; les caractères ratés reviennent plus souvent
- **Feedback visuel** : contour vert/rouge sur la réponse sélectionnée (rapide), puis passage à la question suivante sans scroll automatique ni flash « Chargement… »
- **Layout compact** : avec 8 ou 10 propositions, caractère et boutons réduits pour tout afficher à l'écran mobile

## Bugs corrigés (v1)

1. **Katakana** : rangées `s`/`t` → unifiées en `sh`/`ts` (comme hiragana)
2. **Progression** : comptage par caractères uniques maîtrisés (plus de doublons)
3. **Tailwind CDN** : supprimé (doublon avec PostCSS)
4. **Dépendances inutilisées** : firebase, git, react-scripts retirés
5. **CRA** : migré vers Vite + TypeScript
6. **Feedback boutons** : couleur qui restait sur le dernier choix (réutilisation de romaji + focus mobile)
7. **Questions empilées** : cycle de phases + démontage complet de la grille entre les questions

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

**État VPS (2026-08-31)** : conteneur `hirakana-web` actif (`127.0.0.1:3020`). Snippet Nginx `hirakana.conf` inclus dans `streamtv`. Public : `https://vps-e09ed6db.vps.ovh.net/hirakana/` → **200**. Dernière version : erreurs pondérées, icônes いカ, mode saisie libre.

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
- Yōon (きゃ, しゅ…)
- Streak, statistiques avancées
- PWA offline complète
