import fs from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

interface ListDotenvFilesOptions {
  env?: string;
}

/**
 * Returns a list of `.env*` filenames ordered by the env files priority from lowest to highest.
 *
 * @param dirname - path to `.env*` files' directory
 * @param options - `.env*` files listing options
 */
function listExistDotenvFiles(dirname: string, options: ListDotenvFilesOptions) {
  const { env } = options;

  return [
    resolve(dirname, '.env'),
    resolve(dirname, '.env.local'),
    env && resolve(dirname, `.env.${env}`),
    env && resolve(dirname, `.env.${env}.local`),
  ]
    .filter((filename?: string): filename is string => Boolean(filename))
    .filter((filename) => fs.existsSync(filename));
}

interface IConfigOptions extends Omit<dotenv.DotenvConfigOptions, 'path' | 'override'> {
  /**
   * Default: `process.cwd()`
   *
   * Specify a custom dir path where sebas load your .env* files
   *
   * example: `require('dotenv-sebas').config({ dir: '/custom/path/to' })`
   */
  dir?: string;

  /**
   * Default: `process.env.NODE_ENV`
   *
   * Specify a string which environment you are
   *
   * example: `require('dotenv-sebas').config({ env: process.env.CUSTOM_DOTENV_ENV })`
   */
  env?: string;

  /**
   * Override same key's value in process.env
   */
  overrideProcessEnv?: boolean;
}

/**
 * Main entry point into the "dotenv-sebas". Allows configuration before loading `.env*` files.
 */
export function config(options: IConfigOptions = {}) {
  const { overrideProcessEnv, env = process.env.NODE_ENV, dir = process.cwd(), ...dotenvConfig } = options;
  let envFiles = listExistDotenvFiles(dir, {
    env,
  });

  // if don't override process.env, load config from highest to lowest.
  if (!overrideProcessEnv) {
    envFiles = envFiles.reverse();
  }

  const configResult: Array<{
    file: string;
    error?: Error;
    parsed?: dotenv.DotenvParseOutput;
  }> = [];

  envFiles.forEach((file) => {
    const result = dotenv.config({
      ...dotenvConfig,
      override: overrideProcessEnv,
      path: file,
    });
    configResult.push({
      file,
      ...result,
    });
  });

  return configResult;
}

export default config;
