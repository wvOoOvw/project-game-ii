import { parseCard, parseMaster, parseMoney, symbolNumber, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText } from './utils-canvas'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

class Navigation {
  constructor() {
    this.content = []

    this.mouseDownPosition = null

    this.visible = false

    this.visibleTime = 0
  }

  get minDiff() {
    return 0.01
  }

  get maxVisibleTime() {
    return 42
  }

  render() {
    if (!this.visible) {
      const time = 16
      this.visibleTime = this.visibleTime / time > this.minDiff ? this.visibleTime - this.visibleTime / time : 0
    }
    if (this.visible) {
      const time = 16
      this.visibleTime = (this.maxVisibleTime - this.visibleTime) / time > this.minDiff ? this.visibleTime + (this.maxVisibleTime - this.visibleTime) / time : this.maxVisibleTime
    }

    Canvas.ctx.save()

    Canvas.ctx.globalAlpha = this.visibleTime / this.maxVisibleTime

    drawRect({ x: 0, y: 0, width: Canvas.width, height: Canvas.height })
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    Canvas.ctx.fill()

    drawRectRadius({ x: (Canvas.width - Canvas.maxWidth) / 2, y: Canvas.height - this.visibleTime - 24, width: Canvas.maxWidth, height: this.visibleTime + 24, radius: [8, 8, 0, 0] })
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fill()

    this.content.forEach((i, index) => {
      var width = 72
      var height = 30
      var x = (Canvas.width - width) / 2
      var y = Canvas.height - this.visibleTime
      var radius = 4

      const maxIndex = this.content.length
      const centerIndex = maxIndex / 2 - 0.5
      const diff = (index - centerIndex) * (width + 4)
      x = x + diff

      if (i.active) {
        drawRectRadius({ x, y, width, height, radius })
        Canvas.ctx.fillStyle = 'rgba(40, 90, 90, 1)'
        Canvas.ctx.fill()
      }

      if (!i.active) {
        x = x + Canvas.ctx.lineWidth / 2
        y = y + Canvas.ctx.lineWidth / 2
        width = width - Canvas.ctx.lineWidth
        height = height - Canvas.ctx.lineWidth
        drawRectRadius({ x, y, width, height, radius })
        Canvas.ctx.strokeStyle = 'rgba(40, 90, 90, 1)'
        Canvas.ctx.stroke()
      }

      Canvas.ctx.textAlign = 'center'
      Canvas.ctx.textBaseline = 'middle'
      Canvas.ctx.font = `900 10px Courier`
      Canvas.ctx.fillStyle = i.active ? 'rgba(255, 255, 255, 1)' : 'rgba(40, 90, 90, 1)'
      Canvas.ctx.fillText(i.name, x + width / 2, y + height / 2)

      Event.addEventListener('touchstart', i.event, { ifTouchCover: { x, y, width, height }, stop: true, priority: 900 })
    })

    Canvas.ctx.globalAlpha = 1

    const line = { y: Canvas.height - this.visibleTime - 12, width: 180, height: 2, radius: 1 }
    line.x = (Canvas.width - line.width) / 2

    drawRectRadius(line)
    Canvas.ctx.fillStyle = `rgba(${Math.ceil(255 - (this.visibleTime / this.maxVisibleTime) * 255)}, ${Math.ceil(255 - (this.visibleTime / this.maxVisibleTime) * 255)}, ${Math.ceil(255 - (this.visibleTime / this.maxVisibleTime) * 255)}, 1)`
    Canvas.ctx.fill()

    Canvas.ctx.restore()

    Event.addEventListener('touchstart', () => this.visible = false, { priority: 898 })
    Event.addEventListener('touchstart', () => this.visible = !this.visible, { ifTouchCover: { ...line, y: line.y - 4, height: line.height + 8 }, stop: true, priority: 899 })
  }
}

export { Navigation }