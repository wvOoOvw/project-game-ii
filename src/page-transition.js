import { createImage, numberFix } from './utils-common'
import { drawImage } from './utils-canvas'

import J_music_8abd849fe01a4fb68dceacc6018190fc0 from '../media/background/music_8abd849fe01a4fb68dceacc6018190fc0.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_8abd849fe01a4fb68dceacc6018190fc0)

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class PageTransition {
  constructor() {
    this.opacity = 0
    this.count = 0
  }

  render() {
    if (this.count <= 20) {
      this.opacity = numberFix(this.opacity + 0.05)
      this.count = this.count + 1
    }

    if (this.count > 20 && this.count <= 40) {
      this.count = this.count + 1
    }

    if (this.count > 40 && this.count <= 60) {
      this.opacity = numberFix(this.opacity - 0.05)
      this.count = this.count + 1
    }

    if (this.count > 60) {
      Imitation.state.page.current = Imitation.state.page.next
      Imitation.state.page.next = ''
      return
    }

    ctx.globalAlpha = this.opacity

    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })

    ctx.globalAlpha = 1
  }
}

export default PageTransition