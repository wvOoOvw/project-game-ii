import { drawRadius } from './utils-canvas'
import { numberFix } from './utils-common'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Message {
  constructor() {
    this.message = ''
    this.backgroundColor = 'rgba(255, 255, 255, 1)'
    this.textColor = 'rgba(0, 0, 0, 1)'

    this.timeout = 750
    this.timeoutRef = null

    this.show = false

    this.opacity = 0
    this.width = Math.min(windowWidth - 24, 180)
    this.height = 32
    this.x = (windowWidth - this.width) / 2
    this.y = windowHeight
  }

  send(message, backgroundColor = 'rgba(255, 255, 255, 1)', textColor = 'rgba(0, 0, 0, 1)') {
    clearTimeout(this.timeoutRef)

    this.message = message
    this.backgroundColor = backgroundColor
    this.textColor = textColor
    this.show = true

    this.timeoutRef = setTimeout(() => {
      this.show = false
      this.timeoutRef = null
    }, this.timeout)
  }

  render() {
    if (this.show && this.opacity < 1) {
      this.opacity = numberFix(this.opacity + 0.05)
    }

    if (!this.show && this.opacity > 0) {
      this.opacity = numberFix(this.opacity - 0.05)
    }

    if (this.show && this.y > windowHeight - 44) {
      this.y = numberFix(this.y - 4)
    }

    if (!this.show && this.y < windowHeight) {
      this.y = numberFix(this.y + 4)
    }

    if (!this.show && this.opacity === 0) return

    ctx.save()

    ctx.globalAlpha = this.opacity

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 10px ${window.fontFamily}`
    ctx.fillStyle = this.backgroundColor

    drawRadius({ x: this.x, y: this.y, width: this.width, height: this.height, radius: 8 })

    ctx.fill()

    ctx.fillStyle = this.textColor

    ctx.fillText(this.message, this.x + this.width / 2, this.y + this.height / 2)

    ctx.restore()
  }
}

export { Message }