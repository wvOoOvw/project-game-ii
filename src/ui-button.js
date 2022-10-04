import { UI } from './ui'
import { drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

class Button extends UI {
  constructor(props) {
    super(props)
    this.radius = props.radius || 8
    this.font = props.font || 14
    this.opacity = props.opacity || 1
    this.text = props.text
  }

  render() {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${this.font}px monospace`
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`

    drawRadius({ x: this.resultX, y: this.resultY, width: this.width, height: this.height, radius: this.radius })

    ctx.fill()

    ctx.fillStyle = 'black'

    ctx.fillText(this.text, this.resultX + this.width / 2, this.resultY + this.height / 2)
  }
}

export { Button }