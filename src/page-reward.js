import { ifTouchCover, ifScreenCover, parseCard, parseMaster, parseMoney, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Navigation } from './ui-navigation'

import { Picture } from './utils-picture'

const ctx = canvas.getContext('2d')

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

    this.novaTime = 0
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

    ctx.fillText(`${money.name} ${money.number}`, x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option
    const money = this.money

    ctx.save()

    drawRadius({ x, y, width, height, radius: 8 })

    ctx.clip()

    drawImage(money.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.globalAlpha = this.novaTime

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

    this.novaTime = 0

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
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
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
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(card.name, x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option
    const card = this.card

    ctx.save()

    drawRadius({ x, y, width, height, radius: 8 })

    ctx.clip()

    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.globalAlpha = this.novaTime

    this.drawTitle()
    this.drawName()

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    window.Imitation.state.function.event('touchmove', this.eventMove.bind(this))
    window.Imitation.state.function.event('touchend', this.eventUp.bind(this))
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
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
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
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText([card.name, card.exp].join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  drawRaceType() {
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
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(card.race + ' · ' + card.type, x_ + width_ / 2, y_ + height_ / 2)
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
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    drawMultilineText({ x: x_ + width * 0.05, y: y_ + width * 0.05, width: width_ - width * 0.1, wrapSpace: width * 0.075, text: card.description(card.level) })
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option
    const card = this.card

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.04 })

    ctx.clip()

    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()
    this.drawRaceType()
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

    this.novaTime = 0

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
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option
    const master = this.master

    ctx.save()

    drawRadius({ x, y, width, height, radius: 8 })

    ctx.clip()

    drawImage(master.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.globalAlpha = this.novaTime

    this.drawTitle()
    this.drawName()

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    window.Imitation.state.function.event('touchmove', this.eventMove.bind(this))
    window.Imitation.state.function.event('touchend', this.eventUp.bind(this))
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
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
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
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
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
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText('HP ' + master.HP, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawATTACT() {
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
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText('ATTACT ' + master.ATTACT, x_ + width_ / 2, y_ + height_ / 2)
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
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    drawMultilineText({ x: x_ + width * 0.05, y: y_ + width * 0.05, width: width_ - width * 0.1, wrapSpace: width * 0.075, text: master.skill[this.skillIndex].description(master.level) })
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option
    const master = this.master

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.04 })

    ctx.clip()

    drawImage(master.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()
    this.drawHP()
    this.drawATTACT()
    this.drawDescription()

    ctx.restore()
  }
}

class Page {
  constructor() {
    this.preview = null

    this.type

    this.card = []
    this.master = []
    this.money = []

    this.InstanceNavigation
    this.InstanceScroll
    this.InstanceCard
    this.InstanceCardPreview
    this.InstanceMaster
    this.InstanceMasterPreview
    this.InstanceMoney

    this.init()
    this.compute()
  }

  get masterHeight() {
    const row = this.master.length
    return ((windowWidth - 60) / 4 * 1.35) * row + (row ? 12 * (row - 1) : 0)
  }

  get cardHeight() {
    const row = Math.ceil(this.card.length / 4)
    return ((windowWidth - 60) / 4 * 1.35) * row + (row ? 12 * (row - 1) : 0)
  }

  get moneyHeight() {
    const row = Math.ceil(this.money.length / 4)
    return ((windowWidth - 60) / 4 * 1.35) * row + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.card = []
    this.master = []
    this.money = []

    if (!this.type && window.Imitation.state.reward.value.some(i => i.card)) {
      this.type = 'card'
    }
    if (!this.type && window.Imitation.state.reward.value.some(i => i.master)) {
      this.type = 'master'
    }
    if (!this.type && window.Imitation.state.reward.value.some(i => i.money)) {
      this.type = 'money'
    }

    if (this.type === 'card') {
      this.card = parseCard(window.Imitation.state.reward.value.filter(i => i.card).map(i => ({ ...i, level: 1 })))
    }
    if (this.type === 'master') {
      this.master = parseMaster(window.Imitation.state.reward.value.filter(i => i.master).map(i => ({ ...i, level: 1 })))
    }
    if (this.type === 'money') {
      this.money = parseMoney(window.Imitation.state.reward.value.filter(i => i.money))
    }

    this.instanceNavigation()
    this.instanceScroll()
    this.instanceCard()
    this.instanceMaster()
    this.instanceMoney()
    this.instanceCardPreview()
    this.instanceMasterPreview()
  }

  instanceNavigation() {
    const option = {
      content: [
        [
          {
            justifyContent: 'left',
            text: '返回',
            event: () => {
              window.Imitation.state.page.current = 'transition'
              window.Imitation.state.page.next = window.Imitation.state.reward.back
            }
          },
          {
            justifyContent: 'right',
            text: window.Imitation.state.reward.title,
          },
        ],
        [
          ...new Array(['card', '卡牌'], ['master', '队长'], ['money', '资源'])
            .filter(i => window.Imitation.state.reward.value.some(i_ => i_[i[0]]))
            .map((i, index) => {
              return {
                active: i[0] === this.type,
                justifyContent: 'left',
                text: i[1],
                event: () => {
                  this.type = i[0]
                  this.init()
                }
              }
            })
        ]
      ]
    }

    this.InstanceNavigation = new Navigation(option)
  }

  instanceScroll() {
    const option = { x: 12, y: 12 + safeTop, width: windowWidth - 24, height: windowHeight - this.InstanceNavigation.height - 36 - safeTop, contentHeight: this.masterHeight + this.cardHeight + this.moneyHeight + 12 }

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
      option.y = 12 + index * (option.height + 12) + safeTop

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
      option.y = 12 + parseInt(index / 4) * (option.height + 12) + safeTop

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
      option.y = 12 + index * (option.height + 12) + safeTop

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

      this.InstanceMaster.forEach((i) => {
        i.offsetY = 0 - offsetY
        const cover = ifScreenCover(i.option, this.InstanceScroll.option)
        if (cover) i.render()
        if (!cover) i.novaTime = 0
      })
      this.InstanceCard.forEach((i) => {
        i.offsetY = 0 - offsetY
        const cover = ifScreenCover(i.option, this.InstanceScroll.option)
        if (cover) i.render()
        if (!cover) i.novaTime = 0
      })
      this.InstanceMoney.forEach((i) => {
        i.offsetY = 0 - offsetY
        const cover = ifScreenCover(i.option, this.InstanceScroll.option)
        if (cover) i.render()
        if (!cover) i.novaTime = 0
      })
    }

    this.InstanceScroll.render(event)
  }

  drawPreview() {
    var closeCover = []

    if (this.InstanceCard.find(i => i.card === this.preview)) {
      this.InstanceCardPreview.card = this.preview
      this.InstanceCardPreview.render()
    }
    if (this.InstanceMaster.find(i => i.master === this.preview)) {
      this.InstanceMasterPreview.master = this.preview
      this.InstanceMasterPreview.render()

      this.preview.skill.forEach((i, index) => {
        const option = { x: windowWidth / 2 - 40, y: this.InstanceMasterPreview.y - 42, width: 72, height: 30, radius: 8 }

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `900 10px ${window.fontFamily}`

        const maxIndex = this.preview.skill.length
        const centerIndex = maxIndex / 2 - 0.5
        const diff = (index - centerIndex) * option.width * 1.1

        option.x = option.x + diff

        drawRadius(option)
        ctx.fillStyle = index === this.InstanceMasterPreview.skillIndex ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'
        ctx.fill()
        ctx.fillStyle = index === this.InstanceMasterPreview.skillIndex ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
        ctx.fillText(i.name, option.x + option.width / 2, option.y + option.height / 2)

        const event = (e) => {
          this.InstanceMasterPreview.skillIndex = index
        }

        window.Imitation.state.function.event('touchstart', event, { ifTouchCover: option })

        closeCover.push(option)
      })
    }

    const close = (e) => {
      this.preview = null
      this.InstanceMasterPreview.skillIndex = 0
      this.InstanceMasterPreview.novaTime = 0
      this.InstanceCardPreview.novaTime = 0
    }

    window.Imitation.state.function.event('touchstart', close)
  }

  compute() {
    const library = window.Imitation.state.info.library
    const reward = window.Imitation.state.reward.value

    reward.forEach(i => {
      if (i.card) {
        const findInLibrary = library.card.find(i_ => i_.key === i.key)
        if (findInLibrary) {
          findInLibrary.exp = findInLibrary.exp + i.exp
        }
        if (!findInLibrary) {
          library.card.push({ key: i.key, level: 1, exp: i.exp })
        }
        const findInLibrary_ = library.card.find(i_ => i_.key === i.key)
        while (findInLibrary_.exp >= 100 * Math.pow(2, findInLibrary_.level - 1)) {
          findInLibrary_.exp = findInLibrary_.exp - 100 * Math.pow(2, findInLibrary_.level - 1)
          findInLibrary_.level = findInLibrary_.level + 1
        }
      }
      if (i.master) {
        const findInLibrary = library.master.find(i_ => i_.key === i.key)
        if (findInLibrary) {
          findInLibrary.exp = findInLibrary.exp + i.exp
        }
        if (!findInLibrary) {
          library.master.push({ key: i.key, level: 1, exp: i.exp })
        }
        const findInLibrary_ = library.card.find(i_ => i_.key === i.key)
        while (findInLibrary_.exp >= 100 * Math.pow(2, findInLibrary_.level - 1)) {
          findInLibrary_.exp = findInLibrary_.exp - 100 * Math.pow(2, findInLibrary_.level - 1)
          findInLibrary_.level = findInLibrary_.level + 1
        }
      }
    })

    window.Imitation.state.function.saveInfo()
  }

  render() {
    drawImage(Picture.get('background-page'), { x: 0, y: 0, width: windowWidth, height: windowHeight })
    this.InstanceNavigation.render()

    if (this.preview) {
      this.drawPreview()
    }

    if (!this.preview) {
      this.drawScroll()
    }
  }
}

export default Page