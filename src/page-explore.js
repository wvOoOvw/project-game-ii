import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, parseMaster, setArrayRandom, numberFix } from './utils-common'
import { drawText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Button } from './ui-button'

import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/background/music_1c31bcc267a545ef971109512053f3e50.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_1c31bcc267a545ef971109512053f3e50)

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

    this.touchDelayTime = props.touchDelayTime

    this.touchArea = props.touchArea

    this.touchTimeout
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  eventDown(e) {
    if (this.touchArea && !ifTouchCover(e, this.touchArea)) return

    this.touchTimeout = true
  }

  eventUp(e) {
    if (this.touchTimeout === true) this.touchEvent()
    this.touchTimeout = false
  }

  eventMove(e) {
    this.touchTimeout = false
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

    const width_ = height * 0.85
    const height_ = height * 0.85
    const x_ = x + (height - height_) / 2
    const y_ = y + (height - height_) / 2
    const radius_ = width_ / 2

    ctx.font = `900 ${height * 0.1}px ${window.fontFamily}`

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(explore.name, x_ + width_ / 2, y_ + height_ / 2)

    drawRadius({ x: x_ + width_ + (height - height_) / 2, y: y_, width: width - width_ - (height - height_) * 2, height: height_, radius: height * 0.1 })
    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'
    drawText({ x: x_ + width_ + (height - height_), y: y_ + (height - height_) / 2, width: width - width_ - (height - height_) * 3, fontHeight: height * 0.15, text: explore.description })

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

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height
    const explore = this.explore

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(this.explore.imageDOM, { x: x, y: y, width: width, height: height })

    const width_ = height * this.novaTime
    const height_ = height * this.novaTime
    const x_ = x + (width - width_) / 2
    const y_ = y + (height - height_) / 2
    const radius_ = width_ / 2

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.07}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(explore.name, x + width / 2, y + width * 0.12)

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'

    drawText({ x: x + width * 0.08, y: y + width * 0.6, width: width - width * 0.25, fontHeight: width * 0.105, text: explore.description })

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
    const row = Math.ceil(this.explore.length / 4)

    if (row === 0) return -12

    const real = ((windowWidth - 60) / 4 * 1.35) * row

    const margin = row ? 12 * (row - 1) : 0

    return real + margin
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
        touchEvent: () => this.enter(explore),
      }

      option.height = (windowWidth - 60) / 4 * 1.35
      option.x = 12
      option.y = 72 + index * (option.height + 12) + this.bannerHeight + safeTop

      return new ExploreInList(option)
    })
  }

  instanceExplorePreview() {
    const option = {
      width: windowWidth * 0.7,
      explore: this.preview,
    }

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

    const _drawTypeButton = () => {
      const array = [['alltime', '常驻'], ['week_' + new Date().getDay(), '周活动']]

      array.forEach((i, index) => {
        const option_ = { x: 24 + index * 84, y: 12 + option.y, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, text: i[1] }

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

    _drawTypeButton()

    ctx.restore()
  }

  drawExplore(offsetY) {
    this.InstanceExplore.forEach((i) => {
      if (!ifScreenCover({ ...i.option, y: i.y - offsetY }, this.InstanceScroll.option)) return

      i.offsetY = 0 - offsetY
      i.render()
    })
  }

  drawPreview() {
    var closeCover = []

    const buttonY = this.InstanceExplorePreview.y + this.InstanceExplorePreview.height

    this.InstanceExplorePreview.explore = this.preview

    this.InstanceExplorePreview.render()

    const option = { x: windowWidth / 2 - 60, y: buttonY + 40, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '购买' }

    new Button(option).render()

    const buy = () => {
      this.buy(this.preview)
      this.preview = null
      this.InstanceExplorePreview.novaTime = 0
    }

    addEventListener('touchstart', buy, option)

    closeCover.push(option)

    const close = (e) => {
      if (closeCover.some(i => ifTouchCover(e, i))) return
      this.preview = null
      this.InstanceExplorePreview.novaTime = 0
    }

    addEventListenerPure('touchstart', close)
  }

  drawBackground() {
    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  drawButtonHome() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, radius: 8, font: `900 12px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '返回' }

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
          ...parseMaster([Imitation.state.info.library.master.find(i => i.key === Imitation.state.info.team[Imitation.state.info.teamIndex].master[0].key)])[0],
          buff: []
        },
        card: {
          team: parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex].card, true),
          store: setArrayRandom(parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex].card, true)),
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
          team: parseCard(explore.boss.card, true),
          store: setArrayRandom(parseCard(explore.boss.card, true)),
          hand: [],
          cemetery: [],
          consume: []
        },
        AI: explore.AI
      },
      reward: parseCard(explore.reward())
    }

    Imitation.state.page.current = 'transition'
    Imitation.state.page.next = 'battle-pve'
  }

  render() {
    this.drawBackground()

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