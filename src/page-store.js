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

class ListItemEmpty {
  constructor() {
    this.x
    this.y
    this.width
    this.height
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  render() {
    const { x, y, width, height } = this.option

    Canvas.ctx.save()

    drawRectRadius({ x, y, width, height, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    Canvas.ctx.fill()

    Canvas.ctx.restore()
  }
}

class ListItem {
  constructor() {
    this.x
    this.y
    this.width
    this.height

    this.offsetY = 0

    this.source

    this.touchEvent = null
    this.touchArea = null
    this.touchTimeout = null
  }

  get option() {
    return { x: this.x, y: this.y + this.offsetY, width: this.width, height: this.height }
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

    drawRectRadius({ x, y, width, height, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fill()

    Canvas.ctx.clip()

    drawImage(this.source.imageDOM, { x: x, y: y, width: width, height: height })

    const width_ = height * 0.075
    const height_ = height * 0.075
    const x_ = x + height * 0.05
    const y_ = y + height * 0.05
    const radius_ = height_ / 2

    Canvas.ctx.textAlign = 'center'
    Canvas.ctx.textBaseline = 'middle'
    Canvas.ctx.font = `900 ${width * 0.04}px Courier`

    drawRectRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    Canvas.ctx.fillStyle = this.source.inTeam ? `rgba(0, 0, 0, 0.75)` : `rgba(255, 255, 255, 0.75)`
    Canvas.ctx.fill()

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

    this.witch = parseWitch(Imitation.state.info.library)

    this.InstanceScroll = new Scroll()
    this.InstanceWitch = []
  }

  get option() {
    return { x: this.x, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  get witchHeight() {
    const row = Math.ceil(this.witch.length / 4)
    return ((this.width - 36) / 4 * 1.35) * row + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.InstanceScroll.x = this.x
    this.InstanceScroll.y = this.y
    this.InstanceScroll.width = this.width
    this.InstanceScroll.height = this.height
    this.InstanceScroll.contentHeight = this.witchHeight + 12

    this.InstanceWitch = this.witch.map((witch, index) => {
      var Instance
      if (witch) {
        Instance = new ListItem()
      }
      if (!witch) {
        Instance = new ListItemEmpty()
      }

      Instance.width = (this.width - 36) / 4
      Instance.height = Instance.width * 1.35
      Instance.x = this.x + parseInt(index % 4) * (Instance.width + 12)
      Instance.y = this.y + parseInt(index / 4) * (Instance.height + 12)
      Instance.source = witch
      Instance.touchAble = true
      Instance.touchArea = this.InstanceScroll.option
      Instance.touchEvent = () => {
        Imitation.state.page.current = 'preview'
        Imitation.state.cache = witch
      }

      return Instance
    })
  }

  render() {
    const event = (scroll) => {
      const offsetY = scroll[1]

      this.InstanceWitch.forEach((i) => {
        i.offsetY = 0 - offsetY
        if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
      })
    }

    this.InstanceScroll.render(event)
  }
}

class Page {
  constructor() {
    this.InstanceNavigation = new Navigation()
    this.InstanceNavigation.content = [
      { name: '战斗', event: () => Imitation.state.page.current = 'pve' },
      { name: '仓库', active: true }
    ]

    this.InstanceList = new List()
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
    this.InstanceList.width = Math.min(Canvas.width - 24, Canvas.maxWidth - 24)
    this.InstanceList.height = Canvas.height - this.InstanceNavigation.height - 12
    this.InstanceList.x = (Canvas.width - this.InstanceList.width) / 2
    this.InstanceList.y = 12
    this.InstanceList.init()
  }

  render() {
    this.InstanceNavigation.render()
    this.InstanceList.render()
  }
}

export default FadeCreator(Page)