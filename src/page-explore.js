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
import { ExploreInList, ExploreInPreview } from './ui-source'

class Page {
  constructor() {
    this.preview = null

    this.type = 'alltime'

    this.explore

    this.InstanceNavigation
    this.InstanceScroll
    this.InstanceExplore
    this.InstanceExplorePreview

    this.init()
  }

  get exploreHeight() {
    const row = this.explore.length
    return ((Canvas.width - 60) / 4 * 1.35) * row + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.explore = Imitation.state.explore.filter(i => i.type === this.type)

    this.instanceNavigation()
    this.instanceScroll()
    this.instanceExplore()
    this.instanceExplorePreview()
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
            text: new Array(['alltime', '常驻'], ['week_' + new Date().getDay(), '周活动']).find(i => i[0] === this.type)[1],
            event: () => {
              var r
              if (!r && this.type === 'alltime') r = 'week_' + new Date().getDay()
              if (!r && this.type === 'week_' + new Date().getDay()) r = 'alltime'
              this.type = r
              this.init()
            }
          },
          {
            justifyContent: 'right',
            text: '探索',
          }
        ]
      ]
    }

    this.InstanceNavigation = new Navigation(option)
  }

  instanceScroll() {
    const option = { x: 12, y: 12, width: Canvas.width - 24, height: Canvas.height - this.InstanceNavigation.height - 36, contentHeight: this.exploreHeight }

    this.InstanceScroll = new Scroll(option)
  }

  instanceExplore() {
    this.InstanceExplore = this.explore.map((explore, index) => {
      const option = {
        width: Canvas.width - 24,
        explore: explore,
        touchAble: true,
        touchArea: this.InstanceScroll.option,
        touchEvent: () => this.preview = explore,
      }
      option.height = (Canvas.width - 60) / 4 * 1.35
      option.x = 12
      option.y = 12 + index * (option.height + 12)

      return new ExploreInList(option)
    })
  }

  instanceExplorePreview() {
    const option = {}
    option.width = Canvas.width * 0.7
    option.height = option.width * 1.35
    option.x = Canvas.width * 0.15
    option.y = (Canvas.height - option.width * 1.5) / 2 - 60

    this.InstanceExplorePreview = new ExploreInPreview(option)
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]

      this.InstanceExplore.forEach((i) => {
        i.offsetY = 0 - offsetY
        const cover = ifScreenCover(i.option, this.InstanceScroll.option)
        if (cover) i.render()
        if (!cover) i.novaTime = 0
      })
    }

    this.InstanceScroll.render(event)
  }

  drawPreview() {
    const close = (e) => {
      this.preview = null
      this.InstanceExplorePreview.novaTime = 0
      this.InstanceExplore.forEach(i => i.novaTime = 0)
    }

    if (!this.preview.inTeam) {
      this.InstanceExplorePreview.extra = [
        {
          name: '战斗',
          event: () => this.enter(this.preview)
        }
      ]
    }
    this.InstanceExplorePreview.close = close
    this.InstanceExplorePreview.explore = this.preview
    this.InstanceExplorePreview.render()
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
          hand: [],
        },
      },
      opposite: {
        master: {
          ...parseMaster([explore.boss.master])[0],
          buff: []
        },
        card: {
          team: parseCard(explore.boss.card),
          hand: [],
        },
        AI: explore.AI
      },
      reward: explore.reward
    }

    if (Imitation.state.battle.self.card.team.length < 8) {
      Message.play('卡组数量满足8张', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    Imitation.state.page.current = 'transition'
    Imitation.state.page.next = 'pve'
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