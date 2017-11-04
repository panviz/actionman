import Component from './component'

export default class Oval extends Component {
  // this component doesn't listen to Ripple action
  static get actions () {
    return ['Buzz', 'SetColor', 'ToggleRaise']
  }

  constructor (...args) {
    super(...args)
    this.$el.append('<div>Oval doesn\'t listen to Ripple</div>')
  }
}
