---
id: 47
title: Initialiser le monorepo Git avec structure multi-apps
status: In Progress
priority: critical
assignees: []
labels:
  - setup
  - git
  - v1.0
subtasks: []
dependencies: []
blocked_by: []
created_date: '2025-12-09T20:38:41.300Z'
updated_date: '2025-12-09T20:44:17.238Z'
changelog:
  - timestamp: '2025-12-09T20:38:41.300Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:38:55.935Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:38:56.661Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:38:57.384Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:38:58.121Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:38:58.910Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-09T20:43:29.392Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2025-12-09T20:43:35.657Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-09T20:44:17.238Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Repository Git initialisé
    checked: false
  - text: 'Structure api/, cli/, web/ créée'
    checked: false
  - text: .gitignore configuré pour les 3 stacks
    checked: false
  - text: README.md principal avec vue d'ensemble
    checked: false
ai_plan: |-
  ## Plan d'implémentation

  ### Objectif
  Créer la structure monorepo pour héberger les 3 applications EnvMark.

  ### Étapes
  1. Initialiser Git dans le dossier envmark
  2. Créer la structure de dossiers
  3. Configurer .gitignore global
  4. Créer README.md principal
  5. Premier commit

  ### Structure finale
  ```
  envmark/
  ├── api/                    # Laravel 11 API
  │   ├── app/
  │   ├── config/
  │   ├── database/
  │   ├── routes/
  │   ├── composer.json
  │   └── .env.example
  ├── cli/                    # TypeScript CLI
  │   ├── src/
  │   ├── package.json
  │   └── tsconfig.json
  ├── web/                    # Landing page
  │   ├── src/
  │   └── package.json
  ├── docs/                   # Documentation partagée
  ├── .github/
  │   └── workflows/          # CI/CD
  ├── backlog/                # Backmark tasks
  ├── .gitignore
  ├── README.md
  └── CLAUDE.md
  ```

  ### Fichiers concernés
  - `.gitignore`
  - `README.md`
  - `api/.gitkeep`
  - `cli/.gitkeep`
  - `web/.gitkeep`

  ### Approche technique
  ```bash
  # Initialiser Git
  git init

  # Créer la structure
  mkdir -p api cli web docs .github/workflows

  # .gitignore global
  cat > .gitignore << 'EOF'
  # Dependencies
  node_modules/
  vendor/

  # Environment
  .env
  .env.local
  .envmark.key

  # Build
  dist/
  build/

  # IDE
  .idea/
  .vscode/
  *.swp

  # OS
  .DS_Store
  Thumbs.db

  # Logs
  *.log
  storage/logs/*

  # Cache
  .cache/
  storage/framework/cache/*
  EOF

  # Premier commit
  git add .
  git commit -m 'Initial monorepo structure'
  ```
ai_notes: >
  **2025-12-09T20:43:35.657Z** - **21:43** - Démarrage de l'initialisation du
  monorepo Git

  **2025-12-09T20:44:17.238Z** - **21:45** - Structure créée: api/, cli/, web/,
  docs/, .github/workflows/
---
Créer la structure monorepo pour les 3 applications: api/ (Laravel), cli/ (TypeScript), web/ (Landing page). Configurer Git, .gitignore global, et README principal. Cette tâche doit être faite AVANT toutes les autres.
