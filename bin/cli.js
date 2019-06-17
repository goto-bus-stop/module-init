#!/usr/bin/env node

var moduleInit = require('../')
var path = require('path')
var chalk = require('chalk')
var config = require('git-config').sync()
var inquirer = require('inquirer')
var clopts = require('cliclopts')([
  {
    name: 'dir',
    abbr: 'd',
    help: 'specify module directory (default: cwd)'
  },
  {
    name: 'version',
    abbr: 'v',
    boolean: true,
    help: 'show version information'
  },
  {
    name: 'force',
    abbr: 'f',
    help: 'skip prompt and init with defaults',
    boolean: true
  },
  {
    name: 'help',
    abbr: 'h',
    help: 'show help',
    boolean: true
  }
])
var argv = require('minimist')(process.argv.slice(2), {
  alias: clopts.alias(),
  boolean: clopts.boolean(),
  default: clopts.default()
})

catchInputErrors()

var questions = [
  {
    type: 'input',
    name: 'pkgName',
    message: 'name',
    default: path.basename(argv.dir || process.cwd())
  },
  {
    type: 'input',
    name: 'pkgVersion',
    message: 'version',
    default: '0.0.0'
  },
  {
    type: 'input',
    name: 'pkgDescription',
    message: 'description'
  },
  {
    type: 'input',
    name: 'pkgKeywords',
    message: 'keywords'
  },
  {
    type: 'list',
    name: 'pkgLicense',
    message: 'license',
    choices: ['Apache-2.0', 'BSD-3-Clause', 'CC0-1.0', 'ISC', 'MIT', 'UNLICENSED'],
    default: 'Apache-2.0'
  },
  {
    type: 'confirm',
    name: 'private',
    message: 'private',
    default: false
  },
  {
    type: 'confirm',
    name: 'pkgContributing',
    message: 'CONTRIBUTING.md',
    default: false
  },
  {
    type: 'confirm',
    name: 'lockfile',
    message: 'use a lockfile',
    default: false
  },
  {
    type: 'confirm',
    name: 'gitInit',
    message: 'git init',
    default: true
  },
  {
    type: 'confirm',
    name: 'npmInstall',
    message: 'npm install',
    default: true
  }
]

main().then(() => {
  process.exit(0)
}, () => {
  process.exit(1)
})
async function main () {
  var data
  if (argv.force) {
    data = await force()
  } else {
    data = await prompt()
  }
  data = prepData(data)
  await init(data)
}

function catchInputErrors () {
  var errs = 0

  if (argv.version) {
    console.log(require(path.resolve(__dirname, '..', 'package.json')).version)
    process.exit(0)
  }

  if (argv.help) {
    console.log('Usage: module-init [options]')
    clopts.print()
    process.exit(0)
  }

  if (!config.user ||
    !config.user.name) {
    console.log(chalk.red('Missing user name in .gitconfig'))
    console.log('  Please make sure your name is set, e.g.')
    console.log('  git config --global user.name "YOUR NAME"')
    errs++
  }

  if (!config.user ||
    !config.user.email) {
    console.log(chalk.red('Missing user email in .gitconfig'))
    console.log('  Please make sure your email is set, e.g.')
    console.log('  git config --global user.email "YOUR EMAIL"')
    errs++
  }

  if (!config.github || !config.github.user) {
    console.log(chalk.red('Missing github user in .gitconfig'))
    console.log('  Please make sure your github username is set, e.g.')
    console.log('  git config --global github.user "YOUR USERNAME"')
    errs++
  }

  if (errs) process.exit(1)
}

function force () {
  var data = {}

  for (var i = 0; i < questions.length; i++) {
    if (typeof questions[i].default !== 'undefined') {
      data[questions[i].name] = questions[i].default
    }
  }

  return data
}

function prompt () {
  return inquirer.prompt(questions)
}

function prepData (data) {
  data.usrName = config.user.name
  data.usrEmail = config.user.email
  data.usrGithub = config.github.user

  if (argv.dir) data.dir = argv.dir
  if (!data.pkgDescription) data.pkgDescription = ''
  if (!data.pkgKeywords) data.pkgKeywords = ''
  if (data.pkgKeywords !== '') {
    data.pkgKeywords = data.pkgKeywords
      .split(/[\s,]+/)
      .filter(function (value, index, self) {
        return !!value && self.indexOf(value) === index
      })
      .map(function (value) {
        return '"' + value + '"'
      })
      .join(', ')
  }

  data.pkgConfig = !data.lockfile

  return data
}

function init (data) {
  return new Promise((resolve, reject) => {
    moduleInit(data)
      .on('create', function (file) {
        // file created
        console.log(chalk.green('✓ ') + chalk.bold(file) + ' created')
      })
      .on('warn', function (msg) {
        // something weird happened
        console.log(chalk.yellow('✗ ' + msg))
      })
      .on('err', function (err) {
        // something went horribly wrong!
        console.error(err)
        reject(err)
      })
      .on('done', function (res) {
        // we did it!
        console.log(chalk.green('✓ ') + chalk.bold(res.pkgName) + ' initialized')
        resolve(res)
      })
      .run() // run the thing
  })
}
