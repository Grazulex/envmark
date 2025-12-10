#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('envmark')
  .description('Manage .env files using Git as storage backend')
  .version('0.1.0');

// Commands will be added here
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
