import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard } from './utils-common'
import { drawText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { originCard, originBoss, originExplore } from './source'

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

    this.card = {
      key: 1,
      name: '燃烧',
      type: '进攻卡',
      race: '火',
      limit: 3,
      image: createImage('https://img2.huashi6.com/images/resource/f196633863275/2022/09/05/13842_52253234441.jpg'),
      description: l => `消耗10MP，造成 ${l * 15 + 100} 伤害，并附加给目标一层灼烧印记。`,
      function: (card, self, opposite, round) => {
        return [
          { type: 'cost-mp', target: 'self', value: -10 },
          { type: 'hit', target: 'opposite', value: -(card.level * 15 + 100) },
          { type: 'buff', target: 'opposite', value: 'fire' }
        ]
      }
    }
  }

  render() {
    const x = 0
    const y = 0
    const width = windowWidth
    const height = windowHeight
    const card = this.card

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(card.image, { x: x, y: y, width: width, height: height })

    ctx.fillStyle = `rgba(255, 255, 255, 1)`

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = `900 ${width * 0.075}px ${window.fontFamily}`

    ctx.fillText(card.name, x + width / 2, y + width * 0.12)

    if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

    ctx.textAlign = 'start'

    ctx.fillText(`${card.race} · ${card.type}`, x + width * 0.08, y + width * 0.48)

    drawText({ x: x + width * 0.08, y: y + width * 0.60, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })

  }
}

export { SaveImage }