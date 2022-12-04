import './adapter-weapp'

import { parseCard, parseMaster, parseMoney, symbolNumber, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText } from './utils-canvas'

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

import { originWitch, sourceIoad } from './source'

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

      info: null,

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
          const info = {
            library: originWitch.map(i => ({ key: i.key, level: 1, exp: 0, characteristic: [{ key: 1, level: 1 }, { key: 2, level: 1 }] })),
            team: originWitch.map(i => ({ key: i.key })).filter((i, index) => index < 4),
          }

          Imitation.state.info = info
        }
      },

      loading: true,

      sound: {
        ifBackground: false,
        ifSource: false
      },

      cache: null
    }

    Imitation.state.getInfo()

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