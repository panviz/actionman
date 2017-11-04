/**
 * A "Command" object
 * @event enable
 * @event disable
 */
import EventEmitter from 'eventemitter3'

/* eslint class-methods-use-this: ['error', { 'exceptMethods': ['undo', 'redo'] }] */
export default class Action extends EventEmitter {
  constructor (id, p = {}) {
    super()
    this._id = id || this.constructor.id
    this._registrars = {}
    this.register(p.registrar, p.registrarId)
  }
  /**
   * @return String constructor name if this class is extended or provided id otherwise
   */
  get id () {
    return this._id ? this._id : this.constructor.name
  }
  /**
   * @returns Boolean whether Action has overriden undo method
   */
  get canUndo () {
    return this.undo !== Action.prototype.undo
  }

  get isEnabled () {
    return !this._deny
  }
  /**
   * Subscribe registrar for this action
   * Anonymous registrars are allowed
   */
  register (registrar, id = _.keys(this._registrars).length) {
    if (registrar) this._registrars[id] = registrar
    return registrar
  }
  /**
   * Unsubscribe registrar from this action
   * Clear all listeners if there are no registrars left
   * @param registrar
   */
  deregister (idOrRegistrar) {
    let id // eslint-disable-line no-unused-vars
    let registrar
    if (_.isString(idOrRegistrar)) id = idOrRegistrar
    else registrar = idOrRegistrar

    if (id) delete this._registrars[id]
    if (registrar) delete this._registrars[_.findKey(this._registrars, registrar)]
    if (_.isEmpty(this._registrars)) this.off()
  }
  /**
   * Execute the action code
   */
  apply (ids, ...args) {
    if (this._deny) return
    if (ids === 'all') ids = _.keys(this._registrars)
    ids = _.castArray(ids)

    if (this._execute && !_.isEmpty(this._registrars)) {
      const results = _.map(ids, (id) => {
        this._registrar = this._registrars[id]
        if (!this._registrar) return
        const result = this._execute(...args)
        this._registrar = undefined
        return result
      })
      this.emit('fire', ...args)
      return results
    }
  }
  /**
   * A simple action just calls a method of the same name as its id on registrar
   * Override in concrete action
   */
  _execute (...args) {
    const method = this.id.charAt(0).toLowerCase() + this.id.slice(1)
    if (_.isFunction(this._registrar[method])) {
      return this._registrar[method].call(this._registrar, ...args)
    }
  }
  /**
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
   */
  undo () {}
  /**
   * @abstract
   */
  redo () {}
}
