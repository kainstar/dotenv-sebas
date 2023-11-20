## THIS REPO IS DEPRECATED. REUSE [DOTENV-FLOW](https://github.com/kerimdzhanov/dotenv-flow) PLEASE.

# dotenv-sebas

<img src="https://raw.githubusercontent.com/kainstar/dotenv-sebas/master/logo.png" alt="dotenv-sebas" width="280" height="140" align="right" />

[dotenv](https://github.com/motdotla/dotenv) is a zero-dependency npm module that loads environment variables from a `.env` file into [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env).

But in most case, we write some code to load different `.env*` files in different runtime environments like:

```js
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

dotenv.config({ path: '.env', override: true });
dotenv.config({ path: '.env.local', override: true });

// load in development envs
if (isDevelopment) {
  dotenv.config({ path: '.env.development', override: true });
  dotenv.config({ path: '.env.development.local', override: true });
}

// load in production envs
if (isProduction) {
  dotenv.config({ path: '.env.production', override: true });
  dotenv.config({ path: '.env.production.local', override: true });
}
```

**dotenv-sebas** will help you to handle judge environment and load `.env*` files like `.env.development`, `.env.test` and `.env.production`, also allowing defined variables to be overwritten individually in the appropriate `.env*.local` file.

[![npm package][npm-img]][npm-url] [![Build Status][build-img]][build-url] [![Downloads][downloads-img]][downloads-url] [![Issues][issues-img]][issues-url] [![Code Coverage][codecov-img]][codecov-url] [![Commitizen Friendly][commitizen-img]][commitizen-url] [![Semantic Release][semantic-release-img]][semantic-release-url]

## Why not dotenv-flow ?

[dotenv-flow](https://github.com/kerimdzhanov/dotenv-flow) is also a awesome library to do what dotenv-sebas want to do, but it has never been released for two years. And it install dotenv@^8.2.0 as a dependency, which lead to we can't install latest dotenv.

dotenv-sebas reuse a part of dotenv-flow's code, and remove rest part to make self tinier.

## Install

```bash
npm install dotenv-sebas dotenv
```

## Usage

```js
const sebas = require('dotenv-sebas');

sebas.config();
```

After this, you can access all the environment variables you have defined in your `.env*` files through `process.env.*`.

For example, let's suppose that you have the following `.env*` files in your project:

```sh
# .env

DATABASE_HOST=127.0.0.1
DATABASE_PORT=27017
DATABASE_USER=default
DATABASE_PASS=
DATABASE_NAME=my_app
```

```sh
# .env.local

DATABASE_USER=local-user
DATABASE_PASS=super-secret
```

```sh
# .env.development

DATABASE_NAME=my_app_dev
```

```sh
# .env.test

DATABASE_NAME=my_app_test
```

```sh
# .env.production

DATABASE_NAME=my_app_prod
```

```sh
# .env.production.local

DATABASE_HOST=10.0.0.32
DATABASE_PORT=27017
DATABASE_USER=devops
DATABASE_PASS=1qa2ws3ed4rf5tg6yh
DATABASE_NAME=application_storage
```

```js
// your_script.js

require('dotenv-sebas').config();

console.log('database host:', process.env.DATABASE_HOST);
console.log('database port:', process.env.DATABASE_PORT);
console.log('database user:', process.env.DATABASE_USER);
console.log('database pass:', process.env.DATABASE_PASS);
console.log('database name:', process.env.DATABASE_NAME);
```

And if you run `your_script.js` in the **development** environment, like:

```sh
$ NODE_ENV=development node your_script.js
```

you'll get the following output:

```text
database host: 127.0.0.1
database port: 27017
database user: local-user
database pass: super-secret
database name: my_app_dev
```

Or if you run the same script in the **production** environment:

```sh
$ NODE_ENV=production node your_script.js
```

you'll get the following:

```text
database host: 10.0.0.32
database port: 27017
database user: devops
database pass: 1qa2ws3ed4rf5tg6yh
database name: application_storage
```

Note that the `.env*.local` files should be ignored by your version control system (refer the [Files under version control](#files-under-version-control) section below to learn more), and you should have the `.env.production.local` file only on your production deployment machine.

## API reference

### `sebas.config([options]) => result[]`

The main entry point function that load your `.env*` files.

It returns an array contains every `.env*` file's load result includes the actual loaded `file` and the original module ([dotenv](https://github.com/motdotla/dotenv)) returns `parsed`, `error` properties.

#### `options.dir`

**Type**: `string`

**Default**: `process.cwd()`

Specify a custom dir path where sebas load your .env\* files

#### `options.env`

**Type**: `string`

**Default**: `process.env.NODE_ENV`

Specify a string which environment you are

#### `options.overrideProcessEnv`

**Type**: `boolean`

Specify whether override the existed key's value in `process.env`

[build-img]: https://github.com/kainstar/dotenv-sebas/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/kainstar/dotenv-sebas/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/dotenv-sebas
[downloads-url]: https://www.npmtrends.com/dotenv-sebas
[npm-img]: https://img.shields.io/npm/v/dotenv-sebas
[npm-url]: https://www.npmjs.com/package/dotenv-sebas
[issues-img]: https://img.shields.io/github/issues/kainstar/dotenv-sebas
[issues-url]: https://github.com/kainstar/dotenv-sebas/issues
[codecov-img]: https://codecov.io/gh/kainstar/dotenv-sebas/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/kainstar/dotenv-sebas
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
