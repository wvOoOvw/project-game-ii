import { parseCard, parseMaster, parseMoney, symbolNumber, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText, drawFullColor } from './utils-canvas'
import { FadeCreator } from './utils-ui'

import { originMoney, originMaster, originCard, originExplore, originShop, sourceIoad } from './source'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

class Page {
  constructor() {
    this.width = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.height = Math.min(Canvas.width * 0.75, Canvas.maxWidth * 0.75)
    this.x = (Canvas.width - this.width) * 0.5
    this.y = (Canvas.height - this.height) * 0.5

    this.mouseDownPosition = null

    this.rotateNumber = 0
    this.loadingNumber = 0

    this.randomColor = Math.random() * 3

    if (this.randomColor < 1) {
      this.randomColor = 'rgba(40, 90, 90, 1)'
    }
    if (this.randomColor < 2) {
      this.randomColor = 'rgba(90, 40, 90, 1)'
    }
    if (this.randomColor < 3) {
      this.randomColor = 'rgba(90, 90, 40, 1)'
    }
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  get minDiff() {
    return 0.2
  }

  get maxRotateNumber() {
    return this.width / 4
  }

  eventDown(e) {
    try {
      this.mouseDownPosition = [e.x || e.touches[0].clientX, e.y || e.touches[0].clientY]
      this.touchStart()
    } catch { }
  }

  eventUp(e) {
    const event = () => {
      Imitation.state.page.current = 'pve'
    }

    if (Math.abs(this.rotateNumber) === this.maxRotateNumber) event()

    this.mouseDownPosition = null
  }

  eventMove(e) {
    if (!this.mouseDownPosition) return

    const changeX = (e.pageX || e.targetTouches[0].pageX) - this.mouseDownPosition[0]
    const changeY = (e.pageY || e.targetTouches[0].pageY) - this.mouseDownPosition[1]
    this.mouseDownPosition = [this.mouseDownPosition[0] + changeX, this.mouseDownPosition[1] + changeY]

    const result = this.rotateNumber + changeX

    this.rotateNumber = result

    if (result > this.maxRotateNumber) this.rotateNumber = this.maxRotateNumber
    if (result < -this.maxRotateNumber) this.rotateNumber = -this.maxRotateNumber
  }

  async init() {
    await Promise.all([
      Sound.load(),
      Picture.load(),
      Animation.load()
    ])

    sourceIoad()

    this.loading = false
  }

  render() {
    if (Imitation.state.loading) {
      this.loadingNumber = this.loadingNumber + 1

      const base = 240
      const unit = base / 4
      const abs = this.loadingNumber % base

      if (abs <= unit) {
        this.rotateNumber = abs
      }
      if (abs > unit && abs <= unit * 3) {
        this.rotateNumber = unit * 2 - abs
      }
      if (abs > unit * 3 && abs <= unit * 4) {
        this.rotateNumber = abs - unit * 4
      }

      this.rotateNumber = this.rotateNumber * (this.maxRotateNumber / unit)
    }

    if (!Imitation.state.loading) {
      if (this.rotateNumber !== 0 && !this.mouseDownPosition) {
        const time = 16

        if (this.rotateNumber < 0) {
          this.rotateNumber = this.rotateNumber / time < -this.minDiff / time ? this.rotateNumber - this.rotateNumber / time : 0
        }
        if (this.rotateNumber > 0) {
          this.rotateNumber = this.rotateNumber / time > this.minDiff / time ? this.rotateNumber - this.rotateNumber / time : 0
        }
      }

      Event.addEventListener('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
      Event.addEventListener('touchmove', this.eventMove.bind(this))
      Event.addEventListener('touchend', this.eventUp.bind(this))
    }

    drawFullColor('rgba(0, 0, 0, 1)')

    const { x, y, width, height } = this.option

    Canvas.ctx.save()

    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.fillStyle = this.randomColor
    Canvas.ctx.fill()

    Canvas.ctx.globalAlpha = 1

    Canvas.ctx.translate(x + width * 0.5, y + height * 0.5)
    Canvas.ctx.rotate(this.rotateNumber / 200)
    Canvas.ctx.translate(-(x + width * 0.5), -(y + height * 0.5))

    drawRectRadius({ ...this.option, radius: 8 })

    Canvas.ctx.clip()

    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fill()

    Canvas.ctx.globalAlpha = Math.min((this.maxRotateNumber - Math.abs(this.rotateNumber)) / this.maxRotateNumber, 1)

    Canvas.ctx.textAlign = 'center'
    Canvas.ctx.textBaseline = 'middle'
    Canvas.ctx.font = `900 ${width * 0.05}px Courier`
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    Canvas.ctx.fillText('魔女的冒险 污秽篇', this.x + this.width * 0.5, this.y + this.height * 0.4)
    if (Imitation.state.loading) {
      Canvas.ctx.fillText('加载资源中', this.x + this.width * 0.5, this.y + this.height * 0.6)
    }
    if (!Imitation.state.loading) {
      Canvas.ctx.fillText('滑动 开始游戏', this.x + this.width * 0.5, this.y + this.height * 0.6)
    }

    drawRectRadius({ x: x + width * 0.1, y: y + height * 0.5 - 1, width: width * 0.8, height: 2, radius: 2 })
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    Canvas.ctx.fill()

    Canvas.ctx.globalAlpha = Math.min(Math.abs(this.rotateNumber) / this.maxRotateNumber, 1)

    drawImageFullHeight(Picture.get('home'), this.option)

    Canvas.ctx.restore()
  }
}

export default FadeCreator(Page)