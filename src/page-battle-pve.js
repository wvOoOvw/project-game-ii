import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, parseMaster, parseMoney, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'
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

    this.novaTime = 0

    this.card = props.card
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const x = this.x
    const y = this.y
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

    ctx.globalAlpha = this.novaTime
    ctx.globalAlpha = Math.min(this.novaTime, this.useAbleTime * 1)

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(this.card.imageDOM, { x: x, y: y, width: width, height: height })

    const width_ = height * this.mouseDownPositionTime
    const height_ = height * this.mouseDownPositionTime
    const x_ = x + (width - width_) / 2
    const y_ = y + (height - height_) / 2
    const radius_ = width_ / 2

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, ${0.5 + this.ifTouchEndTime * 0.35})`

    ctx.fill()

    if (this.mouseDownPositionTime === 1) {
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 ${width * 0.07}px ${window.fontFamily}`
      ctx.fillStyle = `rgba(0, 0, 0, 1)`

      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)
      ctx.fillText(`${card.race} · ${card.type}`, x + width * 0.08, y + width * 0.48)

      ctx.textAlign = 'start'
      ctx.textBaseline = 'top'

      drawText({ x: x + width * 0.08, y: y + width * 0.72, width: width - width * 0.25, fontHeight: width * 0.105, text: card.description(1) })
    }

    if (this.mouseDownPositionTime === 0) {
      const width_ = width * 0.6
      const height_ = width * 0.2
      const x_ = x + width / 2 - width_ / 2
      const y_ = y + height - height_ - (x_ - x)
      const radius_ = width * 0.08

      const text = [card.name, levelText(card.level)]

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
    ctx.save()

    const { x, y, width, height, information } = this

    const option = {
      width: width * 0.4,
      height: width * 0.12,
    }

    option.x = x + width / 2 - option.width / 2
    option.y = y + width * 0.02
    option.radius = option.height / 4
    option.text = [information.master.name, levelText(information.master.level)].join(' ')
    option.font = `900 ${width * 0.04}px ${window.fontFamily}`
    option.fillStyle = [`rgba(255, 255, 255, 1)`, 'rgba(0, 0, 0, 1)']

    new Button(option).render()

    ctx.restore()
  }

  drawHM() {
    const { x, y, width, height, information } = this

    const option = {
      width: Math.min(width * 0.7, windowWidth / 2 - 24),
      height: width * 0.12,
    }

    option.y = y + height - option.height - width * 0.02
    option.radius = option.height / 2

    option.x = x + width / 2 - option.width - width * 0.02

    drawRadius(option)

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.04}px ${window.fontFamily}`

    ctx.fillStyle = `rgba(185, 0, 0, 1)`
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    ctx.fillText(`HP ${information.master.HP}`, option.x + option.width / 2, option.y + option.height / 2)

    option.x = x + width / 2 + width * 0.02

    drawRadius(option)

    ctx.fillStyle = `rgba(0, 0, 185, 1)`
    ctx.fill()

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    ctx.fillText(`MP ${information.master.MP}`, option.x + option.width / 2, option.y + option.height / 2)
  }

  drawBuff() {
    const { x, y, width, height, information } = this

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.font = `900 ${width * 0.03}px ${window.fontFamily}`

    var renderList = information.master.buff
      .reduce((t, i) => {
        const find = t.find(i_ => i_.name === i)
        if (find) find.number = find.number + 1
        if (!find) t.push({ name: i, number: 1 })
        return t
      }, [{ name: 'BUFF' }])

    renderList
      .forEach((i, index) => {
        const option = {
          width: width * 0.16,
          height: width * 0.08,
          y: y + width * 0.15
        }

        const maxIndex = renderList.length
        const centerIndex = maxIndex / 2 - 0.5
        const diff = index - centerIndex

        option.radius = option.height / 4
        option.x = x + (width - option.width) / 2 + diff * (option.width + width * 0.02)

        drawRadius(option)

        ctx.fillStyle = `rgba(0, 0, 0, 0.75)`

        ctx.fill()

        ctx.fillStyle = 'rgba(255, 255, 255, 1)'

        ctx.fillText(i.number ? `${i.name} X${i.number}` : i.name, option.x + option.width / 2, option.y + option.height / 2)
      })
  }

  drawCard() {
    const width = Math.min(this.width * 1.75, windowWidth - 24)
    const height = this.height
    const x = this.x - (width - this.width) / 2
    const y = this.y + width * 0.02

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
    this.drawBuff()
    this.drawCard()
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
    const option = { x: this.x + 12, y: this.y + this.height / 2 - 15 + 32, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: `ROUND ${this.env.round}` }

    new Button(option).render()
  }

  drawButtonOverRound() {
    const option = { x: this.x + this.width - 84, y: this.y + this.height / 2 - 15 + 32, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: [`rgba(255, 255, 255, 1)`, 'rgba(0, 0, 0, 1)'], text: '结束回合' }

    new Button(option).render()

    if (this.useAbleTime !== 1) return

    const event = () => {
      this.roundOver()
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonStore() {
    const option = { x: this.x + 12, y: this.y + this.height / 2 - 15 - 32, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: `查看牌库x${this.InstanceRoleSelf.information.card.store.length}` }

    new Button(option).render()

    if (this.useAbleTime !== 1) return

    const event = () => {
      this.watchStore()
    }

    addEventListener('touchstart', event, option)
  }

  drawButtonCemetery() {
    const option = { x: this.x + 96, y: this.y + this.height / 2 - 15 - 32, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: `查看墓地x${this.InstanceRoleSelf.information.card.cemetery.length}` }

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

    drawRadius({ x, y, width, height, radius: 8 })

    ctx.clip()

    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

    const width_ = width * 0.75
    const height_ = width * 0.2
    const x_ = x + width / 2 - width_ / 2
    const y_ = y + height - height_ - (x_ - x)
    const radius_ = height_ / 4

    const text = [card.name, levelText(card.level)]

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.07}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)

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
    const row = Math.ceil(this.cards.length / 3)

    if (row === 0) return 0

    const real = ((windowWidth - 72) / 3 * 1.35) * row

    const margin = row ? 12 * (row - 1) : 0

    return real + margin
  }

  instanceScroll() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 150 - safeTop, radius: 12 }

    drawRadius(scrollOption)
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fill()

    this.InstanceScroll = new Scroll(scrollOption)
  }

  drawButtonBack() {
    const option = { x: 12, y: windowHeight - 78, width: windowWidth - 24, height: 36, radius: 8, font: `900 12px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '返回' }

    new Button(option).render()

    const event = () => {
      this.back()
    }

    addEventListener('touchstart', event, option)
  }

  render() {
    this.InstanceScroll.scrollY = this.cardHeight - this.InstanceScroll.height + 24

    this.drawButtonBack()

    drawRadius({ ...this.InstanceScroll.option, radius: 8 })
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fill()

    const event = (scroll) => {
      this.cards.forEach((card, index) => {
        const option = {
          width: (windowWidth - 72) / 3,
          card: card,
        }

        option.height = option.width * 1.35
        option.x = 24 + parseInt(index % 3) * (option.width + 12)
        option.y = 72 + parseInt(index / 3) * (option.height + 12) + safeTop - scroll[1]

        if (!ifScreenCover(option, this.InstanceScroll.option)) return

        new CardInModal(option).render()
      })
    }

    this.InstanceScroll.render(event)
  }
}

class ItemInReward {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.reward = props.reward
  }

  render() {
    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height
    const reward = this.reward

    if (reward.money) {
      const money = parseMoney([reward.money])[0]

      ctx.save()

      drawRadius({ x, y, width, height, radius: 8 })

      ctx.clip()

      drawImage(money.imageDOM, { x: x, y: y, width: width, height: height })

      const width_ = width * 0.75
      const height_ = width * 0.2
      const x_ = x + width / 2 - width_ / 2
      const y_ = y + height - height_ - (x_ - x)
      const radius_ = height_ / 4

      const text = [money.name, money.number]

      drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

      ctx.fill()

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 ${width * 0.07}px ${window.fontFamily}`
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'

      ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)

      ctx.restore()
    }
    if (reward.card) {
      const card = parseCard([reward])[0]

      ctx.save()

      drawRadius({ x, y, width, height, radius: 8 })

      ctx.clip()

      drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

      const width_ = width * 0.75
      const height_ = width * 0.2
      const x_ = x + width / 2 - width_ / 2
      const y_ = y + height - height_ - (x_ - x)
      const radius_ = height_ / 4

      const text = [card.name, levelText(card.level)]

      drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

      ctx.fill()

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 ${width * 0.07}px ${window.fontFamily}`
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'

      ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)

      ctx.restore()
    }
    if (reward.master) {
      const master = parseMaster([reward])[0]

      ctx.save()

      drawRadius({ x, y, width, height, radius: 8 })

      ctx.clip()

      drawImage(master.imageDOM, { x: x, y: y, width: width, height: height })

      const width_ = width * 0.75
      const height_ = width * 0.2
      const x_ = x + width / 2 - width_ / 2
      const y_ = y + height - height_ - (x_ - x)
      const radius_ = height_ / 4

      const text = [master.name, master.number]

      drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

      ctx.fill()

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 ${width * 0.07}px ${window.fontFamily}`
      ctx.fillStyle = 'rgba(0, 0, 0, 1)'

      ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)

      ctx.restore()
    }
  }
}

class Reward {
  constructor(props) {
    this.over = props.voer
    this.reward = props.reward

    this.InstanceScroll
    this.instanceScroll()
  }

  get rewardHeight() {
    const row = Math.ceil(this.parseReward(this.reward).length / 3)

    if (row === 0) return 0

    const real = ((windowWidth - 72) / 3 * 1.35) * row

    const margin = row ? 12 * (row - 1) : 0

    return real + margin
  }

  instanceScroll() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 150 - safeTop, radius: 12 }

    this.InstanceScroll = new Scroll(scrollOption)
  }

  drawButtonOver() {
    const option = { x: 12, y: windowHeight - 78, width: 72, height: 36, radius: 8, font: `900 12px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: this.over ? '战斗胜利' : '战斗失败' }

    new Button(option).render()
  }

  drawButtonHome() {
    const option = { x: 96, y: windowHeight - 78, width: windowWidth - 108, height: 36, radius: 8, font: `900 12px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '返回' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'explore'
    }

    addEventListener('touchstart', event, option)
  }

  parseReward(reward) {
    const r = []
    reward.forEach(i => {
      if (i.card) {
        r.push(...new Array(i.number).fill({ ...i, number: 1 }))
      }
      if (!i.card) {
        r.push(i)
      }
    })
    return r
  }

  render() {
    this.InstanceScroll.scrollY = this.rewardHeight - this.InstanceScroll.height + 24

    this.drawButtonOver()
    this.drawButtonHome()

    drawRadius({ ...this.InstanceScroll.option, radius: 8 })
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fill()

    const event = (scroll) => {
      this.parseReward(this.reward).forEach((reward, index) => {
        const option = {
          width: (windowWidth - 72) / 3,
          reward: reward,
        }

        option.height = option.width * 1.35
        option.x = 24 + parseInt(index % 3) * (option.width + 12)
        option.y = 72 + parseInt(index / 3) * (option.height + 12) + safeTop - scroll[1]

        if (!ifScreenCover(option, this.InstanceScroll.option)) return

        new ItemInReward(option).render()
      })
    }

    this.InstanceScroll.render(event)
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
    this.InstanceReward

    this.instanceRoleSelf()
    this.instanceRoleOpposite()
    this.instanceAction()
    this.instanceModal()
    this.instanceReward()
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
    const boxHeight = (windowHeight - 180 - safeTop) / 2

    const option = {
      width: Math.min(windowWidth - 24, boxHeight - 24, windowHeight * 0.3),
      height: Math.min(windowWidth - 24, boxHeight - 24, windowHeight * 0.3),
      type: 'self',
      information: Imitation.state.battle.self,
      env: this.env,
      useCard: this.useCard,
    }

    option.x = (windowWidth - option.width) / 2
    option.y = (safeTop + 60) + (windowHeight - 180 - safeTop) / 2 + 120 + (boxHeight - option.height) / 2

    this.InstanceRoleSelf = new Role(option)
  }

  instanceRoleOpposite() {
    const boxHeight = (windowHeight - 180 - safeTop) / 2

    const option = {
      width: Math.min(windowWidth - 24, boxHeight - 24, windowHeight * 0.3),
      height: Math.min(windowWidth - 24, boxHeight - 24, windowHeight * 0.3),
      type: 'opposite',
      information: Imitation.state.battle.opposite,
      env: this.env,
      useCard: this.useCard
    }

    option.x = (windowWidth - option.width) / 2
    option.y = (safeTop + 60) + (windowHeight - 180 - safeTop) / 2 - option.height - (boxHeight - option.height) / 2

    this.InstanceRoleOpposite = new Role(option)
  }

  instanceAction() {
    const width = windowWidth - 24
    const height = 120

    this.InstanceAction = new Action({
      x: (windowWidth - width) / 2,
      y: (safeTop + 60) + (windowHeight - 180 - safeTop) / 2,
      width: width,
      height: height,
      env: this.env,
      InstanceRoleSelf: this.InstanceRoleSelf,
      InstanceRoleOpposite: this.InstanceRoleOpposite,
      roundOver: this.roundOver,
      watchStore: () => {
        this.modal = true
        this.InstanceModal.cards = this.InstanceRoleSelf.information.card.store
      },
      watchCemetery: () => {
        this.modal = true
        this.InstanceModal.cards = this.InstanceRoleSelf.information.card.cemetery
      }
    })
  }

  instanceModal() {
    this.InstanceModal = new Modal({
      back: () => this.modal = false
    })
  }

  instanceReward() {
    this.InstanceReward = new Reward({
      reward: []
    })
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
    this.InstanceReward.render()
  }

  drawBackground() {
    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  drawButtonHome() {
    const option_ = { x: 12, y: 12 + safeTop, width: 72, height: 36, radius: 8, font: `900 12px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '返回' }

    new Button(option_).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option_)
  }

  pumpCard = (card, role) => {
    if (role.information.card.hand.length === 4) {
      role.information.card.cemetery.push(card)
    }
    if (role.information.card.hand.length < 4) {
      role.information.card.hand.push(card)
    }
  }

  useCard = async (card, role) => {
    const [self, opposite] = role === this.InstanceRoleSelf ? [this.InstanceRoleSelf, this.InstanceRoleOpposite] : [this.InstanceRoleOpposite, this.InstanceRoleSelf]

    var result = card.function(card, self.information, opposite.information, this.env)

    if (result.find(i => i.error)) {
      Imitation.state.function.message(result.find(i => i.error).error, 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    Imitation.state.function.message(card.name + ' ' + levelText(card.level), 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')

    if (result.find(i => i.animation)) {
      const animations = result.filter(i => i.animation)

      while (animations.length) {
        const current = animations.shift()
        if (current.target === 'self') {
          Imitation.state.function.animation(current.animation, (img) => [self.x + self.width / 2 - img.width / 2, self.y + self.height / 2 - img.height / 2])
        }
        if (current.target === 'opposite') {
          Imitation.state.function.animation(current.animation, (img) => [opposite.x + opposite.width / 2 - img.width / 2, opposite.y + opposite.height / 2 - img.height / 2])
        }
      }
    }

    self.information.master.skill.forEach(skill => {
      skill.function(card, result, self.information, opposite.information, this.env)
    })

    self.information.card.hand = self.information.card.hand.filter(i => i !== card)

    self.information.card.cemetery.push(card)
    self.information.card.consume.push(card)

    while (result.length) {
      const current = result.shift()

      if (current.effect === 'cost-mp') {
        if (current.target === 'self') {
          self.information.master.MP = self.information.master.MP + current.value
        }
      }

      if (current.effect === 'hit') {
        if (current.target === 'opposite') {
          opposite.information.master.HP = opposite.information.master.HP + current.value
        }
      }

      if (current.effect === 'buff') {
        if (current.target === 'self') {
          self.information.master.buff.push(...new Array(current.number).fill(current.value))
        }
        if (current.target === 'opposite') {
          opposite.information.master.buff.push(...new Array(current.number).fill(current.value))
        }
      }

      if (current.effect === 'cost-buff') {
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

      if (current.effect === 'cure-hp') {
        if (current.target === 'self') {
          self.information.master.HP = self.information.master.HP + current.value
        }
      }

      if (current.effect === 'cure-mp') {
        if (current.target === 'self') {
          self.information.master.MP = self.information.master.MP + current.value
        }
      }

      if (current.effect === 'pump-store-positive') {
        if (current.target === 'self') {
          new Array(current.value).fill().forEach(i => {
            const card = this.InstanceRoleSelf.information.card.store.shift()
            if (!card) return
            this.pumpCard(card, this.InstanceRoleSelf)
          })
        }
      }

      if (current.effect === 'pump-store-point') {
        if (current.target === 'self') {
          current.value.forEach(i => {
            this.pumpCard(i, this.InstanceRoleSelf)
            this.InstanceRoleSelf.information.card.store = this.InstanceRoleSelf.information.card.store.filter(i_ => i_ !== i)
          })
        }
      }

      if (current.effect === 'pump-cemetery-positive') {
        if (current.target === 'self') {
          new Array(current.value).fill().forEach(i => {
            this.pumpCard(this.InstanceRoleSelf.information.card.cemetery.shift(), this.InstanceRoleSelf)
          })
        }
      }

      if (current.effect === 'pump-cemetery-point') {
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
      Imitation.state.function.message('战斗胜利', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')

      this.InstanceReward.reward = Imitation.state.battle.reward

      const library = Imitation.state.info.library.card

      this.InstanceReward.reward.forEach(i => {
        if (i.money) {
          const findInMoney = Imitation.state.info.money.find(i => i.key === i.key)
          findInMoney.number = findInMoney.number + i.number
        }
        if (i.card) {
          const findInLibrary = library.find(i_ => i_.key === i.key)
          if (findInLibrary) {
            findInLibrary.number = findInLibrary.number + i.number
          }
          if (!findInLibrary) {
            library.push({ key: i.key, level: i.level, number: i.number })
          }
        }
        if (i.master) {
          const findInLibrary = library.master.find(i_ => i_.key === i.key)
          if (findInLibrary) {
            findInLibrary.exp = findInLibrary.exp + i.number / Math.pow(2, (findInLibrary.level - 1))

            if (findInLibrary.exp > 100) {
              findInLibrary.level = findInLibrary.level + 1
              findInLibrary.exp = (findInLibrary.exp - 100) * 0.5
            }
          }
          if (!findInLibrary) {
            library.push({ key: i.key, level: 1, exp: i.number })
          }
        }
      })

      Imitation.state.function.saveInfo()

      this.InstanceReward.over = this.over
      return
    }
    if (this.InstanceRoleSelf.information.master.HP <= 0) {
      this.over = 'lose'
      Imitation.state.function.message('战斗失败', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')

      this.InstanceReward.over = this.over
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