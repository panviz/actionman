import Component from '../component'
import template from './log.html'
import './log.scss'
/**
 * Log all Actions firings along with Undo / Redo
 */
export default class Log extends Component {
  constructor (...args) {
    super(...args)
    this.$el.html(template())

    // TODO consider actionman cursor
    this.actionman.on('change:history', () => {
      const list = _.map(this.actionman.history.reverse(), (record, i) => {
        const klass = (this.actionman.history.length - i - 1 < this.actionman.cursor) ? '' : 'disabled'
        return `<li class="${klass}">${record.action.id}, ${record.args[0]}, ${record.args[1]}</li>`
      })
      this.$el.find('.list').html(list.join(''))
    })
  }
}
