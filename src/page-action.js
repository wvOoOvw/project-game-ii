import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawRect, drawRadius } from './utils-canvas'

import { ScrollY } from './ui-scroll'
import { Card } from './ui-card'
import { Button } from './ui-button'
import { Arrow } from './ui-arrow'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class PageAction {
  constructor() {
    this.offset = 0
  }

  drawBox() {
    const option = { x: 0, y: windowHeight - 30 - this.offset, width: windowWidth, height: 200, radius: 12 }
    drawRadius(option)

    ctx.fillStyle = 'white'

    ctx.fill()
  }

  drawArrow() {
    const option = { x: windowWidth / 2 - 40, y: windowHeight - 30 - this.offset, width: 80, height: 20, direction: 'top' }

    if (Imitation.state.action) {
      option.direction = 'bottom'
    }
    if (!Imitation.state.action) {
      option.direction = 'top'
    }

    new Arrow(option).render()

    const event = () => {
      Imitation.state.action = !Imitation.state.action
    }

    addEventListener('touchstart', event, option)
  }

  drawActioin() {
    const option = { x: windowWidth / 2 - 40, y: windowHeight + 20 - this.offset, width: 120, height: 40, radius: 12, fillStyle: 'black', strokeStyle: 'black', text: 'Home' }
    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  drawAction() {

  }

  render() {
    if (Imitation.state.action && this.offset < 200) {
      this.offset = this.offset + 8
    }
    if (!Imitation.state.action && this.offset > 0) {
      this.offset = this.offset - 8
    }

    this.drawBox()
    this.drawArrow()
    this.drawActioin()
  }

}

export default PageAction