---
id: 19
title: Créer le site envmark.tech
status: Done
priority: high
assignees:
  - '@claude'
labels:
  - website
  - documentation
subtasks: []
dependencies: []
blocked_by: []
created_date: '2025-12-10T05:25:26.869Z'
updated_date: '2025-12-10T05:37:25.399Z'
closed_date: '2025-12-10T05:37:25.399Z'
changelog:
  - timestamp: '2025-12-10T05:25:26.869Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-10T05:26:39.817Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T05:26:48.282Z'
    action: updated
    details: 'status: To Do → In Progress'
    user: user
  - timestamp: '2025-12-10T05:36:34.852Z'
    action: modified
    details: Task updated
    user: AI
  - timestamp: '2025-12-10T05:37:25.399Z'
    action: updated
    details: 'status: In Progress → Done'
    user: user
acceptance_criteria: []
ai_plan: >-
  ## Plan d'implementation


  ### Objectif

  Créer le site web envmark.tech en suivant le même design que shipmark.tech,
  stackmark.tech et backmark.tech. Documentation complète des 11 commandes CLI
  en anglais.


  ### Etapes

  1. Créer le répertoire /home/jean-marc-strauven/Dev/envmark.tech

  2. Créer les fichiers de configuration (netlify.toml, robots.txt, sitemap.xml,
  site.webmanifest)

  3. Adapter les CSS (couleurs: vert/turquoise pour le thème environnement)

  4. Créer les pages HTML:
     - index.html (page d'accueil avec hero, features, demo terminal)
     - getting-started.html (quick start guide)
     - install.html (installation npm/yarn/pnpm)
     - features.html (liste des fonctionnalités)
     - commands.html (référence complète des 11 commandes)
     - configuration.html (fichiers de config)
     - security.html (chiffrement AES-256-GCM)
     - 404.html

  ### Commandes à documenter

  1. envmark init (options: -g, -l, -r, -p, -e, -y)

  2. envmark push [env] (options: -m, -f)

  3. envmark pull [env] (options: -f, -o)

  4. envmark create <env> (options: -b)

  5. envmark list/ls (options: -v)

  6. envmark status

  7. envmark diff <env1> <env2> (options: -k)

  8. envmark history [env] (options: -n)

  9. envmark delete/rm <target> (options: --env, --project-env, -f)

  10. envmark rollback [env] (options: -v, -n, --local, -f)

  11. envmark keygen (options: -s, -d, -f, -p)


  ### Fichiers concernés

  - /home/jean-marc-strauven/Dev/envmark.tech/ (nouveau répertoire)

  - index.html, getting-started.html, install.html, features.html,
  commands.html, configuration.html, security.html, 404.html

  - css/style.css, css/navigation.css

  - js/main.js, js/navigation.js

  - assets/ (logos depuis /home/jean-marc-strauven/Dev/envmark/assets/)


  ### Approche technique

  - Réutiliser la structure HTML/CSS de shipmark.tech comme base

  - Adapter les couleurs CSS pour le thème EnvMark (vert/turquoise pour
  environnement)

  - Documenter exhaustivement toutes les commandes avec exemples

  - Créer une page spéciale pour la sécurité/chiffrement
ai_review: >-
  ## Auto-Review


  ### Complete

  - [x] Structure du site identique à shipmark.tech

  - [x] 8 pages HTML créées (index, getting-started, install, features,
  commands, configuration, security, 404)

  - [x] CSS adapté avec thème vert (#10B981) pour EnvMark

  - [x] JS navigation et animations

  - [x] Documentation des 11 commandes CLI avec toutes les options

  - [x] Page sécurité/chiffrement AES-256-GCM

  - [x] Fichiers SEO (robots.txt, sitemap.xml, site.webmanifest)

  - [x] Favicons générés (16x16, 32x32, ico, apple-touch-icon)

  - [x] Image sociale pour Open Graph

  - [x] Configuration Netlify

  - [x] Git repo initialisé avec remote git@github.com:Grazulex/envmark.tech.git


  ### Tests effectués

  - Structure du fichier: OK (28 fichiers)

  - Logos intégrés: OK

  - Toutes les commandes documentées: OK (init, push, pull, create, list,
  status, diff, history, delete, rollback, keygen)


  ### Limitations connues

  - Pas de Google Analytics (ID à ajouter si nécessaire)

  - Les images social.png sont générées basiquement avec ImageMagick


  ### Questions pour le développeur

  - Voulez-vous un ID Google Analytics spécifique pour ce site?
---
Créer un site web marketing pour envmark.tech similaire aux sites backmark.tech, shipmark.tech et stackmark.tech. Le site doit documenter toutes les commandes CLI, options et fonctionnalités d'envmark en anglais.
