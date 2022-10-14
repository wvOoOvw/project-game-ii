import './adapter-web'
import './adapter-dpr'
import './data-imitation'

import PageTransition from './page-transition'
import PageHome from './page-home'
import PageExplore from './page-explore'
import PageBattlePve from './page-battle-pve'
import PageStore from './page-store'

import { Message } from './ui-message'
import { Sound } from './utils-sound'
import { SaveImage } from './utils-saveImage'

import { originCard, originBoss, originExplore } from './source'

const ctx = canvas.getContext('2d')

class Main {
  constructor() {
    this.loadingInformation = false
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
        current: 'explore',
        next: '',
        map: {
          'save-image': SaveImage,
          'transition': PageTransition,
          'home': PageHome,
          'explore': PageExplore,
          'battle-pve': PageBattlePve,
          'store': PageStore,
        },
      },
      removeEventListener: [],
      info: {
        cardLibrary: null,
        team: null,
        teamIndex: null,
      },
      explore: {
        map: null
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

    const responseHTTP = {
      cardLibrary: originCard.map(i => {
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
      }),
      team: [
        originCard.map(i => ({ key: i.key, value: [{ level: 1, number: 1 }] })),
        originCard.map(i => ({ key: i.key, value: [{ level: 1, number: 1 }] })),
        originCard.map(i => ({ key: i.key, value: [{ level: 1, number: 1 }] })),
        originCard.map(i => ({ key: i.key, value: [{ level: 1, number: 1 }] })),
      ],
      teamIndex: 0,
    }

    Imitation.state.info = responseHTTP

    Imitation.state.explore.map = originExplore
  }
}

new Main()