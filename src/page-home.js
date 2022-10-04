import { addEventListener, createImage } from './utils-common'
import { drawImage } from './utils-canvas'

import { Button } from './ui-button'

import J_music_56280e428411459c823ce172d97da20c0 from '../media/music_56280e428411459c823ce172d97da20c0.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_56280e428411459c823ce172d97da20c0)

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class PageHome {
  constructor() {
    
  }

  drawButtonBattle() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7 - 60, width: 120, height: 40, text: '战斗' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'battle'
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonExplore() {
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
    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  render() {
    this.drawBackground()
    this.drawButtonBattle()
    this.drawButtonExplore()
    this.drawButtonStore()
  }
}

export default PageHome