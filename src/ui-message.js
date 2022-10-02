import { numberFix } from './utils-common'

const ctx = canvas.getContext('2d')

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Message {
  constructor() {
    this.message = ''

    this.timeout = 1000
    this.timeoutRef = null

    this.show = false

    this.opacity = 0
  }

  send(message) {
    clearTimeout(this.timeoutRef)

    this.message = message
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

    if (!this.show && this.opacity === 0) return

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = 'bold 14px monospace'
    ctx.lineWidth = 1
    ctx.fillStyle = `rgba(0, 0, 0, ${this.opacity})`

    ctx.fillText(this.message, windowWidth / 2, 24)
  }
}

export { Message }