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

  }

  render() {
    drawImage(Picture.get('background-home'), { x: 0, y: 0, width: Canvas.width, height: Canvas.height })

    new Array(['商店', 'shop'], ['探索', 'explore'], ['编队', 'store']).forEach((i, index) => {
      const option = { x: Canvas.width / 2 - 60, y: Canvas.height - 120 - index * 60, width: 120, height: 40, radius: 8 }

      Canvas.ctx.textAlign = 'center'
      Canvas.ctx.textBaseline = 'middle'
      Canvas.ctx.font = `900 14px Courier`

      drawRectAngle(option)

      Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
      Canvas.ctx.fill()
      Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      Canvas.ctx.fillText(i[0], option.x + option.width / 2, option.y + option.height / 2)

      const event = () => {
        Imitation.state.page.current = 'transition'
        Imitation.state.page.next = i[1]
      }

      Event.addEventListener('touchstart', event, { ifTouchCover: option })
    })

    new Array(['音乐', 'soundBackground'], ['音效', 'soundSource']).forEach((i, index) => {
      const option = { y: 12, width: 64, height: 28, radius: 4 }

      option.x = 12 + index * (12 + option.width)

      Canvas.ctx.textAlign = 'center'
      Canvas.ctx.textBaseline = 'middle'
      Canvas.ctx.font = `900 10px Courier`

      drawRectAngle(option)

      Canvas.ctx.fillStyle = Imitation.state[i[1]] ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'
      Canvas.ctx.fill()
      Canvas.ctx.fillStyle = Imitation.state[i[1]] ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
      Canvas.ctx.fillText(i[0], option.x + option.width / 2, option.y + option.height / 2)

      const event = () => {
        Imitation.state[i[1]] = !Imitation.state[i[1]]
      }

      Event.addEventListener('touchstart', event, { ifTouchCover: option })
    })

  }
}

export default Page