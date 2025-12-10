#!/usr/bin/env node

import { Command } from 'commander';
import { colors } from './lib/ui.js';

// Import commands
import { initCommand } from './commands/init.js';
import { pushCommand } from './commands/push.js';
import { pullCommand } from './commands/pull.js';
import { createCommand } from './commands/create.js';
import { listCommand } from './commands/list.js';
import { statusCommand } from './commands/status.js';
import { diffCommand } from './commands/diff.js';
import { historyCommand } from './commands/history.js';
import { deleteCommand } from './commands/delete.js';
import { rollbackCommand } from './commands/rollback.js';

const program = new Command();

// Custom help formatting with colors
program.configureOutput({
  outputError: (str, write) => write(colors.error(str)),
});

program
  .name('envmark')
  .description(colors.muted('Manage .env files using Git as storage backend'))
  .version('1.0.0')
  .addHelpText('beforeAll', () => {
    console.log('');
    console.log(colors.primary.bold('  EnvMark') + colors.muted(' - Manage .env files with Git'));
    console.log(colors.muted('─'.repeat(50)));
    console.log('');
    return '';
  })
  .addHelpText('after', () => {
    console.log('');
    console.log(colors.muted('─'.repeat(50)));
    console.log(colors.muted('  Docs: ') + colors.info('https://envmark.tech'));
    console.log('');
    return '';
  });

// Register commands
program.addCommand(initCommand);
program.addCommand(pushCommand);
program.addCommand(pullCommand);
program.addCommand(createCommand);
program.addCommand(listCommand);
program.addCommand(statusCommand);
program.addCommand(diffCommand);
program.addCommand(historyCommand);
program.addCommand(deleteCommand);
program.addCommand(rollbackCommand);

program.parse();
