import './adapter-weapp'

import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText } from './utils-canvas'
import { originMoney, originMaster, originCard, originExplore, originShop, sourceIoad } from './source'

import PageTransition from './page-transition'
import PageLoading from './page-loading'
import PageHome from './page-home'
import PageExplore from './page-explore'
import PagePve from './page-pve'
import PageStore from './page-store'
import PageShop from './page-shop'
import PageReward from './page-reward'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

class Main {
  constructor() {
    this.animationFrameId

    this.instance

    this.init()
    this.loopStart()
  }

  render() {
    Canvas.ctx.clearRect(0, 0, Canvas.width, Canvas.height)

    Event.clearEventListener()

    const pageClass = Imitation.state.page.map[Imitation.state.page.current]

    if (!pageClass) return

    const ifCurrent = this.instance instanceof pageClass

    if (!ifCurrent) this.instance = new pageClass()

    this.instance.render()

    Message.render()
    Animation.render()

    if (!Imitation.state.soundBackground) {
      Sound.stop('background-main')
      Sound.stop('background-pve')
    }
    if (Imitation.state.soundBackground && Imitation.state.page.current === 'pve' && Imitation.state.page.current !== 'transition') {
      Sound.stop('background-main')
      if (Sound.find('background-pve').length === 0) Sound.play('background-pve', { loop: true })
    }
    if (Imitation.state.soundBackground && Imitation.state.page.current !== 'pve' && Imitation.state.page.current !== 'transition') {
      Sound.stop('background-pve')
      if (Sound.find('background-main').length === 0) Sound.play('background-main', { loop: true })
    }
    Sound.render()
  }

  loopStart() {
    const event = () => {
      this.render()
      this.loopStart()
    }

    this.animationFrameId = requestAnimationFrame(event)
  }

  loopEnd() {
    cancelAnimationFrame(this.animationFrameId)
  }

  async init() {
    Imitation.state = {
      page: {
        current: '',
        next: '',
        map: {
          'transition': PageTransition,
          'loading': PageLoading,
          'home': PageHome,
          'explore': PageExplore,
          'pve': PagePve,
          'store': PageStore,
          'shop': PageShop,
          'reward': PageReward,
        },
      },
      function: {
        setInfo: async () => {
          localStorage.setItem('info', JSON.stringify(Imitation.state.info))
        },
        getInfo: async () => {
          localStorage.removeItem('info')
          const info = localStorage.getItem('info')
          if (info) {
            Imitation.state.info = JSON.parse(info)
          }
          if (!info) {
            Imitation.state.function.initInfo()
          }
        },
        initInfo: async () => {
          const info = {
            library: {
              master: originMaster.map(i => ({ key: i.key, level: 1, exp: 0 })),
              card: originCard.map(i => ({ key: i.key, level: 1, exp: 0 }))
            },
            team: [
              {
                master: { key: 3 },
                card: originCard.map(i => ({ key: i.key })).filter((i, index) => index < 8)
              },
              {
                master: { key: 1 },
                card: originCard.map(i => ({ key: i.key })).filter((i, index) => index < 8)
              },
              {
                master: { key: 1 },
                card: originCard.map(i => ({ key: i.key })).filter((i, index) => index < 8)
              },
              {
                master: { key: 1 },
                card: originCard.map(i => ({ key: i.key })).filter((i, index) => index < 8)
              },
            ],
            teamIndex: 0,
            money: [
              { key: 1, number: 88888 },
              { key: 2, number: 12888 },
            ]
          }

          Imitation.state.info = info
        }
      },

      info: null,
      battle: null,
      explore: originExplore,
      shop: originShop,
      reward: null,

      soundBackground: false,
      soundSource: false
    }

    Imitation.state.function.getInfo()

    Imitation.state.page.current = 'loading'

    await Promise.all([
      Sound.load(),
      Picture.load(),
      Animation.load()
    ])

    sourceIoad()

    await wait(60)

    Imitation.state.page.current = 'transition'
    Imitation.state.page.next = searchParams('path') ? searchParams('path') : 'home'
    // Imitation.state.page.current = Imitation.state.page.next

    if (searchParams('path') === 'pve') {
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
            ...parseMaster([originExplore[0].boss.master])[0],
            buff: []
          },
          card: {
            team: parseCard(originExplore[0].boss.card),
            hand: [],
          },
          AI: originExplore[0].AI
        },
        reward: originExplore[0].reward
      }
    }
  }
}

new Main()