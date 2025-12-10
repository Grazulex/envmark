---
id: 8
title: Implementer la commande 'envmark pull'
status: Done
priority: critical
assignees: []
labels:
  - cli
  - command
  - core
subtasks: []
dependencies: []
blocked_by: []
created_date: '2025-12-10T00:56:19.863Z'
updated_date: '2025-12-10T01:19:21.725Z'
closed_date: '2025-12-10T01:19:21.725Z'
changelog:
  - timestamp: '2025-12-10T00:56:19.863Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-10T01:18:58.478Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2025-12-10T01:19:08.160Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:19:16.579Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:19:21.725Z'
    action: updated
    details: 'status: In Progress → Done'
    user: user
acceptance_criteria: []
ai_documentation: |-
  ## Documentation

  ### Commande: envmark pull

  Recupere le fichier .env depuis le repository Git.

  ### Usage
  ```bash
  envmark pull           # Pull depuis l'env par defaut
  envmark pull dev       # Pull depuis development
  envmark pull prod      # Pull depuis main (production)
  envmark pull -f        # Ecrase le .env local sans confirmation
  envmark pull -o .env.backup  # Sauvegarde vers un autre fichier
  ```

  ### Options
  - `-f, --force` : Ecrase le fichier local sans confirmation
  - `-o, --output <path>` : Sauvegarde vers un chemin different

  ### Comportement
  1. Charge la config (global + local)
  2. Checkout la branche de l'environnement
  3. Lit le .env du dossier projet dans le repo
  4. Si .env local existe, demande confirmation
  5. Ecrit le contenu vers .env (ou chemin custom)
ai_review: |-
  ## Auto-Review

  ### Complete
  - [x] Commande pull avec argument env optionnel
  - [x] Checkout branche environnement
  - [x] Lecture .env depuis le repo
  - [x] Confirmation interactive si .env local existe
  - [x] Affichage simple du diff (nombre de lignes)
  - [x] Options -f (force) et -o (output)
  - [x] Liste les envs disponibles si branche inexistante
  - [x] Spinner ora pendant les operations
  - [x] Build OK

  ### Tests effectues
  - npm run build: OK
  - npm run dev -- --help: pull visible

  ### Limitations connues
  - Pas de support chiffrement (tache #4)

  ### Questions pour le developpeur
  - Aucune
---
Pull le .env depuis le repo vers local. Checkout branche env, copie fichier projet vers .env local. Syntax: envmark pull [env]
