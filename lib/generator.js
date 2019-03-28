const Parser = require('./parser')
const templates = require('../templates.json')
const _template = require('lodash/template')
const path = require('path')
const fs = require('fs')

const sequelizeConfigEnv = {
  database: `process.env.DB_DATABASE,`,
  username: `process.env.DB_USERNAME,`,
  password: `process.env.DB_PASSWORD,`,
  dialect: `process.env.DB_DIALECT || 'mysql',`,
  host: `process.env.DB_HOST || 'localhost',`,
  port: `process.env.DB_PORT || 3306`
}

class Generator {
  constructor (options) {
    this._options = Object.assign({
      configPath: null,
      templatePath: null,
      generation: 'es5',
      semicolons: true
    }, options)
    this._template = null
  }

  _setTemplate () {
    if (this._options.templatePath) {
      return this._template = this._options.templatePath
    }
    this._template = templates[this._options.generation][this._options.semicolons ? 'semicolons' : 'default']
  }

  generateFromData (data) {
    this._setTemplate()
    const template = _template(fs.readFileSync(path.resolve(__dirname, '../', this._template), 'utf-8'))
    const renderedData = template({
      sequelizeConfig: {
        file: this._options.configPath,
        env: sequelizeConfigEnv
      },
      models: data
    })
    return renderedData
  }


}

module.exports.Generator = Generator
