const { DataTypes } = require('sequelize')

class Pretender {

  constructor (filepath, sequelize) {
    this._sequelize = sequelize
    this.filepath = filepath
    this._initializer = false
    this._Model = null
    this.isModel = false
    this.name = null
    this.open()
  }

  _checkExt () {
    return (/\.(js)$/i).test(this.filepath)
  }

  _isFunction () {
    return typeof this._initializer === 'function'
  }

  _openInitializer () {
    try {
      this._initializer = require(this.filepath)
    } catch (err) {
      console.error(`Unable to load file: ${this.filepath}`)
      return false
    }
    if (!this._isFunction(this._initializer)) {
      console.error(`Opened file: ${this.filepath} is not a function`)
      return false
    }
    return true
  }

  _initModel () {
    this._Model = this._initializer(this._sequelize, DataTypes)
  }

  _parseModel () {
    if (!this._Model || !this._Model.sequelize) {
      console.error(`Opened file: ${this.filepath} is not a sequelize model`)
      return
    }
    this.isModel = true
    this.name = this._Model.name
  }

  open () {
    if (!this._checkExt()) return
    if (!this._openInitializer()) return 
    this._initModel()
    this._parseModel()
  }

  getName () {
    return this.name
  }

  getPath () {
    return this.filepath
  }

  toDataJson () {
    return {
      name: this.getName(),
      path: this.getPath()
    }
  }

}

module.exports.Pretender = Pretender
