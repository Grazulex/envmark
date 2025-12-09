# EnvMark

> Gestion centralisée et sécurisée des fichiers `.env` pour équipes de développement.

## Architecture

Ce monorepo contient 3 applications :

| Dossier | Description | Stack |
|---------|-------------|-------|
| `api/` | API REST backend | Laravel 11, PostgreSQL |
| `cli/` | CLI pour les développeurs | TypeScript, Node.js |
| `web/` | Landing page | À définir |

## Principe Zero-Knowledge

Le serveur ne voit jamais les secrets en clair. Le chiffrement/déchiffrement se fait exclusivement côté client avec AES-256-GCM.

## Démarrage rapide

### Prérequis

- Docker & Docker Compose
- Node.js 20+ (pour le CLI)

### Développement local

```bash
# Cloner le repo
git clone git@github.com:Grazulex/envmark.git
cd envmark

# Démarrer l'environnement Docker (via Stackmark)
stackmark up

# Installer le CLI localement
cd cli && npm install && npm link
```

## Structure du projet

```
envmark/
├── api/                    # Laravel 11 API
├── cli/                    # TypeScript CLI
├── web/                    # Landing page
├── docs/                   # Documentation
├── backlog/                # Backmark tasks
├── .github/workflows/      # CI/CD
└── docker-compose.yml      # Orchestration Docker
```

## Documentation

- [Spécification complète](./envmark-spec.md)
- [Backlog des tâches](./backlog/)

## Licence

MIT
