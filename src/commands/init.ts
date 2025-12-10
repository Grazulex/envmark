import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import { basename } from 'path';
import {
  globalConfigExists,
  localConfigExists,
  saveGlobalConfig,
  saveLocalConfig,
  createDefaultGlobalConfig,
  createDefaultLocalConfig,
  loadGlobalConfig,
} from '../lib/config.js';
import { GitManager } from '../lib/git.js';
import { colors, icons, header, success, error, info, keyValue, divider, blank } from '../lib/ui.js';

export const initCommand = new Command('init')
  .description('Initialize EnvMark configuration')
  .option('-g, --global', 'Initialize global configuration only')
  .option('-l, --local', 'Initialize local project configuration only')
  .option('-r, --remote <url>', 'Git remote URL for secrets repository')
  .option('-p, --project <name>', 'Project name')
  .action(async (options) => {
    try {
      await runInit(options);
    } catch (err) {
      error((err as Error).message);
      process.exit(1);
    }
  });

interface InitOptions {
  global?: boolean;
  local?: boolean;
  remote?: string;
  project?: string;
}

async function runInit(options: InitOptions): Promise<void> {
  header('EnvMark Initialization');
  blank();

  const hasGlobalConfig = globalConfigExists();
  const hasLocalConfig = localConfigExists();

  // Determine what to initialize
  let initGlobal = options.global || false;
  let initLocal = options.local || false;

  // If neither specified, determine based on current state
  if (!initGlobal && !initLocal) {
    if (!hasGlobalConfig) {
      initGlobal = true;
    }
    if (!hasLocalConfig) {
      initLocal = true;
    }
    // If both exist, ask user
    if (hasGlobalConfig && hasLocalConfig) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'EnvMark is already configured. What do you want to do?',
          choices: [
            { name: 'Reconfigure global settings', value: 'global' },
            { name: 'Reconfigure this project', value: 'local' },
            { name: 'Reconfigure both', value: 'both' },
            { name: 'Cancel', value: 'cancel' },
          ],
        },
      ]);

      if (action === 'cancel') {
        info('Initialization cancelled.');
        return;
      }
      initGlobal = action === 'global' || action === 'both';
      initLocal = action === 'local' || action === 'both';
    }
  }

  // Initialize global config
  if (initGlobal) {
    await initGlobalConfig(options.remote, hasGlobalConfig);
  }

  // Initialize local config
  if (initLocal) {
    await initLocalConfig(options.project, hasLocalConfig);
  }

  // Show summary
  blank();
  divider();
  success('EnvMark initialized successfully!');
  blank();

  if (initGlobal || hasGlobalConfig) {
    try {
      const globalConfig = loadGlobalConfig();
      info('Global configuration:');
      keyValue('Remote', globalConfig.remote);
      keyValue('Default env', globalConfig.defaultEnv || 'development');
      keyValue('Encryption', globalConfig.encrypt ? 'enabled' : 'disabled');
    } catch {
      // Ignore if can't load
    }
  }

  if (initLocal || hasLocalConfig) {
    try {
      const { loadLocalConfig } = await import('../lib/config.js');
      const localConfig = loadLocalConfig();
      blank();
      info('Project configuration:');
      keyValue('Project', localConfig.project);
    } catch {
      // Ignore if can't load
    }
  }

  blank();
  console.log(colors.muted('Next steps:'));
  console.log(colors.muted(`  ${icons.arrow} Run ${colors.primary('envmark pull dev')} to get your .env file`));
  console.log(colors.muted(`  ${icons.arrow} Run ${colors.primary('envmark push dev')} to save changes`));
  blank();
}

async function initGlobalConfig(remoteArg?: string, exists?: boolean): Promise<void> {
  console.log(colors.secondary.bold('Global Configuration'));
  blank();

  if (exists) {
    info('Updating existing global configuration...');
  } else {
    info('Setting up EnvMark for the first time...');
  }
  blank();

  // Get remote URL
  let remote = remoteArg;
  if (!remote) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'remote',
        message: 'Git remote URL for secrets repository:',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Remote URL is required';
          }
          // Basic validation
          if (!input.includes('git@') && !input.startsWith('https://')) {
            return 'Please enter a valid Git URL (SSH or HTTPS)';
          }
          return true;
        },
      },
    ]);
    remote = answers.remote;
  }

  // Test connection to repo
  const spinner = ora('Testing connection to repository...').start();
  let gitManager: GitManager;
  let existingBranches: string[] = [];

  try {
    gitManager = new GitManager({ remote: remote!, verbose: false });
    await gitManager.ensureRepo();
    spinner.text = 'Checking existing environments...';
    existingBranches = await gitManager.listBranches();
    spinner.succeed(`Repository accessible (${existingBranches.length} environment(s) found)`);
  } catch (err) {
    spinner.fail('Failed to access repository');
    throw new Error(`Cannot access repository: ${(err as Error).message}`);
  }

  // If repo is empty or has only main, offer to create base branches
  if (existingBranches.length <= 1) {
    blank();
    info('This repository needs environment branches.');

    const { createBranches } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'createBranches',
        message: 'Select environments to create:',
        choices: [
          { name: 'development', checked: true },
          { name: 'staging', checked: true },
          { name: 'qa', checked: false },
        ].filter(choice => !existingBranches.includes(choice.name)),
      },
    ]);

    if (createBranches.length > 0) {
      const branchSpinner = ora('Creating environment branches...').start();
      try {
        for (const branch of createBranches) {
          branchSpinner.text = `Creating ${branch}...`;
          await gitManager.createBranch(branch, 'main');
        }
        branchSpinner.succeed(`Created ${createBranches.length} environment(s): ${createBranches.join(', ')}`);
        existingBranches = await gitManager.listBranches();
      } catch (err) {
        branchSpinner.fail('Failed to create branches');
        throw err;
      }
    }
    blank();
  }

  // Ask for additional options
  const envChoices = existingBranches.length > 0
    ? existingBranches.map(b => b === 'main' ? 'production' : b)
    : ['development', 'staging', 'production'];

  const { defaultEnv, encrypt } = await inquirer.prompt([
    {
      type: 'list',
      name: 'defaultEnv',
      message: 'Default environment:',
      choices: envChoices,
      default: envChoices.includes('development') ? 'development' : envChoices[0],
    },
    {
      type: 'confirm',
      name: 'encrypt',
      message: 'Enable encryption for .env files?',
      default: false,
    },
  ]);

  // Save config
  const config = createDefaultGlobalConfig(remote!);
  config.defaultEnv = defaultEnv;
  config.encrypt = encrypt;

  saveGlobalConfig(config);
  success('Global configuration saved');
  blank();
}

async function initLocalConfig(projectArg?: string, exists?: boolean): Promise<void> {
  console.log(colors.secondary.bold('Project Configuration'));
  blank();

  if (exists) {
    info('Updating existing project configuration...');
  } else {
    info('Setting up this project...');
  }
  blank();

  // Suggest project name from directory
  const suggestedName = basename(process.cwd())
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-');

  // Get project name
  let project = projectArg;
  if (!project) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'project',
        message: 'Project name:',
        default: suggestedName,
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Project name is required';
          }
          if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
            return 'Project name can only contain letters, numbers, hyphens and underscores';
          }
          return true;
        },
      },
    ]);
    project = answers.project;
  }

  // Save config
  const config = createDefaultLocalConfig(project!);
  saveLocalConfig(config);
  success('Project configuration saved');
  blank();
}
