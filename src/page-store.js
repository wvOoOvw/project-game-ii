import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, sortCard } from './utils-common'
import { drawImage, drawRect, drawRadius } from './utils-canvas'

import { Banner } from './ui-banner'
import { Button } from './ui-button'

import J_205624_78456047248 from '../media/205624_78456047248.jpg'
import J_162926_76690565815 from '../media/162926_76690565815.jpg'
import J_234521_92189037316 from '../media/234521_92189037316.jpg'
import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/music_1c31bcc267a545ef971109512053f3e50.jpeg'
import J_music_47a83799595b4a5b97145a6e594620310 from '../media/music_47a83799595b4a5b97145a6e594620310.jpeg'

const ctx = canvas.getContext('2d')

const backgroundImage = createImage(J_205624_78456047248)
const libraryImage = createImage(J_music_1c31bcc267a545ef971109512053f3e50)
const teamImage = createImage(J_music_47a83799595b4a5b97145a6e594620310)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class App {
  constructor() {

  }

  drawList() {
    const height = (windowHeight - 60 - safeTop) / Imitation.state.info.team.length

    const option = (index) => {
      return {
        x: 12,
        y: 60 + height * index + safeTop,
        width: windowWidth - 24,
        height: height - 12,
        text: '仓库'
      }
    }

    Imitation.state.info.team.forEach((i, index) => {
      new Banner({
        ...option(index),
        imageIns: teamImage,
        text: ['队伍 ' + new Array(index + 1).fill('I').join(''), sortCard(parseCard(i, true)).length]
      }).render()

      const event = () => {
        Imitation.state.page.current = 'transition'
        Imitation.state.page.next = 'store-team'
        Imitation.state.page.params = { index }
      }

      addEventListener('touchstart', event, option(index + 1))
    })
  }

  drawBackground() {
    drawImage(backgroundImage, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  drawButtonHome() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, text: 'Home' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  render() {
    this.drawBackground()
    this.drawButtonHome()
    this.drawList()
  }
}

export default App