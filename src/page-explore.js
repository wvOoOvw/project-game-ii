import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, setArrayRandom, parseMaster } from './utils-common'
import { drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Button } from './ui-button'

import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/music_1c31bcc267a545ef971109512053f3e50.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_1c31bcc267a545ef971109512053f3e50)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Page {
  constructor() {
    this.explore

    this.InstanceScroll

    this.instance()
  }

  get scrollListHeight() {
    const row = this.explore.length

    if (row === 0) return 0

    const real = 160 * row

    const margin = row ? 12 * (row - 1) : 0

    return real + margin
  }

  instance() {
    this.explore = Imitation.state.explore

    this.instanceScroll()
  }

  instanceScroll() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 72 - safeTop, radius: 12, scrollbarHidden: true }

    this.InstanceScroll = new Scroll(scrollOption)

    this.InstanceScroll.scrollY = this.scrollListHeight - this.InstanceScroll.height
  }

  drawScrollBox() {
    const event = (scroll) => {
      const offsetY = scroll[1]
      this.drawScrollContent(offsetY)
    }

    this.InstanceScroll.render(event)
  }

  drawScrollContent(offsetY) {
    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.font = `900 12px ${window.fontFamily}`

    this.explore.forEach((i, index) => {
      const x = 12
      const y = 60 + index * 172 + safeTop - offsetY
      const width = windowWidth - 24
      const height = 160

      if (!ifScreenCover({ x, y, width, height }, this.InstanceScroll.option)) return

      ctx.save()

      drawRadius({ x, y, width, height, radius: 12 })

      ctx.clip()

      drawImage(i.imageDOM, { x: x, y: y, width: width, height: height })

      ctx.fillText(i.name, x + 12, y + 12)

      ctx.restore()

      const event = () => {
        this.enter(i)
      }

      addEventListener('touchstart', event, { x, y, width, height })
    })
  }

  enter(explore) {
    Imitation.state.battle = {
      self: {
        master: {
          ...parseMaster([Imitation.state.info.library.master.find(i => i.key === Imitation.state.info.team[Imitation.state.info.teamIndex].master[0].key)])[0],
          buff: []
        },
        card: {
          team: parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex].card, true),
          store: setArrayRandom(parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex].card, true)),
          hand: [],
          cemetery: [],
          consume: []
        },
      },
      opposite: {
        master: {
          ...parseMaster([explore.boss.master])[0],
          buff: []
        },
        card: {
          team: parseCard(explore.boss.card, true),
          store: setArrayRandom(parseCard(explore.boss.card, true)),
          hand: [],
          cemetery: [],
          consume: []
        },
        AI: explore.AI
      },
      reward: parseCard(explore.reward())
    }

    Imitation.state.page.current = 'transition'
    Imitation.state.page.next = 'battle-pve'
  }

  drawButtonHome() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, text: '返回' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  drawBackground() {
    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  render() {
    this.drawBackground()
    this.drawButtonHome()
    this.drawScrollBox()
  }
}

export default Page