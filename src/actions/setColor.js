import Action from './action'

export default class SetColor extends Action {
  constructor () {
    super()
    this.colors = {}
  }
  _execute (registrar, value) {
    if (value === 'undo') {
      this.undo(registrar)
      return
    }

    if (this.colors[registrar.id]) {
      this.colors[registrar.id].push(registrar.getColor())
    } else {
      this.colors[registrar.id] = [registrar.getColor()]
    }
    registrar.$el.css('background-color', value)
  }

  undo (registrar) {
    const color = this.colors[registrar.id].pop()
    registrar.$el.css('background-color', color)
  }
}
