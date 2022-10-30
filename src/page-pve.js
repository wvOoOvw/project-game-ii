import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, parseMaster, parseMoney, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Button } from './ui-button'
import { Scroll } from './ui-scroll'

import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/background/music_1c31bcc267a545ef971109512053f3e50.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_1c31bcc267a545ef971109512053f3e50)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class CardInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.card = props.card

    this.touchEvent = props.touchEvent
    this.touchArea = props.touchArea
    this.touchTimeout
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

  drawTitle() {
    const { x, y, width, height } = this.option

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.05
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText('CARD 卡牌', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const card = this.card

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width - width_ - width * 0.05
    const y_ = y + height - height_ - width * 0.05
    const radius_ = width * 0.03

    const text = [card.name, levelText(card.level)]

    if (card.number) text.push('x' + card.number)

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    const { x, y, width, height } = this.option
    const card = this.card

    ctx.save()

    drawRadius({ x, y, width, height, radius: 8 })

    ctx.clip()

    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()

    ctx.restore()

    addEventListener('touchstart', this.eventDown.bind(this), { x, y, width, height })
    addEventListenerPure('touchmove', this.eventMove.bind(this))
    addEventListenerPure('touchend', this.eventUp.bind(this))
  }
}

class CardInPreview {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.card = props.card

    this.novaTime = 0
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawTitle() {
    const { x, y, width, height } = this.option

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.05
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText('CARD 卡牌', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const card = this.card

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width - width_ - width * 0.05
    const y_ = y + height - height_ - width * 0.05
    const radius_ = width * 0.03

    const text = [card.name, levelText(card.level)]

    if (card.number) text.push('x' + card.number)

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  drawRace() {
    const { x, y, width, height } = this.option
    const card = this.card

    const width_ = width * 0.9
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.22
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(card.race, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawType() {
    const { x, y, width, height } = this.option
    const card = this.card

    const width_ = width * 0.9
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.39
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(card.type, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawDescription() {
    const { x, y, width, height } = this.option
    const card = this.card

    const width_ = width * 0.9
    const height_ = width * 0.57
    const x_ = x + width * 0.05
    const y_ = y + width * 0.56
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    drawMultilineText({ x: x_ + width * 0.05, y: y_ + width * 0.05, width: width_ - width * 0.1, wrapSpace: width * 0.075, text: card.description(card.level) })
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option
    const card = this.card

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()
    this.drawRace()
    this.drawType()
    this.drawDescription()

    ctx.restore()
  }
}

class Modal {
  constructor(props) {
    this.preview = null

    this.card = []
    this.title = ''
    this.sort = 'name'

    this.back = props.back

    this.InstanceScroll
    this.InstanceCardList
    this.InstanceCardPreview

    this.instanceScroll()
    this.instanceCardPreview()
  }

  get bannerHeight() {
    return 96
  }

  get cardHeight() {
    const row = Math.ceil(this.card.length / 4)
    return row === 0 ? 0 : (((windowWidth - 60) / 4 * 1.35) * row) + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.card = this.card.sort((a, b) => {
      const a_ = String(a[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
      const b_ = String(b[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
      return b_ - a_
    })

    this.instanceScroll()
    this.instanceCardList()
    this.instanceCardPreview()
  }

  instanceScroll() {
    const option = {
      x: 12,
      y: 60 + safeTop,
      width: windowWidth - 24,
      height: windowHeight - 72 - safeTop,
      radius: 12,
    }

    this.InstanceScroll = new Scroll(option)
  }

  instanceCardList() {
    this.InstanceCardList = this.card.map((card, index) => {
      const option = {
        width: (windowWidth - 60) / 4,
        card: card,
        touchAble: true,
        touchArea: this.InstanceScroll.option,
        touchEvent: () => this.preview = card,
      }
      option.height = option.width * 1.35
      option.x = 12 + parseInt(index % 4) * (option.width + 12)
      option.y = 72 + parseInt(index / 4) * (option.height + 12) + this.bannerHeight + safeTop

      return new CardInList(option)
    })
  }

  instanceCardPreview() {
    const option = {}
    option.width = windowWidth * 0.7
    option.height = option.width * 1.35
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 60

    this.InstanceCardPreview = new CardInPreview(option)
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]
      this.drawBanner(offsetY)
      this.drawCard(offsetY)
    }

    this.InstanceScroll.render(event)
  }

  drawBanner(offsetY) {
    const option = { x: 12, y: 60 - offsetY + safeTop, width: windowWidth - 24, height: this.bannerHeight, radius: 12 }

    if (!ifScreenCover(option, this.InstanceScroll.option)) return

    ctx.save()

    drawRadius(option)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
    ctx.fill()

    ctx.clip()

    {
      const option_ = {
        x: 24,
        y: 12 + option.y,
        width: windowWidth - 48,
        height: 30,
        radius: 8,
        font: `900 10px ${window.fontFamily}`,
        fillStyle: ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)'],
        text: this.title
      }

      new Button(option_).render()
    }

    {
      new Array(['name', '名称'], ['level', '等级'], ['type', '类型'], ['race', '种类']).forEach((i, index) => {
        const option_ = {
          x: 24 + index * 72,
          y: 54 + option.y,
          width: 60,
          height: 30,
          radius: 8,
          font: `900 10px ${window.fontFamily}`,
          fillStyle: i[0] === this.sort ? ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)'] : ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'],
          text: i[1]
        }

        if (!ifScreenCover(option_, this.InstanceScroll.option)) return

        new Button(option_).render()

        const event = (e) => {
          if (!ifTouchCover(e, this.InstanceScroll.option)) return

          this.sort = i[0]
          this.init()
        }

        addEventListener('touchstart', event, option_)
      })
    }

    ctx.restore()
  }

  drawCard(offsetY) {
    this.InstanceCardList.forEach((i) => {
      i.offsetY = 0 - offsetY
      if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
    })
  }

  drawPreview() {
    this.InstanceCardPreview.card = this.preview
    this.InstanceCardPreview.render()

    const close = (e) => {
      this.preview = null
      this.InstanceCardPreview.novaTime = 0
    }

    addEventListenerPure('touchstart', close)
  }

  drawButtonHome() {
    const option = {
      x: 12,
      y: 12 + safeTop,
      width: 72,
      height: 36,
      radius: 8,
      font: `900 12px ${window.fontFamily}`,
      fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'],
      text: '返回'
    }

    new Button(option).render()

    addEventListener('touchstart', this.back, option)
  }

  render() {
    this.InstanceScroll.scrollY = this.bannerHeight + this.cardHeight - this.InstanceScroll.height + 12

    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })

    if (this.preview) {
      this.drawPreview()
    }

    if (!this.preview) {
      this.drawButtonHome()
      this.drawScroll()
    }
  }
}

class CardInOpposite {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.novaTime = 0

    this.card = props.card
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height

    ctx.save()

    ctx.globalAlpha = this.novaTime

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(ImageBackground, { x: x, y: y, width: width, height: height })

    ctx.restore()
  }
}

class CardInSelf {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.card = props.card

    this.touchStart = props.touchStart
    this.touchEnd = props.touchEnd
    this.useAble = props.useAble

    this.mouseDownPosition = null

    this.novaTime = 0
    this.ifTouchEndTime = 0
    this.mouseDownPositionTime = 0
    this.useAbleTime = 0
  }

  get ifTouchEnd() {
    return this.offsetY < 0 - this.height / 2
  }

  get option() {
    const diff = {
      x: -this.width * 0.5,
      y: -this.height * 0.5,
      width: this.width,
      height: this.height
    }

    const x = this.x + this.offsetX + diff.x * this.mouseDownPositionTime
    const y = this.y + this.offsetY + diff.y * this.mouseDownPositionTime
    const width = this.width + diff.width * this.mouseDownPositionTime
    const height = this.height + diff.height * this.mouseDownPositionTime

    return { x, y, width, height }
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
      this.touchStart()
    } catch { }
  }

  eventUp(e) {
    if (this.ifTouchEnd) this.touchEnd()

    this.mouseDownPosition = null

    this.offsetX = 0
    this.offsetY = 0
  }

  eventMove(e) {
    if (!this.mouseDownPosition) return

    const changeX = (e.pageX || e.targetTouches[0].pageX) - this.mouseDownPosition[0]
    const changeY = (e.pageY || e.targetTouches[0].pageY) - this.mouseDownPosition[1]
    this.mouseDownPosition = [this.mouseDownPosition[0] + changeX, this.mouseDownPosition[1] + changeY]

    this.offsetX = this.offsetX + changeX
    this.offsetY = this.offsetY + changeY
  }

  drawTitle() {
    const { x, y, width, height } = this.option
    const ifTouchEndTime = this.ifTouchEndTime

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.05
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = `rgba(${Math.floor(255 - ifTouchEndTime * 255)}, ${Math.floor(255 - ifTouchEndTime * 255)}, ${Math.floor(255 - ifTouchEndTime * 255)}, 0.75)`
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = `rgba(${Math.floor(ifTouchEndTime * 255)}, ${Math.floor(ifTouchEndTime * 255)}, ${Math.floor(ifTouchEndTime * 255)}, 1)`
    ctx.fillText('CARD 卡牌', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const ifTouchEndTime = this.ifTouchEndTime
    const card = this.card

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width - width_ - width * 0.05
    const y_ = y + height - height_ - width * 0.05
    const radius_ = width * 0.03

    const text = [card.name, levelText(card.level)]

    if (card.number) text.push('x' + card.number)

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = `rgba(${Math.floor(255 - ifTouchEndTime * 255)}, ${Math.floor(255 - ifTouchEndTime * 255)}, ${Math.floor(255 - ifTouchEndTime * 255)}, 0.75)`
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = `rgba(${Math.floor(ifTouchEndTime * 255)}, ${Math.floor(ifTouchEndTime * 255)}, ${Math.floor(ifTouchEndTime * 255)}, 1)`
    ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  drawRace() {
    const { x, y, width, height } = this.option
    const ifTouchEndTime = this.ifTouchEndTime
    const card = this.card

    const width_ = width * 0.9
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.22
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = `rgba(${Math.floor(255 - ifTouchEndTime * 255)}, ${Math.floor(255 - ifTouchEndTime * 255)}, ${Math.floor(255 - ifTouchEndTime * 255)}, 0.75)`
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = `rgba(${Math.floor(ifTouchEndTime * 255)}, ${Math.floor(ifTouchEndTime * 255)}, ${Math.floor(ifTouchEndTime * 255)}, 1)`
    ctx.fillText(card.race, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawType() {
    const { x, y, width, height } = this.option
    const ifTouchEndTime = this.ifTouchEndTime
    const card = this.card

    const width_ = width * 0.9
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.39
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = `rgba(${Math.floor(255 - ifTouchEndTime * 255)}, ${Math.floor(255 - ifTouchEndTime * 255)}, ${Math.floor(255 - ifTouchEndTime * 255)}, 0.75)`
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = `rgba(${Math.floor(ifTouchEndTime * 255)}, ${Math.floor(ifTouchEndTime * 255)}, ${Math.floor(ifTouchEndTime * 255)}, 1)`
    ctx.fillText(card.type, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawDescription() {
    const { x, y, width, height } = this.option
    const ifTouchEndTime = this.ifTouchEndTime
    const card = this.card

    const width_ = width * 0.9
    const height_ = width * 0.57
    const x_ = x + width * 0.05
    const y_ = y + width * 0.56
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = `rgba(${Math.floor(255 - ifTouchEndTime * 255)}, ${Math.floor(255 - ifTouchEndTime * 255)}, ${Math.floor(255 - ifTouchEndTime * 255)}, 0.75)`
    ctx.fill()

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = `rgba(${Math.floor(ifTouchEndTime * 255)}, ${Math.floor(ifTouchEndTime * 255)}, ${Math.floor(ifTouchEndTime * 255)}, 1)`
    drawMultilineText({ x: x_ + width * 0.05, y: y_ + width * 0.05, width: width_ - width * 0.1, wrapSpace: width * 0.075, text: card.description(card.level) })
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    if (this.mouseDownPosition && this.mouseDownPositionTime < 1) {
      this.mouseDownPositionTime = numberFix(this.mouseDownPositionTime + 0.05)
    }
    if (!this.mouseDownPosition && this.mouseDownPositionTime > 0) {
      this.mouseDownPositionTime = numberFix(this.mouseDownPositionTime - 0.05)
    }

    if (this.ifTouchEnd && this.ifTouchEndTime < 1) {
      this.ifTouchEndTime = numberFix(this.ifTouchEndTime + 0.05)
    }
    if (!this.ifTouchEnd && this.ifTouchEndTime > 0) {
      this.ifTouchEndTime = numberFix(this.ifTouchEndTime - 0.05)
    }

    if (this.useAble && this.useAbleTime < 1) {
      this.useAbleTime = numberFix(this.useAbleTime + 0.05)
    }
    if (!this.useAble && this.useAbleTime > 0) {
      this.useAbleTime = numberFix(this.useAbleTime - 0.05)
    }

    const card = this.card
    const { x, y, width, height } = this.option

    ctx.save()

    ctx.globalAlpha = Math.min(this.novaTime, this.useAbleTime)

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()

    if (this.mouseDownPositionTime !== 0) {
      ctx.globalAlpha = this.mouseDownPositionTime

      this.drawRace()
      this.drawType()
      this.drawDescription()
    }

    ctx.restore()

    if (!this.useAble) return

    addEventListener('touchstart', this.eventDown.bind(this), { x, y, width, height })
    addEventListenerPure('touchmove', this.eventMove.bind(this))
    addEventListenerPure('touchend', this.eventUp.bind(this))
  }
}

class Role {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.type = props.type
    this.information = props.information
    this.env = props.env
    this.useCard = props.useCard

    this.InstanceCards = []
    this.touchCard

    this.show = 'card'
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawBackground() {
    const { x, y, width, height, information } = this

    ctx.save()

    drawRadius({ x, y, width, height, radius: this.width / 2 })

    ctx.clip()

    drawImage(information.master.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.restore()
  }

  drawTitle() {
    ctx.save()

    const { x, y, width, height, information } = this

    const option = {
      width: width * 0.4,
      height: width * 0.12,
    }

    option.x = x + width / 2 - option.width / 2
    option.y = y + width * 0.02
    option.radius = option.height / 4
    option.text = [information.master.name, levelText(information.master.level)].join(' ')
    option.font = `900 ${width * 0.04}px ${window.fontFamily}`
    option.fillStyle = [`rgba(255, 255, 255, 1)`, 'rgba(0, 0, 0, 1)']

    new Button(option).render()

    ctx.restore()
  }

  drawHM() {
    const { x, y, width, height, information } = this

    const option = {
      width: Math.min(width * 0.7, windowWidth / 2 - 24),
      height: width * 0.12,
    }

    option.y = y + height - option.height - width * 0.02
    option.radius = option.height / 2

    option.x = x + width / 2 - option.width - width * 0.02

    drawRadius(option)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.04}px ${window.fontFamily}`

    ctx.fillStyle = `rgba(185, 0, 0, 1)`
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    ctx.fillText(`HP ${information.master.HP}`, option.x + option.width / 2, option.y + option.height / 2)

    option.x = x + width / 2 + width * 0.02

    drawRadius(option)

    ctx.fillStyle = `rgba(0, 0, 185, 1)`
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    ctx.fillText(`MP ${information.master.MP}`, option.x + option.width / 2, option.y + option.height / 2)
  }

  drawBuff() {
    const { x, y, width, height, information } = this

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.font = `900 ${width * 0.03}px ${window.fontFamily}`

    var renderList = information.master.buff
      .reduce((t, i) => {
        const find = t.find(i_ => i_.name === i)
        if (find) find.number = find.number + 1
        if (!find) t.push({ name: i, number: 1 })
        return t
      }, [{ name: 'BUFF' }])

    renderList
      .forEach((i, index) => {
        const option = {
          width: width * 0.16,
          height: width * 0.08,
          y: y + width * 0.15
        }

        const maxIndex = renderList.length
        const centerIndex = maxIndex / 2 - 0.5
        const diff = index - centerIndex

        option.radius = option.height / 4
        option.x = x + (width - option.width) / 2 + diff * (option.width + width * 0.02)

        drawRadius(option)

        ctx.fillStyle = `rgba(0, 0, 0, 0.75)`

        ctx.fill()

        ctx.fillStyle = 'rgba(255, 255, 255, 1)'

        ctx.fillText(i.number ? `${i.name} X${i.number}` : i.name, option.x + option.width / 2, option.y + option.height / 2)
      })
  }

  drawCard() {
    const width = Math.min(this.width * 1.75, windowWidth - 24)
    const height = this.height
    const x = this.x - (width - this.width) / 2
    const y = this.y + width * 0.02

    this.InstanceCards = this.InstanceCards.filter(i => this.information.card.hand.find(i_ => i_ === i.card))

    this.information.card.hand.forEach((i, index) => {
      const maxIndex = this.information.card.hand.length
      const centerIndex = maxIndex / 2 - 0.5

      const diff = index - centerIndex

      const option = {
        width: (width / 4 - 4) - width / 48
      }
      option.height = option.width * 1.35
      option.x = x + (width - option.width) / 2 + diff * (width / 4 - 4)
      option.y = y + (height - option.height) / 2
      option.touchStart = () => this.touchCard = i
      option.touchEnd = () => this.useCard(i, this)
      option.useAble = this.env.current === this

      const find = this.InstanceCards.find(i_ => i_.card === i)

      if (find) {
        find.x = option.x
        find.useAble = option.useAble
      }

      if (!find) {
        const INS = this.type === 'self' ? CardInSelf : CardInOpposite
        this.InstanceCards.push(new INS({ card: i, ...option }))
      }
    })

    this.InstanceCards.forEach(i => i.card !== this.touchCard ? i.render() : null)
    this.InstanceCards.forEach(i => i.card === this.touchCard ? i.render() : null)
  }

  render() {
    this.drawBackground()
    this.drawTitle()
    this.drawHM()
    this.drawBuff()
    this.drawCard()
  }
}

class Action {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.InstanceRoleSelf = props.InstanceRoleSelf
    this.InstanceRoleOpposite = props.InstanceRoleOpposite
    this.env = props.env

    this.roundOver = props.roundOver
    this.watchStore = props.watchStore
    this.watchCemetery = props.watchCemetery

    this.useAbleTime = 0
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawEnv() {
    const option = { x: this.x + 12, y: this.y + this.height / 2 - 15 + 32, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: `ROUND ${this.env.round}` }

    new Button(option).render()
  }

  drawButtonOverRound() {
    const option = { x: this.x + this.width - 84, y: this.y + this.height / 2 - 15 + 32, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: [`rgba(255, 255, 255, 1)`, 'rgba(0, 0, 0, 1)'], text: '结束回合' }

    new Button(option).render()

    if (this.useAbleTime !== 1) return

    const event = () => {
      this.roundOver()
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonStore() {
    const option = { x: this.x + 12, y: this.y + this.height / 2 - 15 - 32, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: `查看牌库x${this.InstanceRoleSelf.information.card.store.length}` }

    new Button(option).render()

    if (this.useAbleTime !== 1) return

    const event = () => {
      this.watchStore()
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonCemetery() {
    const option = { x: this.x + 96, y: this.y + this.height / 2 - 15 - 32, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: `查看墓地x${this.InstanceRoleSelf.information.card.cemetery.length}` }

    new Button(option).render()

    if (this.useAbleTime !== 1) return

    const event = () => {
      this.watchCemetery()
    }

    addEventListener('touchstart', event, option)
  }

  drawBackground() {
    drawRadius({ ...this.option, radius: 12, x: 12, width: windowWidth - 24 })

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'

    ctx.fill()
  }

  render() {
    if (this.env.current === this.InstanceRoleSelf && this.useAbleTime < 1) {
      this.useAbleTime = numberFix(this.useAbleTime + 0.05)
    }

    if (this.env.current !== this.InstanceRoleSelf && this.useAbleTime > 0) {
      this.useAbleTime = numberFix(this.useAbleTime - 0.05)
    }

    this.drawBackground()
    this.drawEnv()
    this.drawButtonOverRound()
    this.drawButtonStore()
    this.drawButtonCemetery()

  }
}

class Page {
  constructor() {
    this.modal = null

    this.env = {
      round: 0,
      current: null
    }

    this.InstanceRoleSelf
    this.InstanceRoleOpposite
    this.InstanceAction
    this.InstanceModal

    this.instanceRoleSelf()
    this.instanceRoleOpposite()
    this.instanceAction()
    this.instanceModal()
    this.initBattler()
  }

  initBattler() {
    new Array(3).fill().forEach(i => {
      this.pumpCard(this.InstanceRoleSelf.information.card.store.shift(), this.InstanceRoleSelf)
      this.pumpCard(this.InstanceRoleOpposite.information.card.store.shift(), this.InstanceRoleOpposite)
    })

    this.env.current = this.InstanceRoleSelf

    this.roundStart()
  }

  instanceRoleSelf() {
    const boxHeight = (windowHeight - 180 - safeTop) / 2

    const option = {
      width: Math.min(windowWidth - 24, boxHeight - 24, windowHeight * 0.3),
      height: Math.min(windowWidth - 24, boxHeight - 24, windowHeight * 0.3),
      type: 'self',
      information: Imitation.state.battle.self,
      env: this.env,
      useCard: this.useCard,
    }

    option.x = (windowWidth - option.width) / 2
    option.y = (safeTop + 60) + (windowHeight - 180 - safeTop) / 2 + 120 + (boxHeight - option.height) / 2

    this.InstanceRoleSelf = new Role(option)
  }

  instanceRoleOpposite() {
    const boxHeight = (windowHeight - 180 - safeTop) / 2

    const option = {
      width: Math.min(windowWidth - 24, boxHeight - 24, windowHeight * 0.3),
      height: Math.min(windowWidth - 24, boxHeight - 24, windowHeight * 0.3),
      type: 'opposite',
      information: Imitation.state.battle.opposite,
      env: this.env,
      useCard: this.useCard
    }

    option.x = (windowWidth - option.width) / 2
    option.y = (safeTop + 60) + (windowHeight - 180 - safeTop) / 2 - option.height - (boxHeight - option.height) / 2

    this.InstanceRoleOpposite = new Role(option)
  }

  instanceAction() {
    const width = windowWidth - 24
    const height = 120

    this.InstanceAction = new Action({
      x: (windowWidth - width) / 2,
      y: (safeTop + 60) + (windowHeight - 180 - safeTop) / 2,
      width: width,
      height: height,
      env: this.env,
      InstanceRoleSelf: this.InstanceRoleSelf,
      InstanceRoleOpposite: this.InstanceRoleOpposite,
      roundOver: this.roundOver,
      watchStore: () => {
        this.modal = true
        this.InstanceModal.title = '牌库'
        this.InstanceModal.card = this.InstanceRoleSelf.information.card.store
        this.InstanceModal.init()
      },
      watchCemetery: () => {
        this.modal = true
        this.InstanceModal.title = '墓地'
        this.InstanceModal.card = this.InstanceRoleSelf.information.card.cemetery
        this.InstanceModal.init()
      }
    })
  }

  instanceModal() {
    this.InstanceModal = new Modal({
      back: () => this.modal = false
    })
  }

  drawRoleSelf() {
    this.InstanceRoleSelf.render()
  }

  drawRoleOpposite() {
    this.InstanceRoleOpposite.render()
  }

  drawAction() {
    this.InstanceAction.render()
  }

  drawModal() {
    this.InstanceModal.render()
  }

  drawBackground() {
    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  drawButtonHome() {
    const option = {
      x: 12,
      y: 12 + safeTop,
      width: 72,
      height: 36,
      radius: 8,
      font: `900 12px ${window.fontFamily}`,
      fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'],
      text: '返回'
    }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'explore'
    }

    addEventListener('touchstart', event, option)
  }

  pumpCard = (card, role) => {
    if (role.information.card.hand.length === 4) {
      role.information.card.cemetery.push(card)
    }
    if (role.information.card.hand.length < 4) {
      role.information.card.hand.push(card)
    }
  }

  useCard = async (card, role) => {
    const [self, opposite] = role === this.InstanceRoleSelf ? [this.InstanceRoleSelf, this.InstanceRoleOpposite] : [this.InstanceRoleOpposite, this.InstanceRoleSelf]

    var result = card.function(card, self.information, opposite.information, this.env)

    if (result.find(i => i.error)) {
      Imitation.state.function.message(result.find(i => i.error).error, 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    Imitation.state.function.message([card.name, levelText(card.level)].join(' '), 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')

    if (result.find(i => i.animation)) {
      const animations = result.filter(i => i.animation)

      while (animations.length) {
        const current = animations.shift()
        if (current.target === 'self') {
          Imitation.state.function.animation(current.animation, (img) => [self.x + self.width / 2 - img.width / 2, self.y + self.height / 2 - img.height / 2])
        }
        if (current.target === 'opposite') {
          Imitation.state.function.animation(current.animation, (img) => [opposite.x + opposite.width / 2 - img.width / 2, opposite.y + opposite.height / 2 - img.height / 2])
        }
      }
    }

    self.information.master.skill.forEach(skill => {
      skill.function(card, result, self.information, opposite.information, this.env)
    })

    self.information.card.hand = self.information.card.hand.filter(i => i !== card)

    self.information.card.cemetery.push(card)
    self.information.card.consume.push(card)

    while (result.length) {
      const current = result.shift()

      if (current.effect === 'cost-mp') {
        if (current.target === 'self') {
          self.information.master.MP = self.information.master.MP - current.value
        }
      }

      if (current.effect === 'hit') {
        if (current.target === 'opposite') {
          opposite.information.master.HP = opposite.information.master.HP - current.value
        }
      }

      if (current.effect === 'buff') {
        if (current.target === 'self') {
          self.information.master.buff.push(...new Array(current.number).fill(current.value))
        }
        if (current.target === 'opposite') {
          opposite.information.master.buff.push(...new Array(current.number).fill(current.value))
        }
      }

      if (current.effect === 'cost-buff') {
        let count = 0
        if (current.target === 'self') {
          self.information.master.buff = self.information.master.buff.filter(i => {
            if (i === current.value && count !== current.number) {
              count = count + 1
              return false
            }
            return true
          })
        }
        if (current.target === 'opposite') {
          opposite.information.master.buff = opposite.information.master.buff.filter(i => {
            if (i === current.value && count !== current.number) {
              count = count + 1
              return false
            }
            return true
          })
        }
      }

      if (current.effect === 'cure-hp') {
        if (current.target === 'self') {
          self.information.master.HP = self.information.master.HP + current.value
        }
      }

      if (current.effect === 'cure-mp') {
        if (current.target === 'self') {
          self.information.master.MP = self.information.master.MP + current.value
        }
      }

      if (current.effect === 'pump-store-positive') {
        if (current.target === 'self') {
          new Array(current.value).fill().forEach(i => {
            const card = this.InstanceRoleSelf.information.card.store.shift()
            if (!card) return
            this.pumpCard(card, this.InstanceRoleSelf)
          })
        }
      }

      if (current.effect === 'pump-store-point') {
        if (current.target === 'self') {
          current.value.forEach(i => {
            this.pumpCard(i, this.InstanceRoleSelf)
            this.InstanceRoleSelf.information.card.store = this.InstanceRoleSelf.information.card.store.filter(i_ => i_ !== i)
          })
        }
      }

      if (current.effect === 'pump-cemetery-positive') {
        if (current.target === 'self') {
          new Array(current.value).fill().forEach(i => {
            this.pumpCard(this.InstanceRoleSelf.information.card.cemetery.shift(), this.InstanceRoleSelf)
          })
        }
      }

      if (current.effect === 'pump-cemetery-point') {
        if (current.target === 'self') {
          current.value.forEach(i => {
            this.pumpCard(i, this.InstanceRoleSelf)
            this.InstanceRoleSelf.information.card.cemetery = this.InstanceRoleSelf.information.card.cemetery.filter(i_ => i_ !== i)
          })
        }
      }
    }

    this.battlerOver()
  }

  roundStart = async () => {
    new Array(1).fill().forEach(i => {
      const card = this.env.current.information.card.store.shift()
      if (!card) return
      this.pumpCard(card, this.env.current)
    })

    if (this.env.current === this.InstanceRoleSelf) {
      this.env.round = this.env.round + 1
    }

    if (this.env.current === this.InstanceRoleOpposite) {
      const result = this.InstanceRoleOpposite.information.AI(this.InstanceRoleOpposite.information, this.InstanceRoleSelf.information, this.env)

      while (result.length) {
        await wait(750)
        await this.useCard(result.shift(), this.InstanceRoleOpposite)
        await wait(750)
      }

      this.roundOver()
    }
  }

  roundOver = async () => {
    if (this.env.current === this.InstanceRoleSelf) {
      this.env.current = this.InstanceRoleOpposite
      await this.roundStart()
      return
    }

    if (this.env.current === this.InstanceRoleOpposite) {
      this.env.current = this.InstanceRoleSelf
      await this.roundStart()
      return
    }
  }

  battlerOver = () => {
    if (this.InstanceRoleOpposite.information.master.HP <= 0) {
      const reward = Imitation.state.battle.reward()

      const library = Imitation.state.info.library.card

      reward.forEach(i => {
        if (i.money) {
          const findInLibrary = Imitation.state.info.money.find(i => i.key === i.key)
          findInLibrary.number = findInLibrary.number + i.number
        }
        if (i.card) {
          const findInLibrary = library.find(i_ => i_.key === i.key)
          if (findInLibrary) {
            findInLibrary.number = findInLibrary.number + i.number
          }
          if (!findInLibrary) {
            library.push({ key: i.key, level: i.level, number: i.number })
          }
        }
        if (i.master) {
          const findInLibrary = library.master.find(i_ => i_.key === i.key)
          if (findInLibrary) {
            findInLibrary.number = findInLibrary.number + i.number
          }
          if (!findInLibrary) {
            library.push({ key: i.key, level: 1, number: i.number })
          }
          if (findInLibrary.number >= 100 * Math.pow(3, findInLibrary.level)) {
            findInLibrary.level = findInLibrary.level + 1
          }
        }
      })

      Imitation.state.function.saveInfo()
      Imitation.state.function.message('战斗胜利', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
      Imitation.state.reward = { value: reward, back: 'explore', title: '战斗胜利' }
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'reward'
      return
    }
    if (this.InstanceRoleSelf.information.master.HP <= 0) {
      Imitation.state.function.message('战斗失败', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
      Imitation.state.reward = { value: [], back: 'explore', title: '战斗失败' }
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'reward'
      return
    }


  }

  render() {
    this.drawBackground()

    if (this.modal) {
      this.drawModal()
    }

    if (!this.modal) {
      this.drawButtonHome()
      this.drawAction()
      this.drawRoleOpposite()
      this.drawRoleSelf()
    }
  }
}

export default Page