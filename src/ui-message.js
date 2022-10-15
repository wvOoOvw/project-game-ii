import { numberFix } from './utils-common'

import { Button } from './ui-button'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
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

    ctx.save()

    ctx.globalAlpha = this.opacity

    const option = {
      width: windowWidth - 24, 
      height: 36,
      font: 12,
      text: this.message
    }

    option.x = (windowWidth - option.width) / 2
    option.y = windowHeight - 48

    new Button(option).render()

    ctx.restore()
  }
}

export { Message }