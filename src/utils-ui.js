import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawMultilineText } from './utils-canvas'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

const FadeCreator = (props) => {
  return class Fade {
    constructor() {
      this.time = 0
      this.component = new props()
    }

    render() {
      if (this.time < 1) this.time = numberFix(this.time + 0.05)

      this.component.render()

      if (this.time < 1) {
        Canvas.ctx.save()

        Canvas.ctx.globalAlpha = 1 - this.time

        drawRect({ x: 0, y: 0, width: Canvas.width, height: Canvas.height })
        Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
        Canvas.ctx.fill()

        Canvas.ctx.restore()

        Event.addEventListener('touchstart', undefined, { stop: true, priority: 1000 })
        Event.addEventListener('touchmove', undefined, { stop: true, priority: 1000 })
        Event.addEventListener('touchend', undefined, { stop: true, priority: 1000 })
      }
    }
  }
}

export { FadeCreator }