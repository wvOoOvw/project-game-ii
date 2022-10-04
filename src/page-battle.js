import { UI } from './ui'
import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, parseCard } from './utils-common'
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

class Battler extends UI {
  constructor(props) {
    super(props)
    this.battler = props.battler
    this.imageIns = props.imageIns
  }


  render() {
    const x = this.resultX
    const y = this.resultY
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

class Card extends UI {
  constructor(props) {
    super(props)
    this.card = props.card
    this.rotate = props.rotate

    this.mouseDownPosition = null

    this.imageDOM
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
    } catch { }
  }
  eventUp(e) {
    this.mouseDownPosition = null

    this.offsetX = 0
    this.offsetY = 0
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

    const x = this.resultX
    const y = this.resultY
    const width = this.width
    const height = this.height
    const card = this.card

    ctx.save()

    ctx.rotate(this.rotate)

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(this.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.fillStyle = `rgba(255, 255, 255, 1)`

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = `bold ${this.width * 0.075}px monospace`

    ctx.fillText(card.name, x + width / 2, y + width * 0.12)

    if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

    ctx.textAlign = 'start'

    ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)

    drawText({ x: x + width * 0.08, y: y + width * 0.48, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })

    ctx.restore()

    addEventListener('touchstart', this.eventDown.bind(this), this.option)
    addEventListenerPure('touchmove', this.eventMove.bind(this), this.option)
    addEventListenerPure('touchend', this.eventUp.bind(this), this.option)
  }
}

class Console extends UI {
  constructor(props) {
    super(props)
    this.cards = props.cards

    this.InstanceCards = []
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
        width: width / 4,
        height: width / 4 * 1.35
      }
      option.x = x + (width - option.width) / 2 + diff * (width / 4)
      option.y = y + (height - option.height) / 2

      return new Card({ card: i, ...option })
    })
  }

  render() {
    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height

    ctx.fillStyle = 'white'

    drawRadius({ x, y, width, height, radius: 0 })

    ctx.fill()

    this.InstanceCards.forEach(i => i.render())
  }
}

class Page {
  constructor() {
    this.left = 0

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
    this.InstanceBattlerSelf.battler.card.store = this.InstanceBattlerSelf.battler.card.team

    this.InstanceBattlerTarget.battler.card.store = this.InstanceBattlerTarget.battler.card.team

    this.pumpCard(this.InstanceBattlerSelf.battler.card.store, this.InstanceBattlerSelf.battler.card.hand, 4)

    this.pumpCard(this.InstanceBattlerTarget.battler.card.store, this.InstanceBattlerTarget.battler.card.hand, 4)

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
    const height = windowHeight * 0.5 - 96
    this.InstanceConsole = new Console({
      x: 12,
      y: windowHeight - height - 12,
      width: windowWidth - 24,
      height: height,
      cards: this.InstanceBattlerSelf.battler.card.hand
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

  pumpCard(store, hand, times) {
    while (times) {
      const index = store.length - 1
      hand.push(store[index])
      store.splice(index, index + 1)
      times = times - 1
    }
  }

  useCard(card, hand, cemetery, consume) {

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