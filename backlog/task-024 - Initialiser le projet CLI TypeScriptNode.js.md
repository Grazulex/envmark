---
id: 24
title: Initialiser le projet CLI TypeScript/Node.js
status: To Do
priority: critical
assignees: []
labels:
  - cli
  - setup
  - v1.0
subtasks: []
dependencies:
  - 47
blocked_by:
  - 25
  - 36
created_date: '2025-12-09T20:16:55.714Z'
updated_date: '2025-12-09T20:29:16.646Z'
changelog:
  - timestamp: '2025-12-09T20:16:55.714Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:29:13.544Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:14.317Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:15.089Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:15.846Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:16.646Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Projet TypeScript initialisé avec tsconfig.json
    checked: false
  - text: Commander.js configuré pour les commandes CLI
    checked: false
  - text: Build avec esbuild fonctionnel
    checked: false
  - text: Commande envmark --version fonctionne
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Initialiser le projet CLI EnvMark en TypeScript avec Commander.js.

  ### Étapes
  1. Créer le répertoire et initialiser npm
  2. Installer dépendances: commander, chalk, ora, inquirer
  3. Configurer TypeScript (tsconfig.json)
  4. Configurer esbuild pour le build
  5. Créer la structure de fichiers
  6. Implémenter le point d'entrée avec Commander

  ### Fichiers concernés
  - `package.json`
  - `tsconfig.json`
  - `esbuild.config.js`
  - `src/index.ts`
  - `src/commands/`
  - `src/lib/`
  - `src/utils/`

  ### Approche technique
  ```bash
  mkdir envmark-cli && cd envmark-cli
  npm init -y
  npm install commander chalk ora inquirer axios
  npm install -D typescript @types/node esbuild vitest
  ```

  ```typescript
  // src/index.ts
  import { Command } from 'commander';
  import { version } from '../package.json';

  const program = new Command();

  program
    .name('envmark')
    .description('Secure .env file management for teams')
    .version(version);

  // Import and register commands
  import './commands/init';
  import './commands/push';
  import './commands/pull';
  // ...

  program.parse();
  ```
---
Créer le projet CLI en TypeScript avec Commander.js. Structure: src/commands/, src/lib/, src/utils/. Configurer package.json, tsconfig.json, esbuild pour build. Distribution via npm (@envmark/cli) et binaire standalone avec pkg.
