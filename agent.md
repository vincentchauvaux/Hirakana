# Agent — HiraKata

> Dernière mise à jour : 2026-09-02 (révisions cumulatives + répétitions avec recul)

## Vision

Application web d'apprentissage des **hiragana** et **katakana** japonais, par quiz à choix multiples (romaji ↔ kana), avec progression par rangées du gojūon (voyelles → K → S → T → N → H → M → Y → R → W/ん), déployable sur VPS OVH.

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
- **Quiz** : choix multiples (4, 6, 8 ou 10 propositions) ou **saisie libre** (romaji tapé + Valider / Entrée)
- **Sens** : **kana → romaji** (défaut) ou **romaji → kana** (on affiche la lecture, on choisit le caractère) ; persisté dans `hirakana-preferences`
- **Source des propositions** (mode choix) : **caractères du niveau** (rangées déjà vues + courante, défaut) ou **tous les caractères** du syllabaire (plus difficile) ; persisté dans `hirakana-preferences`
- **Progression** : à chaque niveau, **tous les caractères débloqués** (rangée courante + précédentes) doivent être réussis `N` fois (`répétitions`, défaut 2). Une erreur **re-mélange** les choix ; une 2ᵉ erreur d’affilée sur le même caractère enlève une réussite (jamais plus de `N` restantes). La barre reflète les réussites / (caractères × N). Passage au niveau suivant quand tout est à 0 restant ; le niveau suivant recommence le compteur pour réviser l’ancien + le nouveau.
- **Fin** : écran de félicitations + bascule vers l'autre script — uniquement après les **10** rangées (46 caractères)
- **Sauvegarde ancienne (5 rangées)** : `level === 5` avec mastered vide est migré vers la rangée は, sans écran Bravo anticipé
- **Reset** : bouton ↺ dans l'en-tête (script courant) ; panneau **Préférences** (⚙) pour reset par script ou global
- **Préférences** : mode quiz (choix / saisie), **sens** (kana → romaji ou romaji → kana), nombre de propositions (4, 6, 8 ou 10 en mode choix), **source des propositions** (niveau ou tout le syllabaire), **répétitions par niveau** (1, 2, 3, 5 ou 1 si illimité pour le palier), persistées dans `localStorage` ; panneau plein écran mobile avec bouton **Retour au quiz** (en-tête + pied de page)
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
8. **Fin à 25/25** : l'écran Bravo se déclenchait après les 5 anciennes rangées ; la rangée courante suffit désormais à passer au niveau suivant, et une sauvegarde `level: 5` reprend sur は

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

**État VPS (2026-09-02)** : conteneur `hirakana-web` actif (`127.0.0.1:3020`). Public : `https://vps-e09ed6db.vps.ovh.net/hirakana/` → **200**. Dernière version : révisions cumulatives par niveau + répétitions avec recul (2 erreurs d’affilée).

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
- Yōon (きゃ, しゅ…)
- Streak, statistiques avancées
- PWA offline complète
