# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-12-10

### Breaking Changes

- **Complete architecture rewrite**: Migrated from Laravel API + PostgreSQL to pure TypeScript CLI
- No more server required - EnvMark is now 100% local
- New storage model using Git as backend

### Added

- **Git-based storage**: Use any Git repository to store your .env files
  - Branches = environments (development, staging, production)
  - Folders = projects (one repo for all your projects)
- **Colored CLI**: Beautiful terminal output with branded colors
- **New commands** (coming soon):
  - `envmark init` - Initialize project configuration
  - `envmark push [env]` - Push .env to Git repo
  - `envmark pull [env]` - Pull .env from Git repo
  - `envmark list` - List available environments
  - `envmark diff <env1> <env2>` - Compare environments
  - `envmark history [env]` - View version history
  - `envmark rollback [env] <commit>` - Restore previous version

### Removed

- Laravel API backend
- PostgreSQL database
- Docker configuration for server
- All server-side authentication

### Technical

- TypeScript + Node.js CLI
- Uses `simple-git` for Git operations
- Uses `commander` for CLI parsing
- Colored output with `chalk`
