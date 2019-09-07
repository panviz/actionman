import _ from 'lodash'
import $ from 'jquery'
import Actionman from '../src/actionman'
import Square from './component/shape/square'
import Oval from './component/shape/oval'

import Panel from './component/panel/panel'
import Log from './component/log/log'
import './app.scss'

window.$ = $

class App {
  constructor () {
    this.container = $('body')
    this.actionman = new Actionman()

    const options = {
      actionman: this.actionman,
      container: $('.shapes'),
    }
    this.shapes = [

      // while first component of type Square is created,
      // it registers Actions for the first time,
      // so they are created by Actionman.set function
      new Square(_.extend({ id: 'first' }, options)),

      // when creating a second Square, actions are already created
      // and are just new component just adds itself as new registrar
      new Square(_.extend({ id: 'second' }, options)),
      new Oval(_.extend({ id: 'third' }, options)),
    ]

    options.container = this.container
    this.log = new Log(options)

    // Actions panel is created last, so that it can subscribe to all previously registered actions
    this.panel = new Panel(options)
  }
}
new App() // eslint-disable-line
