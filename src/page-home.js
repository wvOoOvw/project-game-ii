import { addEventListener, createImage } from './utils-common'
import { drawImage } from './utils-canvas'

import { Button } from './ui-button'

import J_music_56280e428411459c823ce172d97da20c0 from '../media/background/music_56280e428411459c823ce172d97da20c0.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_56280e428411459c823ce172d97da20c0)

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Page {
  constructor() {

  }

  drawButtonExplore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.6, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '探索' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'explore'
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonStore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.6 + 60, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '编队' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'store'
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonShop() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.6 + 120, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '商店' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'shop'
    }

    addEventListener('touchstart', event, option)
  }

  drawBackground() {
    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  render() {
    this.drawBackground()
    this.drawButtonExplore()
    this.drawButtonStore()
    this.drawButtonShop()
  }
}

export default Page