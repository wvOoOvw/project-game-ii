import { ifTouchCover } from './utils-common'

class Event {
  constructor() {
    this.event = []

    this.init()
  }

  init = () => {
    const event = (e, type) => {
      const exe = this.event
        .filter(i => i.type === type)
        .sort((a, b) => b.priority - a.priority)

      var stop = false

      exe.forEach(i => {
        if (stop) return
        if (i.option && i.option.ifTouchCover && !ifTouchCover(e, i.option.ifTouchCover)) return

        if (i.option && i.option.stop) stop = true

        if (typeof i.callback === 'function') i.callback(e)
      })
    }

    new Array('touchstart', 'touchmove', 'touchend', 'mousedown', 'mousemove', 'mouseup').forEach(type => {
      canvas.addEventListener(type, e => event(e, type), { passive: true })
    })
  }

  addEventListener = (type, callback, option) => {
    try {
      if (window.wx._web && window.ontouchstart === undefined && type === 'touchstart') type = 'mousedown'
      if (window.wx._web && window.ontouchmove === undefined && type === 'touchmove') type = 'mousemove'
      if (window.wx._web && window.ontouchend === undefined && type === 'touchend') type = 'mouseup'
    } catch { }

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