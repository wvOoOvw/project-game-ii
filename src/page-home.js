import { addEventListener, createImage } from './utils-common'
import { drawImage } from './utils-canvas'

import { Button } from './ui-button'

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
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7, width: 120, height: 40, text: '战斗' }

    new Button(option).render()

    const event = () => {

    }

    addEventListener('touchstart', event, option)
  }

  drawButtonStore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7 + 60, width: 120, height: 40, text: '仓库' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'store'
      Imitation.dispatch()
    }

    addEventListener('touchstart', event, option)
  }

  drawBackground() {
    drawImage(backgroundImage, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  render() {
    this.drawBackground()
    this.drawButtonBattle()
    this.drawButtonStore()
  }
}

export default PageHome