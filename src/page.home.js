import { addEventListener, createImage } from './utils.common'
import { drawImage } from './utils.canvas'

import { Button } from './ui.button'

import J_205624_78456047248 from '../media/205624_78456047248.jpg'
import J_162926_76690565815 from '../media/162926_76690565815.jpg'
import J_234521_92189037316 from '../media/234521_92189037316.jpg'
import J_185550_35094491662 from '../media/185550_35094491662.jpg'
import J_153344_22433013228 from '../media/153344_22433013228.jpg'

const ctx = canvas.getContext('2d')

const backgroundImage = createImage(J_153344_22433013228)

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class PageHome {
  constructor() {
    
  }

  drawButtonBattle() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7, width: 120, height: 40, text: '探索' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'explore'
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonStore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7 + 60, width: 120, height: 40, text: '仓库' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'store'
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