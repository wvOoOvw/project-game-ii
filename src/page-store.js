import { parseWitch, symbolNumber, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText } from './utils-canvas'
import { UI, Click, FadeCreator } from './utils-ui'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

import { Scroll } from './ui-scroll'
import { Navigation } from './ui-navigation'

class ListItem {
  constructor() {
    this.x
    this.y
    this.width
    this.height

    this.offsetX = 0
    this.offsetY = 0

    this.active

    this.witch

    this.touchEvent = null
    this.touchArea = null
    this.touchTimeout = null
  }

  get option() {
    return { x: this.x + this.offsetX, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  eventDown(e) {
    if (!this.touchArea || ifTouchCover(e, this.touchArea)) this.touchTimeout = true
  }

  eventUp(e) {
    if (this.touchTimeout === true) this.touchEvent()
    this.touchTimeout = false
  }

  eventMove(e) {
    this.touchTimeout = false
  }

  render() {
    const { x, y, width, height } = this.option

    Canvas.ctx.save()

    drawRectRadius({ x, y, width, height, radius: 4 })

    Canvas.ctx.fillStyle = this.active ? 'rgba(40, 40, 90, 1)' : 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fill()

    Canvas.ctx.clip()

    drawImage(this.witch.imageDOM, this.option)

    if (this.witch.inTeam) {
      drawRectRadius({ x: x + height * 0.05, y: y + height * 0.05, width: height * 0.05, height: height * 0.05, radius: height * 0.05 / 2 })
      Canvas.ctx.fillStyle = `rgba(0, 0, 0, 1)`
      Canvas.ctx.fill()
    }

    Canvas.ctx.restore()

    Event.addEventListener('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    Event.addEventListener('touchmove', this.eventMove.bind(this))
    Event.addEventListener('touchend', this.eventUp.bind(this))
  }
}

class List {
  constructor() {
    this.x
    this.y
    this.width
    this.height

    this.witch

    this.active

    this.touchEvent

    this.InstanceScroll = new Scroll()
    this.InstanceWitch = []
  }

  get option() {
    return { x: this.x, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  init() {
    this.InstanceScroll.x = this.x
    this.InstanceScroll.y = this.y
    this.InstanceScroll.width = this.width
    this.InstanceScroll.height = this.height
    this.InstanceScroll.contentWidth = (this.height * 0.65 + this.height * 0.05) * this.witch.length - this.height * 0.05

    this.InstanceWitch = this.witch.map((witch, index) => {
      const Instance = new ListItem()
      Instance.width = this.height * 0.65
      Instance.height = this.height
      Instance.x = this.x + index * (Instance.width + this.height * 0.05)
      Instance.y = this.y
      Instance.witch = witch
      Instance.touchAble = true
      Instance.touchArea = this.InstanceScroll.option
      Instance.touchEvent = () => this.touchEvent(witch)

      return Instance
    })
  }

  render() {
    const event = (scroll) => {
      this.InstanceWitch.forEach((i) => {
        i.active = i.witch.key === this.active
        i.offsetX = 0 - scroll[0]
        if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
      })
    }

    this.InstanceScroll.render(event)
  }
}

class Witch {
  constructor() {
    this.x
    this.y
    this.width
    this.height

    this.witch

    this.mouseDownPosition = null

    this.rotateTime = 0

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
    if (Math.abs(this.rotateTime) === this.maxRotateTime) this.useEvent()

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
        Canvas.ctx.fillText(this.witch.inTeam ? '卸载' : '装载', this.x + this.width * 0.07, this.y + this.height - this.width * 0.085)
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
        Canvas.ctx.fillText(this.witch.inTeam ? '卸载' : '装载', this.x + this.width - this.width * 0.07, this.y + this.height - this.width * 0.085)
      }

      Canvas.ctx.textAlign = 'center'
      const row = drawMultilineText({ width: this.width * 0.9, text: currentSkill.description, onlyread: true })
      drawMultilineText({ x: this.x + this.width / 2, y: this.y - this.width * 0.04 - (this.width * 0.02 + this.width * 0.06 * row) * Math.min(Math.abs(this.rotateTime) / this.maxRotateTime, 1), width: this.width * 0.9, wrapSpace: this.width * 0.06, text: currentSkill.description })
    }

    Canvas.ctx.textAlign = 'start'
    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.font = `900 ${this.width * 0.04}px courier`
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    Canvas.ctx.globalAlpha = 1

    drawRectRadius({ x: this.x + this.width * 0.04, y: this.y + this.height + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`Lv ${Math.ceil(this.witch.level)}`, this.x + this.width * 0.07, this.y + this.height + this.width * 0.045)
    Canvas.ctx.textAlign = 'end'
    drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.height + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
    Canvas.ctx.fill()
    Canvas.ctx.fillText(`Exp ${Math.ceil(this.witch.exp)} / ${Math.pow(2, this.witch.level) * 100}`, this.x + this.width - this.width * 0.07, this.y + this.height + this.width * 0.045)

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

class Page {
  constructor() {
    this.InstanceNavigation = new Navigation()
    this.InstanceNavigation.content = [
      { name: '战斗', event: () => Imitation.state.page.current = 'pve' },
      { name: '仓库', active: true }
    ]

    const load = () => {
      this.InstanceList.witch = parseWitch(Imitation.state.info.library)
        .map(i => { i.inTeam = Imitation.state.info.team.find(i_ => i_.key === i.key); return i })
        .sort((a, b) => {
          return a.key - b.key
        })
        .sort((a, b) => {
          const a_ = a.inTeam ? 1 : 0
          const b_ = b.inTeam ? 1 : 0
          return b_ - a_
        })
    }

    this.InstanceList = new List()
    load()
    this.InstanceList.width = Math.min(Canvas.width - 24, 1080)
    this.InstanceList.height = 220
    this.InstanceList.x = (Canvas.width - this.InstanceList.width) / 2
    this.InstanceList.y = 12 + Canvas.safeArea.top
    this.InstanceList.init()
    this.InstanceList.touchEvent = witch => {
      this.InstanceWitch.witch = witch
      this.InstanceList.active = witch.key
    }
    this.InstanceList.active = this.InstanceList.witch[0].key

    this.InstanceWitch = new Witch()
    this.InstanceWitch.width = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceWitch.height = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceWitch.x = (Canvas.width - this.InstanceWitch.width) * 0.5
    this.InstanceWitch.y = Canvas.height / 2
    this.InstanceWitch.witch = this.InstanceList.witch[0]
    this.InstanceWitch.useEvent = () => {
      if (this.InstanceWitch.witch.inTeam) {
        Imitation.state.info.team = Imitation.state.info.team.filter(i => i.key !== this.InstanceWitch.witch.key)
        Imitation.state.page.current = 'store'
        Message.play('卸载成功')
      }
      if (!this.InstanceWitch.witch.inTeam) {
        if (Imitation.state.info.team.length === 4) {
          Message.play('装载失败 超过最大数量')
          return
        }
        if (Imitation.state.info.team.find(i => i.key === this.InstanceWitch.witch.key)) {
          Message.play('已装载')
          return
        }
        Imitation.state.info.team.push({ key: this.InstanceWitch.witch.key })
        Imitation.state.page.current = 'store'
        Message.play('装载成功')
      }
      this.InstanceWitch.witch.inTeam = !this.InstanceWitch.witch.inTeam

      load()
      this.InstanceList.init()
    }
  }

  render() {
    this.InstanceList.render()
    this.InstanceWitch.render()
    this.InstanceNavigation.render()
  }
}

export default FadeCreator(Page)