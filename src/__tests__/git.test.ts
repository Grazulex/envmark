import { describe, it, expect } from 'vitest';
import { resolveEnvAlias, branchToEnvName } from '../lib/git.js';

describe('Git Module', () => {
  describe('resolveEnvAlias', () => {
    it('should resolve "dev" to "development"', () => {
      expect(resolveEnvAlias('dev')).toBe('development');
    });

    it('should resolve "prod" to "main"', () => {
      expect(resolveEnvAlias('prod')).toBe('main');
    });

    it('should resolve "production" to "main"', () => {
      expect(resolveEnvAlias('production')).toBe('main');
    });

    it('should be case insensitive', () => {
      expect(resolveEnvAlias('DEV')).toBe('development');
      expect(resolveEnvAlias('Dev')).toBe('development');
      expect(resolveEnvAlias('PROD')).toBe('main');
      expect(resolveEnvAlias('Production')).toBe('main');
    });

    it('should return original value for unknown aliases', () => {
      expect(resolveEnvAlias('staging')).toBe('staging');
      expect(resolveEnvAlias('qa')).toBe('qa');
      expect(resolveEnvAlias('test')).toBe('test');
      expect(resolveEnvAlias('custom-env')).toBe('custom-env');
    });

    it('should handle empty string', () => {
      expect(resolveEnvAlias('')).toBe('');
    });
  });

  describe('branchToEnvName', () => {
    it('should convert "main" to "production"', () => {
      expect(branchToEnvName('main')).toBe('production');
    });

    it('should convert "master" to "production"', () => {
      expect(branchToEnvName('master')).toBe('production');
    });

    it('should convert "development" to "dev"', () => {
      expect(branchToEnvName('development')).toBe('dev');
    });

    it('should return original value for other branches', () => {
      expect(branchToEnvName('staging')).toBe('staging');
      expect(branchToEnvName('qa')).toBe('qa');
      expect(branchToEnvName('feature-branch')).toBe('feature-branch');
    });
  });

  describe('alias round-trip', () => {
    it('should resolve and convert back consistently', () => {
      // dev -> development (resolve) -> dev (branchToEnv)
      const resolved = resolveEnvAlias('dev');
      expect(resolved).toBe('development');
      expect(branchToEnvName(resolved)).toBe('dev');
    });

    it('should handle production aliases', () => {
      const resolved = resolveEnvAlias('prod');
      expect(resolved).toBe('main');
      expect(branchToEnvName(resolved)).toBe('production');
    });
  });
});
