import Action from '../../src/action'

export default class SetColor extends Action {
  constructor () {
    super()
    this.states = {}
  }
  _execute (registrar, value) {
    const statesOfRegistrar = this.states[registrar.id]

    if (statesOfRegistrar) statesOfRegistrar.push(registrar.getColor())
    else this.states[registrar.id] = [registrar.getColor()]

    registrar.$el.css('background-color', value)
  }

  undo (registrar) {
    const state = this.states[registrar.id].pop()
    registrar.$el.css('background-color', state)
  }
}
