import Component from '../component'
import './log.scss'

export default class Log extends Component {
  constructor (...args) {
    super(...args)

    _.each(this.actionman.getAll(), (action) => {
      action.on('fire', (...actionargs) => {
        // eslint-disable-next-line
        console.log(action.id)
        // eslint-disable-next-line
        console.log(actionargs)
      })
    })
  }
}
