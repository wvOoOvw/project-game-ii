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
  constructor(props) {
    this.content = props.content

    this.itemWidth = props.itemWidth || 64
    this.itemHeight = props.itemHeight || 30
    this.itemRadius = props.itemRadius || 4
    this.itemBackgroundColor = props.itemBackgroundColor || ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)']
    this.itemTextColor = props.itemTextColor || ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)']
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  get height() {
    return this.content.length * this.itemHeight + (this.content.length - 1) * 12 + 24
  }

  drawBackground() {
    drawRectRadius({ x: 12, y: Canvas.height - this.height - 12, width: Canvas.width - 24, height: this.height, radius: 4 })
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    Canvas.ctx.fill()
  }

  drawContent() {
    Canvas.ctx.textAlign = 'center'
    Canvas.ctx.textBaseline = 'middle'
    Canvas.ctx.font = `900 10px Courier`

    this.content.forEach((row, contentIndex) => {
      const justifyContentIndex = { left: 0, right: 0 }

      row.forEach((item, rowIndex) => {
        var option = {}
        option.y = Canvas.height - 36 - this.itemHeight - contentIndex * this.itemHeight - (contentIndex - 1) * 12
        option.width = item.width || this.itemWidth
        option.height = item.height || this.itemHeight
        option.radius = item.radius || this.itemRadius
        option.backgroundColor = item.backgroundColor || this.itemBackgroundColor
        option.textColor = item.textColor || this.itemTextColor

        if (item.justifyContent === 'left') {
          option.x = 24 + justifyContentIndex[item.justifyContent] * (option.width + 12)
        }
        if (item.justifyContent === 'right') {
          option.x = Canvas.width - 24 - justifyContentIndex[item.justifyContent] * (option.width + 12) - option.width
        }
        if (item.justifyContent === 'center') {
          option.x = (Canvas.width - option.width) / 2

          const maxIndex = row.length
          const centerIndex = maxIndex / 2 - 0.5
          const diff = (rowIndex - centerIndex) * (option.width + 12)

          option.x = option.x + diff
        }
        justifyContentIndex[item.justifyContent] = justifyContentIndex[item.justifyContent] + 1

        option.x = item.x || option.x

        option = { ...option, ...item }

        Canvas.ctx.fillStyle = option.active ? option.backgroundColor[1] : option.backgroundColor[0]

        drawRectRadius(option)

        Canvas.ctx.fill()

        Canvas.ctx.fillStyle = option.active ? option.textColor[1] : option.textColor[0]

        Canvas.ctx.fillText(option.text, option.x + option.width / 2, option.y + option.height / 2)

        Event.addEventListener('touchstart', (e) => option.event ? option.event(e) : null, { ifTouchCover: option })
      })
    })
  }

  render() {
    Canvas.ctx.save()

    this.drawBackground()
    this.drawContent()

    Canvas.ctx.restore()
  }
}

export { Navigation }