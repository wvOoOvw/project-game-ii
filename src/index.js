import './adapter-weapp'

import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText } from './utils-canvas'
import { originMoney, originMaster, originCard, originExplore, originShop, sourceIoad } from './source'

import PageHome from './page-home'
import PagePve from './page-pve'
import PageStore from './page-store'

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

    if (Imitation.state.page !== 'home' && Imitation.state.loading) return

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
        current: searchParams('path') ? searchParams('path') : 'home',
        map: {
          'home': PageHome,
          'pve': PagePve,
          'store': PageStore,
        },
      },
      function: {
        setInfo: async () => {
          localStorage.setItem('info', JSON.stringify(Imitation.state.info))
        },
        getInfo: async () => {
          // localStorage.removeItem('info')
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
      loading: true,

      soundBackground: false,
      soundSource: false
    }

    Imitation.state.function.getInfo()

    await Promise.all([
      Sound.load(),
      Picture.load(),
      Animation.load()
    ])

    sourceIoad()

    Imitation.state.loading = false
  }
}

new Main()