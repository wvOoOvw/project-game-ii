import { drawMultilineText, drawImage, drawRect, drawRectRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Setting {
  constructor(props) {
    this.x = 0
    this.y = safeTop
    this.width = windowWidth
    this.height = windowHeight - safeTop

    this.novaTime = 0
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  render() {
    ctx.save()

    


    window.Imitation.state.function.event('touchstart', () => i.event(), { stop: true })
    window.Imitation.state.function.event('touchmove', () => null, { stop: true })
    window.Imitation.state.function.event('touchend', () => null, { stop: true })

    ctx.restore()
  }
}

export { Setting }