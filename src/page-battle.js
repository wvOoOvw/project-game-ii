class PageBattle {
  constructor() {
    this.left = 0
  }

  render() {
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FF0000'
    ctx.fillRect(this.left, 0, 80, 100)
    this.left = this.left + 1
  }

}

export default PageBattle