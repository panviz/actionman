/**
 * This class represents html component
 * Recieves container to render to
 * Can fire events through shared instance of Actionman
 */
import * as uuid from 'uuid-base62'

export default class Component {
  constructor (p = {}) {
    this.id = p.id || uuid.v4()
    this.$el = $('<div/>').attr('id', this.id)
    this.$el.addClass(this.constructor.name)
    p.container.append(this.$el)

    this.actionman = p.actionman
    _.each(this.constructor.actions, (action) => {
      this.actionman.set(action, this, this.id)
    })
  }
}
