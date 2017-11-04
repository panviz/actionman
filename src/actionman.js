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
  }

  get (id) {
    return this._instances[id]
  }

  getAll () {
    return this._instances
  }
  /**
   * @return {Array} of enabled actions
   */
  getActive () {
    return _.filter(this._instances, action => action.isEnabled())
  }
  /**
   * An action can be created by name
   * It will be used as its id, and method of the same name will be called on each registrar
   * Each action is unique by id
   * @param {Action | String} CustomAction
   */
  set (CustomAction, registrar, registrarId) {
    const id = _.isString(CustomAction) ? CustomAction : CustomAction.name
    let Klass
    if (_.isString(CustomAction)) {
      Klass = CustomAction.startsWith('Toggle') ? ToggleAction : Action
    } else Klass = CustomAction

    if (this._instances[id]) this._instances[id].register(registrar, registrarId)
    else this._instances[id] = new Klass(id, { registrar, registrarId })

    this.emit('add', this._instances[id])
  }
  /**
   * Unsubscribe registrar from action
   * @param {Action | String} CustomAction class or id
   * @param registrar
   */
  unset (CustomAction, registrar) {
    const id = _.isString(CustomAction) ? CustomAction : CustomAction.name
    if (this._instances[id]) this._instances[id].deregister(registrar)
  }
  /**
   * Updates all actions state
   */
  update (...args) {
    _.values(this._instances).forEach((action) => {
      action.evaluate(...args)
    })
  }
  /**
   * Fire an action based on its id
   * @param id String The id of the action
   */
  fire (id, ...args) {
    const action = this._instances[id]

    if (!_.isNil(action)) {
      action.apply(...args)
    }
  }
}
