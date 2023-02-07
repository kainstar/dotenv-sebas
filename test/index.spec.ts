import { describe, it, beforeAll, beforeEach, afterAll, expect, vi } from 'vitest';
import path from 'path';
import sebas from '../src';

const testEnvDir = path.join(__dirname, 'envs');

function isolateProcessEnv() {
  let processEnvBackup: NodeJS.ProcessEnv;

  // backup the original `process.env` object
  beforeAll(() => {
    processEnvBackup = process.env;
  });

  // setup the `process.env` copy
  beforeEach(() => {
    process.env = { ...processEnvBackup };
  });

  // restore the original `process.env` object
  afterAll(() => {
    process.env = processEnvBackup;
  });
}

describe('dotenv-sebas', () => {
  isolateProcessEnv();

  it('loads environment variables from `process.cwd()` into `process.env`', () => {
    expect(process.env).not.toHaveProperty('ENV_VAR');

    const spy = vi.spyOn(process, 'cwd').mockReturnValue(testEnvDir);
    sebas();
    spy.mockRestore();

    expect(process.env).toHaveProperty('ENV_VAR', 'ok');
  });

  it('loads environment variables from the given dir path into `process.env`', () => {
    expect(process.env).not.toHaveProperty('ENV_VAR');

    sebas({
      dir: testEnvDir,
    });

    expect(process.env).toHaveProperty('ENV_VAR', 'ok');
  });

  it('returns array of dotenv config parsed content', () => {
    const results = sebas({
      dir: testEnvDir,
    });

    expect(results).toHaveLength(2);

    results.forEach((result) => {
      expect(result).toHaveProperty('parsed');
    });
  });

  describe('when an environment variable is already defined', () => {
    // predefine the environment variable
    beforeEach(() => {
      process.env.ENV_VAR = 'predefined';
    });

    it("doesn't overwrite the predefined variable", () => {
      sebas({
        dir: testEnvDir,
      });

      expect(process.env).toHaveProperty('ENV_VAR', 'predefined');
    });

    it('overwrite the predefined variable when set `overrideProcessEnv` true', () => {
      sebas({
        dir: testEnvDir,
        overrideProcessEnv: true,
      });

      expect(process.env).toHaveProperty('ENV_VAR', 'ok');
    });
  });

  describe('when the `NODE_ENV` environment variable is present', () => {
    // setup the `NODE_ENV` environment variable
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('loads the default `.env` file', () => {
      expect(process.env).not.toHaveProperty('ENV_VAR');

      sebas({
        dir: testEnvDir,
      });

      expect(process.env).toHaveProperty('ENV_VAR', 'ok');
    });

    it('loads the `.env.local` file', () => {
      expect(process.env).not.toHaveProperty('LOCAL_ENV_VAR');

      sebas({
        dir: testEnvDir,
      });

      expect(process.env).toHaveProperty('LOCAL_ENV_VAR', 'ok');
    });

    it('loads the node_env-specific env file', () => {
      expect(process.env).not.toHaveProperty('DEVELOPMENT_ENV_VAR');

      sebas({
        dir: testEnvDir,
      });

      expect(process.env).toHaveProperty('DEVELOPMENT_ENV_VAR', 'ok');
    });

    it('loads the node_env-specific local env file', () => {
      expect(process.env).not.toHaveProperty('DEVELOPMENT_LOCAL_ENV_VAR');

      sebas({
        dir: testEnvDir,
      });

      expect(process.env).toHaveProperty('DEVELOPMENT_LOCAL_ENV_VAR', 'ok');
    });
  });

  describe('when the `env` option is given', () => {
    it('loads the default `.env` file', () => {
      expect(process.env).not.toHaveProperty('ENV_VAR');

      sebas({
        dir: testEnvDir,
        env: 'development',
      });

      expect(process.env).toHaveProperty('ENV_VAR', 'ok');
    });

    it('loads the `.env.local` file', () => {
      expect(process.env).not.toHaveProperty('LOCAL_ENV_VAR');

      sebas({
        dir: testEnvDir,
        env: 'development',
      });

      expect(process.env).toHaveProperty('LOCAL_ENV_VAR', 'ok');
    });

    it('loads the node_env-specific env file', () => {
      expect(process.env).not.toHaveProperty('DEVELOPMENT_ENV_VAR');

      sebas({
        dir: testEnvDir,
        env: 'development',
      });

      expect(process.env).toHaveProperty('DEVELOPMENT_ENV_VAR', 'ok');
    });

    it('loads the node_env-specific local env file', () => {
      expect(process.env).not.toHaveProperty('DEVELOPMENT_LOCAL_ENV_VAR');

      sebas({
        dir: testEnvDir,
        env: 'development',
      });

      expect(process.env).toHaveProperty('DEVELOPMENT_LOCAL_ENV_VAR', 'ok');
    });
  });
});
