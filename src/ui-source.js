import { ifTouchCover, ifScreenCover, parseCard, parseMaster, parseMoney, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'
import { drawMultilineText, drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle } from './utils-canvas'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

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
    const radius_ = width * 0.02

    drawRectRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

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

    drawRectRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

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

    drawRectRadius({ x, y, width, height, radius: 8 })

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
    ctx.fillText('EXPLORE 礼盒', x_ + width_ / 2, y_ + height_ / 2)
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
    const explore = this.explore

    ctx.save()

    drawRectRadius({ x, y, width, height, radius: 8 })

    ctx.clip()

    drawImage(explore.imageDOM, { x: x, y: y, width: width, height: height })

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
    const shop = this.shop

    ctx.save()

    drawRectRadius({ x, y, width, height, radius: 8 })

    ctx.clip()

    drawImage(shop.imageDOM, { x: x, y: y, width: width, height: height })

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

  drawTitle() {
    const { x, y, width, height } = this.option
    const card = this.card

    const width_ = width * 0.7
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

    const width_ = width * 0.7
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
    const card = this.card

    ctx.save()

    drawRectRadius({ x, y, width, height, radius: 8 })

    ctx.clip()

    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

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
    const master = this.master

    ctx.save()

    drawRectRadius({ x, y, width, height, radius: 8 })

    ctx.clip()

    drawImage(master.imageDOM, { x: x, y: y, width: width, height: height })

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
      'explore 礼盒',
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
          var height__ = height * 0.035
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
          var height__ = height * 0.035
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
          var height__ = height * 0.035
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
        var height__ = height * 0.035
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
          var height__ = height * 0.035
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

export { MoneyInList, ExploreInList, ShopInList, CardInList, MasterInList, ExploreInPreview, ShopInPreview, CardInPreview, MasterInPreview }