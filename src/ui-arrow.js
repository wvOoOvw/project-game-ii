import { UI } from './ui'

const ctx = canvas.getContext('2d')

class Arrow extends UI {
  constructor(props) {
    super(props)
    this.thick = props.thick || 8
    this.lineWidth = props.lineWidth || 1
    this.fillStyle = props.fillStyle || 'black'
    this.direction = props.direction || 'top'
  }

  render() {
    const x = this.resultX
    const y = this.resultY
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