import './adapter-web'
import './adapter-dpr'
import './adapter-font-family'
import './data-imitation'

import PageTransition from './page-transition'
import PageHome from './page-home'
import PageExplore from './page-explore'
import PageBattlePve from './page-battle-pve'
import PageStore from './page-store'
import PageShop from './page-shop'

import { Message } from './ui-message'
import { Sound } from './utils-sound'
import { Animation } from './utils-animation'
import { SaveImage } from './utils-saveImage'

import { originMaster, originCard, originBoss, originExplore } from './source'

const ctx = canvas.getContext('2d')

class Main {
  constructor() {
    this.loadingInformation = false
    this.animationFrameId

    this.instance

    this.instanceMessage = new Message()
    this.instanceSound = new Sound()
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
        current: 'explore',
        next: '',
        map: {
          'save-image': SaveImage,
          'transition': PageTransition,
          'home': PageHome,
          'explore': PageExplore,
          'battle-pve': PageBattlePve,
          'store': PageStore,
          'shop': PageShop
        },
      },
      removeEventListener: [],
      info: null,
      battle: null,
      explore: originExplore,
      function: {
        render: this.render,
        loopStart: this.loopStart,
        loopEnd: this.loopEnd,
        message: (m, b, t) => this.instanceMessage.send(m, b, t),
        sound: (k) => this.instanceSound.play(k),
        animation: (k, option) => this.instanceAnimation.play(k, option),
        saveInfo: () => {
          localStorage.setItem('info', JSON.stringify(Imitation.state.info))
        }
      }
    }

    localStorage.removeItem('info')
    const info = localStorage.getItem('info')

    if (info) {
      Imitation.state.info = JSON.parse(info)
    }

    if (!info) {
      const responseHTTP = {
        library: {
          master: originMaster.map(i => ({ key: i.key, level: 1 })),
          card: originCard.map(i => ({ key: i.key, level: 1, number: i.limit }))
        },
        team: [
          {
            master: [{ key: 1 }],
            card: originCard.map(i => ({ key: i.key, level: 1, number: i.limit }))
          },
          {
            master: [{ key: 1 }],
            card: []
          },
          {
            master: [{ key: 1 }],
            card: []
          },
          {
            master: [{ key: 1 }],
            card: []
          },
        ],
        teamIndex: 0,

        gold_1: 1000,
        gold_2: 1000
      }

      Imitation.state.info = responseHTTP
      Imitation.state.function.saveInfo()
    }
  }
}

new Main()