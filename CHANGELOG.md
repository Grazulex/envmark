# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0](https://github.com/Grazulex/envmark/releases/tag/v1.2.0) (2025-12-10)

### Features

- **crypto:** add AES-256-GCM encryption support ([8bb1a45](https://github.com/Grazulex/envmark/commit/8bb1a45e1803fa0b59b5b9e7aacb56ce4ad90d87))

### Documentation

- add logo to README header ([6b19be3](https://github.com/Grazulex/envmark/commit/6b19be3af22455d941fd8f5eca8ced29cc281e83))
- add README and logo generation prompt ([2677ba9](https://github.com/Grazulex/envmark/commit/2677ba9e1ea04be800b67784d2d42fba8ecd8c52))

### Chores

- rename package to @grazulex/envmark for npm publish ([761661e](https://github.com/Grazulex/envmark/commit/761661e954a4e63c3c488d79dbc22648357c3e22))
## [1.1.0](https://github.com/Grazulex/envmark/releases/tag/v1.1.0) (2025-12-10)

### Features

- **cli:** implement all remaining CLI commands ([13b6a67](https://github.com/Grazulex/envmark/commit/13b6a675019a7ba18beda18e20969b6b7274296f))
- **cli:** enhance init with branch creation + add create command ([a295e7c](https://github.com/Grazulex/envmark/commit/a295e7cac31a9fa09b1d5b8ac4a44f8f506cc584))
- **cli:** add push and pull commands ([d047f1d](https://github.com/Grazulex/envmark/commit/d047f1d449a16f7fa1d83a08d77050e699edaf7d))
- **cli:** add init command for configuration setup ([05ab503](https://github.com/Grazulex/envmark/commit/05ab5039efb6c972f6c0aeeb20522fcea23fa144))
- **lib:** add Config module with global/local separation ([2c92483](https://github.com/Grazulex/envmark/commit/2c924831b2beac52d6af5470215cbc06461e759e))
- **lib:** add Git manager module for repository operations ([bc464ee](https://github.com/Grazulex/envmark/commit/bc464ee44a025a3fbcaa2b072f1df07b35b112a4))
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
