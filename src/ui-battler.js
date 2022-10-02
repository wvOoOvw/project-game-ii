import { UI } from './ui'
import { drawImage, drawText, drawRect, drawRadius } from './utils-canvas'
import { addEventListener, addEventListenerPure, ifTouchCover } from './utils-common'

const ctx = canvas.getContext('2d')

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Card extends UI {
  constructor(props) {
    super(props)
    this.card = props.card

    this.touchAble = props.touchAble

    this.touchMode = props.touchMode

    this.touchEvent = props.touchEvent

    this.touchDelayTime = props.touchDelayTime

    this.touchArea = props.touchArea

    this.touchTimeout = null

    this.displayMode = props.displayMode
    this.imageMode = props.imageMode

    this.imageIns = props.imageIns

    this.movePosition = [0, 0]

    this.mouseDownPosition = null
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
    } catch { }
  }
  eventUp(e) {
    this.mouseDownPosition = null
  }
  eventMove(e) {
    if (!this.mouseDownPosition) return
    if (this.scrollX <= 0 && this.scrollY <= 0) return

    clearTimeout(this.scrollbarTimeout)
    this.scrollbarTimeout = setTimeout(() => this.scrollbarTimeout = null, 1000)

    const changeX = (e.pageX || e.targetTouches[0].pageX) - this.mouseDownPosition[0]
    const changeY = (e.pageY || e.targetTouches[0].pageY) - this.mouseDownPosition[1]
    this.mouseDownPosition = [this.mouseDownPosition[0] + changeX, this.mouseDownPosition[1] + changeY]

    var resultX = this.movePosition[0] - changeX
    var resultY = this.movePosition[1] - changeY

    if (this.scrollX > 0) {
      if (resultX <= 0) resultX = 0
      if (resultX > this.scrollX) resultX = this.scrollX
    }
    if (this.scrollY > 0) {
      if (resultY <= 0) resultY = 0
      if (resultY > this.scrollY) resultY = this.scrollY
    }

    this.movePosition = [resultX, resultY]
  }

  render() {
    const x = this.resultX
    const y = this.resultY
    const width = this.width
    const height = this.height
    const card = this.card

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(this.imageIns, { x: x + width, y: y + width, width: width, height: height })

    ctx.fillStyle = 'white'

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = `bold ${this.width * 0.075}px monospace`

    if (this.displayMode === 'library') {
      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)

      drawText({ x: x + width * 0.08, y: y + width * 0.48, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })
    }

    if (this.displayMode === 'preview') {
      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)
      ctx.fillText(`${card.attribute} · ${card.type}`, x + width * 0.08, y + width * 0.48)

      drawText({ x: x + width * 0.08, y: y + width * 0.60, text: card.description(1), width: width - width * 0.25, fontHeight: width * 0.12 })
    }

    ctx.restore()

    if (this.touchMode === 'immediate' && this.touchAble) {
      const event = (e) => {
        if (this.touchArea && !ifTouchCover(e, this.touchArea)) return

        this.touchEvent()
      }

      addEventListener('touchstart', event, { x, y, width, height })
    }

    if (this.touchMode === 'delay' && this.touchAble) {
      const event = (e) => {
        if (this.touchArea && !ifTouchCover(e, this.touchArea)) return

        this.touchTimeout = setTimeout(() => this.touchEvent(), this.touchDelayTime)
      }

      addEventListener('touchstart', event, { x, y, width, height })

      const event_ = () => {
        clearTimeout(this.touchTimeout)
      }

      addEventListenerPure('touchmove', event_)
      addEventListenerPure('touchend', event_)
    }

    if (this.touchMode === 'click' && this.touchAble) {
      const event = (e) => {
        if (this.touchArea && !ifTouchCover(e, this.touchArea)) return

        this.touchTimeout = true
      }

      addEventListener('touchstart', event, { x, y, width, height })

      const event_ = () => {
        this.touchTimeout = false
      }

      addEventListenerPure('touchmove', event_)

      const event__ = () => {
        if (this.touchTimeout === true) this.touchEvent()
        this.touchTimeout = false
      }

      addEventListenerPure('touchend', event__)
    }
  }
}

class Battler extends UI {
  constructor(props) {
    super(props)
    this.battler = props.battler
    this.type = props.type

    this.InstanceCard
  }

  instanceCard() {
    this.InstanceCard = this.battler.card.hand.map((i, index) => {

      const option = { width: 120, height: 160 }

      option.x = windowWidth / 2 - option.width / 2
      option.x = this.resultY + this.height - 12

      return new Card({ ...option, ...i })
    })
  }

  cardPosition() {
    this.InstanceCard.forEach((i, index) => {
      const maxIndex = this.InstanceCard.length
      const centerIndex = maxIndex / 2 - 0.5

      const offset = centerIndex - maxIndex
    })
  }

  render() {
    const x = this.resultX
    const y = this.resultY
    const width = this.width
    const height = this.height
    const battler = this.battler

    ctx.save()

    drawRadius({ x, y, width, height, radius: 12 })

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fill()

    ctx.clip()

    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.font = `bold 12px monospace`

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'

    ctx.fillText(`HP: ${battler.HP}`, x + 12, y + 12)
    ctx.fillText(`MP: ${battler.MP}`, x + 12, y + 30)
    ctx.fillText(`牌库: ${battler.card.store.length}`, x + 12, y + 48)
    ctx.fillText(`手牌: ${battler.card.hand.length}`, x + 12, y + 66)
    ctx.fillText(`墓地: ${battler.card.cemetery.length}`, x + 12, y + 84)

    this.InstanceCard.forEach(i => i.render())

    ctx.restore()
  }
}

export { Battler }