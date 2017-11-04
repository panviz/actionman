import Component from './component'

export default class Square extends Component {
  static get actions () {
    return ['Ripple', 'Buzz', 'SetColor', 'ToggleRaise']
  }

  constructor (...args) {
    super(...args)

    this.$el.append('<div>Square reacts to all actions. Fires Ripple on click</div>')
    this.$el.on('click', (e) => {
      this.actionman.fire('Ripple', this.id)
    })
  }
}
