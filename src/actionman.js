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
    // array of action fire events { instance, arguments }
    this._history = []
    this._cursor = 0
  }

  get history () {
    return _.cloneDeep(this._history)
  }

  get cursor () {
    return this._cursor
  }

  get (id) {
    return this._instances[id]
  }

  getAll () {
    return this._instances
  }

  getRegistrars (actionId) {
    return this._registrars[actionId]
  }
  /**
   * @return {Array} of enabled actions
   */
  getActive () {
    return _.filter(this._instances, instance => instance.isEnabled)
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
    const actionId = _.isString(CustomAction) ? CustomAction : CustomAction.name
    let Klass
    if (_.isString(CustomAction)) {
      Klass = CustomAction.startsWith('Toggle') ? ToggleAction : Action
    } else Klass = CustomAction

    if (this._instances[actionId]) {
      this._registrars[actionId][registrarId] = registrar
    } else {
      const action = new Klass(actionId)
      this._instances[actionId] = action
      this._registrars[actionId] = { [registrarId]: registrar }
    }

    this.emit('add', this._instances[actionId])
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

      if (id) delete this._registrars[actionId][id]
      if (registrar && this._registrars[actionId][registrar.id]) {
        delete this._registrars[actionId][registrar.id]
      }

      if (Object.keys(this._registrars[actionId]).length === 0) {
        delete this._instances[actionId]
      }
      if (_.isEmpty(this._instances)) this.off()
    }
  }
  /**
   * Updates all actions state
   */
  update (...args) {
    _.values(this._instances).forEach((instance) => {
      instance.evaluate(...args)
    })
  }
  /**
   * Fire an action by id (name of the action)
   * The action will be fired as many times as there are registrars
   * @param { String } id The id of the action
   * @param { Array } registarIds list of registrar ids for which action should be fired
   */
  // TODO always use dedicated argument for non-optional (registrarIds here)
  fire (id, ...args) {
    const action = this._instances[id]
    if (!_.isNil(action) && action.isEnabled) {
      if (action.canUndo) {
        if (this._history.length > this._cursor) { // Changes in the past change the future
          this._updateHistory(this._history.slice(0, this._cursor))
        }
        this._addToHistory({ action, args })
      }
      let [registrarIds, ...params] = args // eslint-disable-line
      if (registrarIds === 'all') registrarIds = _.keys(this._registrars[id])
      registrarIds = _.castArray(registrarIds)
      _.each(registrarIds, (registrarId) => {
        const registrar = this._registrars[id][registrarId]
        action.apply(registrar, ...params)
      })
    }
  }

  _addToHistory (value) {
    this._cursor++
    this._history.push(value)
    this.emit('change:history', { add: true })
  }

  _updateHistory (history) {
    this._history = history
    this.emit('change:history', { update: true })
  }
  /**
   * Execute Action's undo / redo
   */
  _apply (method) {
    const id = this._history[this._cursor].action.id
    const action = this._history[this._cursor].action
    let [registrarIds] = this._history[this._cursor].args
    if (registrarIds === 'all') registrarIds = _.keys(this._registrars[id])
    registrarIds = _.castArray(registrarIds)
    const [, ...args] = this._history[this._cursor].args
    _.each(registrarIds, (registrarId) => {
      const registrar = this._registrars[id][registrarId]
      action[method].call(action, registrar, ...args)
    })
  }

  undo () {
    if (!this.canUndo()) return
    this._cursor--
    this._apply('undo')
    this.emit('change:history', { undo: true })
  }

  redo () {
    if (!this.canRedo()) return
    this._apply('apply')
    this._cursor++
    this.emit('change:history', { redo: true })
  }

  canUndo () {
    return this._history.length > 0 && this._cursor > 0
  }

  canRedo () {
    return this._cursor < this._history.length
  }
}
