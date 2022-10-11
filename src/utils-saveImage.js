import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard } from './utils-common'
import { drawText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { origin as originCard } from '../source/card'

const ctx = canvas.getContext('2d')

const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class SaveImage {
  constructor() {
    window.SaveImage = () => {
      const a = document.createElement("a")
      a.href = canvas.toDataURL()
      a.download = 'image'
      a.click()
    }
  }

  render() {
    const x = 0
    const y = 0
    const width = windowWidth
    const height = windowHeight
    const card = originCard[0]

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(createImage(card.image), { x: x, y: y, width: width, height: height })

    ctx.fillStyle = `rgba(255, 255, 255, 1)`

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = `bold ${width * 0.075}px monospace`

    ctx.fillText(card.name, x + width / 2, y + width * 0.12)

    if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

    ctx.textAlign = 'start'

    ctx.fillText(`${card.race} · ${card.type}`, x + width * 0.08, y + width * 0.48)

    drawText({ x: x + width * 0.08, y: y + width * 0.60, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })

  }
}

export { SaveImage }