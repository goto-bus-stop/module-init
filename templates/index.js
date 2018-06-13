var mustache = require('mustache')
var path = require('path')
var fs = require('fs')

function getTemplate (tpl) {
  var template = function (data) {
    var filename = tpl.file
    var filePath

    switch (filename) {
      case 'LICENSE.md':
        filePath = path.join(__dirname, filename, data.pkgLicense + '.mustache')
        break
      default:
        filePath = path.join(__dirname, filename + '.mustache')
    }

    var fileContent = fs.readFileSync(filePath, 'utf8')
    return mustache.render(fileContent, data)
  }

  tpl.template = template
  return tpl
}

module.exports = [
  {
    file: '.gitignore',
    name: 'pkgGitignore'
  },
  {
    file: '.travis.yml',
    name: 'pkgTravis'
  },
  {
    file: 'CHANGELOG.md',
    name: 'pkgChangelog'
  },
  {
    file: 'CONTRIBUTING.md',
    name: 'pkgContributing'
  },
  {
    file: 'LICENSE.md',
    name: 'pkgLicense'
  },
  {
    file: 'README.md',
    name: 'pkgReadme'
  },
  {
    file: 'package.json',
    name: 'pkgJson'
  },
  {
    file: '.npmrc',
    name: 'pkgConfig'
  }
].map(getTemplate)
