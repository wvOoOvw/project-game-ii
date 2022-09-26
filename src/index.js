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

    this.ImitationInit()
    this.loopStart()
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    Imitation.state.removeEventListener.forEach(i => i())

    Imitation.state.removeEventListener = []

    const page = Imitation.state.page

    if (!page.instance || !(page.instance instanceof page.map[page.current])) {
      if (page.instance && !(page.instance instanceof PageTransition)) {
        page.currentCache = page.current
        page.current = 'transition'
      }
      
      page.instance = new page.map[page.current]()
    }

    page.instance.render()
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
        currentCache: '',
        map: {
          'transition': PageTransition,
          'home': PageHome,
          'store': PageStore,
        },
        instance: null
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

    const event = () => {
      Imitation.state.page.next = Imitation.state.page.current
      Imitation.state.page.current = 'transition'
    }

    Imitation.register(event, state => state.page.current)
  }
}

new Main()