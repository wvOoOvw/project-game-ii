import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, parseCard, numberFix } from './utils-common'
import { drawText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Button } from './ui-button'

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

class Battler {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.battler = props.battler
    this.imageIns = props.imageIns

    this.beHitAnimation = false
    this.beHitAnimationTime = 0
    this.beCureAnimation = false
    this.beCureAnimationTime = 0
  }

  beHit() {
    this.beHitAnimation = true
  }

  beCure() {
    this.beCureAnimation = true
  }

  render() {
    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height
    const battler = this.battler

    ctx.save()

    drawRadius({ x, y, width, height, radius: 12 })

    ctx.clip()

    drawImage(this.imageIns, { x: x, y: y, width: width, height: height })

    ctx.fillStyle = 'white'
    ctx.font = `bold 12px monospace`

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'

    ctx.fillText(`HP: ${battler.HP}`, x + 12, y + 12)
    ctx.fillText(`MP: ${battler.MP}`, x + 12, y + 30)
    ctx.fillText(`牌库: ${battler.card.store.length}`, x + 12, y + 48)
    ctx.fillText(`手牌: ${battler.card.hand.length}`, x + 12, y + 66)
    ctx.fillText(`墓地: ${battler.card.cemetery.length}`, x + 12, y + 84)

    ctx.restore()
  }
}

class Card {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    // this.x_ = 0

    this.card = props.card
    this.touchStart = props.touchStart
    this.touchEnd = props.touchEnd
    this.consoleHeight = props.consoleHeight

    this.useAble = false
    this.useAbleTime = 0

    this.mouseDownPosition = null

    this.mouseDownPositionTime = 0

    this.imageDOM
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
      this.touchStart()
    } catch { }
  }

  eventUp(e) {
    this.mouseDownPosition = null

    this.offsetX = 0
    this.offsetY = 0

    if (this.useAble) this.touchEnd()
  }

  eventMove(e) {
    if (!this.mouseDownPosition) return

    clearTimeout(this.scrollbarTimeout)
    this.scrollbarTimeout = setTimeout(() => this.scrollbarTimeout = null, 1000)

    const changeX = (e.pageX || e.targetTouches[0].pageX) - this.mouseDownPosition[0]
    const changeY = (e.pageY || e.targetTouches[0].pageY) - this.mouseDownPosition[1]
    this.mouseDownPosition = [this.mouseDownPosition[0] + changeX, this.mouseDownPosition[1] + changeY]

    this.offsetX = this.offsetX + changeX
    this.offsetY = this.offsetY + changeY
  }

  render() {
    if (!this.imageDOM || this.imageDOM.src !== this.card.image) this.imageDOM = createImage(this.card.image)

    // if (this.x_ !== this.x) {
    //   const diff = this.x - this.x_

    //   if (diff > 1) this.x_ = this.x_ + 1
    //   if (diff >= -1 && diff <= 1) this.x_ = this.x
    //   if (diff < -1) this.x_ = this.x_ - 1
    // }

    this.useAble = this.offsetY < 0 - this.consoleHeight / 2

    if (this.mouseDownPosition && this.mouseDownPositionTime < 1) {
      this.mouseDownPositionTime = numberFix(this.mouseDownPositionTime + 0.1)
    }

    if (!this.mouseDownPosition && this.mouseDownPositionTime > 0) {
      this.mouseDownPositionTime = 0
    }

    if (this.useAble && this.useAbleTime < 1) {
      this.useAbleTime = numberFix(this.useAbleTime + 0.1)
    }

    if (!this.useAble && this.useAbleTime > 0) {
      this.useAbleTime = numberFix(this.useAbleTime - 0.1)
    }

    const card = this.card

    const diff = {
      x: -this.width * 0.5,
      y: -this.height * 0.5,
      width: this.width,
      height: this.height
    }

    const x = this.x + this.offsetX + diff.x * this.mouseDownPositionTime
    const y = this.y + this.offsetY + diff.y * this.mouseDownPositionTime
    const width = this.width + diff.width * this.mouseDownPositionTime
    const height = this.height + diff.height * this.mouseDownPositionTime

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    if (this.useAbleTime) {
      ctx.shadowBlur = this.useAbleTime * 40
      ctx.shadowColor = "black"
      ctx.fill()

      ctx.shadowBlur = 0
    }

    ctx.clip()

    drawImage(this.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.fillStyle = `rgba(255, 255, 255, 1)`

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = `bold ${width * 0.075}px monospace`

    if (!this.mouseDownPosition) {
      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)

      drawText({ x: x + width * 0.08, y: y + width * 0.48, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })
    }

    if (this.mouseDownPosition) {
      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)
      ctx.fillText(`${card.race} · ${card.type}`, x + width * 0.08, y + width * 0.48)

      drawText({ x: x + width * 0.08, y: y + width * 0.60, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })
    }

    ctx.restore()

    addEventListener('touchstart', this.eventDown.bind(this), { x, y, width, height })
    addEventListenerPure('touchmove', this.eventMove.bind(this))
    addEventListenerPure('touchend', this.eventUp.bind(this))
  }
}

class Console {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.cards = props.cards
    this.env = props.env
    this.useCard = props.useCard
    this.overRound = props.overRound

    this.touchCard

    this.InstanceCards = []
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  get cardHeight() {
    return (this.width / 4 - 12) * 1.35
  }

  updateCards(cards) {
    this.cards = cards

    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height

    this.InstanceCards = this.cards.map((i, index) => {
      const maxIndex = cards.length
      const centerIndex = maxIndex / 2 - 0.5

      const diff = index - centerIndex

      const option = {
        width: width / 4 - width / 48
      }
      option.height = option.width * 1.35
      option.x = x + (width - option.width) / 2 + diff * (width / 4)
      option.y = y + (height - option.height) / 2
      option.touchStart = () => this.touchCard = i
      option.touchEnd = () => this.useCard(i)
      option.consoleHeight = this.height

      return new Card({ card: i, ...option })
    })
  }

  updateEnv(env) {
    this.env = env
  }

  drawEnv() {
    const option = { x: this.x + 12, y: this.y + this.height / 2 + this.cardHeight / 2 + 12, width: 72, height: 30, font: 10, text: `ROUND ${this.env.round}` }

    new Button(option).render()
  }

  drawButtonOverRound() {
    const option = { x: this.x + this.width - 84, y: this.y + this.height / 2 + this.cardHeight / 2 + 12, width: 72, height: 30, font: 10, text: '结束回合' }

    new Button(option).render()

    const event = () => {
      this.overRound()
    }

    addEventListener('touchstart', event, option)
  }

  drawBackground() {
    drawRadius({ ...this.option, radius: 12, x: 12, width: windowWidth - 24 })

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'

    ctx.fill()
  }

  render() {
    this.drawBackground()
    this.drawEnv()
    this.drawButtonOverRound()

    this.InstanceCards.forEach(i => i.card !== this.touchCard ? i.render() : null)
    this.InstanceCards.forEach(i => i.card === this.touchCard ? i.render() : null)
  }
}

class Page {
  constructor() {
    this.animationing = false

    this.env = {
      round: 1
    }

    this.InstanceBattlerSelf
    this.InstanceBattlerTarget
    this.InstanceConsole

    this.instanceBattlerSelf()
    this.instanceBattlerTarget()
    this.instanceConsole()
    this.initBattler()
  }

  initBattler() {
    this.InstanceBattlerSelf.battler.card.store = [...this.InstanceBattlerSelf.battler.card.team]

    this.InstanceBattlerTarget.battler.card.store = [...this.InstanceBattlerTarget.battler.card.team]

    this.pumpCard(4, this.InstanceBattlerSelf)
    this.pumpCard(4, this.InstanceBattlerTarget)

    this.InstanceConsole.updateCards(this.InstanceBattlerSelf.battler.card.hand)
  }

  instanceBattlerSelf() {
    const height = (windowHeight * 0.5) / 2

    this.InstanceBattlerSelf = new Battler({
      x: 12,
      y: 72 + height + safeTop,
      width: windowWidth - 24,
      height: height,
      imageIns: ImageSelf,
      battler: Imitation.state.battle.self
    })

    this.InstanceBattlerSelf.battler.card.team = setArrayRandom(parseCard(Imitation.state.info.team[0], true))
  }

  instanceBattlerTarget() {
    const height = (windowHeight * 0.5) / 2

    this.InstanceBattlerTarget = new Battler({
      x: 12,
      y: 60 + safeTop,
      width: windowWidth - 24,
      height: height,
      imageIns: ImageTarget,
      battler: Imitation.state.battle.target
    })

    this.InstanceBattlerTarget.battler.card.team = setArrayRandom(parseCard(Imitation.state.info.team[0], true))
  }

  instanceConsole() {
    const width = windowWidth < (windowHeight - 160) ? windowWidth - 24 : (windowHeight - 160)
    const height = windowHeight * 0.5 - 96

    this.InstanceConsole = new Console({
      x: (windowWidth - width) / 2,
      y: windowHeight - height - 12,
      width: width,
      height: height,
      cards: this.InstanceBattlerSelf.battler.card.hand,
      env: this.env,
      useCard: this.useCard,
      overRound: this.overRound,
    })
  }

  drawBattlerSelf() {
    this.InstanceBattlerSelf.render()
  }

  drawBattlerTarget() {
    this.InstanceBattlerTarget.render()
  }

  drawConsole() {
    this.InstanceConsole.render()
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

  pumpCard = (times, Battler = this.InstanceBattlerSelf) => {
    while (times) {
      const index = Battler.battler.card.store.length - 1

      Battler.battler.card.hand.push(Battler.battler.card.store[index])
      Battler.battler.card.store.splice(index, index + 1)

      times = times - 1
    }
  }

  useCard = (card, Battler = this.InstanceBattlerSelf) => {
    this.animationing = true

    const [self, target] = Battler === this.InstanceBattlerSelf ? [this.InstanceBattlerSelf, this.InstanceBattlerTarget] : [this.InstanceBattlerTarget, this.InstanceBattlerSelf]

    const result = card.function(card, self.battler, target.battler, this.env)

    while (result.length) {
      const current = result.shift()

      if (current.type === 'hit-target') {
        target.battler.HP = target.battler.HP + current.value
      }
    }

    self.battler.card.hand = self.battler.card.hand.filter(i => i !== card)

    self.battler.card.cemetery.push(card)

    this.animationing = false

    this.InstanceConsole.updateCards(this.InstanceBattlerSelf.battler.card.hand)
  }

  overRound = () => {

  }

  render() {
    this.drawBackground()
    this.drawButtonHome()
    this.drawBattlerSelf()
    this.drawBattlerTarget()
    this.drawConsole()
  }
}

export default Page