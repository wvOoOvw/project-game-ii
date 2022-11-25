import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText, drawFullColor } from './utils-canvas'
import { FadeCreator } from './utils-ui'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

import { Navigation } from './ui-navigation'

class CardAction {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    this.card = []

    this.mouseDownPosition = null

    this.rotateNumber = 0

    this.touchEnd = new Function()
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  get maxRotateNumber() {
    return this.width / 4
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
      this.touchStart()
    } catch { }
  }

  eventUp(e) {
    if (this.rotateNumber === this.width / 4) this.touchEnd(this.card[0])
    if (this.rotateNumber === -this.width / 4) this.touchEnd(this.card[1])

    this.mouseDownPosition = null
  }

  eventMove(e) {
    if (!this.mouseDownPosition) return

    const changeX = (e.pageX || e.targetTouches[0].pageX) - this.mouseDownPosition[0]
    const changeY = (e.pageY || e.targetTouches[0].pageY) - this.mouseDownPosition[1]
    this.mouseDownPosition = [this.mouseDownPosition[0] + changeX, this.mouseDownPosition[1] + changeY]

    const result = this.rotateNumber + changeX

    this.rotateNumber = result

    if (result > this.maxRotateNumber) this.rotateNumber = this.maxRotateNumber
    if (result < -this.maxRotateNumber) this.rotateNumber = -this.maxRotateNumber
  }

  render() {
    if (this.rotateNumber !== 0 && !this.mouseDownPosition) {
      const time = 16

      if (this.rotateNumber < 0) {
        this.rotateNumber = this.rotateNumber / time < -1 / time ? this.rotateNumber - this.rotateNumber / time : 0
      }
      if (this.rotateNumber > 0) {
        this.rotateNumber = this.rotateNumber / time > 1 / time ? this.rotateNumber - this.rotateNumber / time : 0
      }
    }

    var currentCard

    if (this.rotateNumber > 0) currentCard = this.card[0]
    if (this.rotateNumber < 0) currentCard = this.card[1]

    Canvas.ctx.save()

    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(40, 90, 90, 1)'
    Canvas.ctx.fill()

    if (currentCard) {
      Canvas.ctx.globalAlpha = Math.min(Math.abs(this.rotateNumber) / (this.width / 4), 1)

      Canvas.ctx.textBaseline = 'top'
      Canvas.ctx.font = `900 ${this.width * 0.04}px Courier`
      Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      const text = [
        currentCard.name,
        currentCard.race,
        currentCard.type.replaceAll(' ', '·'), ,
      ]

      if (this.rotateNumber > 0) {
        Canvas.ctx.textAlign = 'start'
        text.forEach((i, index) => {
          drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.04 + index * this.width * 0.08, width: 2, height: this.width * 0.05, radius: 2 })
          Canvas.ctx.fill()
          Canvas.ctx.fillText(i, this.x + this.width * 0.06, this.y + this.width * 0.05 + index * this.width * 0.08)
        })
      }
      if (this.rotateNumber < 0) {
        Canvas.ctx.textAlign = 'end'
        text.forEach((i, index) => {
          drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.04 + index * this.width * 0.08, width: 2, height: this.width * 0.05, radius: 2 })
          Canvas.ctx.fill()
          Canvas.ctx.fillText(i, this.x + this.width - this.width * 0.06, this.y + this.width * 0.05 + index * this.width * 0.08)
        })
      }
    }

    Canvas.ctx.globalAlpha = 1

    Canvas.ctx.translate(this.x + this.width * 0.5, this.y + this.height * 2)
    Canvas.ctx.rotate(this.rotateNumber / 400)
    Canvas.ctx.translate(-(this.x + this.width * 0.5), -(this.y + this.height * 2))

    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.clip()

    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fill()

    Canvas.ctx.globalAlpha = Math.min((this.maxRotateNumber - Math.abs(this.rotateNumber)) / this.maxRotateNumber, 1)

    Canvas.ctx.textBaseline = 'middle'
    Canvas.ctx.font = `900 ${this.width * 0.05}px Courier`
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    Canvas.ctx.textAlign = 'start'
    Canvas.ctx.fillText('向右侧滑动', this.x + this.width * 0.6, this.y + this.height * 0.5)
    Canvas.ctx.textAlign = 'end'
    Canvas.ctx.fillText('向左侧滑动', this.x + this.width * 0.4, this.y + this.height * 0.5)

    drawRectRadius({ x: this.x + this.width * 0.5 - 1, y: this.y + this.height * 0.1, width: 2, height: this.height * 0.8, radius: 2 })
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    Canvas.ctx.fill()

    if (currentCard) {
      Canvas.ctx.globalAlpha = Math.min(Math.abs(this.rotateNumber) / this.maxRotateNumber, 1)

      drawImageFullHeight(currentCard.imageDOM, this.option)
    }

    Canvas.ctx.restore()

    Event.addEventListener('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    Event.addEventListener('touchmove', this.eventMove.bind(this))
    Event.addEventListener('touchend', this.eventUp.bind(this))
  }
}

class Page {
  constructor() {
    this.InstanceCardAction = new CardAction()
    this.InstanceCardAction.width = Canvas.width * 0.75
    this.InstanceCardAction.height = Canvas.width * 0.75
    this.InstanceCardAction.x = (Canvas.width - this.InstanceCardAction.width) * 0.5
    this.InstanceCardAction.y = (Canvas.height - this.InstanceCardAction.height) * 0.7
    this.InstanceCardAction.card = parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex].card.map(i => ({ ...i, ...Imitation.state.info.library.card.find(i_ => i_.key === i.key) })))

    this.InstanceNavigation = new Navigation()
    this.InstanceNavigation.content = [{ name: '战斗', active: true }, { name: '仓库', event: () => Imitation.state.page.current = 'store' }]
  }

  render() {
    this.InstanceCardAction.render()
    this.InstanceNavigation.render()
  }
}

export default FadeCreator(Page)