import { addEventListener, addEventListenerPure } from './utils-common'
import { drawRect, drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

class ScrollY {
  constructor(option) {
    this.x = option.x
    this.y = option.y
    this.width = option.width
    this.height = option.height
    this.radius = option.radius

    this.min = option.min
    this.max = option.max

    this.backgroundColor = 'rgba(255, 255, 255, 1)'

    this.scrollbarOffset = option.scrollbarOffset

    this.scrollbarThick = option.scrollbarThick

    this.scrollbarColor = 'rgba(0, 0, 0, opacity)'

    this.scrollbarOpacity = 0

    this.scrollbarTimeout = false

    this.scrollPosition = 0

    this.mouseDownPosition = null
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
    } catch { }
  }
  eventUp(e) {
    this.mouseDownPosition = null
  }
  eventMove(e) {
    if (!this.mouseDownPosition) return

    clearTimeout(this.scrollbarTimeout)
    this.scrollbarTimeout = setTimeout(() => this.scrollbarTimeout = null, 1000)

    const changeX = (e.pageX || e.targetTouches[0].pageX) - this.mouseDownPosition[0]
    const changeY = (e.pageY || e.targetTouches[0].pageY) - this.mouseDownPosition[1]
    this.mouseDownPosition = [this.mouseDownPosition[0] + changeX, this.mouseDownPosition[1] + changeY]

    const result = this.scrollPosition - changeY

    if (result < this.min) {
      this.scrollPosition = this.min
      return
    }

    if (result > this.max) {
      this.scrollPosition = this.max
      return
    }

    this.scrollPosition = this.scrollPosition - changeY
  }

  render(callback) {
    ctx.save()

    const option = { x: this.x, y: this.y, width: this.width, height: this.height, radius: this.radius }

    drawRadius(option)

    ctx.fill()

    addEventListener('touchstart', this.eventDown.bind(this), option)
    addEventListenerPure('touchmove', this.eventMove.bind(this), option)
    addEventListenerPure('touchend', this.eventUp.bind(this), option)

    ctx.clip()

    if (this.max > 0) {
      const lineH = this.height * (this.height / (this.max + this.height))
      const lineY = this.y + (this.height - lineH) * (this.scrollPosition / this.max)

      if (this.scrollbarTimeout && this.scrollbarOpacity < 1) this.scrollbarOpacity = this.scrollbarOpacity + 0.05
      if (!this.scrollbarTimeout && this.scrollbarOpacity > 0) this.scrollbarOpacity = this.scrollbarOpacity - 0.05

      ctx.fillStyle = this.scrollbarColor.replace('opacity', this.scrollbarOpacity)

      drawRect({ x: this.x + this.width - this.scrollbarOffset, y: lineY, width: this.scrollbarThick, height: lineH })

      ctx.fill()
    }

    callback(this.scrollPosition)

    ctx.restore()
  }
}

export { ScrollY } 