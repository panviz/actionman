import Action from '../../src/action'

export default class Rotate extends Action {
  constructor () {
    super()
    this.angles = {}
  }

  _execute (registrar, value) {
    if (this.angles[registrar.id]) {
      this.angles[registrar.id].push(registrar.getAngle())
    } else {
      this.angles[registrar.id] = [registrar.getAngle()]
    }
    const angle = registrar.getAngle() ? registrar.getAngle() + 10 : 10
    registrar.$el.css('transform', `rotate(${angle}deg)`)
  }

  undo (registrar) {
    const angle = this.angles[registrar.id].pop()
    registrar.$el.css('transform', `rotate(${angle}deg)`)
  }
}
