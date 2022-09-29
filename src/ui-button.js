import { UI } from './ui'
import { drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

class Button extends UI {
  constructor(props) {
    super(props)
    this.radius = props.radius || 8
    this.text = props.text
    this.font = props.font || 14
    this.lineWidth = props.lineWidth || 1
    this.fillStyle = props.fillStyle || 'white'
    this.strokeStyle = props.strokeStyle || 'white'
  }

  render() {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${this.font}px monospace`
    ctx.lineWidth = this.lineWidth
    ctx.strokeStyle = this.strokeStyle
    ctx.fillStyle = this.fillStyle

    drawRadius({ x: this.resultX, y: this.resultY, width: this.width, height: this.height, radius: this.radius })

    ctx.stroke()

    ctx.fillText(this.text, this.resultX + this.width / 2, this.resultY + this.height / 2)
  }
}

export { Button }