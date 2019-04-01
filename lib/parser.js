/**
 * Import dependencies
 */
const fs = require('fs')
const path = require('path')
const { Pretender } = require('./pretender')

/**
 * Parser class.
 * Read all models in folder and create manifest.
 */
class Parser {
  /**
   * Parser constructor.
   * @param {object} sequelize - Sequelize instance.
   */
  constructor (sequelize) {
    this.files = []
    this._rawFiles = []
    this._sequelize = sequelize
    this._modesDir = null
    this.databaseConfig = null
  }

  /**
   * Read models dir and return list of files.
   */
  read (modelsDir) {
    this._modelsDir = modelsDir
    this._readModelsDir()
    this._prepareList()
    return this.files
  }

  /**
   * Read models dir and set the list of raw files.
   */
  _readModelsDir () {
    this._rawFiles = fs.readdirSync(this._modelsDir)
  }

  /**
   * Prepare readed file, filter and resolve models name.
   */
  _prepareList () {
    this._rawFiles.map((file) => {
      const pretendModel = new Pretender(path.resolve(this._modelsDir, file), this._sequelize)
      if (!pretendModel.isModel) return
      this.files.push(pretendModel.toDataJson())
    })
  }
}

/**
 * Export Parser class.
 */
module.exports.Parser = Parser
