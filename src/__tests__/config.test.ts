import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import {
  createDefaultGlobalConfig,
  createDefaultLocalConfig,
  getEnvFilePath,
} from '../lib/config.js';

describe('Config Module', () => {
  describe('createDefaultGlobalConfig', () => {
    it('should create config with remote URL', () => {
      const config = createDefaultGlobalConfig('git@github.com:test/repo.git');

      expect(config.remote).toBe('git@github.com:test/repo.git');
      expect(config.defaultEnv).toBe('development');
      expect(config.encrypt).toBe(false);
    });

    it('should handle HTTPS URLs', () => {
      const config = createDefaultGlobalConfig('https://github.com/test/repo.git');

      expect(config.remote).toBe('https://github.com/test/repo.git');
    });
  });

  describe('createDefaultLocalConfig', () => {
    it('should create config with project name', () => {
      const config = createDefaultLocalConfig('my-project');

      expect(config.project).toBe('my-project');
    });

    it('should handle various project name formats', () => {
      expect(createDefaultLocalConfig('project_name').project).toBe('project_name');
      expect(createDefaultLocalConfig('project-name').project).toBe('project-name');
      expect(createDefaultLocalConfig('ProjectName').project).toBe('ProjectName');
    });
  });

  describe('getEnvFilePath', () => {
    it('should return path with project folder', () => {
      const path = getEnvFilePath('my-project');

      expect(path).toBe('my-project/.env');
    });

    it('should handle different project names', () => {
      expect(getEnvFilePath('api')).toBe('api/.env');
      expect(getEnvFilePath('web-frontend')).toBe('web-frontend/.env');
      expect(getEnvFilePath('backend_service')).toBe('backend_service/.env');
    });
  });

  describe('Config file structure', () => {
    const testDir = join(tmpdir(), 'envmark-test-' + Date.now());

    beforeEach(() => {
      if (!existsSync(testDir)) {
        mkdirSync(testDir, { recursive: true });
      }
    });

    afterEach(() => {
      if (existsSync(testDir)) {
        rmSync(testDir, { recursive: true, force: true });
      }
    });

    it('should serialize global config correctly', () => {
      const config = createDefaultGlobalConfig('git@github.com:test/repo.git');
      config.encrypt = true;

      const configPath = join(testDir, 'config.json');
      writeFileSync(configPath, JSON.stringify(config, null, 2));

      const loaded = JSON.parse(readFileSync(configPath, 'utf-8'));

      expect(loaded.remote).toBe('git@github.com:test/repo.git');
      expect(loaded.defaultEnv).toBe('development');
      expect(loaded.encrypt).toBe(true);
    });

    it('should serialize local config correctly', () => {
      const config = createDefaultLocalConfig('test-project');

      const configPath = join(testDir, '.envmark.json');
      writeFileSync(configPath, JSON.stringify(config, null, 2));

      const loaded = JSON.parse(readFileSync(configPath, 'utf-8'));

      expect(loaded.project).toBe('test-project');
    });
  });
});
