import './adapter-weapp'
import './adapter-web'
import './adapter-dpr'
import './adapter-font-family'
import './data-imitation'

import PageTransition from './page-transition'
import PageLoading from './page-loading'
import PageHome from './page-home'
import PageExplore from './page-explore'
import PagePve from './page-pve'
import PageStore from './page-store'
import PageShop from './page-shop'
import PageReward from './page-reward'

import { Message } from './utils-message'
import { Animation } from './utils-animation'
import { Sound } from './utils-sound'
import { Event } from './utils-event'
import { Picture } from './utils-picture'

import { parseMoney, parseCard, parseMaster, wait, searchParams } from './utils-common'

import { originMoney, originMaster, originCard, originExplore, originShop, loadSource } from './source'

const ctx = canvas.getContext('2d')

class Main {
  constructor() {
    this.animationFrameId

    this.instance

    this.init()
    this.loopStart()
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    Event.clearEventListener()

    const pageClass = window.Imitation.state.page.map[window.Imitation.state.page.current]

    if (!pageClass) return

    const ifCurrent = this.instance instanceof pageClass

    if (!ifCurrent) this.instance = new pageClass()

    this.instance.render()

    Message.render()
    Animation.render()

    if (window.Imitation.state.page.current === 'pve' && window.Imitation.state.page.current !== 'transition') {
      Sound.stop('bgm')
      if (Sound.find('pve').length === 0) Sound.play('pve')
    }
    if (window.Imitation.state.page.current !== 'pve' && window.Imitation.state.page.current !== 'transition') {
      Sound.stop('pve')
      if (Sound.find('bgm').length === 0) Sound.play('bgm')
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
    window.Imitation.state = {
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
        render: this.render,
        loopStart: this.loopStart,
        loopEnd: this.loopEnd,

        message: (...props) => Message.play(...props),
        animation: (...props) => Animation.play(...props),
        sound: (...props) => Sound.play(...props),
        animation_: (...props) => Animation.stop(...props),
        sound_: (...props) => Sound.stop(...props),
        event: (...props) => Event.addEventListener(...props),

        setInfo: async () => {
          localStorage.setItem('info', JSON.stringify(window.Imitation.state.info))
        },
        getInfo: async () => {
          localStorage.removeItem('info')
          const info = localStorage.getItem('info')
          if (info) {
            window.Imitation.state.info = JSON.parse(info)
          }
          if (!info) {
            window.Imitation.state.function.initInfo()
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

          window.Imitation.state.info = info
        }
      },

      info: null,
      battle: null,
      explore: originExplore,
      shop: originShop,
      reward: null,
    }

    window.Imitation.state.function.getInfo()

    window.Imitation.state.page.current = 'loading'

    await Promise.all([
      Sound.load(),
      Picture.load(),
      Animation.load()
    ])
    await wait(60)
    loadSource()

    window.Imitation.state.page.current = 'transition'
    window.Imitation.state.page.next = window.wx._web && searchParams('path') ? searchParams('path') : 'home'
    window.Imitation.state.page.current = window.wx._web && searchParams('path') ? searchParams('path') : 'home'

    if (window.wx._web && searchParams('path') === 'pve') {
      window.Imitation.state.battle = {
        self: {
          master: {
            ...parseMaster([window.Imitation.state.info.library.master.find(i => i.key === window.Imitation.state.info.team[window.Imitation.state.info.teamIndex].master.key)])[0],
            buff: []
          },
          card: {
            team: parseCard(window.Imitation.state.info.team[window.Imitation.state.info.teamIndex].card.map(i => ({ ...i, ...window.Imitation.state.info.library.card.find(i_ => i_.key === i.key) }))),
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