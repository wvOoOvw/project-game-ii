import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, parseMaster, setArrayRandom, numberFix } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Button } from './ui-button'

import { Image } from './utils-image'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class ExploreInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.explore = props.explore

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

    ctx.fillText('EXPLORE 探索', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const explore = this.explore

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

    ctx.fillText(explore.name, x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    const x = this.x + this.offsetX
    const y = this.y + this.offsetY
    const width = this.width
    const height = this.height
    const explore = this.explore

    ctx.save()

    drawRadius({ x, y, width, height, radius: 12 })

    ctx.clip()

    drawImage(this.explore.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()

    ctx.restore()

    addEventListener('touchstart', this.eventDown.bind(this), { x, y, width, height })
    addEventListenerPure('touchmove', this.eventMove.bind(this))
    addEventListenerPure('touchend', this.eventUp.bind(this))
  }
}

class ExploreInPreview {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.explore = props.explore

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

    ctx.fillText('EXPLORE 探索', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const explore = this.explore

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

    ctx.fillText(explore.name, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawDifficulty() {
    const { x, y, width, height } = this.option
    const explore = this.explore

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

    ctx.fillText(`难度 ${explore.difficulty}`, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawDescription() {
    const { x, y, width, height } = this.option
    const explore = this.explore

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

    drawMultilineText({ x: x_ + width * 0.05, y: y_ + width * 0.05, width: width_ - width * 0.1, wrapSpace: width * 0.075, text: explore.description })
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option
    const explore = this.explore

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(explore.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.globalAlpha = this.novaTime

    this.drawTitle()
    this.drawName()
    this.drawDifficulty()
    this.drawDescription()

    ctx.restore()
  }
}

class Page {
  constructor() {
    this.preview = null

    this.type = 'alltime'

    this.explore

    this.InstanceScroll
    this.InstanceExplore
    this.InstanceExplorePreview

    this.init()
  }

  get bannerHeight() {
    return 54
  }

  get exploreHeight() {
    const row = this.explore.length
    return row === 0 ? -12 : (((windowWidth - 60) / 4 * 1.35) * row) + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.explore = Imitation.state.explore.filter(i => i.type === this.type)

    this.instanceScroll()
    this.instanceExplore()
    this.instanceExplorePreview()
  }

  instanceScroll() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 72 - safeTop, radius: 12 }

    this.InstanceScroll = new Scroll(scrollOption)

    this.InstanceScroll.scrollY = this.bannerHeight - this.InstanceScroll.height + 24
  }

  instanceExplore() {
    this.InstanceExplore = this.explore.map((explore, index) => {
      const option = {
        width: windowWidth - 24,
        explore: explore,
        touchAble: true,
        touchArea: this.InstanceScroll.option,
        touchEvent: () => this.preview = explore,
      }

      option.height = (windowWidth - 60) / 4 * 1.35
      option.x = 12
      option.y = 72 + index * (option.height + 12) + this.bannerHeight + safeTop

      return new ExploreInList(option)
    })
  }

  instanceExplorePreview() {
    const option = {}
    option.width = windowWidth * 0.7
    option.height = option.width * 1.35
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 60

    this.InstanceExplorePreview = new ExploreInPreview(option)
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]
      this.drawBanner(offsetY)
      this.drawExplore(offsetY)
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

    new Array(['alltime', '常驻'], ['week_' + new Date().getDay(), '周活动']).forEach((i, index) => {
      const option_ = { x: 24 + index * 72, y: 12 + option.y, width: 60, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, text: i[1] }

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

    ctx.restore()
  }

  drawExplore(offsetY) {
    this.InstanceExplore.forEach((i) => {
      i.offsetY = 0 - offsetY
      if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
    })
  }

  drawPreview() {
    var closeCover = []

    const buttonY = this.InstanceExplorePreview.y + this.InstanceExplorePreview.height

    this.InstanceExplorePreview.explore = this.preview

    this.InstanceExplorePreview.render()

    const option = {
      y: buttonY + 24,
      width: 108,
      height: 36,
      radius: 8,
      font: `900 12px ${window.fontFamily}`,
      fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'],
      text: '进入'
    }
    option.x = (windowWidth - option.width) / 2

    new Button(option).render()

    const enter = () => this.enter(this.preview)

    addEventListener('touchstart', enter, option)

    closeCover.push(option)

    const close = (e) => {
      if (closeCover.some(i => ifTouchCover(e, i))) return
      this.preview = null
      this.InstanceExplorePreview.novaTime = 0
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

  enter(explore) {
    Imitation.state.battle = {
      self: {
        master: {
          ...parseMaster([Imitation.state.info.library.master.find(i => i.key === Imitation.state.info.team[Imitation.state.info.teamIndex].master.key)])[0],
          buff: []
        },
        card: {
          team: parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex].card.map(i => ({ ...i, ...Imitation.state.info.library.card.find(i_ => i_.key === i.key) }))),
          store: setArrayRandom(parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex].card.map(i => ({ ...i, ...Imitation.state.info.library.card.find(i_ => i_.key === i.key) })))),
          hand: [],
          cemetery: [],
          consume: []
        },
      },
      opposite: {
        master: {
          ...parseMaster([explore.boss.master])[0],
          buff: []
        },
        card: {
          team: parseCard(explore.boss.card),
          store: setArrayRandom(parseCard(explore.boss.card)),
          hand: [],
          cemetery: [],
          consume: []
        },
        AI: explore.AI
      },
      reward: explore.reward
    }

    if (Imitation.state.battle.self.card.team.length < 20 || Imitation.state.battle.self.card.team.length > 40) {
      Imitation.state.function.message('卡组数量必须在20-40内', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    Imitation.state.page.current = 'transition'
    Imitation.state.page.next = 'pve'
  }

  render() {
    drawImage(Image.get('background-page'), { x: 0, y: 0, width: windowWidth, height: windowHeight })

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