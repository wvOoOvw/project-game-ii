import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { originCard, originBoss, originExplore } from './source'

const ctx = canvas.getContext('2d')

class SaveImage {
  constructor() {
    this.width = 300
    this.height = 450

    canvas.width = Math.round(this.width * dpr)
    canvas.height = Math.round(this.height * dpr)
    canvas.style.width = this.width + 'px'
    canvas.style.height = this.height + 'px'
    canvas.getContext('2d').scale(dpr, dpr)

    this.cards = originCard

    this.index = 0

    this.stop = false
  }

  saveImage(name) {
    const a = document.createElement("a")
    a.href = canvas.toDataURL()
    a.download = name
    a.click()

    this.index = this.index + 1
    this.stop = false
  }

  render() {
    if (!this.cards[this.index]) return

    const card = this.cards[this.index]

    const x = 0
    const y = 0
    const width = this.width
    const height = this.height

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(card.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.fillStyle = `rgba(255, 255, 255, 1)`

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = `900 ${width * 0.075}px ${window.fontFamily}`

    ctx.fillText(card.name, x + width / 2, y + width * 0.12)

    if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.1, y + width * 0.12)

    ctx.textAlign = 'start'

    ctx.fillText(`${card.race} · ${card.type}`, x + width * 0.08, y + width * 0.48)

    drawMultilineText({ x: x + width * 0.08, y: y + width * 0.60, width: width - width * 0.25, wrapSpace: width * 0.12, text: card.description(1) })

    if (this.stop) return

    setTimeout(() => this.saveImage('card-' + card.key), 1000)

    this.stop = true
  }
}

export { SaveImage }