import { ifTouchCover, numberFix, levelText } from './utils-common'
import { drawMultilineText, drawImage, drawImageFullHeight, drawRectAngle } from './utils-canvas'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class CardEmpty {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.card = props.card

    this.novaTime = 0
  }

  get option() {
    return { x: this.x + this.offsetX, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option

    ctx.save()

    ctx.globalAlpha = this.novaTime

    drawRectAngle({ x, y, width, height, radius: 8 })

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fill()

    ctx.restore()
  }
}

class CardInPve {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = 0
    this.offsetY = 0

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
    const radius_ = height_ / 2

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
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
    const radius_ = height_ / 2

    const text = [card.name, levelText(card.level)]

    if (card.number) text.push('x' + card.number)

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
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
    const radius_ = 2

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
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
    const radius_ = 2

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
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

    drawRectAngle({ x, y, width, height, radius: 8 })

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()

    ctx.clip()

    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

    if (this.mouseDownPositionTime !== 0) {
      ctx.globalAlpha = this.mouseDownPositionTime

      this.drawTitle()
      this.drawName()
      this.drawRaceType()
      this.drawDescription()
    }

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    window.Imitation.state.function.event('touchmove', this.eventMove.bind(this))
    window.Imitation.state.function.event('touchend', this.eventUp.bind(this))
  }
}

class MoneyInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.money = props.money

    this.novaTime = 0
  }

  get option() {
    return { x: this.x + this.offsetX, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  drawTitle() {
    const { x, y, width, height } = this.option
    const money = this.money

    const width_ = width * 0.35
    const height_ = width * 0.07
    const x_ = x + width * 0.03
    const y_ = y + width * 0.03
    const radius_ = height_ / 2

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${height * 0.075}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText('MONEY 货币', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const money = this.money

    const width_ = width * 0.35
    const height_ = height * 0.2
    const x_ = x + width - width_ - height * 0.1
    const y_ = y + height - height_ - height * 0.1
    const radius_ = height_ / 2

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${height * 0.075}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText([master.name, money.number].join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option
    const money = this.money

    ctx.save()

    drawRectAngle({ x, y, width, height, radius: 8 })

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()

    ctx.clip()

    drawImage(money.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.globalAlpha = this.novaTime

    this.drawTitle()
    this.drawName()

    ctx.restore()
  }
}

class ExploreInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.explore = props.explore

    this.novaTime = 0

    this.touchEvent = props.touchEvent
    this.touchArea = props.touchArea
    this.touchTimeout
  }

  get option() {
    return { x: this.x + this.offsetX, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  eventDown(e) {
    if (!this.touchArea || ifTouchCover(e, this.touchArea)) this.touchTimeout = true
  }

  eventUp(e) {
    if (this.touchTimeout === true) this.touchEvent()
    this.touchTimeout = false
  }

  eventMove(e) {
    this.touchTimeout = false
  }

  drawImage() {
    const { x, y, width, height } = this.option
    const explore = this.explore

    drawImage(explore.imageDOM, { x: x, y: y, width: width, height: height })
  }

  drawTitle() {
    const { x, y, width, height } = this.option
    const explore = this.explore

    const width_ = width * 0.35
    const height_ = height * 0.2
    const x_ = x + height * 0.1
    const y_ = y + height * 0.1
    const radius_ = height_ / 2

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${height * 0.075}px ${window.fontFamily}`

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = explore.inTeam ? `rgba(0, 0, 0, 0.75)` : `rgba(255, 255, 255, 0.75)`
    ctx.fill()
    ctx.fillStyle = explore.inTeam ? `rgba(255, 255, 255, 1)` : 'rgba(0, 0, 0, 1)'
    ctx.fillText('EXPLORE 探索', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const explore = this.explore

    const width_ = width * 0.35
    const height_ = height * 0.2
    const x_ = x + width - width_ - height * 0.1
    const y_ = y + height - height_ - height * 0.1
    const radius_ = height_ / 2

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${height * 0.075}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(explore.name, x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option

    ctx.save()

    drawRectAngle({ x, y, width, height, radius: 8 })

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()

    ctx.clip()

    this.drawImage()

    ctx.globalAlpha = this.novaTime

    this.drawTitle()
    this.drawName()

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    window.Imitation.state.function.event('touchmove', this.eventMove.bind(this))
    window.Imitation.state.function.event('touchend', this.eventUp.bind(this))
  }
}

class ShopInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.shop = props.shop

    this.novaTime = 0

    this.touchEvent = props.touchEvent
    this.touchArea = props.touchArea
    this.touchTimeout
  }

  get option() {
    return { x: this.x + this.offsetX, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  eventDown(e) {
    if (!this.touchArea || ifTouchCover(e, this.touchArea)) this.touchTimeout = true
  }

  eventUp(e) {
    if (this.touchTimeout === true) this.touchEvent()
    this.touchTimeout = false
  }

  eventMove(e) {
    this.touchTimeout = false
  }

  drawImage() {
    const { x, y, width, height } = this.option
    const shop = this.shop

    drawImage(shop.imageDOM, { x: x, y: y, width: width, height: height })
  }

  drawTitle() {
    const { x, y, width, height } = this.option
    const shop = this.shop

    const width_ = width * 0.35
    const height_ = height * 0.2
    const x_ = x + height * 0.1
    const y_ = y + height * 0.1
    const radius_ = height_ / 2

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${height * 0.075}px ${window.fontFamily}`

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = shop.inTeam ? `rgba(0, 0, 0, 0.75)` : `rgba(255, 255, 255, 0.75)`
    ctx.fill()
    ctx.fillStyle = shop.inTeam ? `rgba(255, 255, 255, 1)` : 'rgba(0, 0, 0, 1)'
    ctx.fillText('SHOP 礼盒', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const shop = this.shop

    const width_ = width * 0.35
    const height_ = height * 0.2
    const x_ = x + width - width_ - height * 0.1
    const y_ = y + height - height_ - height * 0.1
    const radius_ = height_ / 2

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${height * 0.075}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(shop.name, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawExtra() {
    const { x, y, width, height } = this.option
    const shop = this.shop

    const width_ = width * 0.35
    const height_ = height * 0.2
    const x_ = x + width - width_ - height * 0.1
    const y_ = y + height - height_ - height * 0.4
    const radius_ = height_ / 2

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${height * 0.075}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText([shop.money.name, shop.money.number].join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option

    ctx.save()

    drawRectAngle({ x, y, width, height, radius: 8 })

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()

    ctx.clip()

    this.drawImage()

    ctx.globalAlpha = this.novaTime

    this.drawTitle()
    this.drawName()
    this.drawExtra()

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    window.Imitation.state.function.event('touchmove', this.eventMove.bind(this))
    window.Imitation.state.function.event('touchend', this.eventUp.bind(this))
  }
}

class CardInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.card = props.card

    this.novaTime = 0

    this.touchEvent = props.touchEvent
    this.touchArea = props.touchArea
    this.touchTimeout
  }

  get option() {
    return { x: this.x + this.offsetX, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  eventDown(e) {
    if (!this.touchArea || ifTouchCover(e, this.touchArea)) this.touchTimeout = true
  }

  eventUp(e) {
    if (this.touchTimeout === true) this.touchEvent()
    this.touchTimeout = false
  }

  eventMove(e) {
    this.touchTimeout = false
  }

  drawImage() {
    const { x, y, width, height } = this.option
    const card = this.card

    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })
  }

  drawTitle() {
    const { x, y, width, height } = this.option
    const card = this.card

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.05
    const radius_ = height_ / 2

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = card.inTeam ? `rgba(0, 0, 0, 0.75)` : `rgba(255, 255, 255, 0.75)`
    ctx.fill()
    ctx.fillStyle = card.inTeam ? `rgba(255, 255, 255, 1)` : 'rgba(0, 0, 0, 1)'
    ctx.fillText('CARD 卡牌', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const card = this.card

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width - width_ - width * 0.05
    const y_ = y + height - height_ - width * 0.05
    const radius_ = height_ / 2

    const text = [card.name, levelText(card.level)]

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.045}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option

    ctx.save()

    drawRectAngle({ x, y, width, height, radius: 8 })

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()

    ctx.clip()

    this.drawImage()

    ctx.globalAlpha = this.novaTime

    this.drawTitle()
    this.drawName()

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    window.Imitation.state.function.event('touchmove', this.eventMove.bind(this))
    window.Imitation.state.function.event('touchend', this.eventUp.bind(this))
  }
}

class MasterInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.master = props.master

    this.novaTime = 0

    this.touchEvent = props.touchEvent
    this.touchArea = props.touchArea
    this.touchTimeout
  }

  get option() {
    return { x: this.x + this.offsetX, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  eventDown(e) {
    if (!this.touchArea || ifTouchCover(e, this.touchArea)) this.touchTimeout = true
  }

  eventUp(e) {
    if (this.touchTimeout === true) this.touchEvent()
    this.touchTimeout = false
  }

  eventMove(e) {
    this.touchTimeout = false
  }

  drawImage() {
    const { x, y, width, height } = this.option
    const master = this.master

    drawImage(master.imageDOM, { x: x, y: y, width: width, height: height })
  }

  drawTitle() {
    const { x, y, width, height } = this.option
    const master = this.master

    const width_ = width * 0.35
    const height_ = height * 0.2
    const x_ = x + height * 0.1
    const y_ = y + height * 0.1
    const radius_ = height_ / 2

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${height * 0.075}px ${window.fontFamily}`

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = master.inTeam ? `rgba(0, 0, 0, 0.75)` : `rgba(255, 255, 255, 0.75)`
    ctx.fill()
    ctx.fillStyle = master.inTeam ? `rgba(255, 255, 255, 1)` : 'rgba(0, 0, 0, 1)'
    ctx.fillText('MASTER 队长', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const master = this.master

    const width_ = width * 0.35
    const height_ = height * 0.2
    const x_ = x + width - width_ - height * 0.1
    const y_ = y + height - height_ - height * 0.1
    const radius_ = height_ / 2

    drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${height * 0.075}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText([master.name, levelText(master.level)].join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option

    ctx.save()

    drawRectAngle({ x, y, width, height, radius: 8 })

    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()

    ctx.clip()

    this.drawImage()

    ctx.globalAlpha = this.novaTime

    this.drawTitle()
    this.drawName()

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    window.Imitation.state.function.event('touchmove', this.eventMove.bind(this))
    window.Imitation.state.function.event('touchend', this.eventUp.bind(this))
  }
}

class ExploreInPreview {
  constructor() {
    this.x = 0
    this.y = safeTop
    this.width = windowWidth
    this.height = windowHeight - safeTop

    this.skillIndex = 0
    this.novaTime = 0

    this.explore
    this.close
    this.extra
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawImage() {
    const { x, y, width, height } = this.option
    const explore = this.explore

    drawImageFullHeight(explore.imageDOM, { x: x, y: y, width: width, height: height * 0.4 })
  }

  drawContent() {
    const { x, y, width, height } = this.option
    const explore = this.explore

    ctx.font = `900 ${height * 0.014}px ${window.fontFamily}`

    const list = [
      'EXPLORE 探索',
      explore.name,
      ['难度', explore.difficulty].join(' '),
    ]

    list.forEach((i, index) => {
      const width_ = width - width * 0.1
      const height_ = height * 0.04
      const x_ = x + width * 0.05
      const y_ = height * 0.4 + height * 0.02 + index * height * 0.06
      const radius_ = height_ / 2

      drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fill()

      ctx.textAlign = 'start'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = `rgba(255, 255, 255, 1)`

      ctx.fillText(i, x_ + height_, y_ + height_ / 2)
    })

    {
      const width_ = width - height * 0.04
      const height_ = height * 0.25
      const x_ = x + width * 0.05
      const y_ = height * 0.4 + height * 0.02 + list.length * height * 0.06
      const radius_ = height * 0.02

      drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fill()

      ctx.textAlign = 'start'
      ctx.textBaseline = 'top'
      ctx.fillStyle = `rgba(255, 255, 255, 1)`

      drawMultilineText({ x: x_ + height * 0.04, y: y_ + height * 0.02, width: width_ - height * 0.08, wrapSpace: height * 0.021, text: explore.description })

      if (this.extra) {
        this.extra.forEach((i, index) => {
          var width__ = height * 0.12
          var height__ = height * 0.04
          var radius__ = height__ / 2
          var x__ = (windowWidth - width__) / 2
          var y__ = y_ + height_ + height * 0.02

          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          const maxIndex = this.extra.length
          const centerIndex = maxIndex / 2 - 0.5
          const diff = (index - centerIndex) * (width__ + height * 0.02)

          x__ = x__ + diff

          drawRectAngle({ x: x__, y: y__, width: width__, height: height__, radius: radius__ })
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.fill()
          ctx.fillStyle = 'rgba(0, 0, 0, 1)'
          ctx.fillText(i.name, x__ + width__ / 2, y__ + height__ / 2)

          window.Imitation.state.function.event('touchstart', () => i.event(), { ifTouchCover: { x: x__, y: y__, width: width__, height: height__ }, stop: true })
        })
      }
    }
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    ctx.save()

    ctx.globalAlpha = this.novaTime

    this.drawImage()
    this.drawContent()

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.close)
  }
}

class ShopInPreview {
  constructor() {
    this.x = 0
    this.y = safeTop
    this.width = windowWidth
    this.height = windowHeight - safeTop

    this.skillIndex = 0
    this.novaTime = 0

    this.shop
    this.close
    this.extra
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawImage() {
    const { x, y, width, height } = this.option
    const shop = this.shop

    drawImageFullHeight(shop.imageDOM, { x: x, y: y, width: width, height: height * 0.4 })
  }

  drawContent() {
    const { x, y, width, height } = this.option
    const shop = this.shop

    ctx.font = `900 ${height * 0.014}px ${window.fontFamily}`

    const list = [
      'SHOP 礼盒',
      shop.name,
      [shop.money.name, ':', '售价', shop.money.number, '/', '拥有', window.Imitation.state.info.money.find(i => i.key === shop.money.key).number].join(' '),
    ]

    list.forEach((i, index) => {
      const width_ = width - width * 0.1
      const height_ = height * 0.04
      const x_ = x + width * 0.05
      const y_ = height * 0.4 + height * 0.02 + index * height * 0.06
      const radius_ = height_ / 2

      drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fill()

      ctx.textAlign = 'start'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = `rgba(255, 255, 255, 1)`

      ctx.fillText(i, x_ + height_, y_ + height_ / 2)
    })

    {
      const width_ = width - height * 0.04
      const height_ = height * 0.25
      const x_ = x + width * 0.05
      const y_ = height * 0.4 + height * 0.02 + list.length * height * 0.06
      const radius_ = height * 0.02

      drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fill()

      ctx.textAlign = 'start'
      ctx.textBaseline = 'top'
      ctx.fillStyle = `rgba(255, 255, 255, 1)`

      drawMultilineText({ x: x_ + height * 0.04, y: y_ + height * 0.02, width: width_ - height * 0.08, wrapSpace: height * 0.021, text: shop.description })

      if (this.extra) {
        this.extra.forEach((i, index) => {
          var width__ = height * 0.12
          var height__ = height * 0.04
          var radius__ = height__ / 2
          var x__ = (windowWidth - width__) / 2
          var y__ = y_ + height_ + height * 0.02

          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          const maxIndex = this.extra.length
          const centerIndex = maxIndex / 2 - 0.5
          const diff = (index - centerIndex) * (width__ + height * 0.02)

          x__ = x__ + diff

          drawRectAngle({ x: x__, y: y__, width: width__, height: height__, radius: radius__ })
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.fill()
          ctx.fillStyle = 'rgba(0, 0, 0, 1)'
          ctx.fillText(i.name, x__ + width__ / 2, y__ + height__ / 2)

          window.Imitation.state.function.event('touchstart', () => i.event(), { ifTouchCover: { x: x__, y: y__, width: width__, height: height__ }, stop: true })
        })
      }
    }
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    ctx.save()

    ctx.globalAlpha = this.novaTime

    this.drawImage()
    this.drawContent()

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.close)
  }
}

class CardInPreview {
  constructor() {
    this.x = 0
    this.y = safeTop
    this.width = windowWidth
    this.height = windowHeight - safeTop

    this.skillIndex = 0
    this.novaTime = 0

    this.card
    this.close
    this.extra
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawImage() {
    const { x, y, width, height } = this.option
    const card = this.card

    drawImageFullHeight(card.imageDOM, { x: x, y: y, width: width, height: height * 0.4 })
  }

  drawContent() {
    const { x, y, width, height } = this.option
    const card = this.card

    ctx.font = `900 ${height * 0.014}px ${window.fontFamily}`

    const list = [
      'CARD 卡牌',
      [card.name, levelText(card.level), `${card.exp / Math.pow(2, card.level - 1)}%`].join(' '),
      [card.race, '·', card.type].join(' '),
    ]

    list.forEach((i, index) => {
      const width_ = width - width * 0.1
      const height_ = height * 0.04
      const x_ = x + width * 0.05
      const y_ = height * 0.4 + height * 0.02 + index * height * 0.06
      const radius_ = height_ / 2

      drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fill()

      ctx.textAlign = 'start'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = `rgba(255, 255, 255, 1)`

      ctx.fillText(i, x_ + height_, y_ + height_ / 2)
    })

    {
      const width_ = width - height * 0.04
      const height_ = height * 0.25
      const x_ = x + width * 0.05
      const y_ = height * 0.4 + height * 0.02 + list.length * height * 0.06
      const radius_ = height * 0.02

      drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fill()

      ctx.textAlign = 'start'
      ctx.textBaseline = 'top'
      ctx.fillStyle = `rgba(255, 255, 255, 1)`

      drawMultilineText({ x: x_ + height * 0.04, y: y_ + height * 0.02, width: width_ - height * 0.08, wrapSpace: height * 0.021, text: card.description(card.level) })

      if (this.extra) {
        this.extra.forEach((i, index) => {
          var width__ = height * 0.12
          var height__ = height * 0.04
          var radius__ = height__ / 2
          var x__ = (windowWidth - width__) / 2
          var y__ = y_ + height_ + height * 0.02

          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          const maxIndex = this.extra.length
          const centerIndex = maxIndex / 2 - 0.5
          const diff = (index - centerIndex) * (width__ + height * 0.02)

          x__ = x__ + diff

          drawRectAngle({ x: x__, y: y__, width: width__, height: height__, radius: radius__ })
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.fill()
          ctx.fillStyle = 'rgba(0, 0, 0, 1)'
          ctx.fillText(i.name, x__ + width__ / 2, y__ + height__ / 2)

          window.Imitation.state.function.event('touchstart', () => i.event(), { ifTouchCover: { x: x__, y: y__, width: width__, height: height__ }, stop: true })
        })
      }
    }
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    ctx.save()

    ctx.globalAlpha = this.novaTime

    this.drawImage()
    this.drawContent()

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.close)
  }
}

class MasterInPreview {
  constructor() {
    this.x = 0
    this.y = safeTop
    this.width = windowWidth
    this.height = windowHeight - safeTop

    this.skillIndex = 0
    this.novaTime = 0

    this.master
    this.close
    this.extra
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawImage() {
    const { x, y, width, height } = this.option
    const master = this.master

    drawImageFullHeight(master.imageDOM, { x: x, y: y, width: width, height: height * 0.4 })
  }

  drawContent() {
    const { x, y, width, height } = this.option
    const master = this.master
    const skillIndex = this.skillIndex

    ctx.font = `900 ${height * 0.014}px ${window.fontFamily}`

    const list = [
      'MASTER 队长',
      [master.name, levelText(master.level), `${master.exp / Math.pow(2, master.level - 1)}%`].join(' '),
      ['HP', master.HP].join(' '),
      ['ATTACT', master.ATTACT].join(' '),
    ]

    list.forEach((i, index) => {
      const width_ = width - width * 0.1
      const height_ = height * 0.04
      const x_ = x + width * 0.05
      const y_ = height * 0.4 + height * 0.02 + index * height * 0.06
      const radius_ = height_ / 2

      drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fill()

      ctx.textAlign = 'start'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = `rgba(255, 255, 255, 1)`

      ctx.fillText(i, x_ + height_, y_ + height_ / 2)
    })

    {
      const width_ = width - width * 0.1
      const height_ = height * 0.25
      const x_ = x + width * 0.05
      const y_ = height * 0.4 + height * 0.02 + list.length * height * 0.06
      const radius_ = height * 0.02

      drawRectAngle({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fill()

      ctx.textAlign = 'start'
      ctx.textBaseline = 'top'
      ctx.fillStyle = `rgba(255, 255, 255, 1)`

      drawMultilineText({ x: x_ + height * 0.04, y: y_ + height * 0.02, width: width_ - height * 0.08, wrapSpace: height * 0.021, text: master.skill[this.skillIndex].description(master.level) })

      master.skill.forEach((i, index) => {
        var width__ = height * 0.12
        var height__ = height * 0.04
        var radius__ = height__ / 2
        var x__ = (windowWidth - width__) / 2
        var y__ = y_ + height_ - height__ - 12

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const maxIndex = master.skill.length
        const centerIndex = maxIndex / 2 - 0.5
        const diff = (index - centerIndex) * (width__ + height * 0.02)

        x__ = x__ + diff

        drawRectAngle({ x: x__, y: y__, width: width__, height: height__, radius: radius__ })
        ctx.fillStyle = index === skillIndex ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
        ctx.fill()
        ctx.fillStyle = index === skillIndex ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'
        ctx.fillText(i.name, x__ + width__ / 2, y__ + height__ / 2)

        window.Imitation.state.function.event('touchstart', () => this.skillIndex = index, { ifTouchCover: { x: x__, y: y__, width: width__, height: height__ }, stop: true })
      })

      if (this.extra) {
        this.extra.forEach((i, index) => {
          var width__ = height * 0.12
          var height__ = height * 0.04
          var radius__ = height__ / 2
          var x__ = (windowWidth - width__) / 2
          var y__ = y_ + height_ + height * 0.02

          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'

          const maxIndex = this.extra.length
          const centerIndex = maxIndex / 2 - 0.5
          const diff = (index - centerIndex) * (width__ + height * 0.02)

          x__ = x__ + diff

          drawRectAngle({ x: x__, y: y__, width: width__, height: height__, radius: radius__ })
          ctx.fillStyle = 'rgba(255, 255, 255, 1)'
          ctx.fill()
          ctx.fillStyle = 'rgba(0, 0, 0, 1)'
          ctx.fillText(i.name, x__ + width__ / 2, y__ + height__ / 2)

          window.Imitation.state.function.event('touchstart', () => i.event(), { ifTouchCover: { x: x__, y: y__, width: width__, height: height__ }, stop: true })
        })
      }
    }
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    ctx.save()

    ctx.globalAlpha = this.novaTime

    this.drawImage()
    this.drawContent()

    ctx.restore()

    window.Imitation.state.function.event('touchstart', this.close)
  }
}

export { CardEmpty, CardInPve, MoneyInList, ExploreInList, ShopInList, CardInList, MasterInList, ExploreInPreview, ShopInPreview, CardInPreview, MasterInPreview }