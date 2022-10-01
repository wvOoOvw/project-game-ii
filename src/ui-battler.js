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
    this.index = props.index

    this.scrollPosition = [0, 0]

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

    var resultX = this.scrollPosition[0] - changeX
    var resultY = this.scrollPosition[1] - changeY

    if (this.scrollX > 0) {
      if (resultX <= 0) resultX = 0
      if (resultX > this.scrollX) resultX = this.scrollX
    }
    if (this.scrollY > 0) {
      if (resultY <= 0) resultY = 0
      if (resultY > this.scrollY) resultY = this.scrollY
    }

    this.scrollPosition = [resultX, resultY]
  }

  render() {
    const x = this.resultX
    const y = this.resultY
    const width = this.width
    const height = this.height
    const battler = this.battler
  }
}

class Battler extends UI {
  constructor(props) {
    super(props)
    this.battler = props.battler
    this.type = props.type

    this.animation = false
  }

  animation(type) {
    this.animation = type
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

    // drawImage(this.imageIns, { x: x + width, y: y + width, width: width, height: height })

    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.font = `bold 14px monospace`

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'

    ctx.fillText(`HP: ${battler.HP}`, x + 12, y + 12)
    ctx.fillText(`MP: ${battler.MP}`, x + 12, y + 24)

    // console.log(battler)

    ctx.restore()
  }
}

export { Battler }