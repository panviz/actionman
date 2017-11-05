import Component from './component'
import Rotate from '../action/rotate'

export default class Oval extends Component {
  // this component doesn't listen to Ripple action
  static get actions () {
    return ['Buzz', 'SetColor', 'ToggleRaise', Rotate]
  }

  constructor (...args) {
    super(...args)
    this.$el.append('<div>Oval doesn\'t listen to Ripple</div>')
  }
}
