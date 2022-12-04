import { symbolNumber, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText } from './utils-canvas'
import { UI, Click, FadeCreator } from './utils-ui'
import { originCharacteristic, parseWitch } from './source'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

import { Scroll } from './ui-scroll'
import { Navigation } from './ui-navigation'
import { Mask } from './ui-mask'

class ListItem {
  constructor() {
    this.x
    this.y
    this.width
    this.height

    this.offsetX = 0
    this.offsetY = 0

    this.activeIf

    this.activeTime = 0

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
    if (this.activeIf && this.activeTime < 1) {
      this.activeTime = numberFix(this.activeTime + 0.05)
    }
    if (!this.activeIf && this.activeTime > 0) {
      this.activeTime = numberFix(this.activeTime - 0.05)
    }

    const { x, y, width, height } = this.option

    Canvas.ctx.save()

    drawRectRadius({ x, y, width, height, radius: 4 })

    Canvas.ctx.fillStyle = 'rgba(40, 40, 90, 1)'
    Canvas.ctx.fill()

    Canvas.ctx.clip()

    drawRect({ x, y: this.y + this.height * 0.15 * (1 - this.activeTime), width, height: this.height - (this.height * 0.3 * (1 - this.activeTime)) })
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fill()

    drawImageFullHeight(this.witch.imageDOM, { ...this.option, y: this.y + this.height * 0.2 * (1 - this.activeTime), height: this.height - (this.height * 0.4 * (1 - this.activeTime)) })

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
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  load() {
    this.witch = parseWitch(Imitation.state.info.library)
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

    this.previous

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
        Canvas.ctx.fillText('装载', this.x + this.width * 0.07, this.y + this.height - this.width * 0.045)
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
        Canvas.ctx.fillText('卸载', this.x + this.width - this.width * 0.07, this.y + this.height - this.width * 0.045)
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
      Canvas.ctx.textAlign = 'end'
      drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.height - this.width * 0.09, width: 2, height: this.width * 0.05, radius: 1 })
      Canvas.ctx.fill()
      Canvas.ctx.fillText('升级', this.x + this.width - this.width * 0.07, this.y + this.height - this.width * 0.045)
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
      Canvas.ctx.textAlign = 'end'
      drawRectRadius({ x: this.x + this.width - this.width * 0.04, y: this.y + this.width * 0.04, width: 2, height: this.width * 0.05, radius: 1 })
      Canvas.ctx.fill()
      Canvas.ctx.fillText('重生', this.x + this.width - this.width * 0.07, this.y + this.width * 0.045)

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

class Page {
  constructor() {
    this.InstanceNavigation = new Navigation()
    this.InstanceNavigation.content = [
      { name: '战斗', event: () => Imitation.state.page.current = 'pve' },
      { name: '仓库', active: true }
    ]

    this.InstanceMask = new Mask()

    this.InstanceList = new List()
    this.InstanceList.width = Math.min(Canvas.width - 24, 1080)
    this.InstanceList.height = Math.min(Canvas.width * 0.5, Canvas.maxWidth * 0.5)
    this.InstanceList.x = (Canvas.width - this.InstanceList.width) / 2
    this.InstanceList.y = 12 + Canvas.safeArea.top
    this.InstanceList.load()
    this.InstanceList.init()
    this.InstanceList.touchEvent = witch => {
      if (this.InstanceWitch.witch === witch) return

      this.InstanceWitch.previous = this.InstanceWitch.witch
      this.InstanceWitch.witch = witch
      this.InstanceWitch.previousFadeTime = 0

      this.InstanceList.InstanceWitch.forEach(i => i.activeIf = i.witch === witch)
    }
    this.InstanceList.InstanceWitch.forEach(i => i.activeIf = i.witch.key === this.InstanceList.witch[0].key)

    this.InstanceWitch = new Witch()
    this.InstanceWitch.width = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceWitch.height = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.InstanceWitch.x = (Canvas.width - this.InstanceWitch.width) * 0.5
    this.InstanceWitch.y = Canvas.height / 2 - this.InstanceWitch.height * 0.05
    this.InstanceWitch.useEvent = async (position) => {
      if (position === 'left') {
        Imitation.state.info.team = Imitation.state.info.team.filter(i => i.key !== this.InstanceWitch.witch.key)
        Message.play('卸载成功')
      }

      if (position === 'right') {
        if (Imitation.state.info.team.length === 4) {
          Message.play('装载失败 超过最大数量')
          return
        }
        if (Imitation.state.info.team.find(i => i.key === this.InstanceWitch.witch.key)) {
          Message.play('已装载')
          return
        }
        if (Imitation.state.info.library.find(i => i.key === this.InstanceWitch.witch.key).level < 1) {
          Message.play('装载失败 等级不足 1')
          return
        }
        Imitation.state.info.team.push({ key: this.InstanceWitch.witch.key })
        Message.play('装载成功')
      }

      if (position === 'top') {
        if (this.InstanceWitch.witch.exp < Math.pow(2, this.InstanceWitch.witch.level) * 100) {
          Message.play(`升级失败 经验值不足${Math.pow(2, this.InstanceWitch.witch.level) * 100}`)
          return
        }

        const snapshot = { ...this.InstanceWitch.witch }

        const find = Imitation.state.info.library.find(i => i.key === this.InstanceWitch.witch.key)

        find.exp = find.exp - Math.pow(2, find.level) * 100
        find.level = find.level + 1

        this.InstanceWitch.witch = parseWitch([find])[0]

        this.InstanceMask.showIf = true
        this.InstanceMask.textTextAlign = 'left'
        this.InstanceMask.text = [
          '等级提升',
          `等级 ${Math.ceil(snapshot.level)} -> ${Math.ceil(this.InstanceWitch.witch.level)}`,
          `经验 ${Math.ceil(snapshot.exp)} -> ${Math.ceil(this.InstanceWitch.witch.exp)}`,
          `清醒 ${Math.ceil(snapshot.purity)} -> ${Math.ceil(this.InstanceWitch.witch.purity)}`,
          `理性 ${Math.ceil(snapshot.rational)} -> ${Math.ceil(this.InstanceWitch.witch.rational)}`,
          `感性 ${Math.ceil(snapshot.perceptual)} -> ${Math.ceil(this.InstanceWitch.witch.perceptual)}`,
        ]
        this.InstanceMask.touchEvent = () => {
          this.InstanceMask.showIf = false
          this.InstanceMask.text = null
          this.InstanceMask.touchEvent = null
        }
      }

      if (position === 'bottom') {
        if (this.InstanceWitch.witch.exp < 100) {
          Message.play(`重生失败 经验值不足 100`)
          return
        }

        const result = arrayRandom(originCharacteristic, 2)

        const levelRandom = () => {
          var level = Math.random()

          if (level < 1 && level > 0.9999) level = 8
          if (level < 1 && level > 0.999) level = 7
          if (level < 1 && level > 0.995) level = 6
          if (level < 1 && level > 0.98) level = 5
          if (level < 1 && level > 0.94) level = 4
          if (level < 1 && level > 0.86) level = 3
          if (level < 1 && level > 0.60) level = 2
          if (level < 1 && level > 0) level = 1

          return level
        }

        result[0].level = levelRandom()
        result[1].level = levelRandom()

        const snapshot = { ...this.InstanceWitch.witch }

        const find = Imitation.state.info.library.find(i => i.key === this.InstanceWitch.witch.key)

        find.exp = find.exp - 100
        find.characteristic = [{ key: result[0].key, level: result[0].level }, { key: result[1].key, level: result[1].level }]

        this.InstanceWitch.witch = parseWitch([find])[0]

        this.InstanceMask.showIf = true
        this.InstanceMask.textTextAlign = 'left'
        this.InstanceMask.text = [
          '性格重生',
          `${this.InstanceWitch.witch.characteristic[1].name} ${symbolNumber(this.InstanceWitch.witch.characteristic[1].level)} : ${this.InstanceWitch.witch.characteristic[1].description}`,
          `${this.InstanceWitch.witch.characteristic[0].name} ${symbolNumber(this.InstanceWitch.witch.characteristic[0].level)} : ${this.InstanceWitch.witch.characteristic[0].description}`,
          `经验 ${Math.ceil(snapshot.exp)} -> ${Math.ceil(this.InstanceWitch.witch.exp)}`,
          `清醒 ${Math.ceil(snapshot.purity)} -> ${Math.ceil(this.InstanceWitch.witch.purity)}`,
          `理性 ${Math.ceil(snapshot.rational)} -> ${Math.ceil(this.InstanceWitch.witch.rational)}`,
          `感性 ${Math.ceil(snapshot.perceptual)} -> ${Math.ceil(this.InstanceWitch.witch.perceptual)}`,
        ]
        this.InstanceMask.touchEvent = () => {
          this.InstanceMask.showIf = false
          this.InstanceMask.text = null
          this.InstanceMask.touchEvent = null
        }
      }

      this.InstanceList.load()
      this.InstanceList.init()
      this.InstanceList.InstanceWitch.forEach(i => i.activeIf = i.witch.key === this.InstanceWitch.witch.key)
      this.InstanceWitch.witch = this.InstanceList.witch.find(i => i.key === this.InstanceWitch.witch.key)
      Imitation.state.setInfo()
    }
    this.InstanceWitch.witch = this.InstanceList.witch[0]
  }

  render() {
    this.InstanceList.render()
    this.InstanceWitch.render()
    this.InstanceMask.render()
    this.InstanceNavigation.render()
  }
}

export default FadeCreator(Page)