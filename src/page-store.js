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

    this.offsetY = 0

    this.witch

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

    drawRectRadius({ x, y, width, height, radius: 4 })

    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fill()

    Canvas.ctx.clip()

    drawImage(this.witch.imageDOM, this.option)

    if (this.witch.inTeam) {
      drawRectRadius({ x: x + height * 0.05, y: y + height * 0.05, width: height * 0.075, height: height * 0.075, radius: height * 0.075 / 2 })
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

    this.witch = parseWitch(Imitation.state.info.library)

    this.InstanceScroll = new Scroll()
    this.InstanceWitch = []
  }

  get option() {
    return { x: this.x, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  get itemHeight() {
    const row = Math.ceil(this.witch.length / 2)
    return (this.width - 36) / 4 * 1.5 * row + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.InstanceScroll.x = this.x
    this.InstanceScroll.y = this.y
    this.InstanceScroll.width = this.width
    this.InstanceScroll.height = this.height
    this.InstanceScroll.contentHeight = this.itemHeight + 12

    this.InstanceWitch = this.witch.map((witch, index) => {
      const Instance = new ListItem()
      Instance.width = (this.width - 36) / 4
      Instance.height = (this.width - 36) / 4 * 1.35
      Instance.x = this.x + parseInt(index % 4) * (Instance.width + 12)
      Instance.y = this.y + parseInt(index / 4) * (Instance.height + 12)
      Instance.witch = witch
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
    this.InstanceList.width = Math.min(Canvas.width - 24, Canvas.maxWidth - 24)
    this.InstanceList.height = Canvas.height - 12
    this.InstanceList.x = (Canvas.width - this.InstanceList.width) / 2
    this.InstanceList.y = 12
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
    this.InstanceList.init()
  }

  render() {
    this.InstanceList.render()
    this.InstanceNavigation.render()
  }
}

export default FadeCreator(Page)