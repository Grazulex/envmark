import { Command } from 'commander';
import ora from 'ora';
import { loadGlobalConfig, globalConfigExists } from '../lib/config.js';
import { GitManager, branchToEnvName } from '../lib/git.js';
import { colors, icons, header, error, info, blank, envBadge } from '../lib/ui.js';

export const listCommand = new Command('list')
  .alias('ls')
  .description('List all environments')
  .option('-v, --verbose', 'Show more details')
  .action(async (options) => {
    try {
      await runList(options);
    } catch (err) {
      error((err as Error).message);
      process.exit(1);
    }
  });

interface ListOptions {
  verbose?: boolean;
}

async function runList(options: ListOptions): Promise<void> {
  if (!globalConfigExists()) {
    throw new Error('EnvMark not configured. Run "envmark init" first.');
  }

  header('Environments');
  blank();

  const config = loadGlobalConfig();

  const spinner = ora('Fetching environments...').start();

  try {
    const git = new GitManager({ remote: config.remote, verbose: false });
    await git.ensureRepo();

    const branches = await git.listBranches();
    spinner.stop();

    if (branches.length === 0) {
      info('No environments found');
      blank();
      console.log(colors.muted(`Create one with: ${colors.primary('envmark create <name>')}`));
      blank();
      return;
    }

    // Sort branches: main first, then alphabetically
    const sorted = branches.sort((a, b) => {
      if (a === 'main' || a === 'master') return -1;
      if (b === 'main' || b === 'master') return 1;
      return a.localeCompare(b);
    });

    console.log(colors.muted(`  Remote: ${config.remote}`));
    blank();

    for (const branch of sorted) {
      const envName = branchToEnvName(branch);
      const isDefault = envName === config.defaultEnv || branch === config.defaultEnv;
      const isProd = branch === 'main' || branch === 'master';

      let line = `  ${icons.bullet} `;

      if (isProd) {
        line += envBadge('production');
        line += colors.muted(` (branch: ${branch})`);
      } else {
        line += envBadge(branch);
        if (branch !== envName) {
          line += colors.muted(` → ${envName}`);
        }
      }

      if (isDefault) {
        line += colors.warning(' ★ default');
      }

      console.log(line);
    }

    blank();
    console.log(colors.muted(`  ${sorted.length} environment(s)`));
    blank();

  } catch (err) {
    spinner.fail('Failed to list environments');
    throw err;
  }
}
