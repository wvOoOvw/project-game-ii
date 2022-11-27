import { drawRectRadius } from './utils-canvas'
import { numberFix, wait } from './utils-common'

import { Canvas } from './instance-canvas'

class Message {
  constructor() {
    this.message = ''
    this.backgroundColor = 'rgba(255, 255, 255, 1)'
    this.textColor = 'rgba(0, 0, 0, 1)'

    this.timeoutRef = null

    this.show = false

    this.opacity = 0
    this.width = Math.min(Canvas.width - 24, 200)
    this.height = 32
    this.x = (Canvas.width - this.width) / 2
    this.y = -32
  }

  play(message, backgroundColor = 'rgba(255, 255, 255, 1)', textColor = 'rgba(0, 0, 0, 1)') {
    clearTimeout(this.timeoutRef)

    this.message = message
    this.backgroundColor = backgroundColor
    this.textColor = textColor
    this.show = true

    this.timeoutRef = wait(60, () => {
      this.show = false
      this.timeoutRef = null
    })
  }

  render() {
    if (this.show && this.opacity < 1) {
      this.opacity = numberFix(this.opacity + 0.05)
    }

    if (!this.show && this.opacity > 0) {
      this.opacity = numberFix(this.opacity - 0.05)
    }

    if (this.show && this.y < 12) {
      this.y = numberFix(this.y + 2)
    }

    if (!this.show && this.y > -32) {
      this.y = numberFix(this.y - 2)
    }

    if (!this.show && this.opacity === 0) return

    Canvas.ctx.save()

    Canvas.ctx.globalAlpha = this.opacity

    Canvas.ctx.textAlign = 'center'
    Canvas.ctx.textBaseline = 'middle'
    Canvas.ctx.font = `900 10px Courier`
    Canvas.ctx.fillStyle = this.backgroundColor

    drawRectRadius({ x: this.x, y: this.y, width: this.width, height: this.height, radius: 4 })

    Canvas.ctx.fill()

    Canvas.ctx.fillStyle = this.textColor

    Canvas.ctx.fillText(this.message, this.x + this.width / 2, this.y + this.height / 2)

    Canvas.ctx.restore()
  }
}

const MessageInstance = new Message()

export { MessageInstance as Message }