---
id: 20
title: Améliorer commande list - lister les projets par environnement
status: Done
priority: high
assignees:
  - '@claude'
labels:
  - feature
  - cli
subtasks: []
dependencies: []
blocked_by: []
created_date: '2025-12-10T20:51:44.223Z'
updated_date: '2025-12-10T20:57:11.809Z'
closed_date: '2025-12-10T20:57:11.809Z'
changelog:
  - timestamp: '2025-12-10T20:51:44.223Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-10T20:51:58.061Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T20:51:58.816Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2025-12-10T20:54:46.960Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T20:54:47.670Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T20:54:55.869Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T20:57:11.809Z'
    action: updated
    details: 'status: In Progress → Done'
    user: user
acceptance_criteria: []
ai_plan: >-
  ## Plan d'implémentation


  ### Objectif

  Permettre de lister tous les projets présents dans un environnement donné via
  `envmark list <env>`.


  ### Comportement cible

  - `envmark list` → liste les environnements (comportement actuel)

  - `envmark list <env>` → liste les projets présents dans cet environnement


  ### Étapes

  1. Ajouter une méthode `listProjects(branch)` dans git.ts

  2. Modifier list.ts pour accepter un argument optionnel `[env]`

  3. Si env fourni: afficher les projets de cet environnement

  4. Sinon: afficher les environnements (comportement actuel)


  ### Fichiers concernés

  - src/lib/git.ts (nouvelle méthode)

  - src/commands/list.ts (modification)


  ### Approche technique

  La méthode listProjects va:

  1. Checkout la branche correspondante

  2. Lire les dossiers du repo (chaque dossier = 1 projet)

  3. Retourner la liste des noms de projets
ai_notes: >
  **2025-12-10T20:54:46.959Z** - **21:52** - Implémenté méthode listProjects()
  dans git.ts

  **21:53** - Modifié list.ts pour accepter argument optionnel [env]

  **21:54** - Build OK, tests manuels passés avec succès
ai_documentation: |-
  ## Documentation

  ### Utilisation
  - `envmark list` → Liste tous les environnements disponibles
  - `envmark list <env>` → Liste tous les projets dans l'environnement spécifié

  ### Exemples
  ```bash
  # Lister les environnements
  envmark list

  # Lister les projets dans dev
  envmark list dev

  # Lister les projets en production
  envmark list prod
  ```

  ### Sortie
  Pour les projets, affiche:
  - Nom du projet
  - Indicateur si le fichier .env existe (✓ .env) ou non (empty)
ai_review: |-
  ## Auto-Review

  ### Complété
  - [x] Méthode listProjects() ajoutée dans git.ts
  - [x] Commande list modifiée pour accepter [env]
  - [x] Build TypeScript OK
  - [x] Tests manuels validés (list, list dev, list prod)

  ### Tests effectués
  - `envmark list`: OK - affiche 2 environnements
  - `envmark list dev`: OK - affiche 4 projets avec statut .env
  - `envmark list prod`: OK - affiche message 'No projects found'
  - `envmark list --help`: OK - affiche nouvelle description

  ### Limitations connues
  - Aucune

  ### Questions pour le développeur
  - Aucune
---
Ajouter la possibilité de lister tous les projets présents dans le repo distant pour un environnement sélectionné
