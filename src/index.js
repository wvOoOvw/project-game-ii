import './adapter-weapp'
import './adapter-web'
import './adapter-dpr'
import './adapter-font-family'
import './data-imitation'

import PageTransition from './page-transition'
import PageHome from './page-home'
import PageExplore from './page-explore'
import PagePve from './page-pve'
import PageStore from './page-store'
import PageShop from './page-shop'
import PageReward from './page-reward'

import { Message } from './ui-message'
import { Animation } from './ui-animation'

import { Sound } from './utils-sound'
import { Event } from './utils-event'

import { parseMoney, parseCard, parseMaster } from './utils-common'

import { originMoney, originMaster, originCard, originExplore, originShop } from './source'

const ctx = canvas.getContext('2d')

class Main {
  constructor() {
    this.loadingInformation = false
    this.animationFrameId

    this.instance

    this.instanceMessage = new Message()
    this.instanceAnimation = new Animation()

    this.ImitationInit()
    this.loopStart()
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    Event.clearEventListener()

    const pageClass = window.Imitation.state.page.map[window.Imitation.state.page.current]

    const ifCurrent = this.instance instanceof pageClass

    if (!ifCurrent) this.instance = new pageClass()

    this.instance.render()
    this.instanceMessage.render()
    this.instanceAnimation.render()
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

  ImitationInit() {
    window.Imitation.state = {
      page: {
        current: 'home',
        next: '',
        map: {
          'transition': PageTransition,
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

        message: (...props) => this.instanceMessage.send(...props),
        animation: (...props) => this.instanceAnimation.play(...props),
        sound: (...props) => Sound.play(...props),
        event: (...props) => Event.addEventListener(...props),

        saveInfo: () => {
          localStorage.setItem('info', JSON.stringify(window.Imitation.state.info))
        }
      },

      info: null,
      battle: null,
      explore: originExplore,
      shop: originShop.map(i => { i.money = parseMoney([i.money])[0]; return i }),
      reward: null,
    }

    if (window.wx._web && window.location.search) window.Imitation.state.page.current = window.location.search.replace('?', '')

    localStorage.removeItem('info')
    const info = localStorage.getItem('info')

    if (info) {
      window.Imitation.state.info = JSON.parse(info)
    }

    if (!info) {
      const responseHTTP = {
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
          { key: 1, number: 100000 },
          { key: 2, number: 1000 },
        ]
      }

      window.Imitation.state.info = responseHTTP
      window.Imitation.state.function.saveInfo()
    }

    if (window.Imitation.state.page.current === 'pve') {
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