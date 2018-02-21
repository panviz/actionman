import Shape from './shape'
import Rotate from '../../action/rotate'
import SetColor from '../../../src/actions/setColor'

export default class Square extends Shape {
  static get actions () {
    return ['Ripple', 'Buzz', 'ToggleRaise', SetColor, Rotate]
  }

  constructor (...args) {
    super(...args)

    this.$el.append('<div>Square reacts to all actions. Fires "Ripple" on click for itself only</div>')
    this.$el.on('click', (e) => {
      this.actionman.fire('Ripple', this.id)
    })
  }
}
