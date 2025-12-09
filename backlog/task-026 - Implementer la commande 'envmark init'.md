---
id: 26
title: Implémenter la commande 'envmark init'
status: To Do
priority: critical
assignees: []
labels:
  - cli
  - command
  - v1.0
subtasks: []
dependencies:
  - 21
  - 22
  - 25
blocked_by:
  - 39
created_date: '2025-12-09T20:17:19.472Z'
updated_date: '2025-12-09T20:29:43.830Z'
changelog:
  - timestamp: '2025-12-09T20:17:19.472Z'
    action: created
    details: Task created
    user: system
  - timestamp: '2025-12-09T20:29:33.107Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:33.881Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:34.648Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:35.428Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:36.195Z'
    action: modified
    details: Task updated
    user: user
  - timestamp: '2025-12-09T20:29:43.830Z'
    action: modified
    details: Task updated
    user: AI
acceptance_criteria:
  - text: Commande interactive avec prompts
    checked: false
  - text: Génère UUID au format proj_*
    checked: false
  - text: Génère clé AES-256 au format ek_*
    checked: false
  - text: Crée .envmark.json et .envmark.key
    checked: false
  - text: Appelle API /register avec succès
    checked: false
ai_plan: "## Plan d'implémentation\n\n### Objectif\nCréer la commande `envmark init` pour initialiser un nouveau projet.\n\n### Étapes\n1. Créer `src/commands/init.ts`\n2. Implémenter les prompts interactifs (inquirer)\n3. Générer UUID et clé de chiffrement\n4. Appeler l'API register\n5. Créer les fichiers de config\n6. Afficher les instructions\n\n### Fichiers concernés\n- `src/commands/init.ts`\n\n### Approche technique\n```typescript\nimport { Command } from 'commander';\nimport inquirer from 'inquirer';\nimport { v4 as uuidv4 } from 'uuid';\nimport { generateKey } from '../lib/crypto';\nimport { ApiClient } from '../lib/api';\nimport { saveConfig, saveKey } from '../lib/config';\nimport chalk from 'chalk';\n\nexport const initCommand = new Command('init')\n  .description('Initialize a new EnvMark project')\n  .action(async () => {\n    console.log(chalk.blue('\U0001F510 Initializing new EnvMark project\\n'));\n    \n    const answers = await inquirer.prompt([\n      { type: 'input', name: 'name', message: 'Project name (optional):' },\n      { type: 'password', name: 'password', message: 'Password:', mask: '*' },\n      { type: 'password', name: 'confirm', message: 'Confirm password:', mask: '*' },\n    ]);\n    \n    if (answers.password !== answers.confirm) {\n      console.error(chalk.red('Passwords do not match'));\n      process.exit(1);\n    }\n    \n    const uuid = 'proj_' + uuidv4();\n    const key = generateKey();\n    \n    await ApiClient.register(uuid, answers.password, answers.name);\n    \n    saveConfig({ uuid, name: answers.name, default_environment: 'local' });\n    saveKey(key);\n    \n    console.log(chalk.green('\\n✅ Project created!'));\n    console.log(`   UUID: ${uuid}`);\n    console.log(chalk.yellow('\\n⚠️  Share .envmark.key securely with your team'));\n  });\n```"
---
Commande interactive pour initialiser un nouveau projet. Étapes: demander nom projet (optionnel), générer UUID (proj_*), générer clé AES-256, demander mot de passe + confirmation, appeler API register, créer .envmark.json et .envmark.key, afficher instructions.
