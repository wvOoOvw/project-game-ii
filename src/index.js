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

import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, parseMaster, setArrayRandom, numberFix } from './utils-common'

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

    Imitation.state.removeEventListener.forEach(i => i())

    Imitation.state.removeEventListener = []

    const pageClass = Imitation.state.page.map[Imitation.state.page.current]

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
    Imitation.state = {
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
      removeEventListener: [],
      info: null,
      battle: null,
      explore: originExplore,
      shop: originShop,
      reward: {
        value: null,
        back: null,
      },
      function: {
        render: this.render,
        loopStart: this.loopStart,
        loopEnd: this.loopEnd,
        message: (...props) => this.instanceMessage.send(...props),
        animation: (...props) => this.instanceAnimation.play(...props),
        sound: (...props) => Sound.play(...props),
        saveInfo: () => {
          localStorage.setItem('info', JSON.stringify(Imitation.state.info))
        }
      }
    }

    if (window.location.search) Imitation.state.page.current = window.location.search.replace('?', '')

    localStorage.removeItem('info')
    const info = localStorage.getItem('info')

    if (info) {
      Imitation.state.info = JSON.parse(info)
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
            card: originCard.map(i => ({ key: i.key })).filter((i,index) => index < 8)
          },
          {
            master: { key: 1 },
            card: originCard.map(i => ({ key: i.key })).filter((i,index) => index < 8)
          },
          {
            master: { key: 1 },
            card: originCard.map(i => ({ key: i.key })).filter((i,index) => index < 8)
          },
          {
            master: { key: 1 },
            card: originCard.map(i => ({ key: i.key })).filter((i,index) => index < 8)
          },
        ],
        teamIndex: 0,
        money: [
          { key: 1, number: 100000 },
          { key: 2, number: 100000 },
          { key: 3, number: 100000 },
        ]
      }

      Imitation.state.info = responseHTTP
      Imitation.state.function.saveInfo()
    }

    if (Imitation.state.page.current === 'pve') {
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