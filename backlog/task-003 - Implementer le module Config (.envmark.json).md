---
id: 3
title: Implementer le module Config (.envmark.json)
status: Done
priority: critical
assignees: []
labels:
  - lib
  - config
  - core
subtasks: []
dependencies: []
blocked_by: []
created_date: '2025-12-10T00:56:03.874Z'
updated_date: '2025-12-10T01:11:57.227Z'
closed_date: '2025-12-10T01:11:57.227Z'
changelog:
  - timestamp: '2025-12-10T00:56:03.874Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-10T01:09:38.600Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2025-12-10T01:09:46.775Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:10:30.576Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:11:22.661Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:11:44.319Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:11:52.688Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:11:57.227Z'
    action: updated
    details: 'status: In Progress → Done'
    user: user
acceptance_criteria: []
ai_plan: |-
  ## Plan d'implementation

  ### Objectif
  Creer le module de gestion de la configuration locale (.envmark.json).

  ### Etapes
  1. Definir l'interface EnvMarkConfig
  2. Creer les fonctions loadConfig() et saveConfig()
  3. Creer la fonction initConfig() pour initialisation interactive
  4. Gerer la validation du schema
  5. Gerer les erreurs (fichier manquant, JSON invalide)

  ### Fichiers concernes
  - src/lib/config.ts (nouveau)

  ### Approche technique
  - Interface TypeScript pour la config
  - Lecture/ecriture JSON synchrone
  - Validation des champs obligatoires (remote, project)
ai_notes: >
  **2025-12-10T01:10:30.575Z** - **02:18** - Cree src/lib/config.ts avec
  interface EnvMarkConfig, validation, load/save.

  **2025-12-10T01:11:22.660Z** - **02:20** - Corrige: config globale dans
  ~/.envmark/config.json (remote, encrypt), config locale dans .envmark.json
  (project).
ai_documentation: |-
  ## Documentation

  ### Module: src/lib/config.ts

  ### Architecture de configuration

  **Config globale** (`~/.envmark/config.json`):
  ```json
  {
    "remote": "git@github.com:team/secrets.git",
    "defaultEnv": "development",
    "encrypt": false,
    "envAliases": { "dev": "development" }
  }
  ```

  **Config locale** (`.envmark.json` dans chaque projet):
  ```json
  {
    "project": "my-project-name"
  }
  ```

  ### Fonctions exportees

  - `loadGlobalConfig()` - Charge ~/.envmark/config.json
  - `saveGlobalConfig(config)` - Sauvegarde config globale
  - `loadLocalConfig(dir)` - Charge .envmark.json
  - `saveLocalConfig(config, dir)` - Sauvegarde config locale
  - `loadConfig(dir)` - Merge global + local
  - `globalConfigExists()` / `localConfigExists(dir)`
  - `loadKey()` / `saveKey(key)` - Gestion cle de chiffrement

  ### Fichiers

  - `~/.envmark/config.json` - Config globale
  - `~/.envmark/.envmark.key` - Cle de chiffrement
  - `.envmark.json` - Config locale par projet
ai_review: |-
  ## Auto-Review

  ### Complete
  - [x] Interface GlobalConfig (remote, defaultEnv, encrypt, envAliases)
  - [x] Interface LocalConfig (project, defaultEnv override, encrypt override)
  - [x] Interface EnvMarkConfig (merged)
  - [x] Validation des configs (required fields, format Git URL)
  - [x] loadGlobalConfig / saveGlobalConfig
  - [x] loadLocalConfig / saveLocalConfig
  - [x] loadConfig (merge global + local)
  - [x] Gestion cle encryption (loadKey, saveKey)
  - [x] Build OK

  ### Tests effectues
  - npm run build: OK

  ### Limitations connues
  - Aucune

  ### Questions pour le developpeur
  - Aucune
---
Creer src/lib/config.ts pour lire/ecrire .envmark.json (remote, project, defaultEnv, encrypt). Validation du schema.
