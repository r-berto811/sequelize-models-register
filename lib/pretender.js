/**
 * Import dependencies
 */
const { DataTypes } = require('sequelize')

/**
 * Class Pretender.
 * Class to require file, check if file is a model and return model name.
 */
class Pretender {
  /**
   * Pretender class constructor.
   * @param {string} filepath - Path to parsed file.
   * @param {object} sequelize - Sequelize instance.
   */
  constructor (filepath, sequelize) {
    this._sequelize = sequelize
    this.filepath = filepath
    this._initializer = false
    this._Model = null
    this.isModel = false
    this.name = null
    this.open()
  }

  /**
   * Check if file extension is supported.
   * @returns {boolean}
   */
  _checkExt () {
    return (/\.(js)$/i).test(this.filepath)
  }

  /**
   * Check if required file is function.
   * @returns {boolean}
   */
  _isFunction () {
    return typeof this._initializer === 'function'
  }

  /**
   * Requiire file and check content.
   * @returns {boolean}
   */
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

  /**
   * Initialize the model.
   */
  _initModel () {
    this._Model = this._initializer(this._sequelize, DataTypes)
  }

  /**
   * Parse model and set name attribute.
   */
  _parseModel () {
    if (!this._Model || !this._Model.sequelize) {
      console.error(`Opened file: ${this.filepath} is not a sequelize model`)
      return
    }
    this.isModel = true
    this.name = this._Model.name
  }

  /**
   * Open model and set all data.
   */
  open () {
    if (!this._checkExt()) return
    if (!this._openInitializer()) return 
    this._initModel()
    this._parseModel()
  }

  /**
   * Get the name of model.
   * @returns {string}
   */
  getName () {
    return this.name
  }

  /**
   * Get the path to model.
   * @returns {string}
   */
  getPath () {
    return this.filepath
  }

  /**
   * Get model data in JSON.
   * @returns {object}
   */
  toDataJson () {
    return {
      name: this.getName(),
      path: this.getPath()
    }
  }
}

/**
 * Export pretender class.
 */
module.exports.Pretender = Pretender
