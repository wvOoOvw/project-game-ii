import './adapter-web'
import './adapter-dpr'
import './data-Imitation'

import PageTransition from './page-transition'
import PageHome from './page-home'
import PageStore from './page-store'
// import PageBattle from './page-battle'

import { mock } from '../source/cards'

const ctx = canvas.getContext('2d')

class Main {
  constructor() {
    this.animationFrameId
    this.instance

    this.ImitationInit()
    this.loopStart()
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    Imitation.state.removeEventListener.forEach(i => i())

    Imitation.state.removeEventListener = []

    const pageClass = Imitation.state.page.map[Imitation.state.page.current]

    const ifCurrent = this.instance instanceof pageClass

    if (!ifCurrent) {
      this.instance = new pageClass()
    }

    this.instance.render()
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
        current: 'store',
        next: '',
        map: {
          'transition': PageTransition,
          'home': PageHome,
          'store': PageStore,
        },
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

    Imitation.state.info.cardss[0] = [...Imitation.state.info.cards].filter((i, index) => index < 23)
  }
}

new Main()