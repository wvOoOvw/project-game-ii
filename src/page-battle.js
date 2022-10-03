import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, parseCard } from './utils-common'
import { drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Button } from './ui-button'
import { Battler } from './ui-battler'

import J_205624_78456047248 from '../media/205624_78456047248.jpg'
import J_162926_76690565815 from '../media/162926_76690565815.jpg'
import J_234521_92189037316 from '../media/234521_92189037316.jpg'
import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/music_1c31bcc267a545ef971109512053f3e50.jpeg'
import J_music_47a83799595b4a5b97145a6e594620310 from '../media/music_47a83799595b4a5b97145a6e594620310.jpeg'

const ctx = canvas.getContext('2d')

const backgroundImage = createImage(J_205624_78456047248)
const targetImage = createImage(J_music_47a83799595b4a5b97145a6e594620310)
const selfImage = createImage(J_music_1c31bcc267a545ef971109512053f3e50)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class PageBattle {
  constructor() {
    this.left = 0

    this.InstanceSelfBattler
    this.InstanceTargetBattler

    this.instance()
  }

  instance() {
    const height = (windowHeight * 0.5) / 2
    this.InstanceSelfBattler = new Battler({
      x: 12,
      y: 72 + height + safeTop,
      width: windowWidth - 24,
      height: height,
      imageIns: selfImage,
      battler: Imitation.state.battle.self
    })

    this.InstanceSelfBattler.battler.card.team = setArrayRandom(parseCard(Imitation.state.info.team[0], true))

    this.InstanceTargetBattler = new Battler({
      x: 12,
      y: 60 + safeTop,
      width: windowWidth - 24,
      height: height,
      imageIns: targetImage,
      battler: Imitation.state.battle.target
    })

    this.InstanceTargetBattler.battler.card.team = setArrayRandom(parseCard(Imitation.state.info.team[0], true))

    this.battleInit()
  }

  drawSelfBattler() {
    this.InstanceSelfBattler.render()
  }

  drawTargetBattler() {
    this.InstanceTargetBattler.render()
  }

  drawBackground() {
    drawImage(backgroundImage, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  drawButtonHome() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, text: 'Home' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  battleInit() {
    this.InstanceSelfBattler.battler.card.store = this.InstanceSelfBattler.battler.card.team

    this.InstanceSelfBattler.battler.card.hand = this.InstanceSelfBattler.battler.card.store.filter((i, index) => index < 4)

    this.InstanceTargetBattler.battler.card.store = this.InstanceTargetBattler.battler.card.team

    this.InstanceTargetBattler.battler.card.hand = this.InstanceTargetBattler.battler.card.store.filter((i, index) => index < 4)
  }

  render() {
    this.drawBackground()
    this.drawButtonHome()

    this.drawSelfBattler()
    this.drawTargetBattler()
  }
}

export default PageBattle