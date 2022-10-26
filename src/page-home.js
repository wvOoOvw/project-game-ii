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

  drawMoney() {
    const list = [`金币 ${Imitation.state.info.money_1}`, `钻石 ${Imitation.state.info.money_2}`, `碎片 ${Imitation.state.info.money_3}`]

    list.forEach((i, index) => {
      const maxIndex = list.length
      const centerIndex = maxIndex / 2 - 0.5
      const diff = index - centerIndex

      const option = { y: 12, width: 84, height: 32, radius: 4, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: i }

      option.x = (windowWidth - option.width) / 2 + diff * (option.width + 8)

      new Button(option).render()
    })
  }

  drawButtonExplore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight - 240, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '探索' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'explore'
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonStore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight - 180, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '编队' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'store'
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonShop() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight - 120, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '商店' }

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
    this.drawMoney()
    this.drawButtonExplore()
    this.drawButtonStore()
    this.drawButtonShop()
  }
}

export default Page