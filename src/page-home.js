import { drawMultilineText, drawImage, drawRect, drawRectRadius, drawRectAngle } from './utils-canvas'

import { Picture } from './utils-picture'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Page {
  constructor() {

  }

  render() {
    drawImage(Picture.get('background-home'), { x: 0, y: 0, width: windowWidth, height: windowHeight })

    new Array(['商店', 'shop'], ['探索', 'explore'], ['编队', 'store']).forEach((i, index) => {
      const option = { x: windowWidth / 2 - 60, y: windowHeight - 120 - index * 60, width: 120, height: 40, radius: 8 }

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 14px ${window.fontFamily}`

      drawRectAngle(option)

      ctx.fillStyle = 'rgba(255, 255, 255, 1)'
      ctx.fill()
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fillText(i[0], option.x + option.width / 2, option.y + option.height / 2)

      const event = () => {
        window.Imitation.state.page.current = 'transition'
        window.Imitation.state.page.next = i[1]
      }

      window.Imitation.state.function.event('touchstart', event, { ifTouchCover: option })
    })

    new Array(['音乐', 'soundBackground'], ['音效', 'soundSource']).forEach((i, index) => {
      const option = { y: 12 + safeTop, width: 64, height: 28, radius: 4 }

      option.x = 12 + index * (12 + option.width)

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 10px ${window.fontFamily}`

      drawRectAngle(option)

      ctx.fillStyle = window.Imitation.state[i[1]] ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'
      ctx.fill()
      ctx.fillStyle = window.Imitation.state[i[1]] ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
      ctx.fillText(i[0], option.x + option.width / 2, option.y + option.height / 2)

      const event = () => {
        window.Imitation.state[i[1]] = !window.Imitation.state[i[1]]
      }

      window.Imitation.state.function.event('touchstart', event, { ifTouchCover: option })
    })

  }
}

export default Page