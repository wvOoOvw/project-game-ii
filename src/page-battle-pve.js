import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, parseCard, numberFix } from './utils-common'
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

      drawRadius({ x: this.x + 12, y: this.y + 12, width: (this.width - 24) * (battler.HP / 1000 > 1 ? 1 : battler.HP / 1000), height: 24, radius: 12 })

      ctx.fillStyle = 'rgba(255, 0, 0, 0.7)'
      ctx.fill()

      ctx.fillStyle = 'white'

      ctx.fillText(`HP: ${battler.HP}`, this.x + this.width / 2, y + 24)
    }

    {
      drawRadius({ x: this.x + 12, y: this.y + 48, width: this.width - 24, height: 24, radius: 12 })

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fill()

      drawRadius({ x: this.x + 12, y: this.y + 48, width: (this.width - 24) * (battler.MP / 1000 > 1 ? 1 : battler.MP / 1000), height: 24, radius: 12 })

      ctx.fillStyle = 'rgba(0, 0, 255, 0.7)'
      ctx.fill()

      ctx.fillStyle = 'white'

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

class Battler {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.battler = props.battler
    this.imageIns = props.imageIns
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

      drawRadius({ x: this.x + 12, y: this.y + 12, width: (this.width - 24) * (battler.HP / 1000 > 1 ? 1 : battler.HP / 1000), height: 24, radius: 12 })

      ctx.fillStyle = 'rgba(255, 0, 0, 0.7)'
      ctx.fill()

      ctx.fillStyle = 'white'

      ctx.fillText(`HP: ${battler.HP}`, this.x + this.width / 2, y + 24)
    }

    {
      drawRadius({ x: this.x + 12, y: this.y + 48, width: this.width - 24, height: 24, radius: 12 })

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fill()

      drawRadius({ x: this.x + 12, y: this.y + 48, width: (this.width - 24) * (battler.MP / 1000 > 1 ? 1 : battler.MP / 1000), height: 24, radius: 12 })

      ctx.fillStyle = 'rgba(0, 0, 255, 0.7)'
      ctx.fill()

      ctx.fillStyle = 'white'

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

class Card {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.nova = props.nova
    this.novaTime = this.nova ? 0 : 1

    this.card = props.card
    this.touchStart = props.touchStart
    this.touchEnd = props.touchEnd
    this.actionHeight = props.actionHeight

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

    if (this.novaTime < 1) {
      this.novaTime = numberFix(this.novaTime + 0.05)
    }

    this.useAble = this.offsetY < 0 - this.actionHeight / 2

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

    ctx.globalAlpha = this.novaTime

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    if (this.useAbleTime) {
      ctx.shadowBlur = this.useAbleTime * 40
      ctx.shadowColor = 'rgba(0, 0, 0, 1)'
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
        this.InstanceCards.push(new Card({ card: i, nova: true, ...option }))
      }
    })
  }

  updateEnv(env) {
    this.env = env
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
      this.overRound()
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonCemetery() {
    const option = { x: this.x + 96, y: this.y + this.height / 2 + this.cardHeight / 2 + 12, width: 72, height: 30, font: 10, text: `查看墓地x${this.InstanceBattlerSelf.battler.card.cemetery.length}` }

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
    this.drawButtonStore()
    this.drawButtonCemetery()

    this.InstanceCards.forEach(i => i.card !== this.touchCard ? i.render() : null)
    this.InstanceCards.forEach(i => i.card === this.touchCard ? i.render() : null)
  }
}

class Modal {
  constructor() {
    this.cards = []

    this.InstanceScroll

    this.instanceScroll()
  }

  instanceScroll() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 72 - safeTop, radius: 12 }

    this.InstanceScroll = new Scroll(scrollOption)

    this.InstanceScroll.scrollY = this.bannerHeight + this.cardHeight - this.InstanceScroll.height + 12
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]
      this.drawCard(offsetY)
    }

    this.InstanceScroll.render(event)
  }

  drawCard(offsetY) {
    this.InstanceCard = this.card.map((card, index) => {
      const option = {
        width: (windowWidth - 60) / 4,
        card: card,
        displayMode: 'card',
        touchArea: this.InstanceScroll.option,
        touchEvent: () => this.preview = card,
      }

      option.height = option.width * 1.35
      option.x = 12 + parseInt(index % 4) * (option.width + 12)
      option.y = 72 + parseInt(index / 4) * (option.height + 12) + this.bannerHeight + safeTop

      return new Card(option)
    })

    this.InstanceCard.forEach((i) => {
      if (!ifScreenCover({ ...i.option, y: i.y - offsetY }, this.InstanceScroll.option)) return

      i.offsetY = 0 - offsetY
      i.touchAble = this.preview ? false : true
      i.render()
    })
  }

  drawButtonBack() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, text: 'Home' }

    new Button(option).render()

    if (this.preview) return

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  render() {
    drawScroll()
  }
}

class Page {
  constructor() {
    this.animationing = false

    this.modal = null

    this.env = {

      round: 1
    }

    this.InstanceBattlerSelf
    this.InstanceBattlerOpposite
    this.InstanceAction
    this.InstanceModal

    this.instanceBattlerSelf()
    this.instanceBattlerOpposite()
    this.instanceAction()
    this.instanceModal()
    this.initBattler()
  }

  initBattler() {
    this.InstanceBattlerSelf.battler.card.store = [...this.InstanceBattlerSelf.battler.card.team]

    this.InstanceBattlerOpposite.battler.card.store = [...this.InstanceBattlerOpposite.battler.card.team]

    new Array(4).fill().forEach(i => {
      this.InstanceBattlerSelf.battler.card.hand.push(this.InstanceBattlerSelf.battler.card.store.shift())
    })

    new Array(4).fill().forEach(i => {
      this.InstanceBattlerOpposite.battler.card.hand.push(this.InstanceBattlerOpposite.battler.card.store.shift())
    })

    this.InstanceAction.updateCards(this.InstanceBattlerSelf.battler.card.hand)
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

    this.InstanceBattlerOpposite.battler.card.team = setArrayRandom(parseCard(Imitation.state.info.team[0], true))
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
    })
  }

  instanceModal() {
    this.InstanceModal = new Modal()
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

  useCard = (card, Battler) => {
    this.animationing = true

    const [self, opposite] = Battler === this.InstanceBattlerSelf ? [this.InstanceBattlerSelf, this.InstanceBattlerOpposite] : [this.InstanceBattlerOpposite, this.InstanceBattlerSelf]

    const result = card.function(card, self.battler, opposite.battler, this.env)

    Imitation.state.function.message(card.name)

    while (result.length) {
      const current = result.shift()

      if (current.type === 'cost-mp') {
        if (current.target === 'self') {
          self.battler.MP = self.battler.MP + current.value
        }
      }

      if (current.type === 'hit') {
        Imitation.state.function.sound('hit')

        if (current.target === 'opposite') {
          opposite.battler.HP = opposite.battler.HP + current.value
        }
      }

      if (current.type === 'buff') {
        if (current.target === 'self') {
          self.battler.buff.push(current.value)
        }
        if (current.target === 'opposite') {
          opposite.battler.buff.push(current.value)
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

      if (current.type === 'pump-positive') {
        if (current.target === 'self') {
          new Array(current.value).fill().forEach(i => {
            this.InstanceBattlerSelf.battler.card.hand.push(this.InstanceBattlerSelf.battler.card.store.shift())
          })
        }
      }
    }

    self.battler.card.hand = self.battler.card.hand.filter(i => i !== card)

    self.battler.card.cemetery.push(card)
    self.battler.card.consume.push(card)

    this.animationing = false

    this.InstanceAction.updateCards(this.InstanceBattlerSelf.battler.card.hand)
  }

  overRound = () => {

  }

  render() {
    this.drawBackground()
    this.drawButtonHome()
    this.drawBattlerSelf()
    this.drawBattlerOpposite()
    this.drawAction()
  }
}

export default Page