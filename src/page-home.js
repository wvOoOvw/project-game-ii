import { addEventListener, createImage } from './utils-common'
import { drawImageFullCenter, drawButtonWhite, ctxInit } from './utils-canvas'

import J_205624_78456047248 from '../media/205624_78456047248.jpeg'
import J_162926_76690565815 from '../media/162926_76690565815.jpeg'
import J_234521_92189037316 from '../media/234521_92189037316.jpeg'

const ctx = canvas.getContext('2d')

const backgroundImage = createImage(J_234521_92189037316)

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class PageHome {
  constructor() {

  }

  drawButtonBattle() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7, width: 120, height: 40, radius: 8, font: 14, lineWidth: 1, text: '战斗' }

    drawButtonWhite(option)

    const event = () => {

    }

    addEventListener('touchstart', event, option)
  }

  drawButtonStore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7 + 60, width: 120, height: 40, radius: 8, font: 14, lineWidth: 1, text: '仓库' }

    drawButtonWhite(option)

    const event = () => {
      Imitation.state.page.current = 'store'
      Imitation.dispatch()
    }

    addEventListener('touchstart', event, option)
  }

  render() {
    drawImageFullCenter(backgroundImage, { x: 0, y: 0, width: windowWidth, height: windowHeight })

    this.drawButtonBattle()
    this.drawButtonStore()
  }
}

export default PageHome