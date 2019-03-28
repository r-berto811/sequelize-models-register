const fs = require('fs')
const path = require('path')
const { Pretender } = require('./pretender')

class Parser {
  constructor (sequelize) {
    this.files = []
    this._rawFiles = []
    this._sequelize = sequelize
    this._modesDir = null
    this.databaseConfig = null
  }

  read (modelsDir) {
    this._modelsDir = modelsDir
    this._readModelsDir()
    this._prepareList()
    return this.files
  }

  _readModelsDir () {
    this._rawFiles = fs.readdirSync(this._modelsDir)
  }

  _prepareList () {
    this._rawFiles.map((file) => {
      const pretendModel = new Pretender(path.resolve(this._modelsDir, file), this._sequelize)
      if (!pretendModel.isModel) return
      this.files.push(pretendModel.toDataJson())
    })
  }
}

module.exports.Parser = Parser
