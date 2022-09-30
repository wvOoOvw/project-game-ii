import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
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

class PageExplore {
  constructor() {
    this.exploreMap

    this.InstanceScrollBox
    this.InstanceScrollList

    this.instance()
  }

  get scrollListHeight() {
    const row = this.exploreMap.length

    if (row === 0) return 0

    const real = 160 * row

    const margin = row ? 12 * (row - 1) : 0

    return real + margin
  }

  instance() {
    this.exploreMap = Imitation.state.explore.map

    this.instanceScrollBox()
    this.instanceScrollList()
  }

  instanceScrollBox() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 72 - safeTop, radius: 12, scrollbarHidden: true }

    this.InstanceScrollBox = new Scroll(scrollOption)

    this.InstanceScrollBox.scrollY = this.scrollListHeight - this.InstanceScrollBox.height
  }

  instanceScrollList() {
    this.InstanceScrollList = this.exploreMap.map((i, index) => {
      const scrollOption = { x: 12, y: 60 + 172 * index + safeTop, width: windowWidth - 24, height: 160, radius: 12, scrollbarHidden: true }

      const instance = new Scroll(scrollOption)

      instance.extra = i

      instance.scrollX = 92 * i.list.length + 12 - instance.width

      return instance
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
    this.InstanceScrollList.forEach((i, index) => {
      const option = { ...i.option, y: i.y - offsetY, radius: i.radius }

      drawRadius(option)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.fill()

      i.offsetY = 0 - offsetY

      const event = (scroll) => {
        const offsetX = scroll[0]

        this.drawScrollContent(i.extra, offsetX, offsetY, index)
      }

      i.render(event)
    })
  }

  drawScrollContent(content, offsetX, offsetY, index) {
    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'black'
    ctx.font = 'bold 12px monospace'
    ctx.fillText(content.name, 24, 72 + 172 * index - offsetY + safeTop)

    content.list.forEach((i, index_) => {
      const option = { width: 80, height: 80, y: 108 + 172 * index - offsetY + safeTop, fillStyle: 'black', strokeStyle: 'black', font: 12, text: i.name }

      option.x = 24 + (option.width + 12) * index_ - offsetX

      new Button(option).render()
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

export default PageExplore