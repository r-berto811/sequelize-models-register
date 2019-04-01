/**
 * Import dependencies.
 */
const fs = require('fs')
const path = require('path')
const { Sequelize } = require('sequelize')
const { Parser } = require('./lib/parser')
const { Generator } = require('./lib/generator')

/**
 * Set default sequelize config.
 */
const sequelizeConfigEnv = {
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT || 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306
}

/**
 * Convert full path to relative path.
 * @param {string} outFile
 * @param {string} relatedPath
 * @returns {string}
 */
function toRelativePath (outFile, relatedPath) {
  return path.relative(path.dirname(outFile), relatedPath)
}

/**
 * Get config from setted file or from default options.
 * @param {object} options
 * @returns {object}
 */
const getConfig = function (options) {
  if (options.configPath) {
    return require(options.configPath)
  }
  return sequelizeConfigEnv
}

/**
 * Get read dir and get models data.
 * @param {object} sequelize - Sequelize instance.
 * @param {object} options
 * @returns {Array}
 */
const getData = function (sequelize, options) {
  return new Parser(sequelize)
    .read(options.modelsDir)
    .map((file) => {
      return {
        path: toRelativePath(options.outputFile, file.path),
        name: file.name
      }
    })
}

/**
 * Get output file data.
 * @param {Array} data
 * @param {object} options
 * @returns {string}
 */
const getOutFileData = function (data, options) {
  return new Generator({
    configPath: options.configPath ? toRelativePath(options.outputFile, options.configPath) : null,
    generation: options.generation || 'es5',
    semicolons: options.semicolons || false,
    templatePath: options.templatePath || null
  }).generateFromData(data)
}

/**
 * Generate file based on options and parsed parameters.
 * @param {object} options
 */
function generate (options) {
  const config = getConfig(options)
  const sequelize = new Sequelize(config.database, config.username, config.password, config)
  const data = getData(sequelize, options)
  const outFileData = getOutFileData(data, options)
  fs.writeFileSync(options.outputFile, outFileData)
}

/**
 * Export generate function.
 */
module.exports.generate = generate
