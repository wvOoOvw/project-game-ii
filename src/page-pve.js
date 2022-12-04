import { symbolNumber, wait, hash, numberFix, numberAnimation, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText, drawFullColor } from './utils-canvas'
import { FadeCreator } from './utils-ui'
import { parseWitch, parseMonster } from './source'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

import { Navigation } from './ui-navigation'
import { Mask } from './ui-mask'

import { originWitch, originMonster, sourceIoad } from './source'

class Witch {
  constructor() {
    this.x
    this.y
    this.width
    this.height

    this.witch

    this.previous
    this.next

    this.mouseDownPosition = null

    this.rotateTime = 0

    this.offsetYTime = 0

    this.previousFadeTime = 0

    this.restoreStatus

    this.useEvent = new Function()
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  get minDiff() {
    return 0.01
  }

  get maxRotateTime() {
    return this.width / 4
  }

  get maxOffsetYTime() {
    return this.height / 4
  }

  get skillDescriptionHeight() {
    var currentSkill

    if (this.rotateTime > 0) currentSkill = this.witch.skill[0]
    if (this.rotateTime < 0) currentSkill = this.witch.skill[1]

    if (!currentSkill) return 0

    Canvas.ctx.textAlign = 'start'
    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.font = `900 ${this.width * 0.04}px courier`

    const row = drawMultilineText({ width: this.width * 0.9, text: currentSkill.description, onlyread: true })

    return (this.width * 0.06 * (row - 1) + this.width * 0.08) * Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1)
  }

  get characteristicDescriptionHeight() {
    if (this.offsetYTime <= 0) return 0

    const row = drawMultilineText({ width: this.width * 0.9, text: this.witch.characteristic[0].description, onlyread: true })
    const row_ = drawMultilineText({ width: this.width * 0.9, text: this.witch.characteristic[1].description, onlyread: true })

    return (this.width * 0.02 + this.width * 0.06 * (row - 1) + this.width * 0.06 * row_ + this.width * 0.04) * Math.min(Math.abs(this.offsetYTime) / this.maxOffsetYTime, 1)
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
      this.touchStart()
    } catch { }
  }

  eventUp(e) {
    if (this.rotateTime === this.maxRotateTime) this.useEvent('right')
    if (this.rotateTime === -this.maxRotateTime) this.useEvent('left')
    if (this.offsetYTime === this.maxOffsetYTime) this.useEvent('bottom')
    if (this.offsetYTime === -this.maxOffsetYTime) this.useEvent('top')

    this.mouseDownPosition = null
    this.restoreStatus = null
  }

  eventMove(e) {
    if (!this.mouseDownPosition) return

    const changeX = (e.pageX || e.targetTouches[0].pageX) - this.mouseDownPosition[0]
    const changeY = (e.pageY || e.targetTouches[0].pageY) - this.mouseDownPosition[1]
    this.mouseDownPosition = [this.mouseDownPosition[0] + changeX, this.mouseDownPosition[1] + changeY]

    const resultX = this.rotateTime + changeX
    const resultY = this.offsetYTime + changeY

    if (Math.abs(changeX) > Math.abs(changeY) && Math.abs(resultX) > 2) {
      this.restoreStatus = 'rotate'
    }
    if (Math.abs(changeX) < Math.abs(changeY) && Math.abs(resultY) > 2) {
      this.restoreStatus = 'offsetY'
    }

    if (this.restoreStatus === 'rotate') {
      this.rotateTime = resultX

      if (resultX > this.maxRotateTime) this.rotateTime = this.maxRotateTime
      if (resultX < -this.maxRotateTime) this.rotateTime = -this.maxRotateTime

      return
    }

    if (this.restoreStatus === 'offsetY') {
      this.offsetYTime = resultY

      if (resultY > this.maxOffsetYTime) this.offsetYTime = this.maxOffsetYTime
      if (resultY < -this.maxOffsetYTime) this.offsetYTime = -this.maxOffsetYTime

      return
    }
  }

  render() {
    if (this.restoreStatus !== 'rotate') {
      const time = 16

      if (this.rotateTime < 0) {
        this.rotateTime = this.rotateTime / time < -this.minDiff ? this.rotateTime - this.rotateTime / time : 0
      }
      if (this.rotateTime > 0) {
        this.rotateTime = this.rotateTime / time > this.minDiff ? this.rotateTime - this.rotateTime / time : 0
      }
    }

    if (this.restoreStatus !== 'offsetY') {
      const time = 16

      if (this.offsetYTime < 0) {
        this.offsetYTime = this.offsetYTime / time < -this.minDiff ? this.offsetYTime - this.offsetYTime / time : 0
      }
      if (this.offsetYTime > 0) {
        this.offsetYTime = this.offsetYTime / time > this.minDiff ? this.offsetYTime - this.offsetYTime / time : 0
      }
    }

    if (this.previousFadeTime < 1) {
      this.previousFadeTime = numberFix(this.previousFadeTime + 0.02)
    }

    Canvas.ctx.save()

    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(40, 90, 90, 1)'
    Canvas.ctx.fill()

    // skill

    if (this.rotateTime !== 0) {
      var currentSkill

      if (this.rotateTime > 0) currentSkill = this.witch.skill[0]
      if (this.rotateTime < 0) currentSkill = this.witch.skill[1]

      Canvas.ctx.globalAlpha = Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1)

      Canvas.ctx.font = `900 ${this.width * 0.04}px courier`
      Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      const text = [
        currentSkill.name,
        currentSkill.type,
      ]

      if (this.rotateTime > 0) {
        Canvas.ctx.textAlign = 'start'

        Canvas.ctx.textBaseline = 'top'
        text.forEach((i, index) => {
          drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.04 + index * this.width * 0.08, width: 2, height: this.width * 0.05, radius: 1 })
          Canvas.ctx.fill()
          Canvas.ctx.fillText(i, this.x + this.width * 0.07, this.y + this.width * 0.045 + index * this.width * 0.08)
        })

        Canvas.ctx.textBaseline = 'bottom'
        drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.height - this.width * 0.09, width: 2, height: this.width * 0.05, radius: 1 })
        Canvas.ctx.fill()
        Canvas.ctx.fillText('使用', this.x + this.width * 0.07, this.y + this.height - this.width * 0.045)

        Canvas.ctx.textAlign = 'center'
        drawMultilineText({ x: this.x + this.width / 2, y: this.y + this.height + this.width * 0.04 + this.width * 0.04 * Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: `切换 / ${this.next[0].name}` })
      }
      if (this.rotateTime < 0) {
        Canvas.ctx.textAlign = 'end'

        Canvas.ctx.textBaseline = 'top'
        text.forEach((i, index) => {
          drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.04 + index * this.width * 0.08, width: 2, height: this.width * 0.05, radius: 1 })
          Canvas.ctx.fill()
          Canvas.ctx.fillText(i, this.x + this.width - this.width * 0.07, this.y + this.width * 0.045 + index * this.width * 0.08)
        })

        Canvas.ctx.textBaseline = 'bottom'
        drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.height - this.width * 0.09, width: 2, height: this.width * 0.05, radius: 1 })
        Canvas.ctx.fill()
        Canvas.ctx.fillText('使用', this.x + this.width - this.width * 0.07, this.y + this.height - this.width * 0.045)

        Canvas.ctx.textAlign = 'center'
        drawMultilineText({ x: this.x + this.width / 2, y: this.y + this.height + this.width * 0.04 + this.width * 0.04 * Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: `切换 / ${this.next[1].name}` })
      }

      Canvas.ctx.textBaseline = 'bottom'
      Canvas.ctx.textAlign = 'center'
      const row = drawMultilineText({ width: this.width * 0.9, text: currentSkill.description, onlyread: true })
      drawMultilineText({ x: this.x + this.width / 2, y: this.y - this.width * 0.06 * (row - 1) - this.width * 0.08 * Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: currentSkill.description })
    }

    // skill --end

    // lv

    if (this.offsetYTime < 0) {
      Canvas.ctx.globalAlpha = Math.min(Math.abs(this.offsetYTime) / this.maxOffsetYTime, 1)

      Canvas.ctx.textBaseline = 'bottom'
      Canvas.ctx.font = `900 ${this.width * 0.04}px courier`
      Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      Canvas.ctx.textAlign = 'start'
      drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.height - this.width * 0.17, width: 2, height: this.width * 0.05, radius: 1 })
      Canvas.ctx.fill()
      Canvas.ctx.fillText(`Exp ${Math.ceil(this.witch.exp)} / ${Math.pow(2, this.witch.level) * 100}`, this.x + this.width * 0.07, this.y + this.height - this.width * 0.125)
      drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.height - this.width * 0.09, width: 2, height: this.width * 0.05, radius: 1 })
      Canvas.ctx.fill()
      Canvas.ctx.fillText(`Lv ${Math.ceil(this.witch.level)}`, this.x + this.width * 0.07, this.y + this.height - this.width * 0.045)
    }

    // lv --end

    // characteristic

    if (this.offsetYTime > 0) {
      Canvas.ctx.globalAlpha = Math.min(Math.abs(this.offsetYTime) / this.maxOffsetYTime, 1)

      Canvas.ctx.textBaseline = 'top'
      Canvas.ctx.font = `900 ${this.width * 0.04}px courier`
      Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      Canvas.ctx.textAlign = 'start'
      drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
      Canvas.ctx.fill()
      Canvas.ctx.fillText(`${this.witch.characteristic[0].name} ${symbolNumber(this.witch.characteristic[0].level)}`, this.x + this.width * 0.07, this.y + this.width * 0.045)
      drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.12, width: 2, height: this.width * 0.05, radius: 1 })
      Canvas.ctx.fill()
      Canvas.ctx.fillText(`${this.witch.characteristic[1].name} ${symbolNumber(this.witch.characteristic[1].level)}`, this.x + this.width * 0.07, this.y + this.width * 0.125)

      Canvas.ctx.textBaseline = 'bottom'
      Canvas.ctx.textAlign = 'start'
      const row = drawMultilineText({ width: this.width * 0.9, text: this.witch.characteristic[0].description, onlyread: true })
      drawMultilineText({ x: this.x + this.width * 0.05, y: this.y - this.width * 0.06 * (row - 1) - this.width * 0.04 * Math.min(Math.abs(this.offsetYTime) / this.maxOffsetYTime, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: `${this.witch.characteristic[0].name} ${symbolNumber(this.witch.characteristic[0].level)} : ${this.witch.characteristic[0].description}` })
      const row_ = drawMultilineText({ width: this.width * 0.9, text: this.witch.characteristic[1].description, onlyread: true })
      drawMultilineText({ x: this.x + this.width * 0.05, y: this.y - this.width * 0.02 - this.width * 0.06 * (row - 1) - this.width * 0.06 * row_ - this.width * 0.04 * Math.min(Math.abs(this.offsetYTime) / this.maxOffsetYTime, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: `${this.witch.characteristic[1].name} ${symbolNumber(this.witch.characteristic[1].level)} : ${this.witch.characteristic[1].description}` })
    }

    // characteristic --end

    // paper

    Canvas.ctx.translate(this.x + this.width * 0.5, this.y + this.height * 2)
    Canvas.ctx.rotate(this.rotateTime / 400)
    Canvas.ctx.translate(0, this.offsetYTime)
    Canvas.ctx.translate(-(this.x + this.width * 0.5), -(this.y + this.height * 2))

    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.clip()

    Canvas.ctx.globalAlpha = 1

    Canvas.ctx.fillStyle = 'rgba(40, 40, 90, 1)'
    Canvas.ctx.fill()

    // paper --end

    // witch

    Canvas.ctx.globalAlpha = Math.min((this.maxRotateTime - Math.abs(this.rotateTime)) / this.maxRotateTime, 1)

    drawRect({ ...this.option, y: this.y + this.width * 0.28, height: this.height - this.width * 0.36 })
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fill()

    drawImageFullHeight(this.witch.imageDOM, { ...this.option, y: this.y + this.width * 0.28, height: this.height - this.width * 0.36 })

    Canvas.ctx.textAlign = 'start'
    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.font = `900 ${this.width * 0.04}px courier`
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`清醒 ${Math.ceil(this.witch.purity)}`, this.x + this.width * 0.07, this.y + this.width * 0.045)
    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.12, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`理性 ${Math.ceil(this.witch.rational)}`, this.x + this.width * 0.07, this.y + this.width * 0.125)
    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.2, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`感性 ${Math.ceil(this.witch.perceptual)}`, this.x + this.width * 0.07, this.y + this.width * 0.205)

    Canvas.ctx.textAlign = 'end'
    drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(this.witch.name, this.x + this.width - this.width * 0.07, this.y + this.width * 0.045)
    drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.12, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(this.witch.type, this.x + this.width - this.width * 0.07, this.y + this.width * 0.125)

    if (this.previousFadeTime < 1 && this.previous) {
      Canvas.ctx.globalAlpha = 1 - this.previousFadeTime

      drawImageFullHeight(this.previous.imageDOM, { ...this.option, y: this.y + this.width * 0.28, height: this.height - this.width * 0.36 })

      Canvas.ctx.textAlign = 'start'
      Canvas.ctx.textBaseline = 'top'
      Canvas.ctx.font = `900 ${this.width * 0.04}px courier`
      Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
      Canvas.ctx.fill()
      Canvas.ctx.fillText(`清醒 ${Math.ceil(this.previous.purity)}`, this.x + this.width * 0.07, this.y + this.width * 0.045)
      drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.12, width: 2, height: this.width * 0.05, radius: 1 })
      Canvas.ctx.fill()
      Canvas.ctx.fillText(`理性 ${Math.ceil(this.previous.rational)}`, this.x + this.width * 0.07, this.y + this.width * 0.125)
      drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.2, width: 2, height: this.width * 0.05, radius: 1 })
      Canvas.ctx.fill()
      Canvas.ctx.fillText(`感性 ${Math.ceil(this.previous.perceptual)}`, this.x + this.width * 0.07, this.y + this.width * 0.205)

      Canvas.ctx.textAlign = 'end'
      drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
      Canvas.ctx.fill()
      Canvas.ctx.fillText(this.previous.name, this.x + this.width - this.width * 0.07, this.y + this.width * 0.045)
      drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.12, width: 2, height: this.width * 0.05, radius: 1 })
      Canvas.ctx.fill()
      Canvas.ctx.fillText(this.previous.type, this.x + this.width - this.width * 0.07, this.y + this.width * 0.125)
    }

    // witch -- end

    // skill

    if (currentSkill) {
      Canvas.ctx.globalAlpha = Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1)

      drawImageFullHeight(currentSkill.imageDOM, this.option)
    }

    // skill --end

    Canvas.ctx.restore()

    Event.addEventListener('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    Event.addEventListener('touchmove', this.eventMove.bind(this))
    Event.addEventListener('touchend', this.eventUp.bind(this))
  }
}

class Monster {
  constructor() {
    this.x
    this.y
    this.width
    this.height

    this.monster
    this.skill

    this.skillIf

    this.skillTime = 0
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  get skillDescriptionHeight() {
    if (!this.skill) return 0

    Canvas.ctx.textAlign = 'start'
    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.font = `900 ${this.width * 0.04}px courier`

    const row = drawMultilineText({ width: this.width * 0.9, text: this.skill.description, onlyread: true })

    return (this.width * 0.04 + this.width * 0.06 * row) * this.skillTime
  }

  render() {
    if (this.skillIf && this.skillTime < 1) {
      this.skillTime = numberFix(this.skillTime + 0.05)
    }
    if (!this.skillIf && this.skillTime > 0) {
      this.skillTime = numberFix(this.skillTime - 0.05)
    }

    Canvas.ctx.save()

    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(90, 0, 40, 1)'
    Canvas.ctx.fill()

    drawRect({ ...this.option, y: this.y + this.width * 0.12, height: this.height - this.width * 0.2 })
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fill()

    drawImageFullHeight(this.monster.imageDOM, { ...this.option, y: this.y + this.width * 0.12, height: this.height - this.width * 0.2 })

    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.font = `900 ${this.width * 0.04}px courier`
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    Canvas.ctx.textAlign = 'start'
    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`污秽 ${Math.ceil(this.monster.dirty)}`, this.x + this.width * 0.07, this.y + this.width * 0.045)

    Canvas.ctx.textAlign = 'end'
    drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(this.monster.name, this.x + this.width - this.width * 0.07, this.y + this.width * 0.045)

    Canvas.ctx.globalAlpha = this.skillTime
    Canvas.ctx.textAlign = 'center'
    drawMultilineText({ x: this.x + this.width / 2, y: this.y + this.height + this.width * 0.04 * this.skillTime, width: this.width * 0.9, wrapSpace: this.width * 0.06, text: this.skill.description })

    Canvas.ctx.restore()
  }
}

class Page {
  constructor() {
    this.InstanceNavigation = new Navigation()
    this.InstanceNavigation.content = [
      { name: '战斗', active: true },
      { name: '仓库', event: () => Imitation.state.page.current = 'store' }
    ]

    this.InstanceMask = new Mask()

    this.InstanceWitch = new Witch()
    this.InstanceWitch.width = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceWitch.height = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceWitch.x = (Canvas.width - this.InstanceWitch.width) * 0.5
    this.InstanceWitch.y = Canvas.height / 2

    this.InstanceMonster = new Monster()
    this.InstanceMonster.width = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceMonster.height = Math.min(Canvas.width * 0.6, Canvas.maxWidth * 0.6)
    this.InstanceMonster.x = (Canvas.width - this.InstanceWitch.width) * 0.5
    this.InstanceMonster.y = Canvas.height / 2 - this.InstanceMonster.height

    this.init()
  }

  async init() {
    this.team = parseWitch(Imitation.state.info.team.map(i => Imitation.state.info.library.find(i_ => i_.key === i.key)))
    this.monster = parseMonster(originMonster.map(i => ({ ...i, level: 0 })))

    this.InstanceMonster.monster = arrayRandom(this.monster, 1)[0]

    this.InstanceMask.showIf = false
    this.InstanceWitch.showIf = false

    this.round()
  }

  async round(witch) {
    if (witch) {
      this.InstanceWitch.previous = this.InstanceWitch.witch
      this.InstanceWitch.witch = witch
      this.InstanceWitch.previousFadeTime = 0
    }
    if (!witch) {
      this.InstanceWitch.witch = arrayRandom(this.team, 1)[0]
    }

    if (this.team.length === 1) {
      this.InstanceWitch.next = [this.team[0], this.team[0]]
    }
    if (this.team.length === 2) {
      this.InstanceWitch.next = [this.team.filter(i => i.key !== this.InstanceWitch.witch.key)[0], this.team.filter(i => i.key !== this.InstanceWitch.witch.key)[0]]
    }
    if (this.team.length > 2) {
      this.InstanceWitch.next = arrayRandom(this.team.filter(i => i.key !== this.InstanceWitch.witch.key), 2)
    }

    this.InstanceMonster.skill = arrayRandom(this.InstanceMonster.monster.skill, 1)[0]
    this.InstanceMonster.skillIf = true

    this.InstanceWitch.useEvent = async (position) => {
      if (position !== 'left' && position !== 'right') return

      var skill
      var witch

      if (position === 'right') {
        skill = this.InstanceWitch.witch.skill[0]
        witch = this.InstanceWitch.next[0]
      }
      if (position === 'left') {
        skill = this.InstanceWitch.witch.skill[1]
        witch = this.InstanceWitch.next[1]
      }

      this.InstanceMask.showIf = true
      this.InstanceMask.text = ['战斗中', `${this.InstanceWitch.witch.name} 使用 ${skill.name}`]

      await wait(64)

      this.InstanceMonster.skillIf = false
      this.InstanceMask.showIf = false

      await wait(32)

      this.InstanceMask.showIf = true
      this.InstanceMask.text = ['战斗中']

      await this.compute(this.InstanceWitch.witch, this.InstanceMonster.monster, skill, this.InstanceMonster.skill)

      await wait(64)

      if (this.InstanceMonster.monster.dirty === 0) {
        this.InstanceMask.showIf = false
        await wait(32)
        this.InstanceMask.showIf = true
        this.InstanceMask.text = ['战斗胜利', '点击任意处 重新战斗']
        this.InstanceMask.touchEvent = () => {
          this.InstanceMask.showIf = false
          this.InstanceMask.touchEvent = null
          this.init()
        }
        this.computeReward()
        return
      }

      this.team = this.team.filter(i => i.purity > 0)

      if (this.team.length === 0) {
        this.InstanceMask.showIf = false
        await wait(32)
        this.InstanceMask.showIf = true
        this.InstanceMask.text = ['战斗失败', '点击任意处 继续战斗']
        this.InstanceMask.touchEvent = () => {
          this.InstanceMask.showIf = false
          this.InstanceMask.touchEvent = null
          this.init()
        }
        return
      }

      const currentName = this.InstanceWitch.witch.name

      this.InstanceMask.touchEvent = async () => {
        this.InstanceMask.touchEvent = () => {
          this.InstanceMask.showIf = false
          this.InstanceMask.touchEvent = null
        }
        this.InstanceMask.showIf = false
        await wait(32)
        if (this.InstanceMask.touchEvent === null) return
        this.InstanceMask.showIf = true
        this.InstanceMask.text = ['战斗中', `切换 / ${currentName} -> ${witch.name}`]
      }

      await wait(64)

      await this.round(witch)
    }
  }

  async compute(witch, monster, witchSkill, monsterSkill) {
    var result
    if (witchSkill.speed < monsterSkill.speed) {
      result = [...witchSkill.function(witch, monster, this.team), ...monsterSkill.function(monster, witch, this.team)]
    }
    if (witchSkill.speed > monsterSkill.speed) {
      result = [...monsterSkill.function(monster, witch, this.team), ...witchSkill.function(witch, monster, this.team)]
    }
    if (witchSkill.speed === monsterSkill.speed) {
      const random = Math.random()

      if (random < 0.5) {
        result = [...witchSkill.function(witch, monster, this.team), ...monsterSkill.function(monster, witch, this.team)]
      }
      if (random >= 0.5) {
        result = [...monsterSkill.function(monster, witch, this.team), ...witchSkill.function(witch, monster, this.team)]
      }
    }

    new Array(...this.team, monster).forEach(i => {
      i.buff_.forEach(i => i.value(i, 'start', result))
      i.buff.forEach(i => i.value(i, 'start', result))
    })

    while (result.length) {
      const current = result.shift()

      new Array(...this.team, monster).forEach(i => {
        i.buff_.forEach(i => i.value(i, 'result', result, current))
        i.buff.forEach(i => i.value(i, 'result', result, current))
      })

      if (current.effect === 'Damage-Dirty') {
        this.InstanceMask.text.push(`${current.target.name} 受到伤害 ${Math.ceil(Math.min(current.value, current.target.dirty))}`)
        numberAnimation(Math.min(current.value, current.target.dirty), 32, i => current.target.dirty = current.target.dirty - i)
      }
      if (current.effect === 'Damage-Purity') {
        this.InstanceMask.text.push(`${current.target.name} 受到伤害 ${Math.ceil(Math.min(current.value, current.target.purity))}`)
        numberAnimation(Math.min(current.value, current.target.purity), 32, i => current.target.purity = current.target.purity - i)
      }
      if (current.effect === 'Cure-Purity') {
        this.InstanceMask.text.push(`${current.target.name} 回复清醒 ${Math.ceil(Math.min(current.value, current.target.purity_ - current.target.purity))}`)
        numberAnimation(Math.min(current.value, current.target.purity_ - current.target.purity), 32, i => current.target.purity = current.target.purity + i)
      }
      if (current.effect === 'Cure-Dirty') {
        this.InstanceMask.text.push(`${current.target.name} 回复污秽 ${Math.ceil(Math.min(current.value, current.target.dirty_ - current.target.dirty))}`)
        numberAnimation(Math.min(current.value, current.target.dirty_ - current.target.dirty), 32, i => current.target.dirty = current.target.dirty + i)
      }
      if (current.effect === 'Buff') {
        this.InstanceMask.text.push(`${current.target.name} 附加状态 ${current.name}`)
        current.target.buff.push(current)
      }
      if (current.effect === 'Improve-Rational') {
        this.InstanceMask.text.push(`${current.target.name} 提升理性 ${Math.ceil(current.value)}`)
        numberAnimation(current.value, 32, i => current.target.rational = current.target.rational + i)
      }
      if (current.effect === 'Improve-Perceptual') {
        this.InstanceMask.text.push(`${current.target.name} 提升感性 ${Math.ceil(current.value)}`)
        numberAnimation(current.value, 32, i => current.target.perceptual = current.target.perceptual + i)
      }
    }

    new Array(...this.team, monster).forEach(i => {
      i.buff_.forEach(i => i.value(i, 'end', result))
      i.buff.forEach(i => i.value(i, 'end', result))

      i.buff.forEach(i_ => {
        i_.time = i_.time - 1
        if (i_.time === 0) i.buff = i.buff.filter(i__ => i__ !== i_)
      })
    })
  }

  computeReward() {
    this.InstanceMonster.monster.reward.forEach(reward => {

      if (reward.type === 'exp') {
        Imitation.state.info.team.forEach(i => {
          const find = Imitation.state.info.library.find(i_ => i_.key === i.key)
          find.exp = find.exp + reward.vlaue
          Imitation.state.setInfo()
        })
      }

    })
  }

  render() {
    this.InstanceMonster.y = Canvas.height / 2 - this.InstanceMonster.height * 1.1 - this.InstanceMonster.skillDescriptionHeight - this.InstanceWitch.skillDescriptionHeight - this.InstanceWitch.characteristicDescriptionHeight

    this.InstanceMonster.render()
    this.InstanceWitch.render()
    this.InstanceMask.render()
    this.InstanceNavigation.render()
  }
}

export default FadeCreator(Page)