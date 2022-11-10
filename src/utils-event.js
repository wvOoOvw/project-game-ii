import { ifTouchCover } from './utils-common'

class Event {
  constructor() {
    this.event = []

    this.init()
  }

  init = () => {
    const list = ['touchstart', 'touchmove', 'touchend']

    const event = (e, type) => {
      const list = this.event
        .filter(i => i.type === type)
        .sort((a, b) => b.priority - a.priority)
        .reduce((t, i) => i.option && i.option.stop ? null : [...t, i], [])

      list.forEach(i => {
        if (i.option && i.option.ifTouchCover && !ifTouchCover(e, i.option.ifTouchCover)) return

        i.callback(e)
      })
    }

    list.forEach(type => {
      canvas.addEventListener(type, e => event(e, type), { passive: true })
    })
  }

  addEventListener = (type, callback, option) => {
    this.event.push({ type, callback, option })
  }

  removeEventListener = (type, callback) => {
    this.event = this.event.filter(i => i.type !== type && i.callback !== callback)
  }

  clearEventListener = () => {
    this.event = []
  }
}

const EventInstance = new Event()

export { EventInstance as Event }