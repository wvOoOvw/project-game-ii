import { drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

class Button {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.radius = props.radius
    this.font = props.font
    this.fillStyle = props.fillStyle
    this.text = props.text
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  render() {
    ctx.save()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = this.font
    ctx.fillStyle = this.fillStyle[0]

    drawRadius({ x: this.x, y: this.y, width: this.width, height: this.height, radius: this.radius })

    ctx.fill()

    ctx.fillStyle = this.fillStyle[1]

    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2)

    ctx.restore()
  }
}

export { Button }