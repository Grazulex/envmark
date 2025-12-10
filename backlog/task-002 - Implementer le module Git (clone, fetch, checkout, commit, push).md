---
id: 2
title: 'Implementer le module Git (clone, fetch, checkout, commit, push)'
status: Done
priority: critical
assignees: []
labels:
  - lib
  - git
  - core
subtasks: []
dependencies: []
blocked_by: []
created_date: '2025-12-10T00:56:03.126Z'
updated_date: '2025-12-10T01:09:23.962Z'
closed_date: '2025-12-10T01:09:23.962Z'
changelog:
  - timestamp: '2025-12-10T00:56:03.126Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-10T01:06:43.322Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2025-12-10T01:06:55.306Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:07:51.505Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:08:56.193Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:09:10.194Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:09:18.072Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T01:09:23.962Z'
    action: updated
    details: 'status: In Progress → Done'
    user: user
acceptance_criteria: []
ai_plan: >-
  ## Plan d'implementation


  ### Objectif

  Creer le module Git qui gere toutes les operations avec le repo distant de
  stockage des .env.


  ### Etapes

  1. Creer src/lib/git.ts avec la classe GitManager

  2. Implementer getRepoPath() - chemin du cache local (~/.envmark/repo)

  3. Implementer ensureRepo() - clone ou fetch le repo distant

  4. Implementer checkout() - changer de branche (environnement)

  5. Implementer listBranches() - lister les environnements disponibles

  6. Implementer commitAndPush() - commit un fichier et push

  7. Implementer getFileContent() - lire un fichier d'une branche

  8. Implementer getFileHistory() - git log sur un fichier

  9. Implementer createBranch() - creer un nouvel environnement

  10. Implementer deleteBranch() - supprimer un environnement


  ### Fichiers concernes

  - src/lib/git.ts (nouveau)


  ### Approche technique

  - Utiliser simple-git pour toutes les operations Git

  - Cache local dans ~/.envmark/repo (clone une seule fois, puis fetch)

  - Gestion des erreurs avec messages clairs

  - Support des alias d'environnement (dev -> development, prod -> main)
ai_notes: >
  **2025-12-10T01:07:51.505Z** - **02:12** - Cree src/lib/git.ts avec GitManager
  complet. Fonctions: ensureRepo, checkout, listBranches, readFile,
  writeFileAndPush, getFileHistory, createBranch, deleteBranch, getDiff.

  **2025-12-10T01:08:56.193Z** - **02:15** - Build OK apres correction des types
  simple-git (import nomme, cast unknown).
ai_documentation: |-
  ## Documentation

  ### Module: src/lib/git.ts

  ### Classes et fonctions exportees

  #### `resolveEnvAlias(env: string): string`
  Resout les alias d'environnement (dev -> development, prod -> main).

  #### `branchToEnvName(branch: string): string`
  Convertit un nom de branche en nom d'environnement lisible.

  #### `class GitManager`
  Gestionnaire principal des operations Git.

  **Constructor:**
  ```typescript
  new GitManager({ remote: string, verbose?: boolean })
  ```

  **Methodes principales:**
  - `ensureRepo()` - Clone ou fetch le repo distant
  - `listBranches()` - Liste les environnements disponibles
  - `checkout(env)` - Change d'environnement
  - `getCurrentBranch()` - Retourne la branche actuelle
  - `readFile(path)` - Lit un fichier du repo
  - `writeFileAndPush(path, content, message)` - Ecrit et push
  - `getFileHistory(path, limit)` - Historique git log
  - `getFileAtCommit(path, hash)` - Contenu a un commit
  - `createBranch(name, base)` - Cree un environnement
  - `deleteBranch(name)` - Supprime un environnement
  - `getDiff(path, env1, env2)` - Diff entre envs
  - `branchExists(name)` - Verifie si env existe

  ### Cache local
  Les repos sont caches dans `~/.envmark/repos/<hash>/`
ai_review: |-
  ## Auto-Review

  ### Complete
  - [x] GitManager class avec toutes les operations Git
  - [x] Clone/fetch avec cache local ~/.envmark/repos/
  - [x] Checkout branches avec alias (dev/prod)
  - [x] Read/write fichiers avec commit+push
  - [x] Historique et rollback (getFileHistory, getFileAtCommit)
  - [x] Creation/suppression de branches
  - [x] Diff entre environnements
  - [x] Build TypeScript OK

  ### Tests effectues
  - npm run build: OK

  ### Limitations connues
  - Pas de gestion des conflits Git (merge conflicts)
  - Pas de support SSH key auth specifique (utilise config git globale)

  ### Questions pour le developpeur
  - Aucune
---
Creer src/lib/git.ts avec les fonctions: cloneOrFetch (cache local ~/.envmark/repo), checkout branche, commit fichier, push. Utiliser simple-git.
