import { ifTouchCover, ifScreenCover, createImage, parseCard, parseMaster, parseMoney, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

class Scroll {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.radius = props.radius

    this.scrollX = props.scrollX || 0
    this.scrollY = props.scrollY || 0

    this.scrollPosition = [0, 0]

    this.mouseDownPosition = null

    this.clipFunction = () => {
      const option = { x: this.x, y: this.y, width: this.width, height: this.height, radius: this.radius }

      drawRadius(option)

      return option
    }
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
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

    ctx.restore()

    Imitation.state.function.event('touchstart', this.eventDown.bind(this), { ifTouchCover: option })
    Imitation.state.function.event('touchmove', this.eventMove.bind(this))
    Imitation.state.function.event('touchend', this.eventUp.bind(this))
  }
}

export { Scroll } 