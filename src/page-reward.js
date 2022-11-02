import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, parseMaster, levelText, numberFix, parseMoney } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Button } from './ui-button'

import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/background/music_1c31bcc267a545ef971109512053f3e50.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_1c31bcc267a545ef971109512053f3e50)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class MoneyInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.money = props.money
  }

  get option() {
    return { x: this.x + this.offsetX, y: this.y + this.offsetY, width: this.width, height: this.height }
  }
  
  drawTitle() {
    const { x, y, width, height } = this.option
    const money = this.money

    const width_ = width * 0.35
    const height_ = width * 0.07
    const x_ = x + width * 0.03
    const y_ = y + width * 0.03
    const radius_ = width * 0.02

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.025}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText('MONEY 货币', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const money = this.money

    const width_ = width * 0.35
    const height_ = width * 0.07
    const x_ = x + width - width_ - width * 0.03
    const y_ = y + height - height_ - width * 0.03
    const radius_ = width * 0.02

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.025}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(money.name, x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    const { x, y, width, height } = this.option
    const money = this.money

    ctx.save()

    drawRadius({ x, y, width, height, radius: 12 })

    ctx.clip()

    drawImage(money.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()

    ctx.restore()
  }
}

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

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(card.name, x_ + width_ / 2, y_ + height_ / 2)
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

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText([card.name, card.exp].join(' '), x_ + width_ / 2, y_ + height_ / 2)
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

class MasterInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.master = props.master

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
    const master = this.master

    const width_ = width * 0.35
    const height_ = width * 0.07
    const x_ = x + width * 0.03
    const y_ = y + width * 0.03
    const radius_ = width * 0.02

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.025}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText('MASTER 队长', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const master = this.master

    const width_ = width * 0.35
    const height_ = width * 0.07
    const x_ = x + width - width_ - width * 0.03
    const y_ = y + height - height_ - width * 0.03
    const radius_ = width * 0.02

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.025}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(master.name, x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    const { x, y, width, height } = this.option
    const master = this.master

    ctx.save()

    drawRadius({ x, y, width, height, radius: 12 })

    ctx.clip()

    drawImage(master.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()

    ctx.restore()

    addEventListener('touchstart', this.eventDown.bind(this), { x, y, width, height })
    addEventListenerPure('touchmove', this.eventMove.bind(this))
    addEventListenerPure('touchend', this.eventUp.bind(this))
  }
}

class MasterInPreview {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.master = props.master

    this.skillIndex = 0

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

    ctx.fillText('MASTER 队长', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const master = this.master

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width - width_ - width * 0.05
    const y_ = y + height - height_ - width * 0.05
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText([master.name, master.exp].join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  drawHP() {
    const { x, y, width, height } = this.option
    const master = this.master

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

    ctx.fillText('HP ' + master.HP, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawMP() {
    const { x, y, width, height } = this.option
    const master = this.master

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

    ctx.fillText('MP ' + master.MP, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawDescription() {
    const { x, y, width, height } = this.option
    const master = this.master

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

    drawMultilineText({ x: x_ + width * 0.05, y: y_ + width * 0.05, width: width_ - width * 0.1, wrapSpace: width * 0.075, text: master.skill[this.skillIndex].description(master.level) })
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option
    const master = this.master

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(master.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()
    this.drawHP()
    this.drawMP()
    this.drawDescription()

    ctx.restore()
  }
}

class Page {
  constructor() {
    this.preview = null

    this.type = 'card'

    this.card = []
    this.master = []
    this.money = []

    this.InstanceScroll
    this.InstanceCard
    this.InstanceCardPreview
    this.InstanceMaster
    this.InstanceMasterPreview
    this.InstanceMoney

    this.init()
    this.compute()
  }

  get bannerHeight() {
    return 96
  }

  get masterHeight() {
    const row = this.master.length
    return row === 0 ? 0 : (((windowWidth - 60) / 4 * 1.35) * row) + (row ? 12 * (row - 1) : 0)
  }

  get cardHeight() {
    const row = Math.ceil(this.card.length / 4)
    return row === 0 ? 0 : (((windowWidth - 60) / 4 * 1.35) * row) + (row ? 12 * (row - 1) : 0)
  }

  get moneyHeight() {
    const row = Math.ceil(this.money.length / 4)
    return row === 0 ? 0 : (((windowWidth - 60) / 4 * 1.35) * row) + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.card = []
    this.master = []
    this.money = []

    if (this.type === 'card') {
      this.card = parseCard(Imitation.state.reward.value.filter(i => i.card).map(i => ({ ...i, level: 1 })))
    }
    if (this.type === 'master') {
      this.master = parseMaster(Imitation.state.reward.value.filter(i => i.master).map(i => ({ ...i, level: 1 })))
    }
    if (this.type === 'money') {
      this.money = parseMoney(Imitation.state.reward.value.filter(i => i.money))
    }

    this.instanceScroll()
    this.instanceCard()
    this.instanceMaster()
    this.instanceMoney()
    this.instanceCardPreview()
    this.instanceMasterPreview()
  }

  instanceScroll() {
    const option = {
      x: 12,
      y: 60 + safeTop,
      width: windowWidth - 24,
      height: windowHeight - 72 - safeTop,
      radius: 12,
    }
    option.scrollY = this.bannerHeight + this.masterHeight + this.cardHeight + this.moneyHeight - option.height + 12

    this.InstanceScroll = new Scroll(option)
  }

  instanceMaster() {
    this.InstanceMaster = this.master.map((master, index) => {
      const option = {
        width: windowWidth - 24,
        master: master,
        touchAble: true,
        touchArea: this.InstanceScroll.option,
        touchEvent: () => this.preview = master,
      }

      option.height = (windowWidth - 60) / 4 * 1.35
      option.x = 12
      option.y = 72 + index * (option.height + 12) + this.bannerHeight + safeTop

      return new MasterInList(option)
    })
  }

  instanceCard() {
    this.InstanceCard = this.card.map((card, index) => {
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

  instanceMoney() {
    this.InstanceMoney = this.money.map((money, index) => {
      const option = {
        width: windowWidth - 24,
        money: money,
      }

      option.height = (windowWidth - 60) / 4 * 1.35
      option.x = 12
      option.y = 72 + index * (option.height + 12) + this.bannerHeight + safeTop

      return new MoneyInList(option)
    })
  }

  instanceCardPreview() {
    const option = {
      width: windowWidth * 0.7,
      card: this.preview,
    }

    option.height = option.width * 1.35
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 60

    this.InstanceCardPreview = new CardInPreview(option)
  }

  instanceMasterPreview() {
    const option = {
      width: windowWidth * 0.7,
      card: this.preview,
    }

    option.height = option.width * 1.35
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 60

    this.InstanceMasterPreview = new MasterInPreview(option)
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]
      this.drawBanner(offsetY)
      this.drawMaster(offsetY)
      this.drawCard(offsetY)
      this.drawMoney(offsetY)
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
      const option_ = { x: 24, y: 12 + option.y, width: windowWidth - 48, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)'], text: Imitation.state.reward.title }

      if (!ifScreenCover(option_, this.InstanceScroll.option)) return

      new Button(option_).render()
    }

    {
      new Array(['card', '卡牌'], ['master', '队长'], ['money', '资源']).forEach((i, index) => {
        const option_ = { x: 24 + index * 72, y: 54 + option.y, width: 60, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, text: i[1] }

        option_.fillStyle = i[0] === this.type ? ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)'] : ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)']

        if (!ifScreenCover(option_, this.InstanceScroll.option)) return

        new Button(option_).render()

        const event = (e) => {
          if (!ifTouchCover(e, this.InstanceScroll.option)) return

          this.type = i[0]
          this.init()
        }

        addEventListener('touchstart', event, option_)
      })
    }

    ctx.restore()
  }

  drawCard(offsetY) {
    this.InstanceCard.forEach((i) => {
      i.offsetY = 0 - offsetY
      if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
    })
  }

  drawMaster(offsetY) {
    this.InstanceMaster.forEach((i) => {
      i.offsetY = 0 - offsetY
      if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
    })
  }

  drawMoney(offsetY) {
    this.InstanceMoney.forEach((i) => {
      i.offsetY = 0 - offsetY
      if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
    })
  }

  drawPreview() {
    var closeCover = []

    const buttonY = this.InstanceMasterPreview.y + this.InstanceMasterPreview.height

    if (this.InstanceCard.find(i => i.card === this.preview)) {
      this.InstanceCardPreview.card = this.preview
      this.InstanceCardPreview.render()
    }
    if (this.InstanceMaster.find(i => i.master === this.preview)) {
      this.InstanceMasterPreview.master = this.preview
      this.InstanceMasterPreview.render()

      this.preview.skill.forEach((i, index) => {
        const option = { x: windowWidth / 2 - 40, y: buttonY + 20, width: 80, height: 32, radius: 8, font: `900 10px ${window.fontFamily}`, text: i.name }

        option.fillStyle = index === this.InstanceMasterPreview.skillIndex ? ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)'] : ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)']

        const maxIndex = this.preview.skill.length
        const centerIndex = maxIndex / 2 - 0.5

        const diff = (index - centerIndex) * option.width * 1.1

        option.x = option.x + diff

        new Button(option).render()

        const event = (e) => {
          this.InstanceMasterPreview.skillIndex = index
        }

        addEventListener('touchstart', event, option)

        closeCover.push(option)
      })
    }

    const close = (e) => {
      this.preview = null
      this.InstanceMasterPreview.skillIndex = 0
      this.InstanceMasterPreview.novaTime = 0
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

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = Imitation.state.reward.back
    }

    addEventListener('touchstart', event, option)
  }

  compute() {
    const library = Imitation.state.info.library
    const reward = Imitation.state.reward.value

    reward.forEach(i => {
      if (i.card) {
        const findInLibrary = library.card.find(i_ => i_.key === i.key)
        if (findInLibrary) {
          findInLibrary.exp = findInLibrary.exp + i.exp
        }
        if (!findInLibrary) {
          library.push({ key: i.key, level: 1, exp: i.exp })
        }
        while (findInLibrary.exp >= 100 * Math.pow(2, findInLibrary.level - 1)) {
          findInLibrary.exp = findInLibrary.exp - 100 * Math.pow(2, findInLibrary.level - 1)
          findInLibrary.level = findInLibrary.level + 1
        }
      }
      if (i.master) {
        const findInLibrary = library.master.find(i_ => i_.key === i.key)
        if (findInLibrary) {
          findInLibrary.exp = findInLibrary.exp + i.exp
        }
        if (!findInLibrary) {
          library.push({ key: i.key, level: 1, exp: i.exp })
        }
        while (findInLibrary.exp >= 100 * Math.pow(2, findInLibrary.level - 1)) {
          findInLibrary.exp = findInLibrary.exp - 100 * Math.pow(2, findInLibrary.level - 1)
          findInLibrary.level = findInLibrary.level + 1
        }
      }
    })

    Imitation.state.function.saveInfo()
  }

  render() {
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

export default Page