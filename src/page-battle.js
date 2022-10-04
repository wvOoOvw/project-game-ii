import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, parseCard } from './utils-common'
import { drawImage, drawRect, drawRadius } from './utils-canvas'

import { Button } from './ui-button'
import { Battler } from './ui-battler'

import J_music_b40316005b55465b80ae4eecad8447960 from '../media/music_b40316005b55465b80ae4eecad8447960.jpeg'
import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/music_1c31bcc267a545ef971109512053f3e50.jpeg'
import J_music_6e9e96c75cf04411baa154b1d6a3c7360 from '../media/music_6e9e96c75cf04411baa154b1d6a3c7360.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_1c31bcc267a545ef971109512053f3e50)
const ImageTarget = createImage(J_music_6e9e96c75cf04411baa154b1d6a3c7360)
const ImageSelf = createImage(J_music_b40316005b55465b80ae4eecad8447960)

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
      imageIns: ImageSelf,
      battler: Imitation.state.battle.self
    })

    this.InstanceSelfBattler.battler.card.team = setArrayRandom(parseCard(Imitation.state.info.team[0], true))

    this.InstanceTargetBattler = new Battler({
      x: 12,
      y: 60 + safeTop,
      width: windowWidth - 24,
      height: height,
      imageIns: ImageTarget,
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
    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })
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