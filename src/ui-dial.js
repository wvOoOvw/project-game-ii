import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, parseMaster, levelText, numberFix } from './utils-common'
import { drawText, drawImage, drawRect, drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

class Dial {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.menu = props.menu || [
      { name: '主页', x: this.x, event: () => console.log(1) },
      { name: '仓库', x: this.x, event: () => console.log(1) },
      { name: '商店', x: this.x, event: () => console.log(1) },
      { name: '淘金', x: this.x, event: () => console.log(1) },
    ]

    this.current = props.current

    this.expend = false
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawExpend() {
    const { x, y, width, height } = this

    drawRadius({ x, y, width: height, height: height, radius: height / 2 })

    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${height * 0.5}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    ctx.fillText(this.expend ? '-' : '+', x + height / 2, y + height / 2)

    addEventListener('touchstart', () => this.expend = !this.expend, { x, y, width: height, height: height })
  }

  drawMenu() {
    const { x, y, width, height } = this

    this.menu.forEach((i, index) => {
      const x_ = this.expend ? this.x + (index + 1) * (height + 4) : this.x


      if (i.x !== x_) {
        const space = (this.x + (index + 1) * (height + 4)) / 33
        const diff = x_ - i.x

        if (diff > space) i.x = i.x + space
        if (diff <= space && diff >= -space) i.x = x_
        if (diff < -space) i.x = i.x - space
      }

      drawRadius({ x: i.x, y, width: height, height: height, radius: height / 2 })

      ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx.fill()

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 8px ${window.fontFamily}`
      ctx.fillStyle = 'rgba(255, 255, 255, 1)'

      ctx.fillText(i.name, i.x + height / 2, y + height / 2)

      if (!this.expend || i.x !== x_) return

      addEventListener('touchstart', i.event, { x: i.x, y, width: height, height: height })
    })
  }

  render() {
    const { x, y, width, height } = this

    drawRadius({ x, y, width, height, radius: 8 })
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()

    this.drawMenu()
    this.drawExpend()
  }
}

export { Dial }