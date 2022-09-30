import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Card } from './ui-card'
import { Button } from './ui-button'

import { parse } from '../source/card'

import J_205624_78456047248 from '../media/205624_78456047248.jpg'
import J_162926_76690565815 from '../media/162926_76690565815.jpg'
import J_234521_92189037316 from '../media/234521_92189037316.jpg'

const ctx = canvas.getContext('2d')

const backgroundImage = createImage(J_205624_78456047248)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class PageBattle {
  constructor() {
    this.left = 0
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

  render() {
    this.drawButtonHome()
  }
}

export default PageBattle