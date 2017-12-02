import Shape from './shape'
import Rotate from '../../action/rotate'

export default class Square extends Shape {
  static get actions () {
    return ['Ripple', 'Buzz', 'SetColor', 'ToggleRaise', Rotate]
  }

  constructor (...args) {
    super(...args)

    this.$el.append('<div>Square reacts to all actions. Fires Ripple on click</div>')
    this.$el.on('click', (e) => {
      this.actionman.fire('Ripple', this.id)
    })
  }
}
