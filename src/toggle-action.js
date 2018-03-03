import Action from './action'

export default class ToggleAction extends Action {
  constructor (...args) {
    super(...args)
    this.toggle = {}
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

      if (this.toggle[registrar.id]) {
        this.toggle[registrar.id].push(registrar[getMethod].call(registrar))
      } else {
        this.toggle[registrar.id] = [registrar[getMethod].call(registrar)]
      }

      registrar[method].call(registrar, toggleState, ...args)
    }
  }

  undo (registrar) {
    const method = this._method(registrar)
    const toggle = this.toggle[registrar.id].pop()
    registrar[method].call(registrar, toggle)
    super.undo(registrar)
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

