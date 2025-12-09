# CLAUDE.md - EnvMark

## Apercu du projet

EnvMark est un outil de gestion centralisee et securisee des fichiers `.env` pour equipes de developpement. Il utilise une architecture SaaS avec chiffrement cote client (zero-knowledge).

## Architecture

- **Backend** : Laravel 11+ avec PostgreSQL
- **CLI** : Go ou PHP (Phar) - binaire multi-plateforme
- **Frontend** : Livewire ou Inertia.js + Tailwind CSS
- **Chiffrement** : AES-256-GCM cote client

### Principe zero-knowledge

Le serveur ne voit jamais les secrets en clair. Le chiffrement/dechiffrement se fait exclusivement cote client avec la cle projet.

### Authentification sans compte

Pas d'OAuth, pas d'email, pas de gestion d'utilisateurs. Un projet = un UUID + un mot de passe partage en equipe.

## Structure des fichiers cles

- `.envmark.json` : Configuration projet (versionne dans Git)
- `.envmark.key` : Cle AES-256 (dans .gitignore, CONFIDENTIEL)

## Commandes CLI principales

```bash
envmark init                    # Initialiser un nouveau projet
envmark push [env]              # Upload .env chiffre
envmark pull [env]              # Download .env
envmark list                    # Lister les environnements
envmark diff env1 env2          # Comparer deux environnements
envmark history [env]           # Historique des versions
envmark rollback [env] --version N
envmark passwd                  # Changer le mot de passe
envmark logout                  # Effacer le cache de session
envmark status                  # Afficher la configuration
```

## API REST - Endpoints principaux

```
POST   /api/projects/register                    # Nouveau projet
GET    /api/projects/{uuid}/environments         # Liste environnements
POST   /api/projects/{uuid}/environments/{env}   # Push
GET    /api/projects/{uuid}/environments/{env}   # Pull
GET    /api/projects/{uuid}/environments/{env}/history
GET    /api/projects/{uuid}/diff?from={env1}&to={env2}
PUT    /api/projects/{uuid}/password
DELETE /api/projects/{uuid}
```

### Headers d'authentification

```
X-Project-UUID: proj_a1b2c3d4-e5f6-7890-abcd-ef1234567890
X-Project-Auth: encrypted_password_base64...
```

## Schema de base de donnees

Tables principales :
- `projects` : UUID, name, password_hash
- `env_files` : project_id, environment, version, encrypted_content, checksum
- `audit_logs` : project_id, action, environment, ip_address

## Securite

- Chiffrement AES-256-GCM avec IV unique par push
- Tag d'authentification pour detection d'alteration
- Cache de session : 30 minutes, fichier `~/.envmark/session`
- Ne jamais versionner `.envmark.key` ni le mot de passe

## Conventions de developpement

- Le serveur stocke uniquement des blobs chiffres
- Le mot de passe est hashe avec bcrypt cote serveur
- UUID format : `proj_` suivi d'un UUID v4
- Cle format : `ek_` suivi de la cle AES-256 en base64

---

## INSTRUCTIONS OBLIGATOIRES POUR L'IA (Claude Code)

> **IMPORTANT**: Cette section définit le comportement OBLIGATOIRE de l'IA lors du travail sur ce projet. Ces règles sont NON NÉGOCIABLES.

### Règle #1: TOUJOURS utiliser Backmark pour tracker le travail

Quand l'utilisateur te demande de faire une tâche de développement:

```bash
# 1. CRÉER LA TÂCHE IMMÉDIATEMENT
backmark task create "<titre descriptif>" -a "@claude" -p <priorité> -l "<labels>"

# 2. DOCUMENTER TON PLAN AVANT DE CODER
backmark task ai-plan <id> "## Plan d'implémentation
### Objectif
<ce que tu vas accomplir>

### Étapes
1. <étape 1>
2. <étape 2>

### Fichiers concernés
- <fichier 1>
- <fichier 2>

### Approche technique
<ta stratégie>"

# 3. DÉMARRER LE TRAVAIL
backmark task edit <id> --status "In Progress"
```

### Règle #2: DOCUMENTER pendant l'implémentation

```bash
# Prendre des notes horodatées PENDANT que tu travailles
backmark task ai-note <id> "**HH:MM** - <ce que tu fais/décides/rencontres>"

# Exemples de notes:
backmark task ai-note <id> "**14:30** - Créé le service auth.ts avec JWT"
backmark task ai-note <id> "**14:45** - ISSUE: conflit de types, résolu avec generic"
backmark task ai-note <id> "**15:00** - DECISION: utiliser bcryptjs au lieu de bcrypt"
```

### Règle #3: GÉNÉRER la documentation

```bash
# Documenter ce que tu as créé
backmark task ai-doc <id> "## Documentation

### Utilisation
<comment utiliser la fonctionnalité>

### API/Interface
<endpoints, fonctions, etc.>

### Configuration
<options de config si applicable>"
```

### Règle #4: AUTO-REVIEW avant de terminer

```bash
# Faire ton auto-évaluation HONNÊTE
backmark task ai-review <id> "## Auto-Review

### Complété
- [x] <ce qui est fait>
- [ ] <ce qui n'est pas fait si applicable>

### Tests effectués
- <test 1>: OK/NOK

### Limitations connues
- <limitation 1>

### Questions pour le développeur
- <question si tu as des doutes>"
```

### Règle #5: FERMER proprement la tâche

```bash
# Vérifier et cocher les critères d'acceptation
backmark task check <id> 0
backmark task check <id> 1

# Fermer la tâche
backmark task close <id>
```

### Commandes slash disponibles

Tu as accès aux commandes slash suivantes pour t'aider:

- `/backmark-guide` - Guide complet de toutes les commandes et du workflow
- `/start-task` - Workflow pour démarrer une nouvelle tâche
- `/complete-task` - Workflow pour terminer une tâche proprement
- `/note` - Comment prendre des notes pendant le développement
- `/backmark-status` - Vérifier l'état du backlog

### Exemple de session complète

```bash
# L'utilisateur demande: "Ajoute une fonction de recherche"

# 1. Créer la tâche
backmark task create "Implémenter la recherche fuzzy" -a "@claude" -p high -l "feature,search"
# Output: Task #42 created

# 2. Planifier
backmark task ai-plan 42 "## Plan
### Objectif
Ajouter une recherche fuzzy avec Fuse.js

### Étapes
1. Installer fuse.js
2. Créer src/utils/search.ts
3. Ajouter endpoint GET /api/search
4. Indexer les données existantes

### Fichiers
- src/utils/search.ts (nouveau)
- src/routes/api.ts (modifier)"

# 3. Critères d'acceptation
backmark task add-criterion 42 "Recherche retourne résultats en <100ms"
backmark task add-criterion 42 "Supporte les filtres par type"

# 4. Démarrer
backmark task edit 42 --status "In Progress"

# 5. Implémenter avec notes
backmark task ai-note 42 "**10:00** - npm install fuse.js"
# ... coder ...
backmark task ai-note 42 "**10:30** - search.ts créé, threshold=0.3"
# ... coder ...
backmark task ai-note 42 "**11:00** - Endpoint fonctionnel, ~45ms"

# 6. Documenter
backmark task ai-doc 42 "## Search API
GET /api/search?q=<query>&limit=10

Response: { results: [], total: number }"

# 7. Review
backmark task ai-review 42 "## Review
### Complété
- [x] Fuse.js intégré
- [x] Endpoint créé
- [x] Performance OK (45ms)

### Tests
- 1000 items: 45ms ✓
- Filtres: OK ✓

### Limitations
- Pas de support multi-langue"

# 8. Fermer
backmark task check 42 0
backmark task check 42 1
backmark task close 42
```

### Ce qui est INTERDIT

- Coder SANS créer de tâche Backmark
- Coder SANS documenter un plan d'abord
- Terminer SANS faire d'auto-review
- Ignorer les commandes ai-plan, ai-note, ai-doc, ai-review
- Oublier de mettre à jour le statut de la tâche

### Ressources

- Documentation complète: https://www.backmark.tech/commands
- AI Workflow: https://www.backmark.tech/ai-workflow
- Commande slash `/backmark-guide` pour référence rapide
