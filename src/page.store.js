import { addEventListener, addEventListenerPure, createImage, ifTouchCover } from './utils.common'
import { drawImage, drawRect, drawRadius } from './utils.canvas'

import { ScrollY } from './ui.scroll'
import { Card } from './ui.card'
import { Button } from './ui.button'

import { parse } from '../source/cards'

import J_205624_78456047248 from '../media/205624_78456047248.jpg'
import J_162926_76690565815 from '../media/162926_76690565815.jpg'
import J_234521_92189037316 from '../media/234521_92189037316.jpg'

const ctx = canvas.getContext('2d')

const backgroundImage = createImage(J_205624_78456047248)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class PageStore {
  constructor() {
    this.preview = null
    this.previewType = null

    this.scroll_I
    this.cards_I
    this.cardss_I
    this.preview_I

    this.instance()
  }

  get cards() {
    return Imitation.state.info.cards
  }

  get cardss() {
    return Imitation.state.info.cardss[Imitation.state.info.cardssIndex]
  }

  get cardsH() {
    const row = Math.ceil(this.cards.length / 4)

    return ((windowWidth - 24 - 12 * 5) / 4 * 1.25) * row + (row ? 12 * (row - 1) : 0)
  }

  get cardssH() {
    const row = Math.ceil(this.cardss.length / 3)

    return ((windowWidth - 24 - 12 * 4) / 3 * 0.175) * row + (row ? 6 * (row - 1) : 0)
  }

  get cardssHH() {
    if (this.cardss.length === 0) return -12

    return this.cardssH + 24
  }

  get scrollOption() {
    return { x: this.scroll_I.x, y: this.scroll_I.y, width: this.scroll_I.width, height: this.scroll_I.height }
  }

  setScrollOptionH() {
    this.scroll_I.max = this.cardsH - this.scroll_I.height + 24
  }

  instance() {
    this.instanceScroll()
    this.instanceCards()
    this.instanceCardss()
    this.instancePreview()
  }

  instanceScroll() {
    const scrollOption = { x: 12, y: 76 + this.cardssHH + safeTop, width: windowWidth - 24, height: windowHeight - 88 - this.cardssHH - safeTop, radius: 12, scrollbarOffset: 4, scrollbarThick: 2, min: 0 }

    this.scroll_I = new ScrollY(scrollOption)

    this.setScrollOptionH()
  }

  instanceCards() {
    const touchEvent = (card) => {
      this.previewType = 'cards'
      this.preview = card
    }

    this.cards_I = this.cards.map((card, index) => {
      card = parse(card)

      card.image = backgroundImage

      const option = {
        width: (windowWidth - 24 - 12 * 5) / 4,
        card: card,
        touchMode: 'click',
        touchArea: this.scrollOption,
        touchEvent: () => touchEvent(card),
        displayMode: 'normal',
        imageMode: 'full',
        imageIns: backgroundImage
      }

      option.height = option.width * 1.25
      option.x = 12 + 12 + (index % 4) * (option.width + 12)
      option.y = 76 + 12 + parseInt(index / 4) * (option.height + 12) + this.cardssHH + safeTop

      return new Card(option)

    })
  }

  instanceCardss() {
    const touchEvent = (card) => {
      this.previewType = 'cardss'
      this.preview = card
    }

    this.cardss_I = this.cardss.map((card, index) => {
      card = parse(card)

      const option = {
        width: (windowWidth - 24 - 12 * 4) / 3,
        card: card,
        touchMode: 'click',
        touchEvent: () => touchEvent(card),
        displayMode: 'line',
        imageMode: 'full',
        imageIns: backgroundImage
      }

      option.height = option.width * 0.175
      option.x = 12 + 12 + (index % 3) * (option.width + 12)
      option.y = 64 + 12 + parseInt(index / 3) * (option.height + 6) + safeTop

      return new Card(option)

    })
  }

  instancePreview() {
    const option = {
      width: windowWidth * 0.7,
      card: this.preview,
      displayMode: 'normal',
      imageMode: 'full',
      imageIns: backgroundImage
    }

    option.height = option.width * 1.5
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 80

    this.preview_I = new Card(option)
  }

  drawButtonHome() {
    const option = { x: 12, y: 12 + safeTop, width: 40, height: 40, radius: 20, text: 'H' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  drawPreview() {
    if (!this.preview) return

    drawRect({ x: 0, y: 0, width: windowWidth, height: windowHeight })

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'

    ctx.fill()

    this.preview_I.card = this.preview

    this.preview_I.render()

    const buttonY = windowHeight - (windowHeight - windowWidth * 0.7 * 1.5) / 2 - 80

    if (this.previewType === 'cards') {
      const option = { x: windowWidth / 2 - 60, y: buttonY + 40, width: 120, height: 40, radius: 8, text: '装载' }

      new Button(option).render()

      const load = () => {
        this.load(this.preview)
        this.preview = null
      }

      addEventListener('touchstart', load, option)

      const option_ = { x: windowWidth / 2 - 60, y: buttonY + 100, width: 120, height: 40, radius: 8, text: '合成' }

      new Button(option_).render()

      const compose = () => {
        this.compose(this.preview)
        this.preview = null
      }

      addEventListener('touchstart', compose, option_)

      const close = (e) => {
        if (ifTouchCover(e, option)) return
        if (ifTouchCover(e, option_)) return
        this.preview = null
      }

      addEventListenerPure('touchstart', close)
    }

    if (this.previewType === 'cardss') {
      const option = { x: windowWidth / 2 - 60, y: buttonY + 40, width: 120, height: 40, radius: 8, text: '卸载' }

      new Button(option).render()

      const unload = () => {
        this.unload(this.preview)
        this.preview = null
      }

      addEventListener('touchstart', unload, option)

      const close = (e) => {
        if (ifTouchCover(e, option)) return
        this.preview = null
      }

      addEventListenerPure('touchstart', close)
    }
  }

  drawScroll() {
    const event = (scrollPosition) => {
      this.drawCards(scrollPosition)
    }

    this.scroll_I.render(event)
  }

  drawCards(scrollPosition) {
    this.cards_I.forEach((card) => {
      card.scrollTop = scrollPosition
      card.touchAble = this.preview ? false : true
      card.render()
    })
  }

  drawCardss(scrollPosition) {
    if (this.cardss.length === 0) return

    const option = { x: 12, y: 64 + safeTop, width: windowWidth - 24, height: this.cardssH + 24, radius: 12 }

    drawRadius(option)

    ctx.fillStyle = 'white'
    ctx.fill()

    this.cardss_I.forEach((card) => {
      card.scrollTop = scrollPosition
      card.touchAble = this.preview ? false : true
      card.render()
    })
  }

  drawCardssSelect() {
    new Array(4).fill().forEach((i, index) => {
      const option = { y: 12 + safeTop, width: 40, height: 40, radius: 20, font: 14, lineWidth: 1, text: index }

      option.x = 12 + 60 + (index % 4) * (option.width + 12)

      if (index === Imitation.state.info.cardssIndex) {
        new Button({ ...option, fillStyle: 'black', strokeStyle: 'black' }).render()
      }

      if (index !== Imitation.state.info.cardssIndex) {
        new Button(option).render()

        if (this.preview) return

        const event = () => {
          Imitation.state.info.cardssIndex = index
          this.instance()
        }

        addEventListener('touchstart', event, option)
      }
    })
  }

  drawBackground() {
    drawImage(backgroundImage, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  compose(card) { }

  load(card) {
    const currentCards = Imitation.state.info.cards
    const currentCardss = Imitation.state.info.cardss[Imitation.state.info.cardssIndex]

    const cardsF = currentCards.filter(i => i.key === card.key && i.level === card.level)
    const cardssF = currentCardss.filter(i => i.key === card.key && i.level === card.level)

    if (cardsF.length === cardssF.length) return

    currentCardss.push({ key: card.key, level: card.level })

    this.instance()
  }

  unload(card) {
    const currentCardss = Imitation.state.info.cardss[Imitation.state.info.cardssIndex]

    const cardssF = currentCardss.find(i => i.key === card.key && i.level === card.level)

    Imitation.state.info.cardss[Imitation.state.info.cardssIndex] = currentCardss.filter(i => i !== cardssF)

    this.instance()
  }

  render() {
    this.drawBackground()
    this.drawButtonHome()
    this.drawCardssSelect()
    this.drawCardss()
    this.drawScroll()
    this.drawPreview()
  }
}

export default PageStore