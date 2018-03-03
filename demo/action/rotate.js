import Action from '../../src/action'

export default class Rotate extends Action {
  constructor () {
    super()
    this.states = {}
  }

  _execute (registrar, value) {
    const statesOfRegistrar = this.states[registrar.id]

    if (statesOfRegistrar) statesOfRegistrar.push(registrar.getAngle())
    else this.states[registrar.id] = [registrar.getAngle()]

    const angle = value || registrar.getAngle() ? registrar.getAngle() + 10 : 10
    registrar.$el.css('transform', `rotate(${angle}deg)`)
  }

  undo (registrar) {
    const angle = this.states[registrar.id].pop()
    registrar.$el.css('transform', `rotate(${angle}deg)`)
    super.undo(registrar)
  }
}
