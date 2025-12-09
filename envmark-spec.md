# EnvMark

> Gestion centralisée et sécurisée des fichiers `.env` pour équipes de développement.

---

## Le problème

Les fichiers `.env` sont au cœur de chaque projet, mais leur gestion reste artisanale :

- Partagés via Slack, email ou post-it (🔐 ?)
- Désynchronisés entre développeurs
- Aucun historique des modifications
- Pas de visibilité sur les différences entre environnements
- Onboarding cauchemardesque pour les nouveaux devs

## La solution

**EnvMark** centralise les fichiers `.env` de manière sécurisée avec :

- Chiffrement côté client (zero-knowledge)
- CLI simple et intuitif
- Dashboard web pour visualiser et comparer
- Historique complet des modifications
- Gestion des accès par projet et par équipe

---

## Architecture

### Approche retenue : SaaS avec chiffrement côté client

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   CLI/Client    │  HTTPS  │   API Laravel   │         │    Database     │
│                 │ ──────► │                 │ ──────► │                 │
│  • Clé AES-256  │         │  • Vérifie UUID │         │  • UUID projet  │
│  • Chiffrement  │         │  • Vérifie pwd  │         │  • Password hash│
│  • Mot de passe │         │  • Blob chiffré │         │  • Blobs .env   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

**Principe zero-knowledge** : le serveur ne voit jamais les secrets en clair. Le chiffrement/déchiffrement se fait exclusivement côté client avec la clé projet.

**Principe sans compte** : pas d'OAuth, pas d'email, pas de gestion d'utilisateurs. Un projet = un UUID + un mot de passe partagé en équipe.

### Pourquoi cette approche ?

| Critère | SaaS Cloud | Self-hosted | Git-based |
|---------|------------|-------------|-----------|
| Friction à l'adoption | ✅ Faible | ❌ Élevée | ⚠️ Moyenne |
| Monétisation | ✅ Simple | ⚠️ Complexe | ❌ Difficile |
| Sécurité perçue | ⚠️ (résolu par chiffrement client) | ✅ | ✅ |
| Collaboration | ✅ Native | ⚠️ | ⚠️ |
| Maintenance | ✅ Centralisée | ❌ Distribuée | ⚠️ |

---

## API REST

### Authentification

Authentification par **UUID projet + mot de passe chiffré** — sans compte utilisateur ni OAuth.

**Principe :**

1. À l'init, le CLI génère un UUID unique et une clé de chiffrement
2. L'utilisateur définit un mot de passe, chiffré localement avec la clé
3. Le mot de passe chiffré est envoyé au serveur avec l'UUID
4. Pour chaque requête, le CLI envoie l'UUID + mot de passe chiffré
5. Le serveur compare avec le hash stocké pour autoriser l'action

```
X-Project-UUID: proj_a1b2c3d4-e5f6-7890-abcd-ef1234567890
X-Project-Auth: encrypted_password_base64...
```

**Avantages :**

- Zéro friction (pas de compte à créer)
- Pas d'OAuth ni de token à gérer
- Le mot de passe peut être partagé en équipe comme la clé
- Modèle simple : 1 projet = 1 UUID = 1 mot de passe

### Endpoints

#### Initialisation projet

```
POST   /api/projects/register            # Enregistrer un nouveau projet
```

#### Environnements (.env)

```
GET    /api/projects/{uuid}/environments                    # Liste des environnements
POST   /api/projects/{uuid}/environments/{env}              # Push (upload .env chiffré)
GET    /api/projects/{uuid}/environments/{env}              # Pull (download dernière version)
GET    /api/projects/{uuid}/environments/{env}?version={n}  # Pull version spécifique
DELETE /api/projects/{uuid}/environments/{env}              # Supprimer un environnement
```

#### Historique et diff

```
GET    /api/projects/{uuid}/environments/{env}/history      # Historique des versions
GET    /api/projects/{uuid}/diff?from={env1}&to={env2}      # Comparer deux environnements
```

#### Administration projet

```
PUT    /api/projects/{uuid}/password                        # Changer le mot de passe
DELETE /api/projects/{uuid}                                 # Supprimer le projet
```

### Exemples de requêtes

**Enregistrement d'un nouveau projet :**

```bash
POST /api/projects/register
Content-Type: application/json

{
  "uuid": "proj_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "password_hash": "encrypted_password_base64...",
  "project_name": "mon-projet-laravel"
}
```

**Réponse :**

```json
{
  "success": true,
  "uuid": "proj_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2025-01-15T10:30:00Z"
}
```

**Push d'un fichier .env :**

```bash
POST /api/projects/proj_a1b2c3d4.../environments/production
X-Project-Auth: encrypted_password_base64...
Content-Type: application/json

{
  "encrypted_content": "base64_encoded_encrypted_blob...",
  "checksum": "sha256_hash",
  "comment": "Ajout de la clé Stripe"
}
```

**Réponse :**

```json
{
  "success": true,
  "version": 14,
  "environment": "production",
  "created_at": "2025-01-15T10:30:00Z"
}
```

**Pull d'un fichier .env :**

```bash
GET /api/projects/proj_a1b2c3d4.../environments/production
X-Project-Auth: encrypted_password_base64...
```

**Réponse :**

```json
{
  "environment": "production",
  "version": 14,
  "encrypted_content": "base64_encoded_encrypted_blob...",
  "checksum": "sha256_hash",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

---

## Schéma de base de données

```sql
-- Projets (authentification par UUID + mot de passe)
CREATE TABLE projects (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(50) UNIQUE NOT NULL,         -- proj_a1b2c3d4-e5f6-7890-...
    name VARCHAR(255),                        -- Nom optionnel du projet
    password_hash VARCHAR(255) NOT NULL,      -- Mot de passe chiffré (bcrypt)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Fichiers .env (versionnés)
CREATE TABLE env_files (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    environment VARCHAR(100) NOT NULL,        -- production, staging, local, etc.
    version INT NOT NULL DEFAULT 1,
    encrypted_content TEXT NOT NULL,          -- Blob chiffré AES-256-GCM
    checksum VARCHAR(64) NOT NULL,            -- SHA-256 pour vérification
    comment VARCHAR(500),                     -- Note optionnelle
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, environment, version)
);

-- Index pour performances
CREATE INDEX idx_projects_uuid ON projects(uuid);
CREATE INDEX idx_env_files_project_env ON env_files(project_id, environment);
CREATE INDEX idx_env_files_latest ON env_files(project_id, environment, version DESC);

-- Audit log (optionnel, pour traçabilité)
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,             -- push, pull, delete, password_change
    environment VARCHAR(100),
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Notes :**

- Pas de table `users` — l'authentification est par projet
- Le `password_hash` stocke le mot de passe hashé avec bcrypt (pas le chiffré reçu)
- L'UUID est le seul identifiant externe du projet
- Audit logs simplifié (pas de user_id)

---

## CLI

### Installation

```bash
# Via Composer (projets PHP/Laravel)
composer require envmark/cli --dev

# Via NPM (projets Node)
npm install -g @envmark/cli

# Via Homebrew (macOS)
brew install envmark

# Binaire standalone
curl -fsSL https://envmark.tech/install.sh | bash
```

### Configuration initiale

```bash
# Initialiser un nouveau projet
envmark init

# → Génère un UUID unique
# → Génère la clé de chiffrement AES-256
# → Demande un mot de passe + confirmation
# → Chiffre le mot de passe et l'envoie au serveur
# → Crée .envmark.json et .envmark.key
```

**Exemple d'exécution :**

```
$ envmark init

🔐 Initialisation d'un nouveau projet EnvMark

Nom du projet (optionnel): mon-projet-laravel

Définissez un mot de passe pour ce projet.
Ce mot de passe sera partagé avec votre équipe.

Mot de passe: ********
Confirmer: ********

✅ Projet créé avec succès !

   UUID: proj_a1b2c3d4-e5f6-7890-abcd-ef1234567890

📁 Fichiers créés :
   .envmark.json  → À versionner dans Git
   .envmark.key   → À ajouter dans .gitignore (CONFIDENTIEL)

⚠️  Partagez la clé (.envmark.key) et le mot de passe 
   avec votre équipe via un canal sécurisé.
```

**Fichier `.envmark.json` (versionné dans Git) :**

```json
{
  "uuid": "proj_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "mon-projet-laravel",
  "default_environment": "local",
  "api_url": "https://api.envmark.tech"
}
```

**Fichier `.envmark.key` (dans .gitignore) :**

```
ek_a1b2c3d4e5f6...  # Clé AES-256 pour chiffrement
```

### Rejoindre un projet existant

Pour un nouveau développeur qui rejoint le projet :

```bash
# 1. Clone le repo (récupère .envmark.json)
git clone git@github.com:acme/project.git
cd project

# 2. Récupère la clé de chiffrement (via canal sécurisé)
echo "ek_a1b2c3..." > .envmark.key

# 3. Pull l'environnement local
envmark pull local
# → Demande le mot de passe du projet
# → Télécharge et déchiffre le .env
```

### Gestion du mot de passe en session

Pour éviter de retaper le mot de passe à chaque commande :

```bash
# Le mot de passe est mis en cache pour 30 minutes
envmark pull local
Password: ********
# → .env téléchargé

envmark push local
# → Pas de mot de passe demandé (cache actif)

# Après 30 minutes d'inactivité
envmark pull staging
Password: ********
# → Mot de passe redemandé
```

**Implémentation technique du cache :**

- Stockage dans un fichier temporaire chiffré : `~/.envmark/session`
- Contient : `{ "password_encrypted": "...", "expires_at": "timestamp" }`
- Supprimé automatiquement après 30 min d'inactivité
- Commande `envmark logout` pour forcer la suppression

### Commandes principales

```bash
# Push le .env actuel vers un environnement
envmark push [environment]
envmark push production
envmark push staging --comment "Ajout clé Stripe"

# Pull un .env depuis le serveur
envmark pull [environment]
envmark pull production
envmark pull staging --version 5    # Version spécifique

# Lister les environnements disponibles
envmark list

# Comparer deux environnements
envmark diff production staging

# Voir l'historique d'un environnement
envmark history production

# Rollback à une version précédente
envmark rollback production --version 12

# Changer le mot de passe du projet
envmark passwd

# Effacer le cache de session
envmark logout

# Afficher la configuration actuelle
envmark status
```

### Exemple de workflow complet

```bash
# === Développeur principal (init) ===

cd mon-projet
envmark init
# → Crée le projet, définit mot de passe

envmark push local --comment "Config initiale"
# → Upload le .env local

# Partage avec l'équipe :
# - .envmark.key via 1Password
# - Mot de passe via Slack DM

# === Nouveau développeur ===

git clone git@github.com:acme/mon-projet.git
cd mon-projet

# Récupère la clé (depuis 1Password)
echo "ek_a1b2c3..." > .envmark.key

envmark pull local
# Password: ******** (reçu via Slack)
# → .env créé avec les bonnes valeurs

# Travaille, modifie le .env...

envmark push local --comment "Ajout config Redis"
# → Mot de passe en cache, pas redemandé
```

---

## Chiffrement

### Algorithme

- **AES-256-GCM** (Authenticated Encryption)
- Clé de 256 bits générée aléatoirement par projet
- IV unique pour chaque push
- Tag d'authentification pour détecter toute altération

### Flux de chiffrement (push)

```
.env (clair)
    │
    ▼
┌─────────────────────────────┐
│  Lecture du fichier .env    │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Génération IV aléatoire    │
│  (12 bytes)                 │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Chiffrement AES-256-GCM    │
│  avec clé projet            │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Concaténation :            │
│  IV + ciphertext + tag      │
└─────────────────────────────┘
    │
    ▼
┌─────────────────────────────┐
│  Encodage Base64            │
└─────────────────────────────┘
    │
    ▼
Envoi vers API (blob chiffré)
```

### Partage de la clé et du mot de passe

Pour collaborer sur un projet, deux éléments doivent être partagés de manière sécurisée :

1. **La clé de chiffrement** (`.envmark.key`)
2. **Le mot de passe du projet**

**Méthodes de partage recommandées :**

| Méthode | Clé | Mot de passe | Sécurité |
|---------|-----|--------------|----------|
| **1Password / Bitwarden** | ✅ | ✅ | ⭐⭐⭐ |
| **Slack DM** | ⚠️ | ✅ | ⭐⭐ |
| **Message éphémère** | ✅ | ✅ | ⭐⭐ |
| **En personne** | ✅ | ✅ | ⭐⭐⭐ |

> ⚠️ La clé et le mot de passe ne doivent **jamais** être versionnés dans Git.

---

## Dashboard Web (optionnel)

Le dashboard web est **optionnel** — EnvMark fonctionne entièrement via CLI. Cependant, un dashboard peut être utile pour :

### Fonctionnalités

- **Vue projet** : liste des environnements avec dernière modification
- **Comparateur** : diff visuel entre environnements (clés présentes/absentes)
- **Historique** : timeline des modifications avec timestamps
- **Paramètres** : changer le mot de passe, supprimer le projet

> Note : Le dashboard nécessite l'UUID + mot de passe pour accéder au projet (même auth que le CLI).

### Capture d'écran (wireframe)

```
┌─────────────────────────────────────────────────────────────────┐
│  EnvMark                                         [Se déconnecter]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📁 mon-projet-laravel                                         │
│  UUID: proj_a1b2c3d4-e5f6-7890-abcd-ef1234567890               │
│                                                                 │
│  ┌─────────────┬─────────────┬─────────────┬─────────────┐     │
│  │ production  │ staging     │ local       │ + Ajouter   │     │
│  │ v14         │ v8          │ v23         │             │     │
│  │ il y a 2h   │ il y a 1j   │ il y a 5min │             │     │
│  └─────────────┴─────────────┴─────────────┴─────────────┘     │
│                                                                 │
│  [Comparer]  [Historique]  [Paramètres]                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Accès au dashboard

```
https://envmark.tech/project/{uuid}
→ Demande le mot de passe
→ Session de 30 min (comme le CLI)
```

---

## Webhooks (optionnel, v1.1+)

### Événements disponibles

| Événement | Déclencheur |
|-----------|-------------|
| `env.pushed` | Nouveau push d'un .env |
| `env.deleted` | Suppression d'un environnement |

### Payload exemple

```json
{
  "event": "env.pushed",
  "project_uuid": "proj_a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "project_name": "mon-projet-laravel",
  "environment": "production",
  "version": 14,
  "comment": "Ajout de la clé Stripe",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Intégrations suggérées

- **Slack** : notification dans un channel dédié
- **Discord** : idem

---

## Stack technique

### Backend

- **Framework** : Laravel 11+
- **Base de données** : PostgreSQL (ou SQLite pour MVP)
- **Cache** : Redis (optionnel)
- **Queue** : Laravel Horizon pour webhooks asynchrones

### CLI

- **Langage** : Go ou PHP (Phar)
- **Distribution** : binaire statique multi-plateforme

### Frontend (Dashboard)

- **Framework** : Livewire ou Inertia.js + Vue/React
- **UI** : Tailwind CSS

---

## Modèle économique

### Plans tarifaires (par projet)

| Plan | Prix | Limites |
|------|------|---------|
| **Free** | 0€ | 2 environnements, 10 versions d'historique |
| **Pro** | 3€/mois/projet | Environnements illimités, historique complet, webhooks |
| **Lifetime** | 29€ one-time | Comme Pro, pour toujours |

**Simplicité** : pas de compte utilisateur = pas de gestion de "sièges". Le prix est par projet, peu importe combien de devs l'utilisent.

### Métriques clés

- Nombre de projets actifs
- Conversion Free → Pro
- Taux de rétention mensuel

---

## Roadmap

### v1.0 (MVP)

- [ ] API REST core (register/push/pull/list)
- [ ] CLI avec init, push, pull
- [ ] Authentification UUID + mot de passe
- [ ] Chiffrement AES-256-GCM côté client
- [ ] Cache de session (30 min)
- [ ] Versioning des fichiers

### v1.1

- [ ] Diff entre environnements (CLI + API)
- [ ] Historique et rollback
- [ ] Dashboard web minimal
- [ ] Webhooks Slack/Discord

### v1.2

- [ ] Intégration CI/CD (GitHub Actions, GitLab CI)
- [ ] Audit logs consultables
- [ ] Commande `envmark validate` (lint du .env)

### v2.0

- [ ] Self-hosted option (image Docker)
- [ ] Plugin IDE (VS Code, PhpStorm)
- [ ] Import/export projets

---

## Concurrents et alternatives

| Solution | Type | Chiffrement | Collaboration | Prix |
|----------|------|-------------|---------------|------|
| **Doppler** | SaaS | Serveur | ✅ | $$$$ |
| **Vault (HashiCorp)** | Self-hosted | ✅ | ⚠️ | Complexe |
| **git-crypt** | Git-based | ✅ | ⚠️ | Gratuit |
| **dotenv-vault** | SaaS | Client | ✅ | $$ |
| **EnvMark** | SaaS | Client (zero-knowledge) | ✅ | $ |

### Positionnement

EnvMark se positionne comme une alternative **simple et abordable** à Doppler, avec un focus sur :

- La **sécurité** (chiffrement côté client)
- La **simplicité** (CLI intuitif, onboarding rapide)
- Le **prix** (accessible aux indés et petites équipes)

---

## Pour aller plus loin

- [ ] Landing page sur envmark.tech
- [ ] Documentation développeur
- [ ] Article de lancement (Dev.to, Laravel News)
- [ ] Vidéo démo YouTube

---

*Document généré le 9 janvier 2025*
