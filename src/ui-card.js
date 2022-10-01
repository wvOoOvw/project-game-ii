import { UI } from './ui'
import { drawImage, drawText, drawRect, drawRadius } from './utils-canvas'
import { addEventListener, addEventListenerPure, ifTouchCover } from './utils-common'

const ctx = canvas.getContext('2d')

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Card extends UI {
  constructor(props) {
    super(props)
    this.card = props.card

    this.touchAble = props.touchAble

    this.touchMode = props.touchMode

    this.touchEvent = props.touchEvent

    this.touchDelayTime = props.touchDelayTime

    this.touchArea = props.touchArea

    this.touchTimeout = null

    this.displayMode = props.displayMode
    this.imageMode = props.imageMode

    this.imageIns = props.imageIns
  }

  render() {
    const x = this.resultX
    const y = this.resultY
    const width = this.width
    const height = this.height
    const card = this.card

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    if (this.imageMode === 'center') {
      drawImage(this.imageIns, { x: x + width, y: y + width, width: width, height: height })
    }

    if (this.imageMode === 'overspread') {
      drawImage(this.imageIns, { x: 0, y: 0, width: windowWidth, height: windowHeight })
    }

    ctx.fillStyle = 'white'

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = `bold ${this.width * 0.075}px monospace`

    if (this.displayMode === 'library') {
      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)

      drawText({ x: x + width * 0.08, y: y + width * 0.48, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })
    }

    if (this.displayMode === 'team') {
      ctx.textAlign = 'start'

      ctx.fillText(card.name, x + width * 0.05, y + height / 2)

      ctx.textAlign = 'end'

      ctx.fillText('Lv' + card.level, x + width - width * 0.05, y + height / 2)
    }

    if (this.displayMode === 'preview') {
      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)
      ctx.fillText(`${card.attribute} · ${card.type}`, x + width * 0.08, y + width * 0.48)

      drawText({ x: x + width * 0.08, y: y + width * 0.60, text: card.description(1), width: width - width * 0.25, fontHeight: width * 0.12 })
    }

    ctx.restore()

    if (this.touchMode === 'immediate' && this.touchAble) {
      const event = (e) => {
        if (this.touchArea && !ifTouchCover(e, this.touchArea)) return

        this.touchEvent()
      }

      addEventListener('touchstart', event, { x, y, width, height })
    }

    if (this.touchMode === 'delay' && this.touchAble) {
      const event = (e) => {
        if (this.touchArea && !ifTouchCover(e, this.touchArea)) return

        this.touchTimeout = setTimeout(() => this.touchEvent(), this.touchDelayTime)
      }

      addEventListener('touchstart', event, { x, y, width, height })

      const event_ = () => {
        clearTimeout(this.touchTimeout)
      }

      addEventListenerPure('touchmove', event_)
      addEventListenerPure('touchend', event_)
    }

    if (this.touchMode === 'click' && this.touchAble) {
      const event = (e) => {
        if (this.touchArea && !ifTouchCover(e, this.touchArea)) return

        this.touchTimeout = true
      }

      addEventListener('touchstart', event, { x, y, width, height })

      const event_ = () => {
        this.touchTimeout = false
      }

      addEventListenerPure('touchmove', event_)

      const event__ = () => {
        if (this.touchTimeout === true) this.touchEvent()
        this.touchTimeout = false
      }

      addEventListenerPure('touchend', event__)
    }
  }
}

export { Card } 