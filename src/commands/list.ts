import { Command } from 'commander';
import ora from 'ora';
import { loadGlobalConfig, globalConfigExists } from '../lib/config.js';
import { GitManager, branchToEnvName, resolveEnvAlias } from '../lib/git.js';
import { colors, icons, header, error, info, blank, envBadge } from '../lib/ui.js';

export const listCommand = new Command('list')
  .alias('ls')
  .argument('[env]', 'Environment to list projects from')
  .description('List all environments, or projects in a specific environment')
  .option('-v, --verbose', 'Show more details')
  .action(async (env, options) => {
    try {
      if (env) {
        await runListProjects(env, options);
      } else {
        await runList(options);
      }
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

async function runListProjects(env: string, options: ListOptions): Promise<void> {
  if (!globalConfigExists()) {
    throw new Error('EnvMark not configured. Run "envmark init" first.');
  }

  const config = loadGlobalConfig();
  const branch = resolveEnvAlias(env);

  header(`Projects in ${env}`);
  blank();

  const spinner = ora(`Fetching projects from ${branch}...`).start();

  try {
    const git = new GitManager({ remote: config.remote, verbose: false });
    await git.ensureRepo();

    // Check if branch exists
    if (!(await git.branchExists(env))) {
      spinner.fail(`Environment '${env}' does not exist`);
      blank();
      console.log(colors.muted(`Available environments: ${colors.primary('envmark list')}`));
      blank();
      return;
    }

    const projects = await git.listProjects(env);
    spinner.stop();

    if (projects.length === 0) {
      info(`No projects found in ${branch}`);
      blank();
      console.log(colors.muted(`Push your first project with: ${colors.primary(`envmark push ${env}`)}`));
      blank();
      return;
    }

    console.log(colors.muted(`  Remote: ${config.remote}`));
    console.log(colors.muted(`  Branch: ${branch}`));
    blank();

    for (const project of projects) {
      let line = `  ${icons.bullet} `;
      line += colors.primary(project.name);

      if (project.hasEnv) {
        line += colors.success(' ✓ .env');
      } else {
        line += colors.muted(' (empty)');
      }

      console.log(line);
    }

    blank();
    console.log(colors.muted(`  ${projects.length} project(s)`));
    blank();

  } catch (err) {
    spinner.fail('Failed to list projects');
    throw err;
  }
}
