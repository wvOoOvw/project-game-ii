import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText } from './utils-canvas'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

class Scroll {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.contentWidth = props.contentWidth
    this.contentHeight = props.contentHeight

    this.scrollPosition = props.scrollPosition || [0, 0]

    this.mouseDownPosition = null
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

    const changeX = (e.pageX || e.targetTouches[0].pageX) - this.mouseDownPosition[0]
    const changeY = (e.pageY || e.targetTouches[0].pageY) - this.mouseDownPosition[1]
    this.mouseDownPosition = [this.mouseDownPosition[0] + changeX, this.mouseDownPosition[1] + changeY]

    var resultX = this.scrollPosition[0] - changeX
    var resultY = this.scrollPosition[1] - changeY

    if (!this.contentWidth) resultX = this.scrollPosition[0]
    if (!this.contentHeight) resultY = this.scrollPosition[1]

    this.scrollPosition = [resultX, resultY]
  }

  render(callback) {

    if (!this.mouseDownPosition) {
      const time = 16

      if (this.scrollPosition[0] < 0) {
        this.scrollPosition[0] = this.scrollPosition[0] / time < - 1 / time ? this.scrollPosition[0] - this.scrollPosition[0] / time : 0
      }
      if (this.scrollPosition[1] < 0) {
        this.scrollPosition[1] = this.scrollPosition[1] / time < - 1 / time ? this.scrollPosition[1] - this.scrollPosition[1] / time : 0
      }
      if (this.scrollPosition[0] > 0) {
        if (this.contentWidth - this.width < 0 || this.contentWidth - this.width === 0) {
          this.scrollPosition[0] = this.scrollPosition[0] / time > 1 / time ? this.scrollPosition[0] - this.scrollPosition[0] / time : 0
        }
        if (this.contentWidth - this.width > 0 && this.scrollPosition[0] > this.contentWidth - this.width) {
          this.scrollPosition[0] = (this.scrollPosition[0] - (this.contentWidth - this.width)) / time > 1 / time ? this.scrollPosition[0] - (this.scrollPosition[0] - (this.contentWidth - this.width)) / time : this.contentWidth - this.width
        }
      }
      if (this.scrollPosition[1] > 0) {
        if (this.contentHeight - this.height < 0 || this.contentHeight - this.height === 0) {
          this.scrollPosition[1] = this.scrollPosition[1] / time > 1 / time ? this.scrollPosition[1] - this.scrollPosition[1] / time : 0
        }
        if (this.contentHeight - this.height > 0 && this.scrollPosition[1] > this.contentHeight - this.height) {
          this.scrollPosition[1] = (this.scrollPosition[1] - (this.contentHeight - this.height)) / time > 1 / time ? this.scrollPosition[1] - (this.scrollPosition[1] - (this.contentHeight - this.height)) / time : this.contentHeight - this.height
        }
      }
    }

    Canvas.ctx.save()

    const option = { x: this.x, y: this.y, width: this.width, height: this.height }

    drawRect(option)

    Canvas.ctx.clip()

    callback(this.scrollPosition)

    Canvas.ctx.restore()

    Event.addEventListener('touchstart', this.eventDown.bind(this), { ifTouchCover: option })
    Event.addEventListener('touchmove', this.eventMove.bind(this))
    Event.addEventListener('touchend', this.eventUp.bind(this))
  }
}

export { Scroll } 