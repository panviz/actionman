import Component from '../component'
import './shape.scss'

export default class Shape extends Component {
  constructor (...args) {
    super(...args)
    this.$el.addClass('mdc-elevation--z2')
  }

  ripple () {
    this.$el.removeClass('ripple')
    setTimeout(() => this.$el.addClass('ripple'), 100)
  }

  buzz () {
    this.$el.removeClass('buzz')
    setTimeout(() => this.$el.addClass('buzz'), 100)
  }

  setColor (color) {
    this.$el.css('background-color', color)
  }

  raise (flag) {
    this.$el.toggleClass('mdc-elevation--z8')
  }

  getColor () {
    return this.$el.css('background-color')
  }

  getAngle () {
    const transform = this.el.style.transform
    return transform.match(/\d+/) === null ? 0 : +transform.match(/\d+/)
  }

  getRaise () {
    return this.$el.hasClass('mdc-elevation--z8')
  }
}
