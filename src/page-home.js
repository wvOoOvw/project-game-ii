import { addEventListener, createImage } from './utils-common'
import { drawImage, drawRadius } from './utils-canvas'

import { Picture } from './utils-picture'

const ctx = canvas.getContext('2d')

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Page {
  constructor() {

  }

  drawButtonExplore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight - 240, width: 120, height: 40, radius: 8 }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 14px ${window.fontFamily}`

    drawRadius(option)

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillText('探索', option.x + option.width / 2, option.y + option.height / 2)

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'explore'
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonStore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight - 180, width: 120, height: 40, radius: 8 }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 14px ${window.fontFamily}`

    drawRadius(option)

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillText('编队', option.x + option.width / 2, option.y + option.height / 2)

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'store'
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonShop() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight - 120, width: 120, height: 40, radius: 8 }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 14px ${window.fontFamily}`

    drawRadius(option)

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillText('商店', option.x + option.width / 2, option.y + option.height / 2)

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'shop'
    }

    addEventListener('touchstart', event, option)
  }

  render() {
    drawImage(Picture.get('background-home'), { x: 0, y: 0, width: windowWidth, height: windowHeight })

    this.drawButtonExplore()
    this.drawButtonStore()
    this.drawButtonShop()
  }
}

export default Page