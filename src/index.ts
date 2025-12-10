#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { colors, icons, divider } from './lib/ui.js';

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

// Commands will be added here as subcommands
// - init
// - remote
// - push
// - pull
// - list
// - create
// - delete
// - diff
// - history
// - rollback
// - status
// - keygen

program.parse();
