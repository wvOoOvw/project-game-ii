import './adapter-web'
import './adapter-dpr'
import './data-Imitation'

import PageHome from './page-home'
import PageStore from './page-store'
// import PageBattle from './page-battle'

import { ctxInit } from './utils-canvas'

import { mock } from '../source/cards'

const ctx = canvas.getContext('2d')

class Main {
  constructor() {
    ctxInit(canvas)

    this.animationFrameId
    this.pageInstance

    this.ImitationInit()
    this.loopStart()
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    Imitation.state.removeEventListener.forEach(i => i())

    Imitation.state.removeEventListener = []

    if (!this.pageInstance || !(this.pageInstance instanceof Imitation.state.page.map[Imitation.state.page.current])) {
      this.pageInstance = new Imitation.state.page.map[Imitation.state.page.current]()
    }

    this.pageInstance.render()
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
        map: {
          'home': PageHome,
          'store': PageStore,
        }
      },
      removeEventListener: [],
      info: {
        cards: [],
        cardss: [[], [], [], []],
        cardssIndex: 0,
      }
    }

    Imitation.state.info.cards = mock(12).map(card => {
      return {
        key: card.key,
        level: 1,
        number: 4
      }
    })

    Imitation.state.info.cardss[0] = [...Imitation.state.info.cards].filter((i,index) => index < 23)

    const event = () => {

    }

    Imitation.register(event, state => state.page.current)
  }
}

new Main()