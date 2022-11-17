import { drawMultilineText, drawImage, drawRect, drawRectRadius, drawRectAngle } from './utils-canvas'

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

    drawRectAngle(option)

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillText('探索', option.x + option.width / 2, option.y + option.height / 2)

    const event = () => {
      window.Imitation.state.page.current = 'transition'
      window.Imitation.state.page.next = 'explore'
    }

    window.Imitation.state.function.event('touchstart', event, { ifTouchCover: option })
  }

  drawButtonStore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight - 180, width: 120, height: 40, radius: 8 }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 14px ${window.fontFamily}`

    drawRectAngle(option)

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillText('编队', option.x + option.width / 2, option.y + option.height / 2)

    const event = () => {
      window.Imitation.state.page.current = 'transition'
      window.Imitation.state.page.next = 'store'
    }

    window.Imitation.state.function.event('touchstart', event, { ifTouchCover: option })
  }

  drawButtonShop() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight - 120, width: 120, height: 40, radius: 8 }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 14px ${window.fontFamily}`

    drawRectAngle(option)

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillText('商店', option.x + option.width / 2, option.y + option.height / 2)

    const event = () => {
      window.Imitation.state.page.current = 'transition'
      window.Imitation.state.page.next = 'shop'
    }

    window.Imitation.state.function.event('touchstart', event, { ifTouchCover: option })
  }

  render() {
    drawImage(Picture.get('background-home'), { x: 0, y: 0, width: windowWidth, height: windowHeight })

    this.drawButtonExplore()
    this.drawButtonStore()
    this.drawButtonShop()
  }
}

export default Page