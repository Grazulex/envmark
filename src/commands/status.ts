import { Command } from 'commander';
import { existsSync } from 'fs';
import { join } from 'path';
import {
  globalConfigExists,
  localConfigExists,
  loadGlobalConfig,
  loadLocalConfig,
  getEnvFilePath,
} from '../lib/config.js';
import { GitManager } from '../lib/git.js';
import { colors, icons, header, info, warning, keyValue, blank, envBadge } from '../lib/ui.js';

export const statusCommand = new Command('status')
  .description('Show current EnvMark configuration and status')
  .action(async () => {
    try {
      await runStatus();
    } catch (err) {
      console.error(colors.error((err as Error).message));
      process.exit(1);
    }
  });

async function runStatus(): Promise<void> {
  header('EnvMark Status');
  blank();

  // Check global config
  const hasGlobal = globalConfigExists();
  const hasLocal = localConfigExists();

  console.log(colors.secondary.bold('Configuration'));
  blank();

  if (!hasGlobal) {
    warning('Global configuration not found');
    console.log(colors.muted(`  Run ${colors.primary('envmark init')} to set up EnvMark`));
    blank();
    return;
  }

  const globalConfig = loadGlobalConfig();

  // Global config info
  info('Global:');
  keyValue('Config file', join(GitManager.getEnvmarkDir(), 'config.json'));
  keyValue('Remote', globalConfig.remote);
  keyValue('Default env', globalConfig.defaultEnv || 'development');
  keyValue('Encryption', globalConfig.encrypt ? colors.success('enabled') : colors.muted('disabled'));
  blank();

  // Local config info
  if (hasLocal) {
    const localConfig = loadLocalConfig();
    info('Project:');
    keyValue('Config file', join(process.cwd(), '.envmark.json'));
    keyValue('Project name', localConfig.project);

    // Check local .env file
    const localEnvPath = join(process.cwd(), '.env');
    if (existsSync(localEnvPath)) {
      keyValue('Local .env', colors.success('exists'));
    } else {
      keyValue('Local .env', colors.warning('not found'));
    }
    blank();
  } else {
    warning('No project configuration in current directory');
    console.log(colors.muted(`  Run ${colors.primary('envmark init')} in your project directory`));
    blank();
  }

  // Repository status
  if (hasGlobal) {
    console.log(colors.secondary.bold('Repository'));
    blank();

    try {
      const git = new GitManager({ remote: globalConfig.remote, verbose: false });
      const repoPath = git.getLocalRepoPath();

      if (existsSync(join(repoPath, '.git'))) {
        keyValue('Local cache', repoPath);

        const branches = await git.listBranches();
        keyValue('Environments', branches.length.toString());

        if (branches.length > 0) {
          blank();
          info('Available environments:');
          for (const branch of branches) {
            const isProd = branch === 'main' || branch === 'master';
            const badge = isProd ? envBadge('production') : envBadge(branch);
            console.log(`  ${icons.bullet} ${badge}`);
          }
        }
      } else {
        keyValue('Local cache', colors.muted('not cloned yet'));
        console.log(colors.muted(`  Run any command to clone the repository`));
      }
    } catch {
      keyValue('Repository', colors.error('unreachable'));
    }
    blank();
  }

  // Quick commands
  console.log(colors.secondary.bold('Quick Commands'));
  blank();
  console.log(colors.muted(`  ${icons.arrow} ${colors.primary('envmark pull [env]')}  - Get .env from remote`));
  console.log(colors.muted(`  ${icons.arrow} ${colors.primary('envmark push [env]')}  - Save .env to remote`));
  console.log(colors.muted(`  ${icons.arrow} ${colors.primary('envmark list')}        - List environments`));
  console.log(colors.muted(`  ${icons.arrow} ${colors.primary('envmark diff e1 e2')}  - Compare environments`));
  blank();
}
