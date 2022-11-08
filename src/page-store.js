import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, parseMaster, levelText, numberFix } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Navigation } from './ui-navigation'

import { Picture } from './utils-picture'

const ctx = canvas.getContext('2d')

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
    const card = this.card

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.05
    const radius_ = width * 0.03

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = card.inTeam ? `rgba(0, 0, 0, 0.75)` : `rgba(255, 255, 255, 0.75)`
    ctx.fill()
    ctx.fillStyle = card.inTeam ? `rgba(255, 255, 255, 1)` : 'rgba(0, 0, 0, 1)'
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

    ctx.fillText([card.name, levelText(card.level), `${card.exp / Math.pow(2, card.level - 1)}%`].join(' '), x_ + width_ / 2, y_ + height_ / 2)
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
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
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

    ctx.globalAlpha = this.novaTime

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

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.025}px ${window.fontFamily}`

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = master.inTeam ? `rgba(0, 0, 0, 0.75)` : `rgba(255, 255, 255, 0.75)`
    ctx.fill()
    ctx.fillStyle = master.inTeam ? `rgba(255, 255, 255, 1)` : 'rgba(0, 0, 0, 1)'
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

    ctx.fillText([master.name, levelText(master.level)].join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option
    const master = this.master

    ctx.save()

    drawRadius({ x, y, width, height, radius: 12 })

    ctx.clip()

    drawImage(master.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.globalAlpha = this.novaTime

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

    ctx.fillText([master.name, levelText(master.level), `${master.exp / Math.pow(2, master.level - 1)}%`].join(' '), x_ + width_ / 2, y_ + height_ / 2)
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
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
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

    ctx.globalAlpha = this.novaTime

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

    this.type = 'card'

    this.master
    this.card

    this.InstanceNavigation
    this.InstanceScroll
    this.InstanceMasterList
    this.InstanceMasterPreview
    this.InstanceCardList
    this.InstanceCardPreview

    this.init()
  }

  get masterHeight() {
    const row = this.master.length
    return (((windowWidth - 60) / 4 * 1.35) * row) + (row ? 12 * (row - 1) : 0)
  }

  get cardHeight() {
    const row = Math.ceil(this.card.length / 4)
    return (((windowWidth - 60) / 4 * 1.35) * row) + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.master = []
    this.card = []

    if (this.type === 'card') {
      this.master = parseMaster([Imitation.state.info.library.master.find(i => i.key === Imitation.state.info.team[Imitation.state.info.teamIndex].master.key)])
        .map(i => {
          i.inTeam = Imitation.state.info.team[Imitation.state.info.teamIndex].master.key === i.key
          return i
        })

      this.card = parseCard(Imitation.state.info.library.card)
        .map(i => {
          i.inTeam = Imitation.state.info.team[Imitation.state.info.teamIndex].card.some(i_ => i_.key === i.key)
          return i
        })
        .sort((a, b) => {
          const a_ = String(a.name).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
          const b_ = String(b.name).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
          return b_ - a_
        })
        .sort((a, b) => {
          const a_ = a.inTeam ? 1 : 0
          const b_ = b.inTeam ? 1 : 0
          return b_ - a_
        })
    }
    if (this.type === 'master') {
      this.master = parseMaster(Imitation.state.info.library.master)
        .map(i => {
          i.inTeam = Imitation.state.info.team[Imitation.state.info.teamIndex].master.key === i.key
          return i
        })
        .sort((a, b) => {
          const a_ = String(a.name).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
          const b_ = String(b.name).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
          return b_ - a_
        })
        .sort((a, b) => {
          const a_ = a.inTeam ? 1 : 0
          const b_ = b.inTeam ? 1 : 0
          return b_ - a_
        })

      this.card = parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex].card
        .map(i => {
          i.inTeam = Imitation.state.info.team[Imitation.state.info.teamIndex].card.some(i_ => i_.key === i.key)
          return i
        })
        .map(i => ({ ...i, ...Imitation.state.info.library.card.find(i_ => i_.key === i.key) })))
        .sort((a, b) => {
          const a_ = String(a.name).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
          const b_ = String(b.name).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
          return b_ - a_
        })
    }

    this.instanceNavigation()
    this.instanceScroll()
    this.instanceMasterList()
    this.instanceCardList()
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
              Imitation.state.page.current = 'transition'
              Imitation.state.page.next = 'home'
            }
          },
          {
            justifyContent: 'right',
            text: '编队',
          }
        ],
        [
          ...new Array(Imitation.state.info.team.length).fill().map((i, index) => {
            return {
              width: 48,
              active: index === Imitation.state.info.teamIndex,
              justifyContent: 'left',
              text: levelText(index + 1),
              event: () => {
                Imitation.state.info.teamIndex = index
                this.init()
              }
            }
          }),
          {
            active: true,
            justifyContent: 'right',
            text: this.type === 'card' ? '卡牌' : '队长',
            event: () => {
              this.type = this.type === 'card' ? 'master' : 'card'
              this.init()
            }
          }
        ],
      ]
    }

    this.InstanceNavigation = new Navigation(option)
  }

  instanceScroll() {
    const option = { x: 12, y: 12 + safeTop, width: windowWidth - 24, height: windowHeight - this.InstanceNavigation.height - 36 - safeTop, radius: 12 }
    option.scrollY = this.masterHeight + this.cardHeight - option.height + 12

    this.InstanceScroll = new Scroll(option)
  }

  instanceMasterList() {
    this.InstanceMasterList = this.master.map((master, index) => {
      const option = {
        width: windowWidth - 24,
        master: master,
        touchAble: true,
        touchArea: this.InstanceScroll.option,
        touchEvent: () => this.preview = master,
      }
      option.height = (windowWidth - 60) / 4 * 1.35
      option.x = 12
      if (this.type === 'master') {
        option.y = 24 + index * (option.height + 12) + this.cardHeight + safeTop
      }
      if (this.type === 'card') {
        option.y = 12 + index * (option.height + 12) + safeTop
      }

      return new MasterInList(option)
    })
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
      if (this.type === 'master') {
        option.y = 12 + parseInt(index / 4) * (option.height + 12) + safeTop
      }
      if (this.type === 'card') {
        option.y = 24 + parseInt(index / 4) * (option.height + 12) + this.masterHeight + safeTop
      }

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

  instanceMasterPreview() {
    const option = {}
    option.width = windowWidth * 0.7
    option.height = option.width * 1.35
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 60

    this.InstanceMasterPreview = new MasterInPreview(option)
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]

      this.InstanceCardList.forEach((i) => {
        i.offsetY = 0 - offsetY
        if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
      })
      this.InstanceMasterList.forEach((i) => {
        i.offsetY = 0 - offsetY
        if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
      })
    }

    this.InstanceScroll.render(event)
  }

  drawPreview() {
    var closeCover = []

    const buttonY = this.InstanceMasterPreview.y + this.InstanceMasterPreview.height

    if (this.InstanceCardList.find(i => i.card === this.preview)) {
      this.InstanceCardPreview.card = this.preview
      this.InstanceCardPreview.render()

      const option = { y: buttonY + 24, width: 108, height: 36, radius: 8 }
      option.x = (windowWidth - option.width) / 2

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 12px ${window.fontFamily}`

      drawRadius(option)
      ctx.fillStyle = 'rgba(255, 255, 255, 1)'
      ctx.fill()
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'

      if (this.preview.inTeam) {
        ctx.fillText('卸载', option.x + option.width / 2, option.y + option.height / 2)
        addEventListener('touchstart', () => this.unloadCard(this.preview), option)
      }
      if (!this.preview.inTeam) {
        ctx.fillText('装载', option.x + option.width / 2, option.y + option.height / 2)
        addEventListener('touchstart', () => this.loadCard(this.preview), option)
      }

      closeCover.push(option)
    }

    if (this.InstanceMasterList.find(i => i.master === this.preview)) {
      this.InstanceMasterPreview.master = this.preview
      this.InstanceMasterPreview.render()

      this.preview.skill.forEach((i, index) => {
        const option = { x: windowWidth / 2 - 40, y: this.InstanceMasterPreview.y - 42, width: 72, height: 30, radius: 8 }

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `900 10px ${window.fontFamily}`

        const maxIndex = this.preview.skill.length
        const centerIndex = maxIndex / 2 - 0.5
        const diff = (index - centerIndex) * (option.width + 12)

        option.x = option.x + diff

        drawRadius(option)
        ctx.fillStyle = index === this.InstanceMasterPreview.skillIndex ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'
        ctx.fill()
        ctx.fillStyle = index === this.InstanceMasterPreview.skillIndex ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
        ctx.fillText(i.name, option.x + option.width / 2, option.y + option.height / 2)

        addEventListener('touchstart', () => this.InstanceMasterPreview.skillIndex = index, option)

        closeCover.push(option)
      })

      if (!this.preview.inTeam) {
        const option = { y: buttonY + 24, width: 108, height: 36, radius: 8 }
        option.x = (windowWidth - option.width) / 2

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `900 12px ${window.fontFamily}`

        drawRadius(option)
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        ctx.fill()
        ctx.fillStyle = 'rgba(0, 0, 0, 1)'
        ctx.fillText('装载', option.x + option.width / 2, option.y + option.height / 2)

        addEventListener('touchstart', () => this.loadMaster(this.preview), option)

        closeCover.push(option)
      }
    }

    const close = (e) => {
      if (closeCover.some(i => ifTouchCover(e, i))) return
      this.preview = null
      this.InstanceMasterPreview.skillIndex = 0
      this.InstanceMasterPreview.novaTime = 0
      this.InstanceCardPreview.novaTime = 0
    }

    addEventListenerPure('touchstart', close)
  }

  loadCard(card) {
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex].card

    const findInTeam = team.find(i_ => i_.key === card.key)

    if (team.length === 8) {
      Imitation.state.function.message('超出卡组数量限制', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }
    if (findInTeam) {
      Imitation.state.function.message('卡牌已装载', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }
    if (!findInTeam) {
      team.push({ key: card.key })
    }

    this.init()
    this.preview = null
    Imitation.state.function.message('装载成功', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.function.saveInfo()
  }

  unloadCard(card) {
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex].card

    const findInTeam = team.find(i_ => i_.key === card.key)

    if (!findInTeam) {
      Imitation.state.function.message('未装载当前卡牌', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    team.splice(team.indexOf(findInTeam), 1)

    this.init()
    this.preview = null
    Imitation.state.function.message('卸载成功', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.function.saveInfo()
  }

  loadMaster(master) {
    Imitation.state.info.team[Imitation.state.info.teamIndex].master.key = master.key

    this.init()
    this.preview = null
    Imitation.state.function.message('装载成功', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.function.saveInfo()
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