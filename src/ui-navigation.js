import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Navigation {
  constructor(props) {
    this.content = props.content

    this.itemWidth = props.itemWidth || 72
    this.itemHeight = props.itemHeight || 30
    this.itemRadius = props.itemRadius || 8
    this.itemBackgroundColor = props.itemBackgroundColor || ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)']
    this.itemTextColor = props.itemTextColor || ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)']
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  get height() {
    return this.content.length * this.itemHeight + (this.content.length - 1) * 12 + 24
  }

  drawBackground() {
    drawRadius({ x: 12, y: windowHeight - this.height - 12, width: windowWidth - 24, height: this.height, radius: 12 })
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fill()
  }

  drawContent() {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 10px ${window.fontFamily}`

    this.content.forEach((row, rowIndex) => {
      const justifyContentIndex = { left: 0, right: 0 }

      row.forEach((item) => {
        var option = {}
        option.y = windowHeight - 36 - this.itemHeight - rowIndex * this.itemHeight - (rowIndex - 1) * 12
        option.width = item.width || this.itemWidth
        option.height = item.height || this.itemHeight
        option.radius = item.radius || this.itemRadius
        option.backgroundColor = item.backgroundColor || this.itemBackgroundColor
        option.textColor = item.textColor || this.itemTextColor

        if (item.justifyContent === 'left') {
          option.x = 24 + justifyContentIndex[item.justifyContent] * (option.width + 12)
        }
        if (item.justifyContent === 'right') {
          option.x = windowWidth - 24 - justifyContentIndex[item.justifyContent] * (option.width + 12) - option.width
        }
        justifyContentIndex[item.justifyContent] = justifyContentIndex[item.justifyContent] + 1

        option.x = item.x || option.x

        option = { ...option, ...item }

        ctx.fillStyle = option.active ? option.backgroundColor[1] : option.backgroundColor[0]

        drawRadius(option)

        ctx.fill()

        ctx.fillStyle = option.active ? option.textColor[1] : option.textColor[0]

        ctx.fillText(option.text, option.x + option.width / 2, option.y + option.height / 2)

        window.Imitation.state.function.event('touchstart', (e) => option.event ? option.event(e) : null, { ifTouchCover: option })
      })
    })
  }

  render() {
    ctx.save()

    this.drawBackground()
    this.drawContent()

    ctx.restore()
  }
}

export { Navigation }