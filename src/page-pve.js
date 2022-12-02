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

    this.useIf

    this.mouseDownPosition = null

    this.rotateTime = 0
    this.previousFadeTime = 0

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

  get skillDescriptionHeight() {
    var currentSkill

    if (this.rotateTime > 0) currentSkill = this.witch.skill[0]
    if (this.rotateTime < 0) currentSkill = this.witch.skill[1]

    if (!currentSkill) return 0

    Canvas.ctx.textAlign = 'start'
    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.font = `900 ${this.width * 0.04}px courier`

    const row = drawMultilineText({ width: this.width * 0.9, text: currentSkill.description, onlyread: true })

    return (this.width * 0.06 + this.width * 0.06 * row) * Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1)
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
      this.touchStart()
    } catch { }
  }

  eventUp(e) {
    if (this.rotateTime === this.maxRotateTime) {
      this.useEvent(this.witch.skill[0], this.next[0])
    }
    if (this.rotateTime === -this.maxRotateTime) {
      this.useEvent(this.witch.skill[1], this.next[1])
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

    if (result > this.maxRotateTime) this.rotateTime = this.maxRotateTime
    if (result < -this.maxRotateTime) this.rotateTime = -this.maxRotateTime
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

    if (this.previousFadeTime < 1) {
      this.previousFadeTime = numberFix(this.previousFadeTime + 0.02)
    }

    Canvas.ctx.save()

    // skill

    var currentSkill

    if (this.rotateTime > 0) currentSkill = this.witch.skill[0]
    if (this.rotateTime < 0) currentSkill = this.witch.skill[1]

    if (currentSkill) {
      drawRectRadius({ ...this.option, radius: 8 })
      Canvas.ctx.fillStyle = 'rgba(40, 90, 90, 1)'
      Canvas.ctx.fill()

      Canvas.ctx.globalAlpha = Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1)

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
        drawMultilineText({ x: this.x + this.width / 2, y: this.y + this.height + this.width * 0.04 * Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: `切换 / ${this.next[0].name}` })
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
        drawMultilineText({ x: this.x + this.width / 2, y: this.y + this.height + this.width * 0.04 * Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: `切换 / ${this.next[1].name}` })
      }

      Canvas.ctx.textAlign = 'center'
      const row = drawMultilineText({ width: this.width * 0.9, text: currentSkill.description, onlyread: true })
      drawMultilineText({ x: this.x + this.width / 2, y: this.y - this.width * 0.04 - (this.width * 0.02 + this.width * 0.06 * row) * Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: currentSkill.description })
    }

    // skill --end

    // paper

    Canvas.ctx.translate(this.x + this.width * 0.5, this.y + this.height * 2)
    Canvas.ctx.rotate(this.rotateTime / 400)
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

    if (!this.useIf) {
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

class Mask {
  constructor() {
    this.useIf

    this.text

    this.touchEvent = new Function()

    this.alphaTime = 0
  }

  render() {
    if (this.useIf && this.alphaTime < 1) {
      this.alphaTime = numberFix(this.alphaTime + 0.05)
    }
    if (!this.useIf && this.alphaTime > 0) {
      this.alphaTime = numberFix(this.alphaTime - 0.05)
    }

    Canvas.ctx.save()

    Canvas.ctx.globalAlpha = this.alphaTime * 0.5

    drawFullColor('rgba(0, 0, 0, 1)')

    Canvas.ctx.globalAlpha = this.alphaTime

    if (this.text) {
      Canvas.ctx.textAlign = 'center'
      Canvas.ctx.textBaseline = 'middle'
      Canvas.ctx.font = `900 14px courier`
      Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      Canvas.ctx.fillText(this.text[0], Canvas.width / 2, Canvas.height / 2 - 24)

      Canvas.ctx.font = `900 12px courier`

      Canvas.ctx.fillText(this.text[1], Canvas.width / 2, Canvas.height / 2 + 24)

      drawRectRadius({ x: (Canvas.width - 240) / 2, y: Canvas.height / 2 - 1, width: 240, height: 2, radius: 2 })
      Canvas.ctx.fill()
    }

    Canvas.ctx.restore()

    if (this.useIf || this.alphaTime > 0) Event.addEventListener('touchstart', this.touchEvent, { stop: true, priority: 100 })
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
    this.InstanceMask.width = Canvas.width
    this.InstanceMask.height = Canvas.height
    this.InstanceMask.x = 0
    this.InstanceMask.y = 0

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

    this.InstanceMask.useIf = false
    this.InstanceWitch.useIf = false

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

    this.InstanceWitch.useEvent = async (skill, witch) => {
      this.InstanceMask.useIf = true
      this.InstanceWitch.useIf = true

      this.InstanceMask.text = ['战斗中', '等待战斗结束']

      Message.play(`使用 ${skill.name}`)

      await wait(60)

      this.InstanceMonster.skillIf = false

      await wait(60)

      await this.compute(this.InstanceWitch.witch, this.InstanceMonster.monster, skill, this.InstanceMonster.skill)

      await wait(115)

      if (this.InstanceMonster.monster.dirty === 0) {
        this.InstanceMask.useIf = false
        await wait(15)
        this.InstanceMask.useIf = true
        this.InstanceMask.text = ['战斗胜利', '点击任意处 继续战斗']
        this.InstanceMask.touchEvent = () => {
          this.InstanceMask.text = null
          this.InstanceMask.touchEvent = null
          this.init()
        }
        this.computeResult()
        return
      }

      this.team = this.team.filter(i => i.purity > 0)

      if (this.team.length === 0) {
        this.InstanceMask.useIf = false
        await wait(15)
        this.InstanceMask.useIf = true
        this.InstanceMask.text = ['战斗失败', '点击任意处 继续战斗']
        this.InstanceMask.touchEvent = () => {
          this.InstanceMask.text = null
          this.InstanceMask.touchEvent = null
          this.init()
        }
        return
      }

      await this.round(witch)

      await wait(45)

      this.InstanceMask.useIf = false

      await wait(15)

      this.InstanceMask.text = null

      this.InstanceWitch.useIf = false
    }
  }

  async compute(witch, monster, witchSkill, monsterSkill) {
    const witchResult = witchSkill.function(witch, monster, this.team)

    while (witchResult.length) {
      const result = witchResult.shift()

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

  computeResult() {
    Imitation.state.info.team.forEach(i => {
      const find = Imitation.state.info.library.find(i_ => i_.key === i.key)

      find.exp = find.exp + this.InstanceMonster.monster.exp

      while (find.exp >= Math.pow(2, find.level) * 100) find.level = find.level + 1

      Imitation.state.setInfo()
    })
  }

  render() {
    this.InstanceMonster.y = Canvas.height / 2 - this.InstanceMonster.height * 1.1 - this.InstanceMonster.skillDescriptionHeight - this.InstanceWitch.skillDescriptionHeight

    this.InstanceMonster.render()
    this.InstanceWitch.render()
    this.InstanceMask.render()
    this.InstanceNavigation.render()
  }
}

export default FadeCreator(Page)