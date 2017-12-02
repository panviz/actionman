import Shape from './shape'
import Rotate from '../../action/rotate'

export default class Oval extends Shape {
  // this component doesn't listen to Ripple action
  static get actions () {
    return ['Buzz', 'SetColor', 'ToggleRaise', Rotate]
  }

  constructor (...args) {
    super(...args)
    this.$el.append('<div>Oval doesn\'t listen to Ripple by default. Click to toggle this subscription</div>')
  }
}
