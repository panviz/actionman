import './component.scss'

export default class Component {
  constructor (id, p) {
    this.id = id
    this.$el = $('<div/>').attr('id', this.id)
    this.$el.addClass(this.constructor.name)
    this.$el.addClass('mdc-elevation--z2')
    p.container.append(this.$el)

    this.actionman = p.actionman
    _.each(this.constructor.actions, (action) => {
      this.actionman.set(action, this, this.id)
    })
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
}
