import { MDCSelect } from '@material/select'
import { MDCRipple } from '@material/ripple'

import Actionman from '../src/actionman'
import Square from './component/square'
import Oval from './component/oval'

import './app.scss'

class App {
  constructor () {
    this.container = $('body')
    this.actionman = new Actionman()
    this.select = new MDCSelect(this.container.find('.mdc-select')[0])
    this.switch = this.container.find('.mdc-switch > input')
    this.buttons = this.container.find('.action-panel .mdc-button')
    _.each(this.buttons, button => MDCRipple.attachTo(button))

    const options = {
      actionman: this.actionman,
      container: $('.components'),
    }
    this.components = [

      // while first component of type Square is created,
      // it registers Actions for the first time,
      // so they are created by Actionman.set function
      new Square('first', options),

      // when creating a second Square, actions are already created
      // and are just new component just adds itself as new registrar
      new Square('second', options),
      new Oval('third', options),
    ]

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
    this.actionman.get('Ripple').on('state:change', (state) => {
      this.container.find('[data-action="Ripple"] > button').attr('disabled', !state)
    })
    this.actionman.get('Buzz').on('state:change', (state) => {
      this.container.find('[data-action="Buzz"] > button').attr('disabled', !state)
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
new App() // eslint-disable-line
