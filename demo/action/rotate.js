import Action from '../../src/actions/action'

export default class Rotate extends Action {
  constructor () {
    super()
    this._angle = 10
  }

  _execute (registrar, value) {
   /* let angle = this._angle
    if (value === 'undo') {
      angle = -this._angle
    }*/
    const angle = registrar.getAngle() ? +registrar.getAngle() + 10 : 10
    registrar.$el.css('transform', `rotate(${angle}deg)`)
  }

  undo () {}
}
