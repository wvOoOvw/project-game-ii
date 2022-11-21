import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText } from './utils-canvas'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

class Page {
  constructor() {
    this.opacity = 0
    this.count = 0
  }

  render() {
    if (this.count <= 20) {
      this.opacity = numberFix(this.opacity + 0.05)
      this.count = this.count + 1
    }

    if (this.count > 20 && this.count <= 40) {
      this.count = this.count + 1
    }

    if (this.count > 40 && this.count <= 60) {
      this.opacity = numberFix(this.opacity - 0.05)
      this.count = this.count + 1
    }

    if (this.count > 60) {
      Imitation.state.page.current = Imitation.state.page.next
      Imitation.state.page.next = ''
      return
    }

    Canvas.ctx.globalAlpha = this.opacity

    drawImage(Picture.get('background-transition'), { x: 0, y: 0, width: Canvas.width, height: Canvas.height })

    Canvas.ctx.globalAlpha = 1
  }
}

export default Page