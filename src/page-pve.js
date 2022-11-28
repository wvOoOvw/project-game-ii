import { parseWitch, symbolNumber, wait, hash, numberFix, numberAnimation, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
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

import { originWitch, originMonster, sourceIoad } from './source'

class Witch {
  constructor() {
    this.x
    this.y
    this.width
    this.height

    this.witch
    this.left
    this.right

    this.mouseDownPosition = null

    this.rotateNumber = 0

    this.touchEnd = new Function()
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
    if (this.rotateNumber === this.maxRotateNumber) this.touchEnd(this.witch.skill[0], this.left)
    if (this.rotateNumber === -this.maxRotateNumber) this.touchEnd(this.witch.skill[1], this.right)

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
        Canvas.ctx.fillText('使用', this.x + this.width * 0.07, this.y + this.height - this.width * 0.08)

        Canvas.ctx.textAlign = 'center'
        drawMultilineText({ x: this.x + this.width / 2, y: this.y + this.height + this.width * 0.04 * Math.min(Math.abs(this.rotateNumber) / this.maxRotateNumber, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: this.right.name })
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
        Canvas.ctx.fillText('使用', this.x + this.width - this.width * 0.07, this.y + this.height - this.width * 0.08)

        Canvas.ctx.textAlign = 'center'
        drawMultilineText({ x: this.x + this.width / 2, y: this.y + this.height + this.width * 0.04 * Math.min(Math.abs(this.rotateNumber) / this.maxRotateNumber, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: this.left.name })
      }

      {
        Canvas.ctx.textAlign = 'center'
        const row = drawMultilineText({ x: this.x + this.width / 2, y: this.y - this.width * 0.12, width: this.width * 0.9, wrapSpace: this.width * 0.06, text: current.description, onlyread: true })
        drawMultilineText({ x: this.x + this.width / 2, y: this.y - this.width * 0.06 * Math.min(Math.abs(this.rotateNumber) / this.maxRotateNumber, 1) - this.width * 0.06 * row, width: this.width * 0.9, wrapSpace: this.width * 0.06, text: current.description })
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

    Canvas.ctx.textAlign = 'start'
    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.font = `900 ${this.width * 0.04}px Courier`
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`清醒:${Math.ceil(this.witch.purity)}`, this.x + this.width * 0.07, this.y + this.width * 0.05)

    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.12, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`理性:${Math.ceil(this.witch.rational)}`, this.x + this.width * 0.07, this.y + this.width * 0.13)

    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.2, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`感性:${Math.ceil(this.witch.perceptual)}`, this.x + this.width * 0.07, this.y + this.width * 0.21)

    Canvas.ctx.textAlign = 'end'

    drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(this.witch.name, this.x + this.width - this.width * 0.07, this.y + this.width * 0.05)

    drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.12, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(this.witch.type, this.x + this.width - this.width * 0.07, this.y + this.width * 0.13)

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

class Monster {
  constructor() {
    this.x
    this.y
    this.width
    this.height

    this.monster
    this.skill

    this.mouseDownPosition = null

    this.rotateNumber = 0

    this.touchEnd = new Function()
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  render() {
    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(90, 0, 40, 1)'
    Canvas.ctx.fill()

    drawImageFullHeight(this.monster.imageDOM, { ...this.option, y: this.y + this.width * 0.1, height: this.height - this.width * 0.1 })

    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.font = `900 ${this.width * 0.04}px Courier`
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    Canvas.ctx.textAlign = 'start'
    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`污秽:${Math.ceil(this.monster.dirty)}`, this.x + this.width * 0.07, this.y + this.width * 0.05)

    Canvas.ctx.textAlign = 'end'
    drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(this.monster.name, this.x + this.width - this.width * 0.07, this.y + this.width * 0.05)

    Canvas.ctx.textAlign = 'center'

    drawMultilineText({ x: this.x + this.width / 2, y: this.y + this.height + this.width * 0.04, width: this.width * 0.9, wrapSpace: this.width * 0.06, text: this.skill.description })
  }
}

class Page {
  constructor() {
    this.team = parseWitch(Imitation.state.info.team)

    this.InstanceNavigation = new Navigation()
    this.InstanceNavigation.content = [{ name: '战斗', active: true }, { name: '仓库', event: () => Imitation.state.page.current = 'store' }]

    this.InstanceWitch = new Witch()
    this.InstanceWitch.width = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceWitch.height = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceWitch.x = (Canvas.width - this.InstanceWitch.width) * 0.5
    this.InstanceWitch.y = (Canvas.height - this.InstanceNavigation.height) / 2

    this.InstanceMonster = new Monster()
    this.InstanceMonster.width = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceMonster.height = Math.min(Canvas.width * 0.5, Canvas.maxWidth * 0.5)
    this.InstanceMonster.x = (Canvas.width - this.InstanceWitch.width) * 0.5
    this.InstanceMonster.y = (Canvas.height - this.InstanceNavigation.height) / 2 - this.InstanceMonster.height * 1.5
    this.InstanceMonster.monster = arrayRandom(originMonster, 1)[0]

    this.round()
  }

  round(next) {
    this.InstanceWitch.witch = next ? next : arrayRandom(this.team, 1)[0]
    this.InstanceWitch.left = arrayRandom(this.team, 1)[0]
    this.InstanceWitch.right = arrayRandom(this.team, 1)[0]

    this.InstanceMonster.skill = arrayRandom(this.InstanceMonster.monster.skill, 1)[0]

    this.InstanceWitch.touchEnd = (skill, next) => {
      this.compute(this.InstanceWitch.witch, this.InstanceMonster.monster, skill, this.InstanceMonster.skill)

      // this.round(next)
    }
  }

  async compute(witch, monster, witchSkill, monsterSkill) {
    const witchResult = witchSkill.function(witch, monster, this.team)

    while (witchResult.length) {
      const current = witchResult.shift()

      if (current.effect === 'Damage') {
        numberAnimation(current.value, 32, i => current.target.dirty = current.target.dirty - i, current.target.dirty)
        // Animation.play('red-hit', (img) => [this.InstanceMonster.x + this.InstanceMonster.width / 2 - img.width / 2, this.InstanceMonster.y + this.InstanceMonster.height / 2 - img.height / 2])
      }
      if (current.effect === 'Improve') {
        numberAnimation(current.value, 32, i => current.target[current.key] = current.target[current.key] + i, current.target[current.key])
      }

      await wait(30)
    }

    const monsterResult = monsterSkill.function(monster, witch, this.team)

    while (monsterResult.length) {
      const current = monsterResult.shift()

      if (current.effect === 'Damage') {
        numberAnimation(current.value, 32, i => current.target.purity = current.target.purity - i, current.target.purity)
      }

      await wait(30)
    }
  }

  render() {
    this.InstanceNavigation.render()
    this.InstanceMonster.render()
    this.InstanceWitch.render()
  }
}

export default FadeCreator(Page)