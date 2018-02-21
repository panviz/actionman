import Action from './action'

export default class ToggleAction extends Action {
  constructor (...args) {
    super(...args)
    this._toggleState = false
  }

  apply (ids, state, ...args) {
    if (_.isBoolean(state)) this._toggleState = state
    else this._toggleState = !this._toggleState

    super.apply(ids, this._toggleState, ...args)
  }
  /**
   * Infer toggle method name from action id
   */
  _execute (...args) {
    let method
    const toggleName = this.id.charAt(0).toLowerCase() + this.id.slice(1)
    const name = this.id.replace('Toggle', '').toLowerCase()

    if (_.isFunction(this._registrar[toggleName])) method = toggleName
    if (_.isFunction(this._registrar[name])) method = name
    if (_.isFunction(this._registrar[this.id])) method = this.id

    if (method) this._registrar[method].call(this._registrar, this._toggleState, ...args)
  }

  undo () {}

  redo () {}
}
