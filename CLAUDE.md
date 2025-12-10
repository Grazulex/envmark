# CLAUDE.md - EnvMark

## Apercu du projet

EnvMark est un CLI de gestion des fichiers `.env` utilisant Git comme backend de stockage. Un seul repo pour tous les projets, une branche par environnement. Zero serveur, zero API, 100% local.

## Architecture

- **CLI** : TypeScript/Node.js
- **Backend** : Git (1 repo unique pour tous les projets)
- **Stockage** : 1 branche = 1 environnement, 1 dossier = 1 projet
- **Chiffrement** : AES-256-GCM optionnel cote client

### Principe de fonctionnement

```
envmark-secrets (repo Git unique)
├── branch: development
│   ├── project-alpha/.env
│   ├── project-beta/.env
│   └── api-gateway/.env
├── branch: staging
│   ├── project-alpha/.env
│   └── ...
├── branch: qa
│   └── ...
└── branch: main (production)
    ├── project-alpha/.env
    └── ...
```

- `envmark push dev` → checkout branche `development`, commit dans dossier projet, push
- `envmark pull prod` → checkout branche `main`, copie `.env` du dossier projet vers local
- Tous les projets dans un seul repo
- Toutes les branches (envs) partagees entre projets

### Avantages

- 1 seul repo pour toute l'equipe/entreprise
- Zero serveur a maintenir
- Zero cout d'hebergement
- Git donne tout gratuitement : versioning, diff, branches, PR, protections
- Branch protection sur main = securiser la prod
- Coherent avec la philosophie des autres outils (Stackmark, Shipmark, Backmark)

## Structure des fichiers

### Configuration globale (~/.envmark/)
```
~/.envmark/
├── config.json       # Config globale (remote, defaultEnv, encrypt)
├── .envmark.key      # Cle AES-256 optionnelle (mode 600)
└── repos/            # Cache des repos clones
    └── <hash>/       # Clone du repo distant
```

### ~/.envmark/config.json
```json
{
  "remote": "git@github.com:team/envmark-secrets.git",
  "defaultEnv": "development",
  "encrypt": false
}
```

### Configuration locale (par projet)
```
mon-projet/
├── .env              # Fichier environnement actif (gitignore)
└── .envmark.json     # Config projet (versionne)
```

### .envmark.json (dans chaque projet)
```json
{
  "project": "my-project-name"
}
```

## Commandes CLI

```bash
envmark init                     # Initialiser config locale (demande nom projet + remote)
envmark remote <git-url>         # Configurer/changer le repo de stockage
envmark push [env]               # Push .env vers branche env / dossier projet
envmark pull [env]               # Pull .env depuis branche env / dossier projet
envmark list                     # Lister les environnements (branches du repo)
envmark create <env>             # Creer un nouvel environnement (branche)
envmark delete <env>             # Supprimer un environnement (branche)
envmark diff <env1> <env2>       # Comparer .env du projet entre deux envs
envmark history [env]            # Historique des versions (git log sur le fichier)
envmark rollback [env] <commit>  # Restaurer une version anterieure
envmark status                   # Afficher la config et l'etat
envmark keygen                   # Generer une nouvelle cle de chiffrement
```

## Workflow utilisateur

```bash
# 1. Initialisation (une seule fois par projet)
cd mon-projet
envmark init
# → Demande: nom du projet? remote git?
# → Cree .envmark.json

# 2. Usage quotidien
envmark pull dev           # Recuperer le .env de dev
# ... travailler ...
envmark push dev           # Sauvegarder les changements

# 3. Deploiement / comparaison
envmark pull prod          # Recuperer la config prod
envmark diff dev prod      # Verifier les differences
```

## Mapping branches / environnements

| Alias         | Branche Git      |
|---------------|------------------|
| dev           | development      |
| development   | development      |
| staging       | staging          |
| qa            | qa               |
| prod          | main             |
| production    | main             |

## Fonctionnement interne

### Push
```bash
envmark push dev
# 1. Clone/fetch le repo envmark-secrets (en cache local ~/.envmark/repo)
# 2. git checkout development
# 3. mkdir -p <project-name>
# 4. cp .env → <project-name>/.env (ou .env.enc si chiffre)
# 5. git add + commit + push
```

### Pull
```bash
envmark pull prod
# 1. Clone/fetch le repo envmark-secrets
# 2. git checkout main
# 3. cp <project-name>/.env → .env local (dechiffre si necessaire)
```

## Securite

- **Chiffrement optionnel** : AES-256-GCM cote client
- **Cle locale** : `.envmark.key` jamais versionne
- **Repo prive** : L'utilisateur gere la securite de son repo
- **Branch protection** : Proteger main sur GitHub/GitLab = proteger prod

## Stack technique

- TypeScript + Node.js
- Commander.js pour le parsing CLI
- simple-git pour les operations Git
- crypto (Node.js natif) pour AES-256-GCM

---

## INSTRUCTIONS OBLIGATOIRES POUR L'IA (Claude Code)

> **IMPORTANT**: Cette section definit le comportement OBLIGATOIRE de l'IA lors du travail sur ce projet. Ces regles sont NON NEGOCIABLES.

### Regle #1: TOUJOURS utiliser Backmark pour tracker le travail

Quand l'utilisateur te demande de faire une tache de developpement:

```bash
# 1. CREER LA TACHE IMMEDIATEMENT
backmark task create "<titre descriptif>" -a "@claude" -p <priorite> -l "<labels>"

# 2. DOCUMENTER TON PLAN AVANT DE CODER
backmark task ai-plan <id> "## Plan d'implementation
### Objectif
<ce que tu vas accomplir>

### Etapes
1. <etape 1>
2. <etape 2>

### Fichiers concernes
- <fichier 1>
- <fichier 2>

### Approche technique
<ta strategie>"

# 3. DEMARRER LE TRAVAIL
backmark task edit <id> --status "In Progress"
```

### Regle #2: DOCUMENTER pendant l'implementation

```bash
# Prendre des notes horodatees PENDANT que tu travailles
backmark task ai-note <id> "**HH:MM** - <ce que tu fais/decides/rencontres>"

# Exemples de notes:
backmark task ai-note <id> "**14:30** - Cree le service git.ts"
backmark task ai-note <id> "**14:45** - ISSUE: probleme avec simple-git, resolu"
backmark task ai-note <id> "**15:00** - DECISION: utiliser crypto natif Node.js"
```

### Regle #3: GENERER la documentation

```bash
# Documenter ce que tu as cree
backmark task ai-doc <id> "## Documentation

### Utilisation
<comment utiliser la fonctionnalite>

### API/Interface
<fonctions, commandes, etc.>

### Configuration
<options de config si applicable>"
```

### Regle #4: AUTO-REVIEW avant de terminer

```bash
# Faire ton auto-evaluation HONNETE
backmark task ai-review <id> "## Auto-Review

### Complete
- [x] <ce qui est fait>
- [ ] <ce qui n'est pas fait si applicable>

### Tests effectues
- <test 1>: OK/NOK

### Limitations connues
- <limitation 1>

### Questions pour le developpeur
- <question si tu as des doutes>"
```

### Regle #5: FERMER proprement la tache

```bash
# Verifier et cocher les criteres d'acceptation
backmark task check <id> 0
backmark task check <id> 1

# Fermer la tache
backmark task close <id>
```

### Ce qui est INTERDIT

- Coder SANS creer de tache Backmark
- Coder SANS documenter un plan d'abord
- Terminer SANS faire d'auto-review
- Ignorer les commandes ai-plan, ai-note, ai-doc, ai-review
- Oublier de mettre a jour le statut de la tache
