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
    this.buttonBattle_I
    this.buttonStore_I

    this.instance()
  }

  instance() {
    this.instanceButtonBattle()
    this.instanceButtonStore()
  }

  instanceButtonBattle() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7, width: 120, height: 40, text: '战斗' }

    this.buttonBattle_I = new Button(option)
  }

  instanceButtonStore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7 + 60, width: 120, height: 40, text: '仓库' }

    this.buttonStore_I = new Button(option)
  }

  drawButtonBattle() {
    this.buttonBattle_I.render()

    const { x, y, width, height } = this.buttonBattle_I

    const event = () => {

    }

    addEventListener('touchstart', event, { x, y, width, height })
  }

  drawButtonStore() {
    this.buttonStore_I.render()

    const { x, y, width, height } = this.buttonStore_I

    const event = () => {
      Imitation.state.page.current = 'store'
      Imitation.dispatch()
    }

    addEventListener('touchstart', event, { x, y, width, height })
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