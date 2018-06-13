# module-init

Create a new node module with all the right stuff.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]
[![downloads][downloads-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/module-init.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/module-init
[travis-image]: https://img.shields.io/travis/ungoldman/module-init.svg?style=flat-square
[travis-url]: https://travis-ci.org/ungoldman/module-init
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://standardjs.com/
[downloads-image]: https://img.shields.io/npm/dm/module-init.svg?style=flat-square

## Overview

`module-init` is a command-line tool for generating a new node module.

The following list of files are created based on user input:

- **README.md**
  - Automatically generates title, description, and some tasteful badges (version, build status, code style).
  - Auto-populates install, usage, contributing, and license sections with relevant info.
- **LICENSE.md**
  - Options: `Apache-2.0`, `BSD-3-Clause`, `CC0-1.0`, `ISC`, `MIT`, `UNLICENSED`.
- **CHANGELOG.md**
  - Uses [Keep a Changelog](http://keepachangelog.com/) style.
- **CONTRIBUTING.md**
  - Optionally generates contributing guidelines based on [CONTRIBUTING.md](https://github.com/ungoldman/CONTRIBUTING.md) boilerplate.
- **package.json**
  - Fills out all standard fields.
  - Adds code style linter ([`standard`](https://github.com/feross/standard) to `devDependencies`.
  - Adds [`tape`](https://github.com/substack/tape) & [`tap-spec`](https://github.com/scottcorgan/tap-spec) to `devDependencies`.
  - Sets up `npm test` script.
  - Runs [`fixpack`](https://github.com/HenrikJoreteg/fixpack).
- **.travis.yml**
  - Covers Node.js `4` and `6`.
- **.gitignore**
  - Ignores `node_modules` directory.
- **index.js**
  - A blank module entry point file.
- **test/index.js**
  - A boilerplate test file using [`tape`](https://github.com/substack/tape).

Optionally runs `git init` and `npm install` in the new module directory.

## Install

```
npm install @goto-bus-stop/create -g
```

## Usage

### CLI

```
$ npm init @goto-bus-stop --help
Usage: @goto-bus-stop/create [options]
    --dir, -d             specify module directory (default: cwd)
    --version, -v         show version information
    --force, -f           skip prompt and init with defaults
    --help, -h            show help
```

#### Example

```
~ $ npm init @goto-bus-stop -d new-project
? name: new-project
? version: 1.0.0
? description:
? keywords:
? license: ISC
? private: No
? CONTRIBUTING.md: Yes
? git init: Yes
? npm install: Yes
Initialized empty Git repository in /Users/yourname/new-project/.git/
✓ .gitignore created
✓ .travis.yml created
✓ CHANGELOG.md created
✓ CONTRIBUTING.md created
✓ LICENSE created
✓ README.md created
✓ package.json created
✓ index.js created
✓ test/index.js created
tape@4.0.3 node_modules/tape
...
tap-spec@4.0.2 node_modules/tap-spec
...
standard@5.0.2 node_modules/standard
...
✓ new-project initialized
```

### Node API

`module-init` can also be required as a regular node module.

Configuration properties from other sources (`.gitconfig`, current working directory) will not be automatically used as defaults in this mode. All required properties need to be passed in explicitly.

```js
var moduleInit = require('module-init')

var options = {
  pkgName: 'cool-package',          // required
  pkgVersion: '1.0.0',              // required
  usrName: 'Your Name',             // required
  usrEmail: 'your@email.com',       // required
  usrGithub: 'githubUsername'       // required
  pkgDescription: 'description',    // optional
  pkgKeywords: 'one, two, three',   // optional
  pkgContributing: true,            // optional, default: true
  pkgLicense: 'ISC',                // optional, default: ISC
  private: true,                    // optional, default: false (omitted if false)
  dir: 'project-directory'          // optional: default: cwd
}

moduleInit(options)
  .on('create', function (filename) {
    console.log(`${filename} created`)
    // file created
  })
  .on('warn', function (message) {
    console.log(`warning: ${message}`)
    // something weird but non-critical happened
  })
  .on('err', function (err) {
    console.error(err)
    process.exit(1)
    // something went horribly wrong! stop everything!
  })
  .on('done', function (result) {
    console.log(result) // object containing module metadata
    // done!
  })
  .run() // run the thing
```

`moduleInit` returns an event emitter that emits `create`, `warn`, `err`, and `done`.

`moduleInit.on(string, function)` works as demonstrated in the example above.

`moduleInit.run()` runs the initialization process. It also calls `moduleInit.validate()` internally before proceeding and will emit an `err` event if required options are missing. Event listeners need to be set before `moduleInit.run()` is called.

`moduleInit.validate()` returns an array of missing required options. It returns an empty array if everything's fine. This method is really just for internal use, but is exposed for testing and convenience.

Take a look at [bin/cli.js](bin/cli.js) to see how the API is being used by the CLI.

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before getting started.

## Collaborators

`module-init` is only possible due to the excellent work of the following collaborators:

<table>
  <tbody><tr><th align="left">bcomnes</th><td><a href="https://github.com/bcomnes">GitHub/bcomnes</a></td></tr>
  <tr><th align="left">Flet</th><td><a href="https://github.com/Flet">GitHub/Flet</a></td></tr>
  <tr><th align="left">paulcpederson</th><td><a href="https://github.com/paulcpederson">GitHub/paulcpederson</a></td></tr>
  <tr><th align="left">ungoldman</th><td><a href="https://github.com/ungoldman">GitHub/ungoldman</a></td></tr>
  </tbody>
</table>

## See Also

- [Open Source Maintenance Guidelines](http://ungoldman.com/articles/open-source-maintenance-guidelines/)
- [init-module](https://github.com/ungoldman/init-module)

## License

[ISC](LICENSE.md)
