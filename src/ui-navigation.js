import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
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
    this.rotateNumber = 0
  }

  get height() {
    return 30
  }

  render() {
    Canvas.ctx.save()

    this.content.forEach((i, index) => {
      var width = 72
      var height = 30
      var x = (Canvas.width - width) / 2
      var y = Canvas.height - height - 12
      var radius = 4

      const maxIndex = this.content.length
      const centerIndex = maxIndex / 2 - 0.5
      const diff = (index - centerIndex) * (width + 4)
      x = x + diff

      drawRectRadius({ x, y, width, height, radius })
      Canvas.ctx.fillStyle = i.active ? 'rgba(40, 90, 90, 1)' : 'rgba(255, 255, 255, 1)'
      Canvas.ctx.fill()

      Canvas.ctx.textAlign = 'center'
      Canvas.ctx.textBaseline = 'middle'
      Canvas.ctx.font = `900 ${height * 0.35}px Courier`
      Canvas.ctx.fillStyle = i.active ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
      Canvas.ctx.fillText(i.name, x + width / 2, y + height / 2)

      Event.addEventListener('touchstart', i.event, { ifTouchCover: { x, y, width, height }, stop: true, priority: 990 })
    })

    Canvas.ctx.restore()
  }
}

export { Navigation }