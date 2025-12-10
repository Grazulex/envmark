# EnvMark

**Manage .env files with Git** - A simple, secure way to share environment variables across your team.

[![Version](https://img.shields.io/badge/version-1.1.0-10B981.svg)](https://github.com/Grazulex/envmark)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Why EnvMark?

- **No server required** - Uses Git as storage backend
- **Team-friendly** - Share .env files securely via your own Git repository
- **Environment isolation** - Each environment (dev, staging, prod) is a separate branch
- **Multi-project** - One repository for all your projects
- **Version history** - Track changes, diff environments, rollback anytime
- **Zero configuration** - Works with any Git hosting (GitHub, GitLab, Bitbucket)

## Installation

```bash
npm install -g envmark
```

## Quick Start

### 1. Initialize EnvMark

```bash
# Set up global configuration with your secrets repository
envmark init -r git@github.com:your-org/env-secrets.git

# This creates:
# - ~/.envmark/config.json (global config)
# - .envmark.json (project config)
```

### 2. Push your .env

```bash
# Push to development environment
envmark push dev

# Push to staging
envmark push staging

# Push to production
envmark push prod
```

### 3. Pull .env on another machine

```bash
# Clone a project and pull its .env
git clone your-project
cd your-project
envmark init
envmark pull dev
```

## Commands

| Command | Description |
|---------|-------------|
| `envmark init` | Initialize EnvMark configuration |
| `envmark push [env]` | Push local .env to an environment |
| `envmark pull [env]` | Pull .env from an environment |
| `envmark list` | List all environments |
| `envmark status` | Show current configuration |
| `envmark diff <env1> <env2>` | Compare .env between environments |
| `envmark history [env]` | Show version history |
| `envmark rollback [env]` | Rollback to a previous version |
| `envmark create <env>` | Create a new environment |
| `envmark delete <env>` | Delete an environment |

## How It Works

EnvMark uses a simple but powerful architecture:

```
Your Secrets Repository
├── main (production)
│   ├── project-a/.env
│   ├── project-b/.env
│   └── project-c/.env
├── staging
│   ├── project-a/.env
│   ├── project-b/.env
│   └── project-c/.env
└── development
    ├── project-a/.env
    ├── project-b/.env
    └── project-c/.env
```

- **Branches = Environments** - `main` is production, other branches are dev/staging/etc.
- **Folders = Projects** - Each project has its own folder in each branch
- **Git = Version Control** - Full history, diffs, and rollback capabilities

## Configuration

### Global Config (`~/.envmark/config.json`)

```json
{
  "remote": "git@github.com:your-org/env-secrets.git",
  "defaultEnv": "development",
  "encrypt": false
}
```

### Project Config (`.envmark.json`)

```json
{
  "project": "my-project"
}
```

## Environment Aliases

For convenience, EnvMark supports environment aliases:

| Alias | Branch |
|-------|--------|
| `dev` | `development` |
| `prod` | `main` |
| `production` | `main` |

```bash
# These are equivalent:
envmark pull dev
envmark pull development

envmark push prod
envmark push main
```

## Security

- **Your repository, your control** - EnvMark never touches external servers
- **Git access controls** - Use SSH keys or tokens to control who can access secrets
- **Local caching** - Repository is cached in `~/.envmark/repos/` for performance
- **Encryption** (coming soon) - Optional AES-256-GCM encryption for .env files

## Best Practices

1. **Use a private repository** - Never store secrets in a public repo
2. **Limit access** - Only give repository access to team members who need it
3. **Use deploy keys** - For CI/CD, use read-only deploy keys
4. **Review diffs** - Use `envmark diff` before pulling to see what changed
5. **Don't commit `.envmark.json`** - Add it to `.gitignore` if it contains sensitive project names

## Part of the Mark Suite

EnvMark is part of a suite of developer tools:

- [**Backmark**](https://backmark.tech) - AI-powered backlog management
- [**Stackmark**](https://stackmark.tech) - Docker environment management
- [**Shipmark**](https://shipmark.tech) - Release automation

## License

MIT License - See [LICENSE](LICENSE) for details.

---

Made with love by [Grazulex](https://github.com/Grazulex)
