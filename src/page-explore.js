import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Card } from './ui-card'
import { Button } from './ui-button'

import J_205624_78456047248 from '../media/205624_78456047248.jpg'
import J_162926_76690565815 from '../media/162926_76690565815.jpg'
import J_234521_92189037316 from '../media/234521_92189037316.jpg'
import J_185550_35094491662 from '../media/185550_35094491662.jpg'
import J_153344_22433013228 from '../media/153344_22433013228.jpg'

const ctx = canvas.getContext('2d')

const backgroundImage = createImage(J_153344_22433013228)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class PageHome {
  constructor() {
    this.InstanceScrollBox
    this.InstanceScrollList

    this.instance()
  }

  instance() {
    this.instanceScrollBox()
    this.instanceScrollList()
  }

  instanceScrollBox() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 72 - safeTop, radius: 12, scrollbar: false }

    this.InstanceScrollBox = new Scroll(scrollOption)

    this.InstanceScrollBox.offsetY = 800
  }

  instanceScrollList() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 72 - safeTop, radius: 12, scrollbar: false }

    this.InstanceScrollBox = new Scroll(scrollOption)

    this.InstanceScrollBox.offsetX = 600
  }

  drawScroll() {
    const event = (offset) => {
      this.offsetY = offset[1]
    }

    this.InstanceScrollBox.render(event)
  }

  drawButtonHome() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, text: 'Back' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  drawBackground() {
    drawImage(backgroundImage, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  render() {
    this.drawBackground()
    this.drawButtonHome()
    this.drawScroll()
  }
}

export default PageHome