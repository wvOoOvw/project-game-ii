import { createImage } from './utils-common'
import { drawImage } from './utils-canvas'

import J_205624_78456047248 from '../media/205624_78456047248.jpg'
import J_162926_76690565815 from '../media/162926_76690565815.jpg'
import J_234521_92189037316 from '../media/234521_92189037316.jpg'
import J_17052_65240412012 from '../media/17052_65240412012.jpg'

const ctx = canvas.getContext('2d')

const backgroundImage = createImage(J_162926_76690565815)

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class PageTransition {
  constructor() {
    this.opacity = 0
    this.count = 0
  }

  render() {
    if (this.count <= 20) {
      this.opacity = this.opacity + 0.05
      this.count = this.count + 1
    }

    if (this.count > 20 && this.count <= 40) {
      this.count = this.count + 1
    }

    if (this.count > 40 && this.count <= 60) {
      this.opacity = this.opacity - 0.05
      this.count = this.count + 1
    }

    if (this.count > 60) {
      Imitation.state.page.current = Imitation.state.page.next
      Imitation.state.page.next = ''
      return
    }

    ctx.globalAlpha = this.opacity

    drawImage(backgroundImage, { x: 0, y: 0, width: windowWidth, height: windowHeight })

    ctx.globalAlpha = 1
  }
}

export default PageTransition