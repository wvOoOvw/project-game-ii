import { drawImageFullCenter, drawText, drawRadiusRect, ctxInit } from './utils-canvas'
import { addEventListener, addEventListenerPure, ifTouchCover } from './utils-common'

const ctx = canvas.getContext('2d')

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Card {
  constructor(option) {
    this.x = option.x
    this.y = option.y
    this.width = option.width
    this.height = option.height

    this.card = option.card

    this.touchAble = option.touchAble

    this.touchMode = option.touchMode

    this.touchEvent = option.touchEvent

    this.touchDelayTime = option.touchDelayTime

    this.touchArea = option.touchArea

    this.touchTimeout = null

    this.scrollTop = option.scrollTop
    this.scrollLeft = option.scrollLeft

    this.displayMode = option.displayMode
    this.imageMode = option.imageMode

    this.imageIns = option.imageIns
  }

  render() {
    const x = this.x - (this.scrollLeft ? this.scrollLeft : 0)
    const y = this.y - (this.scrollTop ? this.scrollTop : 0)
    const width = this.width
    const height = this.height
    const card = this.card

    ctx.save()

    drawRadiusRect({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    if (this.imageMode === 'normal') {
      drawImageFullCenter(this.imageIns, { x: x + width, y: y + width, width: width, height: height })
    }

    if (this.imageMode === 'full') {
      drawImageFullCenter(this.imageIns, { x: 0, y: 0, width: windowWidth, height: windowHeight })
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fillRect(x, y, width, height)

    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const fontSize = width * 0.075

    ctx.font = `bold ${fontSize}px monospace`

    if (this.displayMode === 'normal') {
      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.12 + width * 0.24)
      ctx.fillText(card.type, x + width * 0.08, y + width * 0.12 + width * 0.36)
      ctx.fillText(card.attribute, x + width * 0.08, y + width * 0.12 + width * 0.48)
      ctx.fillText(`消耗：${card.cost}`, x + width * 0.08, y + width * 0.12 + width * 0.60)

      drawText({ x: x + width * 0.08, y: y + width * 0.84, text: card.description(1), width: width - width * 0.25, fontHeight: width * 0.12 })
    }

    if (this.displayMode === 'line') {
      ctx.fillText(card.name, x + width * 0.12, y + height / 2)

      ctx.fillText('Lv' + card.level, x + width - width * 0.12, y + height / 2)
    }

    ctxInit()

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