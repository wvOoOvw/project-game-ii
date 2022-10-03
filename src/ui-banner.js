import { UI } from './ui'
import { drawImage, drawRadius } from './utils-canvas'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Banner extends UI {
  constructor(props) {
    super(props)
    this.text = props.text
    this.imageIns = props.imageIns
  }

  render() {
    const x = this.resultX
    const y = this.resultY
    const width = this.width
    const height = this.height
    const text = this.text

    ctx.save()

    drawRadius({ x, y, width, height, radius: 12 })

    ctx.clip()

    drawImage(this.imageIns, { x: x, y: y, width: width, height: height })

    ctx.fillStyle = 'white'
    ctx.font = `bold 12px monospace`

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'

    if (typeof text === 'string') {
      ctx.fillText(text, x + 12, y + 12)

    }

    if (typeof text === 'object') {
      text.forEach((i, index) => {
        ctx.fillText(i, x + 12, y + 12 + 18 * index)
      })
    }

    ctx.restore()
  }
}

export { Banner }