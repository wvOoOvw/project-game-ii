import { UI } from './ui'
import { drawImage, drawText, drawRect, drawRadius } from './utils-canvas'
import { addEventListener, addEventListenerPure, ifTouchCover } from './utils-common'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Battler extends UI {
  constructor(props) {
    super(props)
    this.battler = props.battler
    this.imageIns = props.imageIns
  }


  render() {
    const x = this.resultX
    const y = this.resultY
    const width = this.width
    const height = this.height
    const battler = this.battler

    ctx.save()

    drawRadius({ x, y, width, height, radius: 12 })

    ctx.clip()

    drawImage(this.imageIns, { x: x, y: y, width: width, height: height })

    ctx.fillStyle = 'white'
    ctx.font = `bold 12px monospace`

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'

    ctx.fillText(`HP: ${battler.HP}`, x + 12, y + 12)
    ctx.fillText(`MP: ${battler.MP}`, x + 12, y + 30)
    ctx.fillText(`牌库: ${battler.card.store.length}`, x + 12, y + 48)
    ctx.fillText(`手牌: ${battler.card.hand.length}`, x + 12, y + 66)
    ctx.fillText(`墓地: ${battler.card.cemetery.length}`, x + 12, y + 84)

    ctx.restore()
  }
}

export { Battler }