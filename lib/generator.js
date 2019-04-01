/**
 * Import dependencies
 */
const fs = require('fs')
const path = require('path')
const templates = require('../templates.json')
const _template = require('lodash/template')

/**
 * Default sequelize config parameters.
 */
const sequelizeConfigEnv = {
  database: `process.env.DB_DATABASE,`,
  username: `process.env.DB_USERNAME,`,
  password: `process.env.DB_PASSWORD,`,
  dialect: `process.env.DB_DIALECT || 'mysql',`,
  host: `process.env.DB_HOST || 'localhost',`,
  port: `process.env.DB_PORT || 3306`
}

/**
 * Generator class.
 * Generate the manifest file based on input parameters and templates.
 */
class Generator {
  /**
   * Generator constructor.
   * @param {object} options
   */
  constructor (options) {
    this._options = Object.assign({
      configPath: null,
      templatePath: null,
      generation: 'es5',
      semicolons: true
    }, options)
    this._template = null
  }

  /**
   * Set the template file.
   */
  _setTemplate () {
    if (this._options.templatePath) {
      this._template = this._options.templatePath
      return
    }
    const generationTemplates = templates[this._options.generation]
    if (!generationTemplates) {
      throw new Error(`Generation not supported: ${generationTemplates}`)
    }
    this._template = generationTemplates[this._options.semicolons ? 'semicolons' : 'default']
  }

  /**
   * Generate the file content with given data.
   * @param {object} data 
   * @returns {string}
   */
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

/**
 * Expport Generator class.
 */
module.exports.Generator = Generator
