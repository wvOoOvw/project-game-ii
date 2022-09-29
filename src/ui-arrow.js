import { UI } from './ui'

const ctx = canvas.getContext('2d')

class Arrow extends UI {
  constructor(option) {
    super(option)
    this.x = option.x
    this.y = option.y
    this.width = option.width
    this.height = option.height
    this.thick = option.thick || 8
    this.lineWidth = option.lineWidth || 1
    this.fillStyle = option.fillStyle || 'black'

    this.direction = option.direction || 'top'
  }

  render() {
    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height
    const thick = this.thick

    if (this.direction === 'top') {
      ctx.beginPath()
      ctx.moveTo(x, y + height)
      ctx.lineTo(x + width / 2, y)
      ctx.lineTo(x + width, y + height)
      ctx.lineTo(x + width / 2, y + thick)
      ctx.lineTo(x, y + height)
      ctx.closePath()
    }

    if (this.direction === 'bottom') {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + width / 2, y + height)
      ctx.lineTo(x + width, y)
      ctx.lineTo(x + width / 2, y + height - thick)
      ctx.lineTo(x, y)
      ctx.closePath()
    }

    ctx.lineWidth = this.lineWidth
    ctx.fillStyle = this.fillStyle

    ctx.fill()
  }
}

export { Arrow }