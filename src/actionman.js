/**
 * Action Manager
 */
import EventEmitter from 'eventemitter3'
import Action from './action'
import ToggleAction from './toggle-action'

export default class Actionman extends EventEmitter {
  constructor (p = {}) {
    super()
    this._instances = {}
    this._registrars = {}
    this.history = []
    this.cursor = 0
  }

  get (id) {
    return this._instances[id].action
  }

  getAll () {
    const keys = _.keys(this._instances)
    return _.map(keys, key => this._instances[key].action)
  }
  /**
   * @return {Array} of enabled actions
   */
  getActive () {
    const instances = _.filter(this._instances, instance => instance.action.isEnabled)
    return _.map(instances, (instance) => {
      if (instance.action.isEnabled) {
        return instance.action
      }
    })
  }
  /**
   * An action can be created by name
   * It will be used as its id, and method of the same name will be called on each registrar
   * Each action is unique by id
   * Subscribe registrar for this action
   * @param {Action | String} CustomAction
   * @param {Object} registrar
   * @param {String} registrarId
   */
  set (CustomAction, registrar, registrarId) {
    const id = _.isString(CustomAction) ? CustomAction : CustomAction.name
    let Klass
    if (_.isString(CustomAction)) {
      Klass = CustomAction.startsWith('Toggle') ? ToggleAction : Action
    } else Klass = CustomAction

    if (this._instances[id]) {
      this._instances[id].registrars[registrarId] = registrar
    } else {
      const action = new Klass(id)
      this._instances[id] = { action, registrars: { [registrarId]: registrar } }
    }

    this.emit('add', this._instances[id])
  }
  /**
   * Unsubscribe registrar from action
   * Clear all listeners if there are no registrars left
   * @param {Action | String} CustomAction class or id
   * @param {String | Object} idOrRegistrar
   */
  unset (CustomAction, idOrRegistrar) {
    const actionId = _.isString(CustomAction) ? CustomAction : CustomAction.name
    if (this._instances[actionId]) {
      let id
      let registrar
      if (_.isString(idOrRegistrar)) id = idOrRegistrar
      else registrar = idOrRegistrar

      if (id) delete this._instances[actionId].registrars[id]
      if (registrar && this._instances[actionId].registrars[registrar.id]) {
        delete this._instances[actionId].registrars[registrar.id]
      }
      if (_.isEmpty(this._instances)) this.off()
    }
  }
  /**
   * Updates all actions state
   */
  update (...args) {
    _.values(this._instances).forEach((instance) => {
      instance.action.evaluate(...args)
    })
  }
  /**
   * Fire an action based on its id
   * @param id String The id of the action
   */
  fire (id, ...args) {
    const action = this._instances[id].action
    if (!_.isNil(action) && action.isEnabled) {
      if (action.canUndo) {
        if (this.history.length > this.cursor) { // Changes in the past change the future
          this.updateHistory(this.history.slice(0, this.cursor))
        }
        this.addToHistory({ action, args })
      }
      let [registrarsId, ...params] = args // eslint-disable-line
      if (registrarsId === 'all') registrarsId = _.keys(this._instances[id].registrars)
      registrarsId = _.castArray(registrarsId)
      _.each(registrarsId, (registrarId) => {
        const registrar = this._instances[id].registrars[registrarId]
        action.apply(registrar, ...params)
      })
    }
  }

  addToHistory (value) {
    this.cursor++
    this.history.push(value)
    this.emit('change:history')
  }

  updateHistory (history) {
    this.history = history
    this.emit('change:history')
  }

  _apply (method) {
    const id = this.history[this.cursor].action.id
    const action = this.history[this.cursor].action
    let [registrarsId] = this.history[this.cursor].args
    if (registrarsId === 'all') registrarsId = _.keys(this._instances[id].registrars)
    registrarsId = _.castArray(registrarsId)
    const [, ...args] = this.history[this.cursor].args
    _.each(registrarsId, (registrarId) => {
      const registrar = this._instances[id].registrars[registrarId]
      action[method].call(action, registrar, ...args)
    })
  }

  undo () {
    this.cursor--
    this._apply('undo')
    this.emit('change:history')
  }

  redo () {
    this._apply('_execute')
    this.cursor++
    this.emit('change:history')
  }

  canUndo () {
    return this.history.length > 0 && this.cursor > 0
  }

  canRedo () {
    return this.cursor < this.history.length
  }
}
