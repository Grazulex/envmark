import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';
import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { colors, icons } from './ui.js';

// Environment aliases mapping
const ENV_ALIASES: Record<string, string> = {
  dev: 'development',
  prod: 'main',
  production: 'main',
};

// Resolve environment alias to actual branch name
export function resolveEnvAlias(env: string): string {
  return ENV_ALIASES[env.toLowerCase()] || env;
}

// Reverse lookup: branch name to common env name
export function branchToEnvName(branch: string): string {
  if (branch === 'main' || branch === 'master') return 'production';
  if (branch === 'development') return 'dev';
  return branch;
}

export interface GitManagerOptions {
  remote: string;
  verbose?: boolean;
}

export class GitManager {
  private remote: string;
  private repoPath: string;
  private git: SimpleGit | null = null;
  private verbose: boolean;

  constructor(options: GitManagerOptions) {
    this.remote = options.remote;
    this.verbose = options.verbose || false;
    this.repoPath = this.getRepoPath();
  }

  /**
   * Get the local cache path for the repo
   * ~/.envmark/repo/<hash of remote url>
   */
  private getRepoPath(): string {
    const envmarkDir = join(homedir(), '.envmark');
    const repoHash = Buffer.from(this.remote).toString('base64').replace(/[/+=]/g, '_').slice(0, 20);
    return join(envmarkDir, 'repos', repoHash);
  }

  /**
   * Get the .envmark directory path
   */
  static getEnvmarkDir(): string {
    return join(homedir(), '.envmark');
  }

  /**
   * Ensure the .envmark directory exists
   */
  private ensureEnvmarkDir(): void {
    const envmarkDir = GitManager.getEnvmarkDir();
    if (!existsSync(envmarkDir)) {
      mkdirSync(envmarkDir, { recursive: true });
    }
    const reposDir = join(envmarkDir, 'repos');
    if (!existsSync(reposDir)) {
      mkdirSync(reposDir, { recursive: true });
    }
  }

  /**
   * Initialize or get the git instance
   */
  private async getGit(): Promise<SimpleGit> {
    if (this.git) {
      return this.git;
    }

    await this.ensureRepo();

    const options: Partial<SimpleGitOptions> = {
      baseDir: this.repoPath,
      binary: 'git',
      maxConcurrentProcesses: 1,
    };

    this.git = simpleGit(options) as SimpleGit;
    return this.git!
  }

  /**
   * Clone the repo if it doesn't exist, or fetch if it does
   */
  async ensureRepo(): Promise<void> {
    this.ensureEnvmarkDir();

    if (existsSync(join(this.repoPath, '.git'))) {
      // Repo exists, fetch latest
      if (this.verbose) {
        console.log(colors.muted(`  ${icons.sync} Fetching latest from remote...`));
      }
      const git = simpleGit(this.repoPath);
      await git.fetch(['--all', '--prune']);
    } else {
      // Clone the repo
      if (this.verbose) {
        console.log(colors.muted(`  ${icons.git} Cloning repository...`));
      }
      mkdirSync(this.repoPath, { recursive: true });
      const git = simpleGit();
      await git.clone(this.remote, this.repoPath);
    }
  }

  /**
   * List all remote branches (environments)
   */
  async listBranches(): Promise<string[]> {
    const git = await this.getGit();
    const branches = await git.branch(['-r']);

    return branches.all
      .map(b => b.replace('origin/', ''))
      .filter(b => b !== 'HEAD' && !b.includes('->'));
  }

  /**
   * Checkout a branch (environment)
   */
  async checkout(env: string): Promise<void> {
    const git = await this.getGit();
    const branch = resolveEnvAlias(env);

    // Check if branch exists locally
    const localBranches = await git.branchLocal();

    if (localBranches.all.includes(branch)) {
      await git.checkout(branch);
      await git.pull('origin', branch);
    } else {
      // Try to checkout from remote
      try {
        await git.checkout(['-b', branch, `origin/${branch}`]);
      } catch (error) {
        throw new Error(`Environment '${env}' (branch: ${branch}) does not exist`);
      }
    }
  }

  /**
   * Get current branch name
   */
  async getCurrentBranch(): Promise<string> {
    const git = await this.getGit();
    const status = await git.status();
    return status.current || 'unknown';
  }

  /**
   * Read a file from the current branch
   */
  async readFile(filePath: string): Promise<string | null> {
    const fullPath = join(this.repoPath, filePath);
    if (existsSync(fullPath)) {
      return readFileSync(fullPath, 'utf-8');
    }
    return null;
  }

  /**
   * Write a file and commit + push
   */
  async writeFileAndPush(
    filePath: string,
    content: string,
    commitMessage: string
  ): Promise<void> {
    const git = await this.getGit();
    const fullPath = join(this.repoPath, filePath);

    // Ensure directory exists
    const dir = join(this.repoPath, filePath.split('/').slice(0, -1).join('/'));
    if (dir !== this.repoPath && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // Write file
    writeFileSync(fullPath, content, 'utf-8');

    // Git add, commit, push
    await git.add(filePath);
    await git.commit(commitMessage);
    await git.push('origin', await this.getCurrentBranch());
  }

  /**
   * Delete a file and commit + push
   */
  async deleteFileAndPush(filePath: string, commitMessage: string): Promise<void> {
    const git = await this.getGit();
    const fullPath = join(this.repoPath, filePath);

    if (existsSync(fullPath)) {
      unlinkSync(fullPath);
      await git.add(filePath);
      await git.commit(commitMessage);
      await git.push('origin', await this.getCurrentBranch());
    }
  }

  /**
   * Get file history (git log)
   */
  async getFileHistory(
    filePath: string,
    limit = 10
  ): Promise<Array<{ hash: string; date: string; message: string; author: string }>> {
    const git = await this.getGit();

    try {
      const log = await git.log({
        file: filePath,
        maxCount: limit,
        format: {
          hash: '%h',
          date: '%ci',
          message: '%s',
          author: '%an',
        },
      });

      return log.all.map(entry => ({
        hash: entry.hash,
        date: entry.date,
        message: entry.message,
        author: (entry as unknown as Record<string, string>).author || 'Unknown',
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get file content at a specific commit
   */
  async getFileAtCommit(filePath: string, commitHash: string): Promise<string | null> {
    const git = await this.getGit();

    try {
      const content = await git.show([`${commitHash}:${filePath}`]);
      return content;
    } catch {
      return null;
    }
  }

  /**
   * Create a new branch (environment)
   */
  async createBranch(branchName: string, baseBranch = 'main'): Promise<void> {
    const git = await this.getGit();
    const resolvedBase = resolveEnvAlias(baseBranch);

    // Checkout base branch first
    await this.checkout(resolvedBase);

    // Create and push new branch
    await git.checkoutBranch(branchName, resolvedBase);
    await git.push('origin', branchName, ['--set-upstream']);
  }

  /**
   * Delete a branch (environment)
   */
  async deleteBranch(branchName: string): Promise<void> {
    const git = await this.getGit();
    const branch = resolveEnvAlias(branchName);

    // Don't allow deleting main/master
    if (branch === 'main' || branch === 'master') {
      throw new Error('Cannot delete the main/master branch');
    }

    // Switch to main first
    await this.checkout('main');

    // Delete local and remote
    try {
      await git.deleteLocalBranch(branch, true);
    } catch {
      // Branch might not exist locally, continue
    }
    await git.push('origin', `:${branch}`);
  }

  /**
   * Get diff between two branches for a specific file
   */
  async getDiff(filePath: string, branch1: string, branch2: string): Promise<string> {
    const git = await this.getGit();
    const b1 = resolveEnvAlias(branch1);
    const b2 = resolveEnvAlias(branch2);

    try {
      const diff = await git.diff([`origin/${b1}`, `origin/${b2}`, '--', filePath]);
      return diff;
    } catch {
      return '';
    }
  }

  /**
   * Check if a branch exists
   */
  async branchExists(branchName: string): Promise<boolean> {
    const branches = await this.listBranches();
    const branch = resolveEnvAlias(branchName);
    return branches.includes(branch);
  }

  /**
   * Get the repo path (for debugging/info)
   */
  getLocalRepoPath(): string {
    return this.repoPath;
  }
}
