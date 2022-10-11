import { drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

class Button {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.radius = props.radius || 8
    this.font = props.font || 14
    this.opacity = props.opacity || 1
    this.text = props.text
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  render() {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${this.font}px monospace`
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`

    drawRadius({ x: this.x, y: this.y, width: this.width, height: this.height, radius: this.radius })

    ctx.fill()

    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2)
  }
}

export { Button }