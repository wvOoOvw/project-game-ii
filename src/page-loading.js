import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class PageTransition {
  constructor() {
    this.time = 0
  }

  render() {
    this.time = this.time + 1 / 32

    drawRect({x:0, y:0, width: windowWidth, height: windowHeight})
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 14px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fillText(`加载中${new Array(Math.floor(this.time % 4)).fill('.').join('')}`, windowWidth / 2, windowHeight / 2)
  }
}

export default PageTransition