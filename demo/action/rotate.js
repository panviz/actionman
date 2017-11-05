import Action from '../../src/action'

export default class Rotate extends Action {
  _execute () {
    this._registrar.angle = this._registrar.angle ? this._registrar.angle += 10 : 10
    this._registrar.$el.css('transform', `rotate(${this._registrar.angle}deg)`)
  }
}
