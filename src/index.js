import './adapter-web'
import './adapter-dpr'
import './data-imitation'

import PageTransition from './page-transition'
import PageHome from './page-home'
import PageExplore from './page-explore'
import PageBattle from './page-battle'
import PageStore from './page-store'

import { Message } from './ui-message'
import { Sound } from './utils-sound'
import { SaveImage } from './utils-saveImage'

import { origin as originCard } from '../source/card'
import { origin as originExplore } from '../source/explore'

const ctx = canvas.getContext('2d')

class Main {
  constructor() {
    this.animationFrameId
    this.instance

    this.instanceMessage = new Message()
    this.instanceSound = new Sound()

    // this.instanceSound.play('JOJO_HBY', true)

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
        current: 'battle',
        next: '',
        map: {
          'save-image': SaveImage,
          'transition': PageTransition,
          'home': PageHome,
          'explore': PageExplore,
          'battle': PageBattle,
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
      },
      battle: {
        self: {
          HP: 1000,
          MP: 1000,
          card: {
            team: [],
            store: [],
            hand: [],
            cemetery: [],
            consume: []
          },
          buff: [],
        },
        opposite: {
          HP: 1000,
          MP: 1000,
          card: {
            team: [],
            store: [],
            hand: [],
            cemetery: [],
            consume: []
          },
          buff: [],
        }
      },
      function: {
        render: this.render,
        loopStart: this.loopStart,
        loopEnd: this.loopEnd,
        message: (m) => this.instanceMessage.send(m),
        sound: (k) => this.instanceSound.play(k)
      }
    }

    Imitation.state.info.cardLibrary = originCard.map(i => {
      return {
        key: i.key,
        value: [
          {
            level: 1,
            number: 10
          },
          {
            level: 2,
            number: 4
          },
        ]
      }
    })

    Imitation.state.info.cardLibrary = [...Imitation.state.info.cardLibrary, ...Imitation.state.info.cardLibrary, ...Imitation.state.info.cardLibrary]

    Imitation.state.info.team[0] = originCard.map(i => ({ key: i.key, value: [{ level: 1, number: 1 }] }))

    Imitation.state.info.team[0] = [...Imitation.state.info.team[0], ...Imitation.state.info.team[0]]

    Imitation.state.explore.map = originExplore
  }
}

new Main()