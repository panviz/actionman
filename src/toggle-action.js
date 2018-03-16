import Action from './action'

export default class ToggleAction extends Action {
  constructor (...args) {
    super(...args)
    this.states = {}
  }
  /**
   * Infer toggle method name from action id
   */
  _execute (registrar, state, ...args) {
    let toggleState
    const method = this._method(registrar)
    if (method) {
      const getMethod = `get${method.charAt(0).toUpperCase()}${method.slice(1)}`
      if (_.isBoolean(state)) toggleState = state
      else toggleState = !registrar[getMethod].call(registrar)

      if (this.states[registrar.id]) {
        this.states[registrar.id].push(registrar[getMethod].call(registrar))
      } else {
        this.states[registrar.id] = [registrar[getMethod].call(registrar)]
      }

      registrar[method].call(registrar, toggleState, ...args)
    }
  }

  undo (registrar) {
    const method = this._method(registrar)
    const state = this.states[registrar.id].pop()
    registrar[method].call(registrar, state)
    super.undo(registrar, state)
  }

  _method (registrar) {
    let method
    const toggleName = this.id.charAt(0).toLowerCase() + this.id.slice(1)
    const name = this.id.replace('Toggle', '').toLowerCase()
    if (_.isFunction(registrar[toggleName])) method = toggleName
    if (_.isFunction(registrar[name])) method = name
    if (_.isFunction(registrar[this.id])) method = this.id
    return method
  }
}

