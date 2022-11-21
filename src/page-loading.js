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
    this.time = 0
  }

  render() {
    this.time = this.time + 1 / 32

    drawRect({ x: 0, y: 0, width: Canvas.width, height: Canvas.height })
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    Canvas.ctx.fill()

    Canvas.ctx.textAlign = 'center'
    Canvas.ctx.textBaseline = 'middle'
    Canvas.ctx.font = `900 14px Courier`
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fillText(`加载中${new Array(Math.floor(this.time % 4)).fill('.').join('')}`, Canvas.width / 2, Canvas.height / 2)
  }
}

export default Page