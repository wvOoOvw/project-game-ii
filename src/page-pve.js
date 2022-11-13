import { ifTouchCover, ifScreenCover, parseCard, parseMaster, parseMoney, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Navigation } from './ui-navigation'

import { Picture } from './utils-picture'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

const numberAnimation = (number, time, callback) => {
  const list = new Array(time).fill(number / time)
  const event = () => {
    requestAnimationFrame(() => {
      callback(list.shift())
      if (list[0]) event()
    })
  }
  event()
}

class CardMessage {
  constructor() {
    this.width = Math.min(windowWidth * 0.7, (windowHeight - safeTop) * 0.5)
    this.height = this.width * 1.35
    this.x = (windowWidth - this.width) / 2
    this.y = ((windowHeight - safeTop) - this.height) / 2

    this.card

    this.nova = false
    this.novaTime = 0
    this.novaOverTime = 0
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  play(card) {
    this.card = card
    this.nova = true
  }

  drawTitle() {
    const { x, y, width, height } = this.option

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.05
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = `rgba(0, 0, 0, 1)`
    ctx.fillText('CARD 卡牌', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const card = this.card

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width - width_ - width * 0.05
    const y_ = y + height - height_ - width * 0.05
    const radius_ = width * 0.03

    const text = [card.name, levelText(card.level)]

    if (card.number) text.push('x' + card.number)

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = `rgba(0, 0, 0, 1)`
    ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  drawRaceType() {
    const { x, y, width, height } = this.option
    const card = this.card

    const width_ = width * 0.9
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.22
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = `rgba(0, 0, 0, 1)`
    ctx.fillText(card.race + ' · ' + card.type, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawDescription() {
    const { x, y, width, height } = this.option
    const card = this.card

    const width_ = width * 0.9
    const height_ = width * 0.57
    const x_ = x + width * 0.05
    const y_ = y + width * 0.56
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`
    ctx.fill()

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = `rgba(0, 0, 0, 1)`
    drawMultilineText({ x: x_ + width * 0.05, y: y_ + width * 0.05, width: width_ - width * 0.1, wrapSpace: width * 0.075, text: card.description(card.level) })
  }

  render() {
    if (this.nova && this.novaTime < 1) {
      this.novaTime = numberFix(this.novaTime + 0.05)
    }
    if (this.novaTime === 1) {
      this.novaOverTime = this.novaOverTime + 1
      this.nova = false
    }
    if (!this.nova && this.novaTime > 0 && this.novaOverTime === 40) {
      this.novaTime = numberFix(this.novaTime - 0.05)
    }
    if (this.novaTime === 0) {
      this.novaOverTime = 0
      return
    }

    const card = this.card
    const { x, y, width, height } = this.option

    ctx.save()

    ctx.globalAlpha = this.novaTime

    drawRect({ x: 0, y: 0, width: windowWidth, height: windowHeight })
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
    ctx.fill()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()


    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()
    this.drawRaceType()
    this.drawDescription()

    ctx.restore()
  }
}

class RoleMessage {
  constructor() {
    this.queqe = []
    this.time = 60
  }

  play(option) {
    this.queqe.push({ ...option, time: this.time })
  }

  render() {
    this.queqe.forEach(i => {
      const fontSize = i.fontSize
      const text = i.text

      const offsetX = (i.time - this.time) / 4
      const offsetY = (i.time - this.time) / 2

      ctx.save()

      ctx.globalAlpha = i.time / this.time
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 ${fontSize}px ${window.fontFamily}`

      const width = ctx.measureText(text).width + 48

      drawRadius({ x: i.x - width / 2 + offsetX, y: i.y - fontSize + offsetY, width: width, height: fontSize * 2, radius: fontSize * 0.5 })
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
      ctx.fill()

      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fillText(text, i.x + offsetX, i.y + offsetY)

      ctx.restore()

      i.time = numberFix(i.time - 1)

      if (i.time === 0) this.queqe = this.queqe.filter(i => i.time)
    })
  }
}

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

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fill()

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

    this.card = props.card

    this.touchStart = props.touchStart
    this.touchEnd = props.touchEnd

    this.mouseDownPosition = null

    this.novaTime = 0
    this.ifTouchEndTime = 0
    this.mouseDownPositionTime = 0
  }

  get ifTouchEnd() {
    return this.offsetY < 0 - this.height / 2
  }

  get option() {
    return { x: this.x + this.offsetX, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  get optionDiff() {
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

    return { x, y, width, height }
  }

  get color() {
    const ifTouchEndTime = this.ifTouchEndTime

    const active = [0, 0, 0]

    return [
      `rgba(${Math.floor(255 - ifTouchEndTime * (255 - active[0]))}, ${Math.floor(255 - ifTouchEndTime * (255 - active[1]))}, ${Math.floor(255 - ifTouchEndTime * (255 - active[2]))}, 0.75)`,
      `rgba(${Math.floor(ifTouchEndTime * (255 - active[0]) + active[0])}, ${Math.floor(ifTouchEndTime * (255 - active[1]) + active[1])}, ${Math.floor(ifTouchEndTime * (255 - active[2]) + active[2])}, 1)`
    ]
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

  drawTitle() {
    const { x, y, width, height } = this.option
    const color = this.color

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.05
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = color[0]
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = color[1]
    ctx.fillText('CARD 卡牌', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const color = this.color
    const card = this.card

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width - width_ - width * 0.05
    const y_ = y + height - height_ - width * 0.05
    const radius_ = width * 0.03

    const text = [card.name, levelText(card.level)]

    if (card.number) text.push('x' + card.number)

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = color[0]
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = color[1]
    ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  drawRaceType() {
    const { x, y, width, height } = this.option
    const color = this.color
    const card = this.card

    const width_ = width * 0.9
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.22
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = color[0]
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = color[1]
    ctx.fillText(card.race + ' · ' + card.type, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawDescription() {
    const { x, y, width, height } = this.option
    const color = this.color
    const card = this.card

    const width_ = width * 0.9
    const height_ = width * 0.57
    const x_ = x + width * 0.05
    const y_ = y + width * 0.56
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = color[0]
    ctx.fill()

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = color[1]
    drawMultilineText({ x: x_ + width * 0.05, y: y_ + width * 0.05, width: width_ - width * 0.1, wrapSpace: width * 0.075, text: card.description(card.level) })
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    if (this.mouseDownPosition && this.mouseDownPositionTime < 1) {
      this.mouseDownPositionTime = numberFix(this.mouseDownPositionTime + 0.05)
    }
    if (!this.mouseDownPosition && this.mouseDownPositionTime > 0) {
      this.mouseDownPositionTime = numberFix(this.mouseDownPositionTime - 0.05)
    }

    if (this.ifTouchEnd && this.ifTouchEndTime < 1) {
      this.ifTouchEndTime = numberFix(this.ifTouchEndTime + 0.05)
    }
    if (!this.ifTouchEnd && this.ifTouchEndTime > 0) {
      this.ifTouchEndTime = numberFix(this.ifTouchEndTime - 0.05)
    }

    const card = this.card
    const { x, y, width, height } = this.option

    ctx.save()

    ctx.translate(x + width / 2, y + height / 2)
    ctx.scale(this.mouseDownPositionTime + 1, this.mouseDownPositionTime + 1)
    ctx.translate(-(x + width / 2), -(y + height / 2))

    ctx.globalAlpha = this.novaTime

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()

    if (this.mouseDownPositionTime !== 0) {
      ctx.globalAlpha = this.mouseDownPositionTime

      this.drawRaceType()
      this.drawDescription()
    }

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    window.Imitation.state.function.event('touchmove', this.eventMove.bind(this))
    window.Imitation.state.function.event('touchend', this.eventUp.bind(this))
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
      width: width * 0.4,
      height: width * 0.12,
    }
    option.x = x + width / 2 - option.width / 2
    option.y = y + width * 0.02
    option.radius = option.height / 4

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.04}px ${window.fontFamily}`

    drawRadius(option)
    ctx.fillStyle = `rgba(255, 255, 255, 1)`
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillText([information.master.name, levelText(information.master.level)].join(' '), option.x + option.width / 2, option.y + option.height / 2)
  }

  drawACTION() {
    const { x, y, width, height, information } = this

    const option = {
      width: width * 0.04,
      height: width * 0.04,
    }
    option.x = x + width / 2 + width * 0.2 + width * 0.04
    option.y = y + width * 0.06
    option.radius = option.height / 2

    if (information.master._ACTION && information.master._ACTION > 0) {
      new Array(information.master._ACTION).fill().forEach((i, index) => {
        const option_ = { ...option, x: option.x + index * (option.width + width * 0.04) }
        drawRadius(option_)
        ctx.fillStyle = `rgba(255, 255, 255, 1)`
        ctx.fill()
      })
    }
  }

  drawHA() {
    const { x, y, width, height, information } = this

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.04}px ${window.fontFamily}`

    const option = {
      width: width * 1.2,
      height: width * 0.12,
    }
    option.x = x + (width - option.width) / 2
    option.y = y + height - option.height - width * 0.02
    option.radius = option.height / 2

    ctx.save()

    drawRadius(option)

    ctx.clip()

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fill()

    drawRect({ ...option, width: information.master.HP / information.master.HP_ * option.width })

    ctx.fillStyle = `rgba(185, 0, 0, 1)`
    ctx.fill()

    ctx.restore()

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    ctx.fillText(`HP ${Math.floor(information.master.HP)} / ${information.master.HP_} - ATTACT ${Math.floor(information.master.ATTACT)}`, option.x + option.width / 2, option.y + option.height / 2)
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
      }, [])

    if (renderList.length === 0) renderList = [{ name: 'BUFF' }]

    renderList
      .forEach((i, index) => {
        const option = {
          width: width * 0.16,
          height: width * 0.08,
        }

        const maxIndex = renderList.length
        const centerIndex = maxIndex / 2 - 0.5
        const diff = index - centerIndex

        option.radius = option.height / 4
        option.x = x + (width - option.width) / 2 + diff * (option.width + width * 0.02)
        option.y = y + height + width * 0.02

        drawRadius(option)
        ctx.fillStyle = `rgba(0, 0, 0, 0.75)`
        ctx.fill()
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        ctx.fillText(i.number ? `${i.name} X${i.number}` : i.name, option.x + option.width / 2, option.y + option.height / 2)
      })
  }

  drawCard() {
    const width = this.width
    const height = this.height
    const x = this.x - (width - this.width) / 2
    const y = this.y

    this.InstanceCards = this.InstanceCards.filter(i => this.information.card.hand.find(i_ => i_ === i.card))

    this.information.card.hand.forEach((i, index) => {
      const maxIndex = this.information.card.hand.length
      const centerIndex = maxIndex / 2 - 0.5
      const diff = index - centerIndex

      const option = {}
      option.width = width * 0.42
      option.height = option.width * 1.35
      option.x = x + (width - option.width) / 2 + diff * width * 0.45
      option.y = y + (height - option.height) / 2
      option.touchStart = () => this.touchCard = i
      option.touchEnd = () => this.useCard(i)

      const find = this.InstanceCards.find(i_ => i_.card === i)

      if (find) {
        find.x = option.x
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
    this.drawACTION()
    this.drawHA()
    this.drawBuff()
    this.drawCard()
  }
}

class Page {
  constructor() {
    this.currentUseCard = false
    this.currentRole

    this.InstanceNavigation
    this.InstanceRoleSelf
    this.InstanceRoleOpposite
    this.InstanceRoleMessage = new RoleMessage()
    this.InstanceCardMessage = new CardMessage()

    this.instanceNavigation()
    this.instanceRoleSelf()
    this.instanceRoleOpposite()

    this.currentRole = this.InstanceRoleSelf
    this.roundStart()
  }

  instanceRoleSelf() {
    const boxHeight = (windowHeight - (this.InstanceNavigation.height + 12) - safeTop) / 2

    const option = {
      width: Math.min(windowWidth * 0.75, boxHeight * 0.75),
      height: Math.min(windowWidth * 0.75, boxHeight * 0.75),
      type: 'self',
      information: window.Imitation.state.battle.self,
      useCard: this.useCard,
    }
    option.x = (windowWidth - option.width) / 2
    option.y = windowHeight - (this.InstanceNavigation.height + 12) - boxHeight + (boxHeight - option.height) / 2

    this.InstanceRoleSelf = new Role(option)
  }

  instanceRoleOpposite() {
    const boxHeight = (windowHeight - (this.InstanceNavigation.height + 12) - safeTop) / 2

    const option = {
      width: Math.min(windowWidth * 0.75, boxHeight * 0.75),
      height: Math.min(windowWidth * 0.75, boxHeight * 0.75),
      type: 'opposite',
      information: window.Imitation.state.battle.opposite,
      useCard: this.useCard
    }
    option.x = (windowWidth - option.width) / 2
    option.y = (boxHeight - option.height) / 2 + safeTop

    this.InstanceRoleOpposite = new Role(option)
  }

  instanceNavigation() {
    const option = {
      content: [
        [
          {
            justifyContent: 'left',
            text: '退出战斗',
            event: () => {
              window.Imitation.state.page.current = 'transition'
              window.Imitation.state.page.next = 'explore'
            }
          },
          {
            justifyContent: 'right',
            text: '结束回合',
            event: this.roundOver
          },
        ],
      ]
    }

    this.InstanceNavigation = new Navigation(option)
  }

  pumpCard = (card, role) => {
    if (role.information.card.hand.length === 2) {
      role.information.card.cemetery.push(card)
    }
    if (role.information.card.hand.length < 2) {
      role.information.card.hand.push(card)
    }
  }

  useCard = async (card) => {
    if (this.currentUseCard) return

    const currentRole = this.currentRole

    const [self, opposite] = currentRole === this.InstanceRoleSelf ? [this.InstanceRoleSelf, this.InstanceRoleOpposite] : [this.InstanceRoleOpposite, this.InstanceRoleSelf]

    this.currentUseCard = true

    self.information.card.hand = self.information.card.hand.filter(i => i !== card)
    self.information.master._ACTION = self.information.master._ACTION - 1

    this.InstanceCardMessage.play(card)

    await wait(120)

    var result = card.function(card, self.information, opposite.information, this.env)

    self.information.master.skill.forEach(skill => skill.function(card, skill, result, self.information, opposite.information, this.env))

    var roleMessageTimeSelf = 0
    var roleMessageTimeOpposite = 0

    while (result.length) {
      const current = result.shift()

      if (current.custom) {
        current.custom(card, result, self.information, opposite.information, this.env)
      }

      if (current.message) {
        window.Imitation.state.function.message(current.message, 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
      }

      if (current.animation) {
        if (current.target === 'self') {
          window.Imitation.state.function.animation(current.animation, (img) => [self.x + self.width / 2 - img.width / 2, self.y + self.height / 2 - img.height / 2])
        }
        if (current.target === 'opposite') {
          window.Imitation.state.function.animation(current.animation, (img) => [opposite.x + opposite.width / 2 - img.width / 2, opposite.y + opposite.height / 2 - img.height / 2])
        }
      }

      if (current.roleMessage) {
        if (current.target === 'self') {
          wait(roleMessageTimeSelf * 30, () => {
            this.InstanceRoleMessage.play({ text: current.roleMessage, x: self.x + self.width / 2, y: self.y + self.height / 2, fontSize: this.InstanceRoleSelf.width * 0.04 })
          })
          roleMessageTimeSelf = roleMessageTimeSelf + 1
        }
        if (current.target === 'opposite') {
          wait(roleMessageTimeOpposite * 30, () => {
            this.InstanceRoleMessage.play({ text: current.roleMessage, x: opposite.x + opposite.width / 2, y: opposite.y + opposite.height / 2, fontSize: this.InstanceRoleSelf.width * 0.04 })
          })
          roleMessageTimeOpposite = roleMessageTimeOpposite + 1
        }
      }

      if (current.effect) {
        if (current.effect === 'HP') {
          if (current.target === 'self') {
            numberAnimation(current.value, 32, i => self.information.master.HP = Math.min(self.information.master.HP + i, self.information.master.HP_))
          }
          if (current.target === 'opposite') {
            numberAnimation(current.value, 32, i => opposite.information.master.HP = Math.min(opposite.information.master.HP + i, opposite.information.master.HP_))
          }
        }

        if (current.effect === 'ATTACT') {
          if (current.target === 'self') {
            numberAnimation(current.value, 32, i => self.information.master.ATTACT = self.information.master.ATTACT + i)
          }
          if (current.target === 'opposite') {
            numberAnimation(current.value, 32, i => opposite.information.master.ATTACT = opposite.information.master.ATTACT + i)
          }
        }

        if (current.effect === 'BUFF') {
          if (current.target === 'self') {
            if (current.number > 0) {
              self.information.master.buff.push(...new Array(current.number).fill(current.name))
            }
            if (current.number < 0) {
              let count = 0
              self.information.master.buff = self.information.master.buff.filter(i => {
                if (i === current.name && count !== current.number) {
                  count = count - 1
                  return false
                }
                return true
              })
            }
          }
          if (current.target === 'opposite') {
            if (current.number > 0) {
              opposite.information.master.buff.push(...new Array(current.number).fill(current.name))
            }
            if (current.number < 0) {
              let count = 0
              opposite.information.master.buff = opposite.information.master.buff.filter(i => {
                if (i === current.name && count !== current.number) {
                  count = count - 1
                  return false
                }
                return true
              })
            }
          }
        }

        if (current.effect = 'LEVEL') {
          if (current.target === 'self') {
            self.information.card.team.forEach(i => {
              if (i.key === current.key) i.level = i.level + current.number
            })
          }
          if (current.target === 'opposite') {
            opposite.information.card.team.forEach(i => {
              if (i.key === current.key) i.level = i.level + current.number
            })
          }
        }
      }
    }

    await wait(120)

    this.roundContinue()
  }

  oppositeAI = async () => {
    const result = this.InstanceRoleOpposite.information.AI(this.InstanceRoleOpposite.information, this.InstanceRoleSelf.information, this.env)

    await wait(120)
    await this.useCard(result)
    await wait(120)
  }

  roundStart = async () => {
    const currentRole = this.currentRole

    currentRole.information.master._ACTION = currentRole.information.master.ACTION
    currentRole.information.card.hand = arrayRandom(currentRole.information.card.team, 2)

    if (currentRole === this.InstanceRoleOpposite) this.oppositeAI()
  }

  roundContinue = async () => {
    const currentRole = this.currentRole

    if (currentRole.information.master._ACTION > 0) {
      currentRole.information.card.hand = arrayRandom(currentRole.information.card.team, 2)
      if (currentRole === this.InstanceRoleOpposite) this.oppositeAI()
    }

    if (currentRole.information.master._ACTION === 0) {
      this.roundOver()
    }

    this.currentUseCard = false
  }

  roundOver = async () => {
    const currentRole = this.currentRole

    currentRole.information.master._ACTION = 0
    currentRole.information.card.hand = []

    if (this.currentRole === this.InstanceRoleSelf) {
      this.currentRole = this.InstanceRoleOpposite
      await this.roundStart()
      return
    }

    if (this.currentRole === this.InstanceRoleOpposite) {
      this.currentRole = this.InstanceRoleSelf
      await this.roundStart()
      return
    }
  }

  battlerOver = () => {
    if (this.InstanceRoleOpposite.information.master.HP <= 0) {
      const reward = window.Imitation.state.battle.reward()

      window.Imitation.state.function.message('战斗胜利', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
      window.Imitation.state.reward = { value: reward, back: 'explore', title: '战斗胜利' }
      window.Imitation.state.page.current = 'transition'
      window.Imitation.state.page.next = 'reward'
      return
    }
    if (this.InstanceRoleSelf.information.master.HP <= 0) {
      window.Imitation.state.function.message('战斗失败', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
      window.Imitation.state.reward = { value: [], back: 'explore', title: '战斗失败' }
      window.Imitation.state.page.current = 'transition'
      window.Imitation.state.page.next = 'reward'
      return
    }
  }

  render() {
    drawImage(Picture.get('background-page'), { x: 0, y: 0, width: windowWidth, height: windowHeight })

    this.InstanceNavigation.render()
    this.InstanceRoleOpposite.render()
    this.InstanceRoleSelf.render()
    this.InstanceCardMessage.render()
    this.InstanceRoleMessage.render()

    this.battlerOver()
  }
}

export default Page