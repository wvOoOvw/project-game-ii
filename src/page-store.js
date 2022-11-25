import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
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
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0

    this.novaTime = 1
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option

    Canvas.ctx.save()

    Canvas.ctx.globalAlpha = this.novaTime

    drawRectRadius({ x, y, width, height, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    Canvas.ctx.fill()

    Canvas.ctx.restore()
  }
}

class ListItem {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.offsetY = 0

    this.source

    this.touchEvent = null
    this.touchArea = null
    this.touchTimeout = null

    this.novaTime = 1
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
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option

    Canvas.ctx.save()

    drawRectRadius({ x, y, width, height, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fill()

    Canvas.ctx.clip()

    Canvas.ctx.globalAlpha = this.novaTime

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

class Page {
  constructor() {
    this.preview = null

    this.type = 'card'

    this.master
    this.card

    this.InstanceNavigation
    this.InstanceScroll
    this.InstanceMasterList
    this.InstanceCardList

    this.init()
  }

  get masterHeight() {
    const row = this.master.length
    return ((Canvas.width - 60) / 4 * 1.35) * row + (row ? 12 * (row - 1) : 0)
  }

  get cardHeight() {
    const row = Math.ceil(this.card.length / 4)
    return ((Canvas.width - 60) / 4 * 1.35) * row + (row ? 12 * (row - 1) : 0)
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
          return a.key - b.key
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
          return a.key - b.key
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
          return a.key - b.key
        })

      if (this.card.length < 8) this.card.push(...new Array(8 - this.card.length).fill())
    }

    this.InstanceNavigation = new Navigation()
    this.InstanceNavigation.content = [
      { name: '战斗', event: () => Imitation.state.page.current = 'pve' },
      { name: '仓库', active: true },
    ]

    if (this.type === 'card') {
      this.InstanceNavigation.content.push({ name: '卡牌', active: true, event: () => { this.type = 'master'; this.init() } })
    }
    if (this.type === 'master') {
      this.InstanceNavigation.content.push({ name: '魔女', active: true, event: () => { this.type = 'card'; this.init() } })
    }

    this.InstanceScroll = new Scroll()
    this.InstanceScroll.x = 12
    this.InstanceScroll.y = 12
    this.InstanceScroll.width = Canvas.width - 24
    this.InstanceScroll.height = Canvas.height - this.InstanceNavigation.height - 36
    this.InstanceScroll.contentHeight = this.masterHeight + this.cardHeight + 12

    this.InstanceMasterList = this.master.map((master, index) => {
      const Instance = new ListItem()

      Instance.width = Canvas.width - 24
      Instance.height = (Canvas.width - 60) / 4 * 1.35
      Instance.x = 12
      if (this.type === 'master') {
        Instance.y = 24 + index * (Instance.height + 12) + this.cardHeight
      }
      if (this.type === 'card') {
        Instance.y = 12 + index * (Instance.height + 12)
      }
      Instance.source = master
      Instance.touchAble = true
      Instance.touchArea = this.InstanceScroll.option
      Instance.touchEvent = () => {
        this.preview = master
        if (Imitation.state.soundSource) Sound.play(master.soundMain)
      }

      return Instance
    })

    this.InstanceCardList = this.card.map((card, index) => {
      var Instance
      if (card) {
        Instance = new ListItem()
      }
      if (!card) {
        Instance = new ListItemEmpty()
      }

      Instance.width = (Canvas.width - 60) / 4
      Instance.height = Instance.width * 1.35
      Instance.x = 12 + parseInt(index % 4) * (Instance.width + 12)
      if (this.type === 'master') {
        Instance.y = 12 + parseInt(index / 4) * (Instance.height + 12)
      }
      if (this.type === 'card') {
        Instance.y = 24 + parseInt(index / 4) * (Instance.height + 12) + this.masterHeight
      }
      Instance.source = card
      Instance.touchAble = true
      Instance.touchArea = this.InstanceScroll.option
      Instance.touchEvent = () => {
        this.preview = card
        if (Imitation.state.soundSource) Sound.play(card.soundMain)
      }

      return Instance
    })
  }

  loadCard(card) {
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex].card

    const findInTeam = team.find(i_ => i_.key === card.key)

    if (team.length === 8) {
      Message.play('超出卡组数量限制', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }
    if (findInTeam) {
      Message.play('卡牌已装载', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }
    if (!findInTeam) {
      team.push({ key: card.key })
    }

    this.init()
    this.preview = null
    Message.play('装载成功', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.function.setInfo()
  }

  unloadCard(card) {
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex].card

    const findInTeam = team.find(i_ => i_.key === card.key)

    if (!findInTeam) {
      Message.play('未装载当前卡牌', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    team.splice(team.indexOf(findInTeam), 1)

    this.init()
    this.preview = null
    Message.play('卸载成功', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.function.setInfo()
  }

  loadMaster(master) {
    Imitation.state.info.team[Imitation.state.info.teamIndex].master.key = master.key

    this.init()
    this.preview = null
    Message.play('装载成功', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.function.setInfo()
  }

  render() {
    this.InstanceNavigation.render()

    const event = (scroll) => {
      const offsetY = scroll[1]

      this.InstanceCardList.forEach((i) => {
        i.offsetY = 0 - offsetY
        const cover = ifScreenCover(i.option, this.InstanceScroll.option)
        if (cover) i.render()
        if (!cover) i.novaTime = 0
      })
      this.InstanceMasterList.forEach((i) => {
        i.offsetY = 0 - offsetY
        const cover = ifScreenCover(i.option, this.InstanceScroll.option)
        if (cover) i.render()
        if (!cover) i.novaTime = 0
      })
    }

    this.InstanceScroll.render(event)
  }
}

export default FadeCreator(Page)