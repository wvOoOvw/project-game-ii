import { UI } from './ui'
import { addEventListener, addEventListenerPure } from './utils-common'
import { drawRect, drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

class Scroll extends UI {
  constructor(props) {
    super(props)
    this.scrollX = props.scrollX || 0
    this.scrollY = props.scrollY || 0

    // this.scrollbarHidden = props.scrollbarHidden || false

    // this.scrollbarOffset = props.scrollbarOffset || 4

    // this.scrollbarThick = props.scrollbarThick || 2

    // this.scrollbarColor = props.scrollbarColor || 'rgba(0, 0, 0, opacity)'

    // this.scrollbarOpacity = 0

    // this.scrollbarTimeout = false

    this.scrollPosition = [0, 0]

    this.mouseDownPosition = null

    this.clipFunction = () => {
      const option = { x: this.resultX, y: this.resultY, width: this.width, height: this.height, radius: this.radius }

      drawRadius(option)

      return option
    }
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
    if (this.scrollX <= 0 && this.scrollY <= 0) return

    clearTimeout(this.scrollbarTimeout)
    this.scrollbarTimeout = setTimeout(() => this.scrollbarTimeout = null, 1000)

    const changeX = (e.pageX || e.targetTouches[0].pageX) - this.mouseDownPosition[0]
    const changeY = (e.pageY || e.targetTouches[0].pageY) - this.mouseDownPosition[1]
    this.mouseDownPosition = [this.mouseDownPosition[0] + changeX, this.mouseDownPosition[1] + changeY]

    var resultX = this.scrollPosition[0] - changeX
    var resultY = this.scrollPosition[1] - changeY

    if (this.scrollX > 0) {
      if (resultX <= 0) resultX = 0
      if (resultX > this.scrollX) resultX = this.scrollX
    }
    if (this.scrollY > 0) {
      if (resultY <= 0) resultY = 0
      if (resultY > this.scrollY) resultY = this.scrollY
    }

    this.scrollPosition = [resultX, resultY]
  }

  render(callback) {
    ctx.save()

    const option = this.clipFunction()

    ctx.clip()

    callback(this.scrollPosition)

    // if (!this.scrollbarHidden) {
    //   if (this.scrollX > 0) {
    //     const lineW = this.width * (this.width / (this.scrollX + this.width))
    //     const lineX = this.resultX + (this.width - lineW) * (this.scrollPosition[0] / this.scrollX)

    //     drawRect({ x: lineX, y: this.resultY + this.height - this.scrollbarOffset, width: lineW, height: this.scrollbarThick })
    //   }
    //   if (this.scrollY > 0) {
    //     const lineH = this.height * (this.height / (this.scrollY + this.height))
    //     const lineY = this.resultY + (this.height - lineH) * (this.scrollPosition[1] / this.scrollY)

    //     drawRect({ x: this.resultX + this.width - this.scrollbarOffset, y: lineY, width: this.scrollbarThick, height: lineH })
    //   }
    //   if (this.scrollX > 0 || this.scrollY > 0) {
    //     if (this.scrollbarTimeout && this.scrollbarOpacity < 1) this.scrollbarOpacity = this.scrollbarOpacity + 0.05
    //     if (!this.scrollbarTimeout && this.scrollbarOpacity > 0) this.scrollbarOpacity = this.scrollbarOpacity - 0.05

    //     ctx.fillStyle = this.scrollbarColor.replace('opacity', this.scrollbarOpacity)

    //     ctx.fill()
    //   }
    // }

    ctx.restore()

    addEventListener('touchstart', this.eventDown.bind(this), option)
    addEventListenerPure('touchmove', this.eventMove.bind(this), option)
    addEventListenerPure('touchend', this.eventUp.bind(this), option)
  }
}

export { Scroll } 