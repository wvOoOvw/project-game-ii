import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'
import { drawText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Button } from './ui-button'
import { Scroll } from './ui-scroll'

import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/background/music_1c31bcc267a545ef971109512053f3e50.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_1c31bcc267a545ef971109512053f3e50)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class CardInOpposite {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.novaTime = 0

    this.card = props.card
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const x = this.x + this.offsetX
    const y = this.y + this.offsetY
    const width = this.width
    const height = this.height

    ctx.save()

    ctx.globalAlpha = this.novaTime

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(ImageBackground, { x: x, y: y, width: width, height: height })

    ctx.restore()
  }
}

class CardInSelf {
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
    this.useAble = props.useAble

    this.mouseDownPosition = null

    this.ifTouchEndTime = 0
    this.mouseDownPositionTime = 0
    this.useAbleTime = 0
  }

  get ifTouchEnd() {
    return this.offsetY < 0 - this.height / 2
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
      this.touchStart()
    } catch { }
  }

  eventUp(e) {
    if (this.ifTouchEnd) this.touchEnd()

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

    if (this.ifTouchEnd && this.ifTouchEndTime < 1) {
      this.ifTouchEndTime = numberFix(this.ifTouchEndTime + 0.05)
    }

    if (!this.ifTouchEnd && this.ifTouchEndTime > 0) {
      this.ifTouchEndTime = numberFix(this.ifTouchEndTime - 0.05)
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

    ctx.globalAlpha = Math.min(this.novaTime, this.useAbleTime * 0.5 + 0.5)

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    if (this.ifTouchEndTime > 0) {
      ctx.shadowBlur = width * 0.25 * this.ifTouchEndTime
      ctx.shadowColor = 'rgba(0, 0, 0, 1)'
      ctx.fill()
      ctx.shadowBlur = 0
      ctx.shadowColor = '#000000'
    }

    ctx.clip()

    drawImage(this.card.imageDOM, { x: x, y: y, width: width, height: height })

    const width_ = height * this.mouseDownPositionTime
    const height_ = height * this.mouseDownPositionTime
    const x_ = x + (width - width_) / 2
    const y_ = y + (height - height_) / 2
    const radius_ = width_ / 2

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

    ctx.fill()

    if (this.mouseDownPositionTime === 1) {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 ${width * 0.07}px ${window.fontFamily}`
      ctx.fillStyle = `rgba(0, 0, 0, 1)`

      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)
      ctx.fillText(`${card.race} · ${card.type}`, x + width * 0.08, y + width * 0.48)

      ctx.textAlign = 'start'
      ctx.textBaseline = 'top'

      drawText({ x: x + width * 0.08, y: y + width * 0.6, width: width - width * 0.25, fontHeight: width * 0.105, text: card.description(1) })
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
      ctx.font = `900 ${width * 0.075}px ${window.fontFamily}`
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'

      ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)
    }

    ctx.restore()

    if (!this.useAble) return

    addEventListener('touchstart', this.eventDown.bind(this), { x, y, width, height })
    addEventListenerPure('touchmove', this.eventMove.bind(this))
    addEventListenerPure('touchend', this.eventUp.bind(this))
  }
}

class Role {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.type = props.type
    this.information = props.information
    this.env = props.env
    this.useCard = props.useCard

    this.InstanceCards = []
    this.touchCard

    this.show = 'card'
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawBackground() {
    const { x, y, width, height, information } = this

    ctx.save()

    drawRadius({ x, y, width, height, radius: this.width / 2 })

    ctx.clip()

    drawImage(information.master.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.restore()
  }

  drawTitle() {
    const { x, y, width, height, information } = this

    const option = {
      width: width * 0.8,
      height: 24,
    }

    option.x = x + width / 2 - option.width / 2
    option.y = y + 12
    option.radius = option.height / 4
    option.text = [information.master.name, levelText(information.master.level)].join(' ')
    option.font = `900 10px ${window.fontFamily}`
    option.fillStyle = [`rgba(255, 255, 255, 0.75)`, 'rgba(0, 0, 0, 1)']

    new Button(option).render()
  }

  drawHM() {
    const { x, y, width, height, information } = this

    const option = {
      width: width * 0.7 > windowWidth / 2 - 12 ? windowWidth / 2 - 12 : width * 0.7,
      height: 24,
    }

    option.y = y + height - option.height - 12
    option.radius = option.height / 2

    option.x = x + width / 2 - option.width - 6

    drawRadius(option)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 10px ${window.fontFamily}`

    ctx.fillStyle = `rgba(185, 0, 0, 0.75)`
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    ctx.fillText(`HP ${information.master.HP}`, option.x + option.width / 2, option.y + option.height / 2)

    option.x = x + width / 2 + 6

    drawRadius(option)

    ctx.fillStyle = `rgba(0, 0, 185, 0.75)`
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    ctx.fillText(`MP ${information.master.MP}`, option.x + option.width / 2, option.y + option.height / 2)
  }

  drawBuff() {
    const { x, y, width, height, information } = this

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.font = `900 8px ${window.fontFamily}`

    const renderList = information.master.buff
      .reduce((t, i) => {
        const find = t.find(i_ => i_.name === i)
        if (find) find.number = find.number + 1
        if (!find) t.push({ name: i, number: 1 })
        return t
      }, [])

    renderList
      .forEach((i, index) => {
        const option = {
          width: 48,
          height: 24,
        }

        const maxIndex = renderList.length
        const centerIndex = maxIndex / 2 - 0.5
        const diff = index - centerIndex

        option.radius = option.height / 4
        option.x = x + (width - option.width) / 2 + diff * (option.width + 4)
        option.y = y + height + 6

        drawRadius(option)

        ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

        ctx.fill()

        ctx.fillStyle = 'rgba(0, 0, 0, 1)'

        ctx.fillText(`${i.name} X${i.number}`, option.x + option.width / 2, option.y + option.height / 2)
      })
  }

  drawCard() {
    const width = Math.min(this.width * 1.75, windowWidth - 24)
    const height = this.height
    const x = this.x - (width - this.width) / 2
    const y = this.y

    this.InstanceCards = this.InstanceCards.filter(i => this.information.card.hand.find(i_ => i_ === i.card))

    this.information.card.hand.forEach((i, index) => {
      const maxIndex = this.information.card.hand.length
      const centerIndex = maxIndex / 2 - 0.5

      const diff = index - centerIndex

      const option = {
        width: (width / 4 - 4) - width / 48
      }
      option.height = option.width * 1.35
      option.x = x + (width - option.width) / 2 + diff * (width / 4 - 4)
      option.y = y + (height - option.height) / 2
      option.touchStart = () => this.touchCard = i
      option.touchEnd = () => this.useCard(i, this)
      option.useAble = this.env.current === this

      const find = this.InstanceCards.find(i_ => i_.card === i)

      if (find) {
        find.x = option.x
        find.useAble = option.useAble
      }

      if (!find) {
        const INS = this.type === 'self' ? CardInSelf : CardInOpposite
        this.InstanceCards.push(new INS({ card: i, ...option }))
      }
    })

    this.InstanceCards.forEach(i => i.card !== this.touchCard ? i.render() : null)
    this.InstanceCards.forEach(i => i.card === this.touchCard ? i.render() : null)
  }

  render() {
    this.drawBackground()
    this.drawTitle()
    this.drawHM()
    this.drawCard()
    this.drawBuff()
  }
}

class Action {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.InstanceRoleSelf = props.InstanceRoleSelf
    this.InstanceRoleOpposite = props.InstanceRoleOpposite
    this.env = props.env

    this.roundOver = props.roundOver
    this.watchStore = props.watchStore
    this.watchCemetery = props.watchCemetery

    this.useAbleTime = 0
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawEnv() {
    const option = { x: this.x + 12, y: this.y + this.height / 2 + 12, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: `ROUND ${this.env.round}` }

    new Button(option).render()
  }

  drawButtonOverRound() {
    const option = { x: this.x + this.width - 84, y: this.y + this.height / 2 + 12, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: [`rgba(255, 255, 255, 1`, 'rgba(0, 0, 0, 1)'], text: '结束回合' }

    new Button(option).render()

    if (this.useAbleTime !== 1) return

    const event = () => {
      this.roundOver()
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonStore() {
    const option = { x: this.x + 12, y: this.y + this.height / 2 - 40, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: `查看牌库x${this.InstanceRoleSelf.information.card.store.length}` }

    new Button(option).render()

    if (this.useAbleTime !== 1) return

    const event = () => {
      this.watchStore()
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonCemetery() {
    const option = { x: this.x + 96, y: this.y + this.height / 2 - 40, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: `查看墓地x${this.InstanceRoleSelf.information.card.cemetery.length}` }

    new Button(option).render()

    if (this.useAbleTime !== 1) return

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
    if (this.env.current === this.InstanceRoleSelf && this.useAbleTime < 1) {
      this.useAbleTime = numberFix(this.useAbleTime + 0.05)
    }

    if (this.env.current !== this.InstanceRoleSelf && this.useAbleTime > 0) {
      this.useAbleTime = numberFix(this.useAbleTime - 0.05)
    }

    this.drawBackground()
    this.drawEnv()
    this.drawButtonOverRound()
    this.drawButtonStore()
    this.drawButtonCemetery()

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

    ctx.font = `900 ${width * 0.075}px ${window.fontFamily}`

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
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 72 - safeTop, radius: 12 }

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
      option.y = 60 + parseInt(index / 4) * (option.height + 12) + safeTop

      return new CardInModal(option)
    })

    this.InstanceCard.forEach((i) => {
      if (!ifScreenCover({ ...i.option, y: i.y - offsetY }, this.InstanceScroll.option)) return

      i.offsetY = 0 - offsetY
      i.render()
    })
  }

  drawButtonBack() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, radius: 8, font: `900 12px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '返回' }

    new Button(option).render()

    const event = () => {
      this.back()
    }

    addEventListener('touchstart', event, option)
  }

  render() {
    this.drawButtonBack()
    this.drawScroll()
  }
}

class Over {
  constructor() {
    this.over
    this.reward
  }

  drawContent() {
    if (this.over === 'win') {
      new Button({ x: 12, y: 12 + safeTop, width: windowWidth - 24, height: 36, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '战斗胜利' }).render()

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
      new Button({ x: 12, y: 12 + safeTop, width: windowWidth - 24, height: 36, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '战斗失败' }).render()
    }
  }

  drawButtonExplore() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '探索' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'explore'
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonHome() {
    const option = { x: windowWidth / 2 - 60, y: windowHeight * 0.7 + 60, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '首页' }

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
      round: 0,
      current: null
    }

    this.InstanceRoleSelf
    this.InstanceRoleOpposite
    this.InstanceAction
    this.InstanceModal
    this.InstanceOver

    this.instanceRoleSelf()
    this.instanceRoleOpposite()
    this.instanceAction()
    this.instanceModal()
    this.instanceOver()
    this.initBattler()
  }

  initBattler() {
    new Array(3).fill().forEach(i => {
      this.pumpCard(this.InstanceRoleSelf.information.card.store.shift(), this.InstanceRoleSelf)
      this.pumpCard(this.InstanceRoleOpposite.information.card.store.shift(), this.InstanceRoleOpposite)
    })

    this.env.current = this.InstanceRoleSelf

    this.roundStart()
  }

  instanceRoleSelf() {
    const option = {
      width: Math.min(windowWidth * 0.75, windowHeight * 0.3),
      height: Math.min(windowWidth * 0.75, windowHeight * 0.3),
      type: 'self',
      information: Imitation.state.battle.self,
      env: this.env,
      useCard: this.useCard,
    }

    option.x = (windowWidth - option.width) / 2
    option.y = windowHeight - option.height - 48

    this.InstanceRoleSelf = new Role(option)
  }

  instanceRoleOpposite() {
    const option = {
      y: 60 + safeTop,
      width: Math.min(windowWidth * 0.75, windowHeight * 0.3),
      height: Math.min(windowWidth * 0.75, windowHeight * 0.3),
      type: 'opposite',
      information: Imitation.state.battle.opposite,
      env: this.env,
      useCard: this.useCard
    }

    option.x = (windowWidth - option.width) / 2
    option.y = 60 + safeTop

    this.InstanceRoleOpposite = new Role(option)
  }

  instanceAction() {
    const width = windowWidth - 24
    const height = Math.min(windowHeight * 0.4 - safeTop - 160, 120)

    this.InstanceAction = new Action({
      x: (windowWidth - width) / 2,
      y: (windowHeight - (windowHeight * 0.6 + 120 + 60) - height) / 2 + windowHeight * 0.3 + 60 + 48,
      width: width,
      height: height,
      env: this.env,
      InstanceRoleSelf: this.InstanceRoleSelf,
      InstanceRoleOpposite: this.InstanceRoleOpposite,
      roundOver: this.roundOver,
      watchStore: () => {
        this.modal = true
        this.InstanceModal.cards = this.InstanceRoleSelf.information.card.store
        this.InstanceModal.updateScrollY()
      },
      watchCemetery: () => {
        this.modal = true
        this.InstanceModal.cards = this.InstanceRoleSelf.information.card.cemetery
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

  drawRoleSelf() {
    this.InstanceRoleSelf.render()
  }

  drawRoleOpposite() {
    this.InstanceRoleOpposite.render()
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
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, radius: 8, font: `900 12px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '返回' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  pumpCard = (card, role) => {
    if (role.information.card.hand.length === 4) {
      role.information.card.cemetery.push(card)
    }
    if (role.information.card.hand.length < 4) {
      role.information.card.hand.push(card)
    }
    // this.InstanceAction.updateCards(this.InstanceRoleSelf.information.card.hand)
  }

  useCard = async (card, role) => {
    const [self, opposite] = role === this.InstanceRoleSelf ? [this.InstanceRoleSelf, this.InstanceRoleOpposite] : [this.InstanceRoleOpposite, this.InstanceRoleSelf]

    var result = card.function(card, self.information, opposite.information, this.env)

    if (typeof result === 'string') {
      Imitation.state.function.message(result, 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    self.information.master.skill.forEach(skill => {
      skill.function(card, result, self.information, opposite.information, this.env)
    })

    self.information.card.hand = self.information.card.hand.filter(i => i !== card)

    self.information.card.cemetery.push(card)
    self.information.card.consume.push(card)

    // this.InstanceAction.updateCards(this.InstanceRoleSelf.information.card.hand)

    Imitation.state.function.message(card.name + ' ' + levelText(card.level), 'rgba(125, 125, 125, 1)', 'rgba(255, 255, 255, 1)')

    if (role === this.InstanceRoleSelf) {
      Imitation.state.function.animation('red-hit', (img) => [this.InstanceRoleOpposite.x + this.InstanceRoleOpposite.width / 2 - img.width / 2, this.InstanceRoleOpposite.y + this.InstanceRoleOpposite.height / 2 - img.height / 2])
    }
    if (role === this.InstanceRoleOpposite) {
      Imitation.state.function.animation('red-hit', (img) => [this.InstanceRoleSelf.x + this.InstanceRoleSelf.width / 2 - img.width / 2, this.InstanceRoleSelf.y + this.InstanceRoleSelf.height / 2 - img.height / 2])
    }

    while (result.length) {
      const current = result.shift()

      if (current.type === 'cost-mp') {
        if (current.target === 'self') {
          self.information.master.MP = self.information.master.MP + current.value
        }
      }

      if (current.type === 'hit') {
        if (current.target === 'opposite') {
          opposite.information.master.HP = opposite.information.master.HP + current.value
        }
      }

      if (current.type === 'buff') {
        if (current.target === 'self') {
          self.information.master.buff.push(...new Array(current.number).fill(current.value))
        }
        if (current.target === 'opposite') {
          opposite.information.master.buff.push(...new Array(current.number).fill(current.value))
        }
      }

      if (current.type === 'cost-buff') {
        let count = 0
        if (current.target === 'self') {
          self.information.master.buff = self.information.master.buff.filter(i => {
            if (i === current.value && count !== current.number) {
              count = count + 1
              return false
            }
            return true
          })
        }
        if (current.target === 'opposite') {
          opposite.information.master.buff = opposite.information.master.buff.filter(i => {
            if (i === current.value && count !== current.number) {
              count = count + 1
              return false
            }
            return true
          })
        }
      }

      if (current.type === 'cure-hp') {
        if (current.target === 'self') {
          self.information.master.HP = self.information.master.HP + current.value
        }
      }

      if (current.type === 'cure-mp') {
        if (current.target === 'self') {
          self.information.master.MP = self.information.master.MP + current.value
        }
      }

      if (current.type === 'pump-store-positive') {
        if (current.target === 'self') {
          new Array(current.value).fill().forEach(i => {
            const card = this.InstanceRoleSelf.information.card.store.shift()
            if (!card) return
            this.pumpCard(card, this.InstanceRoleSelf)
          })
        }
      }

      if (current.type === 'pump-store-point') {
        if (current.target === 'self') {
          current.value.forEach(i => {
            this.pumpCard(i, this.InstanceRoleSelf)
            this.InstanceRoleSelf.information.card.store = this.InstanceRoleSelf.information.card.store.filter(i_ => i_ !== i)
          })
        }
      }

      if (current.type === 'pump-cemetery-positive') {
        if (current.target === 'self') {
          new Array(current.value).fill().forEach(i => {
            this.pumpCard(this.InstanceRoleSelf.information.card.cemetery.shift(), this.InstanceRoleSelf)
          })
        }
      }

      if (current.type === 'pump-cemetery-point') {
        if (current.target === 'self') {
          current.value.forEach(i => {
            this.pumpCard(i, this.InstanceRoleSelf)
            this.InstanceRoleSelf.information.card.cemetery = this.InstanceRoleSelf.information.card.cemetery.filter(i_ => i_ !== i)
          })
        }
      }
    }

    this.battlerOver()
  }

  roundStart = async () => {
    new Array(1).fill().forEach(i => {
      const card = this.env.current.information.card.store.shift()
      if (!card) return
      this.pumpCard(card, this.env.current)
    })

    if (this.env.current === this.InstanceRoleSelf) {
      this.env.round = this.env.round + 1
    }

    if (this.env.current === this.InstanceRoleOpposite) {
      const result = this.InstanceRoleOpposite.information.AI(this.InstanceRoleOpposite.information, this.InstanceRoleSelf.information, this.env)

      while (result.length) {
        await wait(750)
        await this.useCard(result.shift(), this.InstanceRoleOpposite)
        await wait(750)
      }

      this.roundOver()
    }
  }

  roundOver = async () => {
    if (this.env.current === this.InstanceRoleSelf) {
      this.env.current = this.InstanceRoleOpposite
      await this.roundStart()
      return
    }

    if (this.env.current === this.InstanceRoleOpposite) {
      this.env.current = this.InstanceRoleSelf
      await this.roundStart()
      return
    }
  }

  battlerOver = () => {
    if (this.InstanceRoleOpposite.information.master.HP <= 0) {
      this.over = 'win'

      this.InstanceOver.reward = Imitation.state.battle.reward

      const library = Imitation.state.info.library.card

      this.InstanceOver.reward.forEach(i => {
        const findInLibrary = library.find(i_ => i_.key === i.key)

        if (findInLibrary) {
          findInLibrary.number = findInLibrary.number + i.number
        }
        if (!findInLibrary) {
          library.push({ key: i.key, level: i.level, number: i.number })
        }
      })

      Imitation.state.function.saveInfo()

      this.InstanceOver.over = this.over
      return
    }
    if (this.InstanceRoleSelf.information.master.HP <= 0) {
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
      this.drawAction()
      this.drawRoleOpposite()
      this.drawRoleSelf()
    }
  }
}

export default Page