import { Command } from 'commander';
import ora from 'ora';
import { loadConfig, getEnvFilePath } from '../lib/config.js';
import { GitManager, resolveEnvAlias } from '../lib/git.js';
import { colors, icons, header, error, info, warning, keyValue, blank, envBadge, divider } from '../lib/ui.js';

export const historyCommand = new Command('history')
  .description('Show version history of .env file')
  .argument('[env]', 'Environment to show history for')
  .option('-n, --limit <number>', 'Number of entries to show', '10')
  .action(async (env, options) => {
    try {
      await runHistory(env, options);
    } catch (err) {
      error((err as Error).message);
      process.exit(1);
    }
  });

interface HistoryOptions {
  limit: string;
}

async function runHistory(envArg: string | undefined, options: HistoryOptions): Promise<void> {
  const config = loadConfig();
  const env = envArg || config.defaultEnv;
  const branch = resolveEnvAlias(env);
  const limit = parseInt(options.limit, 10) || 10;

  header(`History: ${envBadge(env)}`);
  blank();

  info('Configuration:');
  keyValue('Project', config.project);
  keyValue('Environment', `${env} (branch: ${branch})`);
  blank();

  const spinner = ora('Fetching history...').start();

  try {
    const git = new GitManager({ remote: config.remote, verbose: false });
    await git.ensureRepo();

    // Check if branch exists
    const exists = await git.branchExists(env);
    if (!exists) {
      spinner.fail(`Environment '${env}' does not exist`);
      blank();
      const branches = await git.listBranches();
      if (branches.length > 0) {
        console.log(colors.muted('Available environments:'));
        branches.forEach(b => console.log(colors.muted(`  ${icons.bullet} ${b}`)));
        blank();
      }
      return;
    }

    // Checkout and get history
    await git.checkout(env);
    const envFilePath = getEnvFilePath(config.project);
    const history = await git.getFileHistory(envFilePath, limit);

    spinner.stop();

    if (history.length === 0) {
      warning(`No history found for project '${config.project}' in ${env}`);
      blank();
      console.log(colors.muted('This could mean:'));
      console.log(colors.muted(`  ${icons.bullet} No .env has been pushed yet`));
      console.log(colors.muted(`  ${icons.bullet} The project name is incorrect`));
      blank();
      return;
    }

    divider();
    blank();

    console.log(colors.muted(`Showing ${history.length} most recent version(s):`));
    blank();

    for (let i = 0; i < history.length; i++) {
      const entry = history[i];
      const isLatest = i === 0;

      // Format date
      const date = new Date(entry.date);
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      // Version line
      let versionLine = `  ${colors.primary(entry.hash)}`;
      if (isLatest) {
        versionLine += colors.success(' (latest)');
      }
      console.log(versionLine);

      // Details
      console.log(colors.muted(`    ${icons.bullet} ${dateStr} ${timeStr}`));
      console.log(colors.muted(`    ${icons.bullet} ${entry.author}`));
      console.log(colors.muted(`    ${icons.bullet} ${entry.message}`));
      blank();
    }

    divider();
    console.log(colors.muted('Rollback to a version:'));
    console.log(colors.muted(`  ${icons.arrow} ${colors.primary(`envmark rollback ${env} --version <hash>`)}`));
    blank();

  } catch (err) {
    spinner.fail('Failed to get history');
    throw err;
  }
}
