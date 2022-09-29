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
    this.map

    this.InstanceScrollBox
    this.InstanceScrollList

    this.instance()
  }

  instance() {
    this.map = Imitation.state.explore.map

    this.instanceScrollBox()
    this.instanceScrollList()
  }

  instanceScrollBox() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 72 - safeTop, radius: 12, scrollbar: false }

    this.InstanceScrollBox = new Scroll(scrollOption)

    this.InstanceScrollBox.scrollY = 800
  }

  instanceScrollList() {
    this.InstanceScrollList = this.map.map((i, index) => {
      const scrollOption = { x: 12, y: 60 + 212 * index + safeTop, width: windowWidth - 24, height: 200, radius: 12 }

      scrollOption.scrollX = 600

      return new Scroll(scrollOption)
    })
  }

  drawScrollBox() {
    const event = (scroll) => {
      const offsetY = scroll[1]

      this.drawScrollList(offsetY)
    }

    this.InstanceScrollBox.render(event)
  }

  drawScrollList(offsetY) {
    this.InstanceScrollList.forEach(i => {
      const option = { ...i.option, y: i.y - offsetY, radius: i.radius }

      drawRadius(option)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.fill()

      i.offsetY = 0 - offsetY

      i.render(new Function)
    })
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
    this.drawScrollBox()
  }
}

export default PageHome