import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawMultilineText } from './utils-canvas'
import { UI, Click } from './utils-ui'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

const _drawInTeam = (option, inTeam) => {
  const { x, y, width, height } = option

  const width_ = height * 0.075
  const height_ = height * 0.075
  const x_ = x + height * 0.05
  const y_ = y + height * 0.05
  const radius_ = height_ / 2

  Canvas.ctx.textAlign = 'center'
  Canvas.ctx.textBaseline = 'middle'
  Canvas.ctx.font = `900 ${width * 0.04}px Courier`

  drawRectRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
  Canvas.ctx.fillStyle = inTeam ? `rgba(0, 0, 0, 0.75)` : `rgba(255, 255, 255, 0.75)`
  Canvas.ctx.fill()
}

const _drawListBackground = (option) => {
  const { x, y, width, height } = option

  drawRectRadius({ x, y, width, height, radius: 8 })

  Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
  Canvas.ctx.fill()
}

const _drawListImage = (option, imageDOM) => {
  const { x, y, width, height } = option

  drawImage(imageDOM, { x: x, y: y, width: width, height: height })
}

const _drawListName = (option, text) => {
  const { x, y, width, height } = option

  const width_ = width * 0.35
  const height_ = height * 0.2
  const x_ = x + width - width_ - height * 0.1
  const y_ = y + height - height_ - height * 0.1
  const radius_ = height * 0.025

  drawRectRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

  Canvas.ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

  Canvas.ctx.fill()

  Canvas.ctx.textAlign = 'center'
  Canvas.ctx.textBaseline = 'middle'
  Canvas.ctx.font = `900 ${height * 0.07}px Courier`
  Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'

  Canvas.ctx.fillText(text, x_ + width_ / 2, y_ + height_ / 2)
}

const _drawPreviewImage = (option, imageDOM) => {
  const { x, y, width, height } = option

  drawImageFullHeight(imageDOM, { x: x, y: y + height * 0.025, width: width, height: height * 0.35 })
}

const _drawPreviewContent = (option, singleText, multilineText, skill, extra) => {
  const { x, y, width, height } = option

  Canvas.ctx.font = `900 ${height * 0.014}px Courier`

  const list = singleText

  list.forEach((i, index) => {
    const width_ = width - width * 0.1
    const height_ = height * 0.04
    const x_ = x + width * 0.05
    const y_ = height * 0.4 + height * 0.02 + index * height * 0.06
    const radius_ = 4

    drawRectRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    Canvas.ctx.fillStyle = `rgba(255, 255, 255, 1)`
    Canvas.ctx.fill()

    Canvas.ctx.textAlign = 'start'
    Canvas.ctx.textBaseline = 'middle'
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    Canvas.ctx.fillText(i, x_ + height_ / 2, y_ + height_ / 2)
  })

  {
    const width_ = width - width * 0.1
    const height_ = height * (1 - 0.44 - list.length * 0.06 - (extra ? 0.06 : 0))
    const x_ = x + width * 0.05
    const y_ = height * 0.4 + height * 0.02 + list.length * height * 0.06
    const radius_ = 8

    drawRectRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    Canvas.ctx.fillStyle = `rgba(255, 255, 255, 1)`
    Canvas.ctx.fill()

    Canvas.ctx.textAlign = 'start'
    Canvas.ctx.textBaseline = 'top'
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    drawMultilineText({ x: x_ + height * 0.02, y: y_ + height * 0.02, width: width_ - height * 0.04, wrapSpace: height * 0.021, text: multilineText })

    if (skill) {
      skill.forEach((i, index) => {
        var width__ = height * 0.12
        var height__ = height * 0.04
        var x__ = (Canvas.width - width__) / 2
        var y__ = y_ + height_ - height__ - 12
        var radius__ = 4

        Canvas.ctx.textAlign = 'center'
        Canvas.ctx.textBaseline = 'middle'

        const maxIndex = skill.length
        const centerIndex = maxIndex / 2 - 0.5
        const diff = (index - centerIndex) * (width__ + height * 0.02)

        x__ = x__ + diff

        drawRectRadius({ x: x__, y: y__, width: width__, height: height__, radius: radius__ })
        Canvas.ctx.fillStyle = i.active ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'
        Canvas.ctx.fill()
        Canvas.ctx.fillStyle = i.active ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)'
        Canvas.ctx.fillText(i.name, x__ + width__ / 2, y__ + height__ / 2)

        Event.addEventListener('touchstart', i.click, { ifTouchCover: { x: x__, y: y__, width: width__, height: height__ }, stop: true })
      })
    }

    if (extra) {
      extra.forEach((i, index) => {
        var width__ = height * 0.12
        var height__ = height * 0.04
        var radius__ = 4
        var x__ = (Canvas.width - width__) / 2
        var y__ = y_ + height_ + height * 0.02

        Canvas.ctx.textAlign = 'center'
        Canvas.ctx.textBaseline = 'middle'

        const maxIndex = extra.length
        const centerIndex = maxIndex / 2 - 0.5
        const diff = (index - centerIndex) * (width__ + height * 0.02)

        x__ = x__ + diff

        drawRectRadius({ x: x__, y: y__, width: width__, height: height__, radius: radius__ })
        Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        Canvas.ctx.fill()
        Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
        Canvas.ctx.fillText(i.name, x__ + width__ / 2, y__ + height__ / 2)

        Event.addEventListener('touchstart', () => i.event(), { ifTouchCover: { x: x__, y: y__, width: width__, height: height__ }, stop: true })
      })
    }
  }
}

class CardEmpty extends UI {
  constructor(props) {
    super(props)
    this.card = props.card

    this.novaTime = 0
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option

    Canvas.ctx.save()

    Canvas.ctx.globalAlpha = this.novaTime

    drawRectRadius({ x, y, width, height, radius: 8 })

    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    Canvas.ctx.fill()

    Canvas.ctx.restore()
  }
}


class CardInPveMessage extends UI {
  constructor(props) {
    super(props)

    this.card

    this.nova = false
    this.novaTime = 0
    this.novaOverTime = 0
  }

  play(card) {
    this.card = card
    this.nova = true
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

    Canvas.ctx.save()

    Canvas.ctx.globalAlpha = this.novaTime

    drawRect({ x: 0, y: 0, width: Canvas.width, height: Canvas.height })
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
    Canvas.ctx.fill()

    drawImageFullHeight(this.card.imageDOM, { x: 0, y: (Canvas.height - Canvas.width) / 2, width: Canvas.width, height: Canvas.width })

    Canvas.ctx.restore()
  }
}

class CardInPve extends UI {
  constructor(props) {
    super(props)

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

    Canvas.ctx.save()

    Canvas.ctx.translate(x + width / 2, y + height / 2)
    Canvas.ctx.scale(this.mouseDownPositionTime + 1, this.mouseDownPositionTime + 1)
    Canvas.ctx.translate(-(x + width / 2), -(y + height / 2))

    Canvas.ctx.globalAlpha = this.novaTime

    drawRectRadius({ x, y, width, height, radius: 8 })

    Canvas.ctx.fillStyle = this.color[0]
    Canvas.ctx.fill()

    drawImageFullHeight(this.card.imageDOM, this.option)

    Canvas.ctx.restore()

    Event.addEventListener('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    Event.addEventListener('touchmove', this.eventMove.bind(this))
    Event.addEventListener('touchend', this.eventUp.bind(this))
  }
}


class MoneyInList extends UI {
  constructor(props) {
    super(props)

    this.InstanceClick = new Click(props)

    this.money = props.money
    this.novaTime = 0
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    Canvas.ctx.save()

    _drawListBackground(this.option)

    Canvas.ctx.clip()

    Canvas.ctx.globalAlpha = this.novaTime

    _drawListImage(this.option, this.money.imageDOM)
    _drawListName(this.option, this.money.name)

    Canvas.ctx.restore()

    this.InstanceClick.addEventListener(this.option)
  }
}

class ExploreInList extends UI {
  constructor(props) {
    super(props)

    this.InstanceClick = new Click(props)

    this.explore = props.explore
    this.novaTime = 0
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    Canvas.ctx.save()

    _drawListBackground(this.option)

    Canvas.ctx.clip()

    Canvas.ctx.globalAlpha = this.novaTime

    _drawListImage(this.option, this.explore.imageDOM)
    _drawListName(this.option, this.explore.name)

    Canvas.ctx.restore()

    this.InstanceClick.addEventListener(this.option)
  }
}

class ShopInList extends UI {
  constructor(props) {
    super(props)

    this.InstanceClick = new Click(props)

    this.shop = props.shop
    this.novaTime = 0
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    Canvas.ctx.save()

    _drawListBackground(this.option)

    Canvas.ctx.clip()

    Canvas.ctx.globalAlpha = this.novaTime

    _drawListImage(this.option, this.shop.imageDOM)
    _drawListName(this.option, this.shop.name)

    Canvas.ctx.restore()

    this.InstanceClick.addEventListener(this.option)
  }
}

class CardInList extends UI {
  constructor(props) {
    super(props)

    this.InstanceClick = new Click(props)

    this.novaTime = 0
    this.card = props.card
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    Canvas.ctx.save()

    _drawListBackground(this.option)

    Canvas.ctx.clip()

    Canvas.ctx.globalAlpha = this.novaTime

    _drawListImage(this.option, this.card.imageDOM)
    _drawInTeam(this.option, this.card.inTeam)

    Canvas.ctx.restore()

    this.InstanceClick.addEventListener(this.option)
  }
}

class MasterInList extends UI {
  constructor(props) {
    super(props)

    this.InstanceClick = new Click(props)

    this.novaTime = 0
    this.master = props.master
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    Canvas.ctx.save()

    _drawListBackground(this.option)

    Canvas.ctx.clip()

    Canvas.ctx.globalAlpha = this.novaTime

    _drawListImage(this.option, this.master.imageDOM)
    _drawInTeam(this.option, this.master.inTeam)

    Canvas.ctx.restore()

    this.InstanceClick.addEventListener(this.option)
  }
}


class ExploreInPreview extends UI {
  constructor(props) {
    super(props)

    this.x = 0
    this.y = 0
    this.width = Canvas.width
    this.height = Canvas.height

    this.skillIndex = 0
    this.novaTime = 0

    this.explore
    this.close
    this.extra
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    Canvas.ctx.save()

    Canvas.ctx.globalAlpha = this.novaTime

    _drawPreviewImage(this.option, this.explore.imageDOM)

    const singleText = [
      ['名称: ', this.explore.name].join(' '),
      ['难度: ', this.explore.difficulty].join(' '),
    ]
    const multilineText = this.explore.description

    _drawPreviewContent(this.option, singleText, multilineText, undefined, this.extra)

    Canvas.ctx.restore()

    Event.addEventListener('touchstart', this.close)
  }
}

class ShopInPreview extends UI {
  constructor(props) {
    super(props)

    this.x = 0
    this.y = 0
    this.width = Canvas.width
    this.height = Canvas.height

    this.skillIndex = 0
    this.novaTime = 0

    this.shop
    this.close
    this.extra
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    Canvas.ctx.save()

    Canvas.ctx.globalAlpha = this.novaTime

    _drawPreviewImage(this.option, this.shop.imageDOM)

    const singleText = [
      ['名称: ', this.shop.name].join(' '),
      ['货币: ', this.shop.money.name].join(' '),
      ['售价: ', this.shop.money.number, '/', '拥有', Imitation.state.info.money.find(i => i.key === this.shop.money.key).number].join(' '),
    ]
    const multilineText = this.shop.description

    _drawPreviewContent(this.option, singleText, multilineText, undefined, this.extra)

    Canvas.ctx.restore()

    Event.addEventListener('touchstart', this.close)
  }
}

class CardInPreview extends UI {
  constructor(props) {
    super(props)

    this.x = 0
    this.y = 0
    this.width = Canvas.width
    this.height = Canvas.height

    this.skillIndex = 0
    this.novaTime = 0

    this.card
    this.close
    this.extra
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    Canvas.ctx.save()

    Canvas.ctx.globalAlpha = this.novaTime

    _drawPreviewImage(this.option, this.card.imageDOM)

    const singleText = [
      ['名称: ', this.card.name].join(' '),
      ['等级: ', levelText(this.card.level)].join(' '),
      ['经验: ', `${this.card.exp} / ${Math.pow(2, this.card.level - 1) * 100}`].join(' '),
      ['种族: ', this.card.race.replaceAll(' ', '/')].join(' '),
      ['类型: ', this.card.type.replaceAll(' ', '/')].join(' '),
    ]
    const multilineText = this.card.description(this.card.level)

    _drawPreviewContent(this.option, singleText, multilineText, undefined, this.extra)

    Canvas.ctx.restore()

    Event.addEventListener('touchstart', this.close)
  }
}

class MasterInPreview extends UI {
  constructor(props) {
    super(props)

    this.x = 0
    this.y = 0
    this.width = Canvas.width
    this.height = Canvas.height

    this.skillIndex = 0
    this.novaTime = 0

    this.master
    this.close
    this.extra
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    Canvas.ctx.save()

    Canvas.ctx.globalAlpha = this.novaTime

    _drawPreviewImage(this.option, this.master.imageDOM)

    const singleText = [
      ['名称: ', this.master.name].join(' '),
      ['等级: ', levelText(this.master.level)].join(' '),
      ['经验: ', `${this.master.exp} / ${Math.pow(2, this.master.level - 1) * 100}`].join(' '),
      ['HP: ', this.master.HP].join(' '),
      ['ATTACT: ', this.master.ATTACT].join(' '),
    ]

    const multilineText = this.master.skill[this.skillIndex].description(this.master.level)

    const skill = this.master.skill.map((i, index) => {
      return {
        ...i,
        click: () => this.skillIndex = index,
        active: this.skillIndex === index
      }
    })

    _drawPreviewContent(this.option, singleText, multilineText, skill, this.extra)

    Canvas.ctx.restore()

    Event.addEventListener('touchstart', this.close)
  }
}


export { CardEmpty, CardInPve, CardInPveMessage, MoneyInList, ExploreInList, ShopInList, CardInList, MasterInList, ExploreInPreview, ShopInPreview, CardInPreview, MasterInPreview }