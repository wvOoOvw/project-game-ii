import { parseCard, parseMaster, parseMoney, symbolNumber, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
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

class Witch {
  constructor() {
    this.x
    this.y
    this.width
    this.height

    this.witch = Imitation.state.cache

    this.ifInTeam = Imitation.state.info.team.find(i => i.key === Imitation.state.cache.key) ? true : false

    this.mouseDownPosition = null

    this.rotateNumber = 0
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  get minDiff() {
    return 0.2
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
    if (Math.abs(this.rotateNumber) === this.maxRotateNumber) this.use()

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

  use() {
    if (this.ifInTeam) {
      Imitation.state.info.team = Imitation.state.info.team.filter(i => i.key !== Imitation.state.cache.key)
      Imitation.state.page.current = 'store'
      Message.play('卸载成功')
      return
    }
    if (!this.ifInTeam) {
      if (Imitation.state.info.team.length === 4) {
        Message.play('装载失败 超过最大数量')
        return
      }
      Imitation.state.info.team.push({ key: Imitation.state.cache.key })
      Imitation.state.page.current = 'store'
      Message.play('装载成功')
      return
    }
  }

  render() {
    if (this.rotateNumber !== 0 && !this.mouseDownPosition) {
      const time = 16

      if (this.rotateNumber < 0) {
        this.rotateNumber = this.rotateNumber / time < -this.minDiff / time ? this.rotateNumber - this.rotateNumber / time : 0
      }
      if (this.rotateNumber > 0) {
        this.rotateNumber = this.rotateNumber / time > this.minDiff / time ? this.rotateNumber - this.rotateNumber / time : 0
      }
    }

    var current

    if (this.rotateNumber > 0) current = this.witch.skill[0]
    if (this.rotateNumber < 0) current = this.witch.skill[1]

    Canvas.ctx.save()

    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(40, 90, 90, 1)'
    Canvas.ctx.fill()

    if (current) {
      Canvas.ctx.globalAlpha = Math.min(Math.abs(this.rotateNumber) / this.maxRotateNumber, 1)

      Canvas.ctx.textBaseline = 'top'
      Canvas.ctx.font = `900 ${this.width * 0.04}px Courier`
      Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      const text = [
        current.name,
        current.type,
      ]

      if (this.rotateNumber > 0) {
        Canvas.ctx.textAlign = 'start'
        text.forEach((i, index) => {
          drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.04 + index * this.width * 0.08, width: 2, height: this.width * 0.05, radius: 1 })
          Canvas.ctx.fill()
          Canvas.ctx.fillText(i, this.x + this.width * 0.07, this.y + this.width * 0.05 + index * this.width * 0.08)
        })

        drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.height - this.width * 0.09, width: 2, height: this.width * 0.05, radius: 1 })
        Canvas.ctx.fill()
        Canvas.ctx.fillText(this.ifInTeam ? '卸载' : '装载', this.x + this.width * 0.07, this.y + this.height - this.width * 0.08)
      }
      if (this.rotateNumber < 0) {
        Canvas.ctx.textAlign = 'end'
        text.forEach((i, index) => {
          drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.04 + index * this.width * 0.08, width: 2, height: this.width * 0.05, radius: 1 })
          Canvas.ctx.fill()
          Canvas.ctx.fillText(i, this.x + this.width - this.width * 0.07, this.y + this.width * 0.05 + index * this.width * 0.08)
        })

        drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.height - this.width * 0.09, width: 2, height: this.width * 0.05, radius: 1 })
        Canvas.ctx.fill()
        Canvas.ctx.fillText(this.ifInTeam ? '卸载' : '装载', this.x + this.width - this.width * 0.07, this.y + this.height - this.width * 0.08)
      }

      Canvas.ctx.textAlign = 'center'
      const row = drawMultilineText({ x: this.x + this.width / 2, y: this.y - this.width * 0.12, width: this.width * 0.9, wrapSpace: this.width * 0.06, text: current.description, onlyread: true })
      drawMultilineText({ x: this.x + this.width / 2, y: this.y - this.width * 0.06 * Math.min(Math.abs(this.rotateNumber) / this.maxRotateNumber, 1) - this.width * 0.06 * row, width: this.width * 0.9, wrapSpace: this.width * 0.06, text: current.description })
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

    Canvas.ctx.textAlign = 'start'
    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.font = `900 ${this.width * 0.04}px Courier`
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText('清醒:1200', this.x + this.width * 0.07, this.y + this.width * 0.05)

    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.12, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText('理性:980', this.x + this.width * 0.07, this.y + this.width * 0.13)

    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.2, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText('感性:980', this.x + this.width * 0.07, this.y + this.width * 0.21)

    Canvas.ctx.textAlign = 'end'
    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.font = `900 ${this.width * 0.04}px Courier`
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText('修女伊莲娜', this.x + this.width - this.width * 0.07, this.y + this.width * 0.05)

    drawImageFullHeight(this.witch.imageDOM, { ...this.option, y: this.y + this.height * 0.25, height: this.height - this.height * 0.25 })

    if (current) {
      Canvas.ctx.globalAlpha = Math.min(Math.abs(this.rotateNumber) / this.maxRotateNumber, 1)

      drawImageFullHeight(current.imageDOM, this.option)
    }

    Canvas.ctx.restore()

    Event.addEventListener('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    Event.addEventListener('touchmove', this.eventMove.bind(this))
    Event.addEventListener('touchend', this.eventUp.bind(this))
  }
}

class Page {
  constructor() {
    this.InstanceNavigation = new Navigation()
    this.InstanceNavigation.content = [
      { name: '战斗', event: () => Imitation.state.page.current = 'pve' },
      { name: '仓库', event: () => Imitation.state.page.current = 'store' },
    ]

    this.InstanceWitch = new Witch()
    this.InstanceWitch.width = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceWitch.height = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceWitch.x = (Canvas.width - this.InstanceWitch.width) * 0.5
    this.InstanceWitch.y = (Canvas.height - this.InstanceNavigation.height) / 2
  }

  render() {
    this.InstanceWitch.render()
    this.InstanceNavigation.render()
  }
}

export default FadeCreator(Page)