import { parseWitch, symbolNumber, wait, hash, numberFix, numberAnimation, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover, parseMonster } from './utils-common'
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

    this.previous
    this.next

    this.use

    this.mouseDownPosition = null

    this.rotateTime = 0
    this.fadeTime = 0

    this.touchEnd = new Function()
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  get minDiff() {
    return 0.01
  }

  get maxRotateNumber() {
    return this.width / 4
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

    return (this.width * 0.06 + this.width * 0.06 * row) * Math.min(Math.abs(this.rotateTime) / this.maxRotateNumber, 1)
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
      this.touchStart()
    } catch { }
  }

  eventUp(e) {
    if (this.rotateTime === this.maxRotateNumber) {
      this.touchEnd(this.witch.skill[0], this.next[0])
    }
    if (this.rotateTime === -this.maxRotateNumber) {
      this.touchEnd(this.witch.skill[1], this.next[1])
    }

    this.mouseDownPosition = null
  }

  eventMove(e) {
    if (!this.mouseDownPosition) return

    const changeX = (e.pageX || e.targetTouches[0].pageX) - this.mouseDownPosition[0]
    const changeY = (e.pageY || e.targetTouches[0].pageY) - this.mouseDownPosition[1]
    this.mouseDownPosition = [this.mouseDownPosition[0] + changeX, this.mouseDownPosition[1] + changeY]

    const result = this.rotateTime + changeX

    this.rotateTime = result

    if (result > this.maxRotateNumber) this.rotateTime = this.maxRotateNumber
    if (result < -this.maxRotateNumber) this.rotateTime = -this.maxRotateNumber
  }

  render() {
    if (!this.mouseDownPosition && this.rotateTime !== 0) {
      const time = 16

      if (this.rotateTime < 0) {
        this.rotateTime = this.rotateTime / time < -this.minDiff ? this.rotateTime - this.rotateTime / time : 0
      }
      if (this.rotateTime > 0) {
        this.rotateTime = this.rotateTime / time > this.minDiff ? this.rotateTime - this.rotateTime / time : 0
      }
    }

    if (this.fadeTime < 1) {
      this.fadeTime = numberFix(this.fadeTime + 0.02)
    }

    Canvas.ctx.save()

    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(40, 90, 90, 1)'
    Canvas.ctx.fill()

    var currentSkill

    if (this.rotateTime > 0) currentSkill = this.witch.skill[0]
    if (this.rotateTime < 0) currentSkill = this.witch.skill[1]

    if (currentSkill) {
      Canvas.ctx.globalAlpha = Math.min(Math.abs(this.rotateTime) / this.maxRotateNumber, 1)

      Canvas.ctx.textBaseline = 'top'
      Canvas.ctx.font = `900 ${this.width * 0.04}px courier`
      Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      const text = [
        currentSkill.name,
        currentSkill.type,
      ]

      if (this.rotateTime > 0) {
        Canvas.ctx.textAlign = 'start'
        text.forEach((i, index) => {
          drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.width * 0.04 + index * this.width * 0.08, width: 2, height: this.width * 0.05, radius: 1 })
          Canvas.ctx.fill()
          Canvas.ctx.fillText(i, this.x + this.width * 0.07, this.y + this.width * 0.045 + index * this.width * 0.08)
        })

        drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.height - this.width * 0.09, width: 2, height: this.width * 0.05, radius: 1 })
        Canvas.ctx.fill()
        Canvas.ctx.fillText('使用', this.x + this.width * 0.07, this.y + this.height - this.width * 0.085)

        Canvas.ctx.textAlign = 'center'
        drawMultilineText({ x: this.x + this.width / 2, y: this.y + this.height + this.width * 0.04 * Math.min(Math.abs(this.rotateTime) / this.maxRotateNumber, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: `切换 / ${this.next[0].name}` })
      }
      if (this.rotateTime < 0) {
        Canvas.ctx.textAlign = 'end'
        text.forEach((i, index) => {
          drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.04 + index * this.width * 0.08, width: 2, height: this.width * 0.05, radius: 1 })
          Canvas.ctx.fill()
          Canvas.ctx.fillText(i, this.x + this.width - this.width * 0.07, this.y + this.width * 0.045 + index * this.width * 0.08)
        })

        drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.height - this.width * 0.09, width: 2, height: this.width * 0.05, radius: 1 })
        Canvas.ctx.fill()
        Canvas.ctx.fillText('使用', this.x + this.width - this.width * 0.07, this.y + this.height - this.width * 0.085)

        Canvas.ctx.textAlign = 'center'
        drawMultilineText({ x: this.x + this.width / 2, y: this.y + this.height + this.width * 0.04 * Math.min(Math.abs(this.rotateTime) / this.maxRotateNumber, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: `切换 / ${this.next[1].name}` })
      }

      Canvas.ctx.textAlign = 'center'
      const row = drawMultilineText({ width: this.width * 0.9, text: currentSkill.description, onlyread: true })
      drawMultilineText({ x: this.x + this.width / 2, y: this.y - (this.width * 0.06 + this.width * 0.06 * row) * Math.min(Math.abs(this.rotateTime) / this.maxRotateNumber, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: currentSkill.description })
    }

    // paper

    Canvas.ctx.translate(this.x + this.width * 0.5, this.y + this.height * 2)
    Canvas.ctx.rotate(this.rotateTime / 400)
    Canvas.ctx.translate(-(this.x + this.width * 0.5), -(this.y + this.height * 2))

    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.clip()

    Canvas.ctx.globalAlpha = 1

    Canvas.ctx.fillStyle = `rgba(255, 255, 255, 1)`
    Canvas.ctx.fill()

    // paper --end

    // witch

    Canvas.ctx.globalAlpha = Math.min((this.maxRotateNumber - Math.abs(this.rotateTime)) / this.maxRotateNumber, 1)

    drawImageFullHeight(this.witch.imageDOM, { ...this.option, y: this.y + this.height * 0.3, height: this.height - this.height * 0.4 })

    Canvas.ctx.textAlign = 'start'
    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.font = `900 ${this.width * 0.04}px courier`
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'

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

    Canvas.ctx.textAlign = 'start'
    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.height - this.width * 0.09, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`状态 ${this.witch.buff.map(i => i.name).join(' ')}`, this.x + this.width * 0.07, this.y + this.height - this.width * 0.085)

    if (this.fadeTime < 1 && this.previous) {
      Canvas.ctx.globalAlpha = 1 - this.fadeTime

      Canvas.ctx.textAlign = 'start'
      Canvas.ctx.textBaseline = 'top'
      Canvas.ctx.font = `900 ${this.width * 0.04}px courier`
      Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'

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

      drawImageFullHeight(this.previous.imageDOM, { ...this.option, y: this.y + this.height * 0.25, height: this.height - this.height * 0.35 })
    }

    // witch -- end

    if (currentSkill) {
      Canvas.ctx.globalAlpha = Math.min(Math.abs(this.rotateTime) / this.maxRotateNumber, 1)

      drawImageFullHeight(currentSkill.imageDOM, this.option)
    }

    Canvas.ctx.restore()

    if (!this.use) {
      Event.addEventListener('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
      Event.addEventListener('touchmove', this.eventMove.bind(this))
      Event.addEventListener('touchend', this.eventUp.bind(this))
    }
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
    if (this.skillTime < 1) {
      this.skillTime = numberFix(this.skillTime + 0.05)
    }

    Canvas.ctx.save()

    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(90, 0, 40, 1)'
    Canvas.ctx.fill()

    drawImageFullHeight(this.monster.imageDOM, { ...this.option, y: this.y + this.width * 0.15, height: this.height - this.width * 0.25 })

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

    Canvas.ctx.textAlign = 'start'
    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.height - this.width * 0.09, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`状态 ${this.monster.buff.map(i => i.name).join(' ')}`, this.x + this.width * 0.07, this.y + this.height - this.width * 0.085)

    Canvas.ctx.restore()
  }
}

class Page {
  constructor() {
    this.team = parseWitch(Imitation.state.info.team)
    this.monster = parseMonster(originMonster)

    this.InstanceNavigation = new Navigation()
    this.InstanceNavigation.content = [
      { name: '战斗', active: true },
      { name: '仓库', event: () => Imitation.state.page.current = 'store' }
    ]

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
    this.InstanceMonster.monster = arrayRandom(this.monster, 1)[0]

    this.round()
  }

  async round(witch) {
    if (witch) {
      this.InstanceWitch.previous = this.InstanceWitch.witch
      this.InstanceWitch.witch = witch
      this.InstanceWitch.next = arrayRandom(this.team.filter(i => i.key !== this.InstanceWitch.witch.key), 2)
      this.InstanceWitch.fadeTime = 0
    }
    if (!witch) {
      this.InstanceWitch.witch = arrayRandom(this.team, 1)[0]
      this.InstanceWitch.next = arrayRandom(this.team.filter(i => i.key !== this.InstanceWitch.witch.key), 2)
    }

    this.InstanceMonster.skill = arrayRandom(this.InstanceMonster.monster.skill, 1)[0]
    this.InstanceMonster.skillTime = 0

    this.InstanceWitch.touchEnd = async (skill, witch) => {
      this.InstanceWitch.use = true

      await wait(60)
      await this.compute(this.InstanceWitch.witch, this.InstanceMonster.monster, skill, this.InstanceMonster.skill)
      await wait(120)
      await this.round(witch)
      await wait(60)

      this.InstanceWitch.use = false
    }
  }

  async compute(witch, monster, witchSkill, monsterSkill) {
    const witchResult = witchSkill.function(witch, monster, this.team)

    Message.play(`使用 ${witchSkill.name}`)

    while (witchResult.length) {
      const result = witchResult.shift()

      // if (current.animation) {
      //   if (current.target === witch) {
      //     Animation.play(current.animation, (img) => [this.InstanceWitch.x + this.InstanceWitch.width / 2 - img.width / 2, this.InstanceWitch.y + this.InstanceWitch.height / 2 - img.height / 2])
      //   }
      //   if (current.target === monster) {
      //     Animation.play(current.animation, (img) => [this.InstanceMonster.x + this.InstanceMonster.width / 2 - img.width / 2, this.InstanceMonster.y + this.InstanceMonster.height / 2 - img.height / 2])
      //   }
      // }

      const handle = target => {
        const current = { ...result, target }

        current.target.buff.forEach(i => i.value(current))

        if (current.effect === 'Cure') {
          numberAnimation(Math.min(current.value, current.target.purity_ - current.target.purity), 32, i => current.target.purity = current.target.purity + i)
        }
        if (current.effect === 'Damage') {
          numberAnimation(Math.min(current.value, current.target.dirty), 32, i => current.target.dirty = current.target.dirty - i)
        }
        if (current.effect === 'Defent') {
          numberAnimation(Math.min(current.value, current.target.dirty), 32, i => current.target.dirty = current.target.dirty - i)
        }
        if (current.effect === 'Buff') {
          current.target.buff.push(current)
        }
        if (current.effect === 'Improve-Rational') {
          numberAnimation(current.value, 32, i => current.target.rational = current.target.rational + i)
        }
      }

      result.target.forEach(target => handle(target))
    }

    const monsterResult = monsterSkill.function(monster, witch, this.team)

    while (monsterResult.length) {
      const result = monsterResult.shift()

      const handle = target => {
        const current = { ...result, target }

        current.target.buff.forEach(i => i.value(current))

        if (current.effect === 'Cure') {
          numberAnimation(Math.min(current.value, current.target.dirty_ - current.target.dirty_), 32, i => current.target.dirty = current.target.dirty + i)
        }
        if (current.effect === 'Damage') {
          numberAnimation(Math.min(current.value, current.target.purity), 32, i => current.target.purity = current.target.purity - i)
        }
      }

      result.target.forEach(target => handle(target))
    }

    new Array(...this.team, monster).forEach(i => {
      i.buff.forEach(i_ => {
        i_.time = i_.time - 1
        if (i_.time === 0) i.buff = i.buff.filter(i__ => i__ !== i_)
      })
    })
  }

  render() {
    this.InstanceMonster.y = Canvas.height / 2 - this.InstanceMonster.height * 1.1 - this.InstanceMonster.skillDescriptionHeight - this.InstanceWitch.skillDescriptionHeight

    this.InstanceMonster.render()
    this.InstanceWitch.render()
    this.InstanceNavigation.render()
  }
}

export default FadeCreator(Page)