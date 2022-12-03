import { parseCard, parseMaster, parseMoney, symbolNumber, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText } from './utils-canvas'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

class Mask {
  constructor() {
    this.showIf

    this.touchEvent = new Function()

    this.touchEventPriority = 100

    this.alphaTime = 0

    this.alphaTimeSpeed = 1 / 32

    this.text

    this.textOffsetY = 0

    this.textTextAlign = 'center'
  }

  render() {
    if (this.showIf && this.alphaTime < 1) {
      this.alphaTime = numberFix(this.alphaTime + this.alphaTimeSpeed)
    }
    if (!this.showIf && this.alphaTime > 0) {
      this.alphaTime = numberFix(this.alphaTime - this.alphaTimeSpeed)
    }

    Canvas.ctx.save()

    Canvas.ctx.globalAlpha = this.alphaTime * 0.5

    drawRect({ x: 0, y: 0, width: Canvas.width, height: Canvas.height })
    Canvas.ctx.fillStyle = `rgba(0, 0, 0, 1)`
    Canvas.ctx.fill()

    if (this.text && typeof this.text === 'object') {
      Canvas.ctx.globalAlpha = this.alphaTime * 1

      const [one, ...other] = this.text

      Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      drawRectRadius({ x: (Canvas.width - 240) / 2, y: Canvas.height / 2 - 1 + this.textOffsetY, width: 240, height: 2, radius: 2 })
      Canvas.ctx.fill()

      Canvas.ctx.textAlign = 'center'
      Canvas.ctx.textBaseline = 'middle'
      Canvas.ctx.font = `900 14px courier`

      Canvas.ctx.fillText(one, Canvas.width / 2, Canvas.height / 2 - 24 + this.textOffsetY)

      Canvas.ctx.font = `900 12px courier`

      other.forEach((i, index) => {
        Canvas.ctx.textAlign = this.textTextAlign
        if (this.textTextAlign === 'left') {
          Canvas.ctx.fillText(i, (Canvas.width - 240) / 2 + 24, Canvas.height / 2 + 24 * (index + 1) + this.textOffsetY)
        }
        if (this.textTextAlign === 'center') {
          Canvas.ctx.fillText(i, Canvas.width / 2, Canvas.height / 2 + 24 * (index + 1) + this.textOffsetY)
        }
      })
    }

    Canvas.ctx.restore()

    if (this.alphaTime > 0) Event.addEventListener('touchstart', this.touchEvent, { stop: true, priority: this.touchEventPriority })
  }
}

export { Mask }