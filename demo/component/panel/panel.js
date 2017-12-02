import { MDCSelect } from '@material/select'
import { MDCRipple } from '@material/ripple'

import Component from '../component'
import template from './panel.html'
import './panel.scss'

export default class Panel extends Component {
  constructor (...args) {
    super(...args)
    this.$el.html(template())

    this.select = new MDCSelect(this.$el.find('.mdc-select')[0])
    this.switch = this.$el.find('.mdc-switch > input')
    this.buttons = this.$el.find('.action-panel .mdc-button')
    _.each(this.buttons, button => MDCRipple.attachTo(button))

    this.buttons.on('click', (e) => {
      const data = e.target.parentElement.dataset
      const ids = data.ids ? data.ids.split(' ') : 'all'
      this.actionman.fire(data.action, ids)
    })


    this.select.listen('MDCSelect:change', () => {
      this.actionman.fire('SetColor', 'all', this.select.value)
    })
    this.switch.on('change', () => {
      // this action may be fired with or without flag
      this.actionman.fire('ToggleRaise', 'all')
    })
    ;['Ripple', 'Buzz', 'Rotate'].forEach((actionName) => {
      this.actionman.get(actionName).on('state:change', (state) => {
        this.$el.find(`[data-action="${actionName}"] > button`).attr('disabled', !state)
      })
    })
    this.actionman.get('SetColor').on('state:change', (state) => {
      this.select.disabled = !state
    })
    this.actionman.get('ToggleRaise').on('state:change', (state) => {
      this.switch.attr('disabled', !state)
    })
    $('.menu-item .toggle-enabled').on('change', (e) => {
      this.actionman.get(e.target.parentElement.dataset.action).evaluate(e.target.checked)
    })
  }
}
