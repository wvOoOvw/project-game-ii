import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, parseCard } from './utils-common'
import { drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Card } from './ui-card'
import { Button } from './ui-button'
import { Battler } from './ui-battler'

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

    this.InstanceSelf
    this.InstanceTarget

    this.instance()
  }

  instance() {
    const height = (windowHeight - 60 - safeTop - 48) / 2

    this.InstanceSelf = new Battler({
      x: 12,
      y: windowHeight - height - 12,
      width: windowWidth - 24,
      height: height,
      type: 'self',
      battler: Imitation.state.battle.self
    })

    this.InstanceSelf.battler.card.team = setArrayRandom(parseCard(Imitation.state.info.team[0], true))

    this.InstanceTarget = new Battler({
      x: 12,
      y: 60 + safeTop,
      width: windowWidth - 24,
      height: height,
      type: 'target',
      battler: Imitation.state.battle.target
    })

    this.InstanceTarget.battler.card.team = setArrayRandom(parseCard(Imitation.state.info.team[0], true))

    this.battleInit()
  }

  drawSelf() {
    this.InstanceSelf.render()
  }

  drawTarget() {
    this.InstanceTarget.render()
  }

  drawBackground() {
    drawImage(backgroundImage, { x: 0, y: 0, width: windowWidth, height: windowHeight })
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

  battleInit() {
    this.InstanceSelf.battler.card.store = this.InstanceSelf.battler.card.team

    this.InstanceSelf.battler.card.hand =  this.InstanceSelf.battler.card.store.filter((i, index) => index < 4)


    this.InstanceTarget.battler.card.store = this.InstanceTarget.battler.card.team

    this.InstanceTarget.battler.card.hand =  this.InstanceTarget.battler.card.store.filter((i, index) => index < 4)
  }

  render() {
    this.drawBackground()
    this.drawButtonHome()
    this.drawSelf()
    this.drawTarget()
  }
}

export default PageBattle