---
id: 7
title: Implementer la commande 'envmark push'
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
created_date: '2025-12-10T00:56:19.084Z'
updated_date: '2025-12-10T01:18:51.681Z'
closed_date: '2025-12-10T01:18:51.681Z'
changelog:
  - timestamp: '2025-12-10T00:56:19.084Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-10T01:16:27.057Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2025-12-10T01:16:36.869Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:17:41.357Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:18:35.759Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:18:44.336Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:18:51.681Z'
    action: updated
    details: 'status: In Progress → Done'
    user: user
acceptance_criteria: []
ai_plan: >-
  ## Plan d'implementation


  ### Objectif

  Implementer la commande 'envmark push' qui envoie le fichier .env local vers
  le repo Git.


  ### Etapes

  1. Creer src/commands/push.ts

  2. Charger la config (global + local)

  3. Verifier que .env existe localement

  4. Checkout la branche correspondant a l'environnement

  5. Copier le .env dans le dossier projet du repo

  6. Commit et push avec message descriptif

  7. Afficher confirmation


  ### Fichiers concernes

  - src/commands/push.ts (nouveau)

  - src/index.ts (ajouter la commande)


  ### Approche technique

  - Utiliser GitManager pour les operations Git

  - Utiliser ora pour le spinner pendant le push

  - Message de commit automatique avec timestamp
ai_notes: >
  **2025-12-10T01:17:41.357Z** - **02:30** - Cree push.ts et pull.ts avec
  spinners, verification des changements, confirmation interactive.
ai_documentation: |-
  ## Documentation

  ### Commande: envmark push

  Envoie le fichier .env local vers le repository Git.

  ### Usage
  ```bash
  envmark push           # Push vers l'env par defaut
  envmark push dev       # Push vers development
  envmark push prod      # Push vers main (production)
  envmark push -m "msg"  # Message de commit personnalise
  envmark push -f        # Force push meme sans changements
  ```

  ### Options
  - `-m, --message <msg>` : Message de commit personnalise
  - `-f, --force` : Force push meme si aucun changement detecte

  ### Comportement
  1. Charge la config (global + local)
  2. Verifie que .env existe localement
  3. Checkout la branche de l'environnement
  4. Compare avec le contenu actuel du repo
  5. Commit et push si changements detectes
ai_review: |-
  ## Auto-Review

  ### Complete
  - [x] Commande push avec argument env optionnel
  - [x] Verification .env local existe
  - [x] Checkout branche environnement
  - [x] Detection des changements (skip si identique)
  - [x] Commit avec message auto ou custom
  - [x] Options -m (message) et -f (force)
  - [x] Spinner ora pendant les operations
  - [x] Build OK

  ### Tests effectues
  - npm run build: OK
  - npm run dev -- --help: push visible

  ### Limitations connues
  - Pas de support chiffrement (tache #4)

  ### Questions pour le developpeur
  - Aucune
---
Push le .env local vers le repo. Checkout branche env, copie dans dossier projet, commit, push. Syntax: envmark push [env]
