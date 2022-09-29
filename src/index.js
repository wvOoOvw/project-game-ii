import './adapter-web'
import './adapter-dpr'
import './data-imitation'

import PageTransition from './page-transition'
import PageHome from './page-home'
import PageExplore from './page-explore'
import PageStore from './page-store'
// import PageBattle from './page-battle'

import { mock } from '../source/card'
import { origin as originExplore } from '../source/explore'

import { hash } from './utils-common'

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
        current: 'home',
        next: '',
        map: {
          'transition': PageTransition,
          'home': PageHome,
          'explore': PageExplore,
          'store': PageStore,
        },
      },
      removeEventListener: [],
      info: {
        cardLibrary: [],
        team: [[], [], [], []],
        teamIndex: 0,
      },
      explore: {
        map: []
      }
    }

    Imitation.state.info.cardLibrary = mock(15).map(card => {
      return {
        key: card.key,
        level: 1,
        number: 4
      }
    })

    Imitation.state.info.team[0] = [...Imitation.state.info.cardLibrary].filter((i, index) => index < 40).map(i => ({ key: i.key, level: i.level }))

    Imitation.state.explore.map = originExplore
  }
}

new Main()