import { drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

class Button {
  constructor(option) {
    this.x = option.x
    this.y = option.y
    this.width = option.width
    this.height = option.height
    this.radius = option.radius || 8
    this.text = option.text || ''
    this.font = option.font || 14
    this.lineWidth = option.lineWidth || 1
    this.fillStyle = option.fillStyle || 'white'
    this.strokeStyle = option.strokeStyle || 'white'
  }

  render() {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${this.font}px monospace`
    ctx.lineWidth = this.lineWidth
    ctx.strokeStyle = this.strokeStyle
    ctx.fillStyle = this.fillStyle

    drawRadius({ x: this.x, y: this.y, width: this.width, height: this.height, radius: this.radius })

    ctx.stroke()

    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2)
  }
}

export { Button }