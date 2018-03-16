/**
 * A "Command" object
 * @event enable
 * @event disable
 */
import EventEmitter from 'eventemitter3'

/* eslint class-methods-use-this: ['error', { 'exceptMethods': ['undo', 'redo'] }] */
export default class Action extends EventEmitter {
  constructor (id) {
    super()
    this._id = id || this.constructor.id
  }
  /**
   * @return String constructor name if this class is extended or provided id otherwise
   */
  get id () {
    return this._id ? this._id : this.constructor.name
  }
  /**
   * Is the action reversible by design
   * @returns Boolean whether Action has overriden undo method
   */
  get canUndo () {
    return this.undo !== Action.prototype.undo
  }

  get isEnabled () {
    return !this._deny
  }
  /**
   * Execute the action code
   */
  apply (registrar, ...args) {
    if (this._deny) return
    const result = this._execute(registrar, ...args)
    this.emit('fire', registrar, ...args)
    return result
  }
  /**
   * A simple action just calls a method of the same name as its id on registrar
   * Override in concrete action
   */
  _execute (registrar, ...args) {
    const method = this.id.charAt(0).toLowerCase() + this.id.slice(1)
    if (_.isFunction(registrar[method])) {
      return registrar[method].call(registrar, ...args)
    }
  }
  /**
   * Evalutate if the action can be executed
   * A simple action just toggles enabled state by provided flag
   * Override in concrete action
   * @param {Boolean} enable
   */
  evaluate (enable) { // eslint-disable-line
    enable ? this.enable() : this.disable()
  }
  /**
   * Changes enable/disable state
   * Notifies "disable" Event
   */
  disable () {
    if (this._deny) return
    this._deny = true
    this.emit('state:change', !this._deny)
  }
  /**
   * Changes enable/disable state
   * Notifies "enable" Event
   */
  enable () {
    if (!this._deny) return
    this._deny = false
    this.emit('state:change', !this._deny)
  }
  /**
   * @abstract
   * This method definition is required for canUndo
   */
  undo (registrar, ...args) {
    this.emit('undo', registrar, ...args)
  }
}
