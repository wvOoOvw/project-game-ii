import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText } from './utils-canvas'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

import { Scroll } from './ui-scroll'
import { Navigation } from './ui-navigation'
import { CardEmpty, CardInList, MasterInList, CardInPreview, MasterInPreview } from './ui-source'

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
            active: true,
            justifyContent: 'left',
            text: new Array(['card', '卡牌'], ['master', '队长']).find(i => i[0] === this.type)[1],
            event: () => {
              var r
              if (!r && this.type === 'card') r = 'master'
              if (!r && this.type === 'master') r = 'card'
              this.type = r
              this.init()
            }
          },
          {
            active: true,
            justifyContent: 'left',
            text: levelText(Imitation.state.info.teamIndex + 1),
            event: () => {
              Imitation.state.info.teamIndex = Imitation.state.info.team[Imitation.state.info.teamIndex + 1] ? Imitation.state.info.teamIndex + 1 : 0
              this.init()
            }
          },
          {
            justifyContent: 'right',
            text: '编队',
          },
        ],
      ]
    }

    this.InstanceNavigation = new Navigation(option)
  }

  instanceScroll() {
    const option = { x: 12, y: 12, width: Canvas.width - 24, height: Canvas.height - this.InstanceNavigation.height - 36, contentHeight: this.masterHeight + this.cardHeight + 12 }

    this.InstanceScroll = new Scroll(option)
  }

  instanceMasterList() {
    this.InstanceMasterList = this.master.map((master, index) => {
      const option = {}
      option.width = Canvas.width - 24
      option.height = (Canvas.width - 60) / 4 * 1.35
      option.x = 12
      if (this.type === 'master') {
        option.y = 24 + index * (option.height + 12) + this.cardHeight
      }
      if (this.type === 'card') {
        option.y = 12 + index * (option.height + 12)
      }
      option.master = master
      option.touchAble = true
      option.touchArea = this.InstanceScroll.option
      option.touchEvent = () => {
        this.preview = master
        if (Imitation.state.soundSource) Sound.play(master.soundMain)
      }

      return new MasterInList(option)
    })
  }

  instanceCardList() {
    this.InstanceCardList = this.card.map((card, index) => {
      const option = {}
      option.width = (Canvas.width - 60) / 4
      option.height = option.width * 1.35
      option.x = 12 + parseInt(index % 4) * (option.width + 12)
      if (this.type === 'master') {
        option.y = 12 + parseInt(index / 4) * (option.height + 12)
      }
      if (this.type === 'card') {
        option.y = 24 + parseInt(index / 4) * (option.height + 12) + this.masterHeight
      }
      option.card = card
      option.touchAble = true
      option.touchArea = this.InstanceScroll.option
      option.touchEvent = () => {
        this.preview = card
        if (Imitation.state.soundSource) Sound.play(card.soundMain)
      }

      if (card) {
        return new CardInList(option)
      }
      if (!card) {
        return new CardEmpty(option)
      }
    })
  }

  instanceCardPreview() {
    this.InstanceCardPreview = new CardInPreview()
  }

  instanceMasterPreview() {
    this.InstanceMasterPreview = new MasterInPreview()
  }

  drawScroll() {
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

  drawPreview() {
    const close = () => {
      this.preview = null
      this.InstanceMasterPreview.skillIndex = 0
      this.InstanceMasterPreview.novaTime = 0
      this.InstanceCardPreview.novaTime = 0
      this.InstanceCardList.forEach(i => i.novaTime = 0)
      this.InstanceMasterList.forEach(i => i.novaTime = 0)
    }

    if (this.InstanceCardList.find(i => i.card === this.preview)) {
      if (this.preview.inTeam) {
        this.InstanceCardPreview.extra = [
          {
            name: '卸载',
            event: () => this.unloadCard(this.preview)
          }
        ]
      }
      if (!this.preview.inTeam) {
        this.InstanceCardPreview.extra = [
          {
            name: '装载',
            event: () => this.loadCard(this.preview)
          }
        ]
      }
      this.InstanceCardPreview.close = close
      this.InstanceCardPreview.card = this.preview
      this.InstanceCardPreview.render()
    }

    if (this.InstanceMasterList.find(i => i.master === this.preview)) {
      if (!this.preview.inTeam) {
        this.InstanceMasterPreview.extra = [
          {
            name: '装载',
            event: () => this.loadMaster(this.preview)
          }
        ]
      }
      this.InstanceMasterPreview.close = close
      this.InstanceMasterPreview.master = this.preview
      this.InstanceMasterPreview.render()
    }
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
    drawImage(Picture.get('background-page'), { x: 0, y: 0, width: Canvas.width, height: Canvas.height })

    if (this.preview) {
      this.drawPreview()
    }

    if (!this.preview) {
      this.InstanceNavigation.render()
      this.drawScroll()
    }
  }
}

export default Page