class UI {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height
    this.radius = props.radius

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  get resultX() {
    return this.x + (this.offsetX ? this.offsetX : 0)
  }

  get resultY() {
    return this.y + (this.offsetY ? this.offsetY : 0)
  }
}

export { UI }