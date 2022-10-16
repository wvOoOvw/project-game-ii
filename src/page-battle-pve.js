import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'
import { drawText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Button } from './ui-button'
import { Scroll } from './ui-scroll'

import J_music_b40316005b55465b80ae4eecad8447960 from '../media/music_b40316005b55465b80ae4eecad8447960.jpeg'
import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/music_1c31bcc267a545ef971109512053f3e50.jpeg'
import J_music_6e9e96c75cf04411baa154b1d6a3c7360 from '../media/music_6e9e96c75cf04411baa154b1d6a3c7360.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_1c31bcc267a545ef971109512053f3e50)
const ImageOpposite = createImage(J_music_6e9e96c75cf04411baa154b1d6a3c7360)
const ImageSelf = createImage(J_music_b40316005b55465b80ae4eecad8447960)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Opposite {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.battler = props.battler
    this.imageIns = props.imageIns

    this.HP = this.battler.HP
    this.MP = this.battler.MP
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

    ctx.font = `bold 12px monospace`

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'

    ctx.fillText(this.battler.name, this.x + 12, this.y + 12)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'center'

    {
      ctx.save()

      drawRadius({ x: this.x + 12, y: this.y + 36, width: this.width - 24, height: 24, radius: 12 })

      ctx.clip()

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fill()

      drawRect({ x: this.x + 12, y: this.y + 36, width: this.width - 24, height: 24 })

      ctx.fillStyle = 'rgba(185, 0, 0, 1)'
      ctx.fill()

      ctx.restore()

      ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      ctx.fillText(`HP: ${battler.HP}`, this.x + this.width / 2, y + 42)
    }

    {
      ctx.save()

      drawRadius({ x: this.x + 12, y: this.y + 72, width: this.width - 24, height: 24, radius: 12 })

      ctx.clip()

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fill()

      drawRect({ x: this.x + 12, y: this.y + 72, width: this.width - 24, height: 24 })

      ctx.fillStyle = 'rgba(0, 0, 185, 1)'
      ctx.fill()

      ctx.restore()

      ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      ctx.fillText(`MP: ${battler.MP}`, this.x + this.width / 2, y + 78)
    }

    this.battler.buff
      .reduce((t, i) => {
        const find = t.find(i_ => i_.name === i)
        if (find) find.number = find.number + 1
        if (!find) t.push({ name: i, number: 1 })
        return t
      }, [])
      .forEach((i, index) => {
        new Button({ x: 12 + this.x + index * 48, y: this.y + 106, width: 36, height: 36, radius: 18, font: 10, text: i.name + 'x' + i.number }).render()
      })

    ctx.restore()
  }
}

class Battler {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.battler = props.battler
    this.imageIns = props.imageIns

    this.HP = this.battler.HP
    this.MP = this.battler.MP
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

    ctx.font = `bold 12px monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'center'

    {
      drawRadius({ x: this.x + 12, y: this.y + 12, width: this.width - 24, height: 24, radius: 12 })

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fill()

      drawRadius({ x: this.x + 12, y: this.y + 12, width: this.width - 24, height: 24, radius: 12 })

      ctx.fillStyle = 'rgba(185, 0, 0, 1)'
      ctx.fill()

      ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      ctx.fillText(`HP: ${battler.HP}`, this.x + this.width / 2, y + 24)
    }

    {
      drawRadius({ x: this.x + 12, y: this.y + 48, width: this.width - 24, height: 24, radius: 12 })

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fill()

      drawRadius({ x: this.x + 12, y: this.y + 48, width: this.width - 24, height: 24, radius: 12 })

      ctx.fillStyle = 'rgba(0, 0, 185, 1)'
      ctx.fill()

      ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      ctx.fillText(`MP: ${battler.MP}`, this.x + this.width / 2, y + 60)
    }

    this.battler.buff
      .reduce((t, i) => {
        const find = t.find(i_ => i_.name === i)
        if (find) find.number = find.number + 1
        if (!find) t.push({ name: i, number: 1 })
        return t
      }, [])
      .forEach((i, index) => {
        new Button({ x: 12 + this.x + index * 48, y: this.y + 84, width: 36, height: 36, radius: 18, font: 10, text: i.name + 'x' + i.number }).render()
      })

    ctx.restore()
  }
}

class CardInAction {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.novaTime = 0

    this.card = props.card
    this.touchStart = props.touchStart
    this.touchEnd = props.touchEnd
    this.actionHeight = props.actionHeight

    this.useAbleTime = 0

    this.mouseDownPosition = null

    this.mouseDownPositionTime = 0
  }

  get useAble() {
    return this.offsetY < 0 - this.actionHeight / 2
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
      this.touchStart()
    } catch { }
  }

  eventUp(e) {
    if (this.useAble) this.touchEnd()

    this.mouseDownPosition = null

    this.offsetX = 0
    this.offsetY = 0
  }

  eventMove(e) {
    if (!this.mouseDownPosition) return

    const changeX = (e.pageX || e.targetTouches[0].pageX) - this.mouseDownPosition[0]
    const changeY = (e.pageY || e.targetTouches[0].pageY) - this.mouseDownPosition[1]
    this.mouseDownPosition = [this.mouseDownPosition[0] + changeX, this.mouseDownPosition[1] + changeY]

    this.offsetX = this.offsetX + changeX
    this.offsetY = this.offsetY + changeY
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    if (this.mouseDownPosition && this.mouseDownPositionTime < 1) {
      this.mouseDownPositionTime = numberFix(this.mouseDownPositionTime + 0.05)
    }

    if (!this.mouseDownPosition && this.mouseDownPositionTime > 0) {
      this.mouseDownPositionTime = 0
    }

    if (this.useAble && this.useAbleTime < 1) {
      this.useAbleTime = numberFix(this.useAbleTime + 0.05)
    }

    if (!this.useAble && this.useAbleTime > 0) {
      this.useAbleTime = numberFix(this.useAbleTime - 0.05)
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

    ctx.globalAlpha = this.novaTime

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(this.card.imageDOM, { x: x, y: y, width: width, height: height })

    const width_ = height * this.useAbleTime
    const height_ = height * this.useAbleTime
    const x_ = x + (width - width_) / 2
    const y_ = y + (height - height_) / 2
    const radius_ = width_ / 2

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

    ctx.fill()

    if (this.mouseDownPositionTime === 1) {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `bold ${width * 0.075}px monospace`
      ctx.fillStyle = `rgba(0, 0, 0, 1)`

      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)
      ctx.fillText(`${card.race} · ${card.type}`, x + width * 0.08, y + width * 0.48)

      drawText({ x: x + width * 0.08, y: y + width * 0.60, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })
    }

    if (this.mouseDownPositionTime === 0) {
      const width_ = width * 0.6
      const height_ = width * 0.2
      const x_ = x + width / 2 - width_ / 2
      const y_ = y + height - height_ - (x_ - x)
      const radius_ = width * 0.08

      const text = [card.name, levelText(card.level)]

      if (card.number) text.push('x' + card.number)

      drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

      ctx.fill()

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `bold ${width * 0.075}px monospace`
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'

      ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)
    }

    ctx.restore()

    addEventListener('touchstart', this.eventDown.bind(this), { x, y, width, height })
    addEventListenerPure('touchmove', this.eventMove.bind(this))
    addEventListenerPure('touchend', this.eventUp.bind(this))
  }
}

class Action {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.InstanceBattlerSelf = props.InstanceBattlerSelf
    this.InstanceBattlerOpposite = props.InstanceBattlerOpposite

    this.cards = props.cards
    this.env = props.env
    this.useCard = props.useCard
    this.overRound = props.overRound
    this.watchStore = props.watchStore
    this.watchCemetery = props.watchCemetery

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

    this.InstanceCards = this.InstanceCards.filter(i => this.cards.find(i_ => i_ === i.card))

    this.cards.forEach((i, index) => {
      const maxIndex = cards.length
      const centerIndex = maxIndex / 2 - 0.5

      const diff = index - centerIndex

      const option = {
        width: (width / 4 - 4) - width / 48
      }
      option.height = option.width * 1.35
      option.x = x + (width - option.width) / 2 + diff * (width / 4 - 4)
      option.y = y + (height - option.height) / 2
      option.touchStart = () => this.touchCard = i
      option.touchEnd = () => this.useCard(i, this.InstanceBattlerSelf)
      option.actionHeight = this.height

      const find = this.InstanceCards.find(i_ => i_.card === i)

      if (find) {
        find.x = option.x
      }

      if (!find) {
        this.InstanceCards.push(new CardInAction({ card: i, ...option }))
      }
    })
  }

  drawEnv() {
    const option = { x: this.x + 12, y: this.y + this.height / 2 - this.cardHeight / 2 - 42, width: this.width - 24, height: 30, font: 10, text: `ROUND ${this.env.round}` }

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

  drawButtonStore() {
    const option = { x: this.x + 12, y: this.y + this.height / 2 + this.cardHeight / 2 + 12, width: 72, height: 30, font: 10, text: `查看牌库x${this.InstanceBattlerSelf.battler.card.store.length}` }

    new Button(option).render()

    const event = () => {
      this.watchStore()
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonCemetery() {
    const option = { x: this.x + 96, y: this.y + this.height / 2 + this.cardHeight / 2 + 12, width: 72, height: 30, font: 10, text: `查看墓地x${this.InstanceBattlerSelf.battler.card.cemetery.length}` }

    new Button(option).render()

    const event = () => {
      this.watchCemetery()
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
    this.drawButtonStore()
    this.drawButtonCemetery()

    this.InstanceCards.forEach(i => i.card !== this.touchCard ? i.render() : null)
    this.InstanceCards.forEach(i => i.card === this.touchCard ? i.render() : null)
  }
}

class CardInModal {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.card = props.card
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  render() {
    const x = this.x + this.offsetX
    const y = this.y + this.offsetY
    const width = this.width
    const height = this.height
    const card = this.card

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(this.card.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

    ctx.fill()

    ctx.fillStyle = `rgba(0, 0, 0, 1)`

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = `bold ${width * 0.075}px monospace`

    ctx.fillText(card.name, x + width / 2, y + width * 0.12)

    if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

    ctx.textAlign = 'start'

    ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)

    drawText({ x: x + width * 0.08, y: y + width * 0.48, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })

    ctx.restore()
  }
}

class Modal {
  constructor(props) {
    this.cards = []

    this.back = props.back

    this.InstanceScroll

    this.instanceScroll()
  }

  get cardHeight() {
    const row = Math.ceil(this.cards.length / 4)

    if (row === 0) return 0

    const real = ((windowWidth - 60) / 4 * 1.35) * row

    const margin = row ? 12 * (row - 1) : 0

    return real + margin
  }

  updateScrollY() {
    this.InstanceScroll.scrollY = this.cardHeight - this.InstanceScroll.height + 12
  }

  instanceScroll() {
    const scrollOption = { x: 12, y: 12 + safeTop, width: windowWidth - 24, height: windowHeight - 24 - safeTop, radius: 12 }

    drawRadius(scrollOption)
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fill()

    this.InstanceScroll = new Scroll(scrollOption)
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]
      this.drawCard(offsetY)
    }

    this.InstanceScroll.render(event)
  }

  drawCard(offsetY) {
    this.InstanceCard = this.cards.map((card, index) => {
      const option = {
        width: (windowWidth - 60) / 4,
        card: card,
      }

      option.height = option.width * 1.35
      option.x = 12 + parseInt(index % 4) * (option.width + 12)
      option.y = 12 + parseInt(index / 4) * (option.height + 12) + safeTop

      return new CardInModal(option)
    })

    this.InstanceCard.forEach((i) => {
      if (!ifScreenCover({ ...i.option, y: i.y - offsetY }, this.InstanceScroll.option)) return

      i.offsetY = 0 - offsetY
      i.render()
    })
  }

  render() {
    this.drawScroll()

    addEventListenerPure('touchstart', this.back)
  }
}

class Over {
  constructor() {
    this.over
    this.reward
  }

  drawContent() {
    if (this.over === 'win') {
      new Button({ x: 12, y: 12 + safeTop, width: windowWidth - 24, height: 36, text: '战斗胜利' }).render()

      this.reward.forEach((card, index) => {
        const option = {
          width: (windowWidth - 60) / 4,
          card: card,
        }

        option.height = option.width * 1.35
        option.x = 12 + parseInt(index % 4) * (option.width + 12)
        option.y = 60 + parseInt(index / 4) * (option.height + 12) + safeTop

        new CardInModal(option).render()
      })
    }

    if (this.over === 'lose') {
      new Button({ x: 12, y: 12 + safeTop, width: windowWidth - 24, height: 36, text: '战斗失败' }).render()
    }
  }

  drawButtonExplore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7, width: 120, height: 40, text: '探索' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'explore'
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonHome() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7 + 60, width: 120, height: 40, text: '首页' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  render() {
    this.drawContent()
    this.drawButtonExplore()
    this.drawButtonHome()
  }
}

class Page {
  constructor() {
    this.modal = null
    this.over = null

    this.env = {
      round: 1,
    }

    this.InstanceBattlerSelf
    this.InstanceBattlerOpposite
    this.InstanceAction
    this.InstanceModal
    this.InstanceOver

    this.instanceBattlerSelf()
    this.instanceBattlerOpposite()
    this.instanceAction()
    this.instanceModal()
    this.instanceOver()
    this.initBattler()
  }

  initBattler() {
    new Array(4).fill().forEach(i => {
      this.pumpCard(this.InstanceBattlerSelf.battler.card.store.shift(), this.InstanceBattlerSelf)
    })
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
  }

  instanceBattlerOpposite() {
    const height = (windowHeight * 0.5) / 2

    this.InstanceBattlerOpposite = new Opposite({
      x: 12,
      y: 60 + safeTop,
      width: windowWidth - 24,
      height: height,
      imageIns: ImageOpposite,
      battler: Imitation.state.battle.opposite
    })
  }

  instanceAction() {
    var width = windowWidth - 24
    var height = windowHeight * 0.5 - 96

    if (width > windowHeight - 160) width = windowHeight - 160
    if (height > width / 2 + 60) height = width / 2 + 60

    this.InstanceAction = new Action({
      x: (windowWidth - width) / 2,
      y: windowHeight - height - 12,
      width: width,
      height: height,
      cards: this.InstanceBattlerSelf.battler.card.hand,
      env: this.env,
      InstanceBattlerSelf: this.InstanceBattlerSelf,
      InstanceBattlerOpposite: this.InstanceBattlerOpposite,
      useCard: this.useCard,
      overRound: this.overRound,
      watchStore: () => {
        this.modal = true
        this.InstanceModal.cards = this.InstanceBattlerSelf.battler.card.store
        this.InstanceModal.updateScrollY()
      },
      watchCemetery: () => {
        this.modal = true
        this.InstanceModal.cards = this.InstanceBattlerSelf.battler.card.cemetery
        this.InstanceModal.updateScrollY()
      }
    })
  }

  instanceModal() {
    this.InstanceModal = new Modal({
      back: () => this.modal = false
    })
  }

  instanceOver() {
    this.InstanceOver = new Over({})
  }

  drawBattlerSelf() {
    this.InstanceBattlerSelf.render()
  }

  drawBattlerOpposite() {
    this.InstanceBattlerOpposite.render()
  }

  drawAction() {
    this.InstanceAction.render()
  }

  drawModal() {
    this.InstanceModal.render()
  }

  drawOver() {
    this.InstanceOver.render()
  }

  drawBackground() {
    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  drawButtonHome() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, font: 12, text: '返回' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  pumpCard = (card, Battler) => {
    if (Battler.battler.card.hand.length === 4) {
      Battler.battler.card.cemetery.push(card)
    }
    if (Battler.battler.card.hand.length < 4) {
      Battler.battler.card.hand.push(card)
    }
    this.InstanceAction.updateCards(this.InstanceBattlerSelf.battler.card.hand)
  }

  useCard = async (card, Battler) => {
    const [self, opposite] = Battler === this.InstanceBattlerSelf ? [this.InstanceBattlerSelf, this.InstanceBattlerOpposite] : [this.InstanceBattlerOpposite, this.InstanceBattlerSelf]

    const result = card.function(card, self.battler, opposite.battler, this.env)

    if (!result) {
      Imitation.state.function.message('无法使用', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    if (Battler === this.InstanceBattlerSelf) {
      self.battler.card.hand = self.battler.card.hand.filter(i => i !== card)

      self.battler.card.cemetery.push(card)
      self.battler.card.consume.push(card)

      this.InstanceAction.updateCards(this.InstanceBattlerSelf.battler.card.hand)
    }

    Imitation.state.function.message(card.name + ' ' + levelText(card.level), 'rgba(125, 125, 125, 1)', 'rgba(255, 255, 255, 1)')

    while (result.length) {
      const current = result.shift()

      if (current.type === 'cost-mp') {
        if (current.target === 'self') {
          self.battler.MP = self.battler.MP + current.value
        }
      }

      if (current.type === 'hit') {
        if (current.target === 'opposite') {
          opposite.battler.HP = opposite.battler.HP + current.value
        }
      }

      if (current.type === 'buff') {
        if (current.target === 'self') {
          self.battler.buff.push(...new Array(current.number).fill(current.value))
        }
        if (current.target === 'opposite') {
          opposite.battler.buff.push(...new Array(current.number).fill(current.value))
        }
      }

      if (current.type === 'cost-buff') {
        const count = 0
        if (current.target === 'self') {
          self.battler.buff = self.battler.buff.filter(i => {
            if (count === current.number) return true
            if (i === current) return true
            count = count + 1
            return false
          })
        }
        if (current.target === 'opposite') {
          opposite.battler.buff = opposite.battler.buff.filter(i => {
            if (count === current.number) return true
            if (i === current) return true
            count = count + 1
            return false
          })
        }
      }

      if (current.type === 'cure-hp') {
        if (current.target === 'self') {
          self.battler.HP = self.battler.HP + current.value
        }
      }

      if (current.type === 'cure-mp') {
        if (current.target === 'self') {
          self.battler.MP = self.battler.MP + current.value
        }
      }

      if (current.type === 'pump-store-positive') {
        if (current.target === 'self' && Battler === this.InstanceBattlerSelf) {
          new Array(current.value).fill().forEach(i => {
            const card = this.InstanceBattlerSelf.battler.card.store.shift()
            if (!card) return
            this.pumpCard(card, this.InstanceBattlerSelf)
          })
        }
      }

      if (current.type === 'pump-store-point') {
        if (current.target === 'self' && Battler === this.InstanceBattlerSelf) {
          current.value.forEach(i => {
            this.pumpCard(i, this.InstanceBattlerSelf)
            this.InstanceBattlerSelf.battler.card.store = this.InstanceBattlerSelf.battler.card.store.filter(i_ => i_ !== i)
          })
        }
      }

      if (current.type === 'pump-cemetery-positive') {
        if (current.target === 'self' && Battler === this.InstanceBattlerSelf) {
          new Array(current.value).fill().forEach(i => {
            this.pumpCard(this.InstanceBattlerSelf.battler.card.cemetery.shift(), this.InstanceBattlerSelf)
          })
        }
      }

      if (current.type === 'pump-cemetery-point') {
        if (current.target === 'self' && Battler === this.InstanceBattlerSelf) {
          current.value.forEach(i => {
            this.pumpCard(i, this.InstanceBattlerSelf)
            this.InstanceBattlerSelf.battler.card.cemetery = this.InstanceBattlerSelf.battler.card.cemetery.filter(i_ => i_ !== i)
          })
        }
      }
    }

    this.overBattle()
  }

  overRound = async () => {
    await this.oppositeAI()

    this.env.round = this.env.round + 1

    new Array(1).fill().forEach(i => {
      const card = this.InstanceBattlerSelf.battler.card.store.shift()
      if (!card) return
      this.pumpCard(card, this.InstanceBattlerSelf)
    })

    this.InstanceAction.updateCards(this.InstanceBattlerSelf.battler.card.hand)
  }

  oppositeAI = async () => {
    const result = this.InstanceBattlerOpposite.battler.AI(this.InstanceBattlerOpposite.battler, this.InstanceBattlerSelf.battler, this.env)

    while (result.length) {
      await this.useCard(result.shift(), this.InstanceBattlerOpposite)
      if (result.length) await wait(1000)
    }
  }

  overBattle = () => {
    if (this.InstanceBattlerOpposite.battler.HP <= 0) {
      this.over = 'win'

      this.InstanceOver.reward = Imitation.state.battle.reward()

      const library = Imitation.state.info.cardLibrary

      this.InstanceOver.reward.forEach(i => {
        const findInLibrary = library.find(i_ => i_.key === i.key)

        if (findInLibrary) {
          findInLibrary.number = findInLibrary.number + 1
        }
        if (!findInLibrary) {
          library.push({ key: i.key, level: i.level, number: 1 })
        }
      })

      Imitation.state.function.saveInfo()

      this.InstanceOver.over = this.over
      return
    }
    if (this.InstanceBattlerSelf.battler.HP <= 0) {
      this.over = 'lose'

      this.InstanceOver.over = this.over
      return
    }
  }

  render() {
    this.drawBackground()

    if (this.modal) {
      this.drawModal()
    }

    if (this.over) {
      this.drawOver()
    }

    if (!this.modal && !this.over) {
      this.drawButtonHome()
      this.drawBattlerSelf()
      this.drawBattlerOpposite()
      this.drawAction()
    }
  }
}

export default Page