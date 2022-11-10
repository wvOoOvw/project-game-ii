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

const addEventListener = EventInstance.addEventListener

const ifTouchCover = (e, option) => {
  const x = option.x
  const y = option.y
  const width = option.width
  const height = option.height

  const x_ = e.x || e.touches[0].clientX
  const y_ = e.y || e.touches[0].clientY

  return x_ >= x && x_ <= x + width && y_ >= y && y_ <= y + height
}

const ifScreenCover = (a, b) => {
  const { x, y, width, height } = a
  const { x: x_, y: y_, width: width_, height: height_ } = b

  return x + width > x_ && x < x_ + width_ && y + height > y_ && y < y_ + height_
}

export { EventInstance as Event, addEventListener, ifTouchCover, ifScreenCover }