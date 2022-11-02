import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, parseMaster, levelText, numberFix } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Button } from './ui-button'

import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/background/music_1c31bcc267a545ef971109512053f3e50.jpg'

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

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText([card.name, levelText(card.level), `${card.exp / Math.pow(2, card.level - 1)}%`].join(' '), x_ + width_ / 2, y_ + height_ / 2)
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

    ctx.globalAlpha = this.novaTime

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

    ctx.fillText([master.name, levelText(master.level)].join(' '), x_ + width_ / 2, y_ + height_ / 2)
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

    ctx.globalAlpha = this.novaTime

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

    this.type = 'team'
    this.sort = 'name'

    this.master
    this.card

    this.InstanceScroll
    this.InstanceMasterList
    this.InstanceMasterPreview
    this.InstanceCardList
    this.InstanceCardPreview

    this.init()
  }

  get bannerHeight() {
    return 138
  }

  get masterHeight() {
    const row = this.master.length
    return row === 0 ? -12 : (((windowWidth - 60) / 4 * 1.35) * row) + (row ? 12 * (row - 1) : 0)
  }

  get cardHeight() {
    const row = Math.ceil(this.card.length / 4)
    return row === 0 ? 0 : (((windowWidth - 60) / 4 * 1.35) * row) + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.master = []
    this.card = []

    if (this.type === 'team') {
      this.master = parseMaster([Imitation.state.info.library.master.find(i => i.key === Imitation.state.info.team[Imitation.state.info.teamIndex].master.key)])
      this.card = parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex].card.map(i => ({ ...i, ...Imitation.state.info.library.card.find(i_ => i_.key === i.key) })))
      this.card = this.card.sort((a, b) => {
        const a_ = String(a[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
        const b_ = String(b[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
        return b_ - a_
      })
    }
    if (this.type === 'library-card') {
      this.card = parseCard(Imitation.state.info.library.card)
      this.card = this.card.sort((a, b) => {
        const a_ = String(a[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
        const b_ = String(b[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
        return b_ - a_
      })
    }
    if (this.type === 'library-master') {
      this.master = parseMaster(Imitation.state.info.library.master)
    }

    this.instanceScroll()
    this.instanceMasterList()
    this.instanceCardList()
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
    option.scrollY = this.bannerHeight + this.masterHeight + this.cardHeight - option.height + 24

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
      option.y = 72 + index * (option.height + 12) + this.bannerHeight + safeTop

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
      option.y = 84 + parseInt(index / 4) * (option.height + 12) + this.bannerHeight + this.masterHeight + safeTop

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
      this.drawBanner(offsetY)
      this.drawMaster(offsetY)
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

    new Array(Imitation.state.info.team.length).fill().forEach((i, index) => {
      const option_ = {
        x: 24 + index * 72,
        y: 12 + option.y,
        width: 60,
        height: 30,
        radius: 8,
        font: `900 10px ${window.fontFamily}`,
        fillStyle: index === Imitation.state.info.teamIndex ? ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)'] : ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'],
        text: `队伍 ${index + 1}`
      }

      if (!ifScreenCover(option_, this.InstanceScroll.option)) return

      new Button(option_).render()

      const event = (e) => {
        if (!ifTouchCover(e, this.InstanceScroll.option)) return

        Imitation.state.info.teamIndex = index
        this.type = 'team'
        this.init()
      }

      addEventListener('touchstart', event, option_)
    })

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

    new Array(['team', '队伍'], ['library-card', '卡牌仓库'], ['library-master', '队长仓库']).forEach((i, index) => {
      const option_ = {
        x: 24 + index * 72,
        y: 96 + option.y,
        width: 60,
        height: 30,
        radius: 8,
        font: `900 10px ${window.fontFamily}`,
        fillStyle: i[0] === this.type ? ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)'] : ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'],
        text: i[1]
      }

      if (!ifScreenCover(option_, this.InstanceScroll.option)) return

      new Button(option_).render()

      const event = (e) => {
        if (!ifTouchCover(e, this.InstanceScroll.option)) return

        this.type = i[0]
        this.init()
      }

      addEventListener('touchstart', event, option_)
    })

    ctx.restore()
  }

  drawCard(offsetY) {
    this.InstanceCardList.forEach((i) => {
      i.offsetY = 0 - offsetY
      if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
    })
  }

  drawMaster(offsetY) {
    this.InstanceMasterList.forEach((i) => {
      i.offsetY = 0 - offsetY
      if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
    })
  }

  drawPreview() {
    var closeCover = []

    const buttonY = this.InstanceMasterPreview.y + this.InstanceMasterPreview.height

    if (this.InstanceCardList.find(i => i.card === this.preview)) {
      this.InstanceCardPreview.card = this.preview
      this.InstanceCardPreview.render()

      const count = Imitation.state.info.team[Imitation.state.info.teamIndex].card.find(i => i.key === this.preview.key) ? Imitation.state.info.team[Imitation.state.info.teamIndex].card.find(i => i.key === this.preview.key).number : 0

      {
        const option = {
          y: buttonY + 24,
          width: 36,
          height: 36,
          radius: 18,
          font: `900 12px ${window.fontFamily}`,
          fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'],
        }
        option.text = count
        option.x = (windowWidth - option.width) / 2

        new Button(option).render()
      }

      {
        const option = {
          y: buttonY + 24,
          width: 90,
          height: 36,
          radius: 8,
          font: `900 12px ${window.fontFamily}`,
          fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'],
        }
        option.text = '装载'
        option.x = (windowWidth - option.width) / 2 - (option.width / 2 + 36)

        new Button(option).render()

        addEventListener('touchstart', () => this.loadCard(this.preview), option)

        closeCover.push(option)
      }

      {
        const option = {
          y: buttonY + 24,
          width: 90,
          height: 36,
          radius: 8,
          font: `900 12px ${window.fontFamily}`,
          fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'],
        }
        option.text = '卸载'
        option.x = (windowWidth - option.width) / 2 + (option.width / 2 + 36)

        new Button(option).render()

        addEventListener('touchstart', () => this.unloadCard(this.preview), option)

        closeCover.push(option)
      }
    }

    if (this.InstanceMasterList.find(i => i.master === this.preview)) {
      this.InstanceMasterPreview.master = this.preview
      this.InstanceMasterPreview.render()

      this.preview.skill.forEach((i, index) => {
        const option = {
          y: buttonY + 12,
          width: 72,
          height: 30,
          radius: 8,
          font: `900 10px ${window.fontFamily}`,
          text: i.name
        }
        option.x = (windowWidth - option.width) / 2

        option.fillStyle = index === this.InstanceMasterPreview.skillIndex ? ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)'] : ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)']

        const maxIndex = this.preview.skill.length
        const centerIndex = maxIndex / 2 - 0.5

        const diff = (index - centerIndex) * (option.width + 12)

        option.x = option.x + diff

        new Button(option).render()

        addEventListener('touchstart', () => this.InstanceMasterPreview.skillIndex = index, option)

        closeCover.push(option)
      })

      if (this.type === 'library-master') {
        const option = {
          y: buttonY + 66,
          width: 108,
          height: 36,
          radius: 8,
          font: `900 12px ${window.fontFamily}`,
          fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'],
          text: '装载'
        }
        option.x = (windowWidth - option.width) / 2

        new Button(option).render()

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
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  loadCard(card) {
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex].card

    const findInTeam = team.find(i_ => i_.key === card.key)

    if (team.reduce((t, i) => t + i.number, 0) > 40) {
      Imitation.state.function.message('超出卡组数量限制', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    if (team.filter(i => i.key === card.key).reduce((t, i) => t + i.number, 0) >= card.limit) {
      Imitation.state.function.message('超出卡牌数量限制', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    if (findInTeam) {
      findInTeam.number = findInTeam.number + 1
    }

    if (!findInTeam) {
      team.push({ key: card.key, level: card.level, number: 1 })
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

    findInTeam.number = findInTeam.number - 1

    if (findInTeam.number === 0) {
      const index = team.indexOf(findInTeam)
      team.splice(index, 1)
    }

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