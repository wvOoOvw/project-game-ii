import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Card } from './ui-card'
import { Button } from './ui-button'

import { origin as originCard } from '../source/card'

import J_205624_78456047248 from '../media/205624_78456047248.jpg'
import J_162926_76690565815 from '../media/162926_76690565815.jpg'
import J_234521_92189037316 from '../media/234521_92189037316.jpg'

const ctx = canvas.getContext('2d')

const backgroundImage = createImage(J_205624_78456047248)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

const parseCard = (array, numberFlat) => {
  const result = array.reduce((t, i) => {
    const result_ = [...t]

    const origin = originCard.find(i_ => i.key === i_.key)

    i.value.forEach(i_ => {
      if (numberFlat) {
        const item = { ...origin, ...i_ }
        delete item.number
        result_.push(...new Array(i_.number).fill(item))
      }
      if (!numberFlat) {
        result_.push({ ...origin, ...i_ })
      }
    })

    return result_
  }, [])

  return result
}

class PageStore {
  constructor() {
    this.preview = null

    this.card
    this.team

    this.InstanceScroll
    this.InstanceCard
    this.InstanceTeam
    this.InstancePreview

    this.instance()
  }

  get cardHeight() {
    const row = Math.ceil(this.card.length / 4)

    if (row === 0) return 0

    const real = ((windowWidth - 84) / 4 * 1.25) * row

    const margin = row ? 12 * (row - 1) : 0

    return real + margin + 24
  }

  get teamHeight() {
    const row = Math.ceil(this.team.length / 4)

    if (row === 0) return 0

    const real = ((windowWidth - 66) / 4 * 0.2) * row

    const margin = row ? 6 * (row - 1) : 0

    return real + margin + 24
  }

  get teamSelectHeight() {
    return 60
  }

  get emptyHeight() {
    var r = 0

    if (this.team.length === 0) r = r + 12

    return r
  }

  instance() {
    this.card = parseCard(Imitation.state.info.cardLibrary)
    this.team = parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex], true)

    this.instanceScroll()
    this.instanceCard()
    this.instanceTeam()
    this.instancePreview()
  }

  instanceScroll() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 72 - safeTop, radius: 12 }

    this.InstanceScroll = new Scroll(scrollOption)

    this.InstanceScroll.scrollY = this.teamSelectHeight + this.cardHeight + this.teamHeight - this.emptyHeight - this.InstanceScroll.height + 24
  }

  instanceTeam() {
    this.InstanceTeam = this.team.map((card, index) => {
      const option = {
        width: (windowWidth - 66) / 4,
        card: card,
        touchMode: 'click',
        touchEvent: () => this.preview = card,
        displayMode: 'team',
        imageMode: 'overspread',
        imageIns: backgroundImage,
      }

      option.height = option.width * 0.2
      option.x = 24 + parseInt(index % 4) * (option.width + 6)
      option.y = 84 + parseInt(index / 4) * (option.height + 6) + this.teamSelectHeight + safeTop

      return new Card(option)
    })
  }

  instanceCard() {
    this.InstanceCard = this.card.map((card, index) => {
      card.image = backgroundImage

      const option = {
        width: (windowWidth - 84) / 4,
        card: card,
        touchMode: 'click',
        touchArea: this.InstanceScroll.option,
        touchEvent: () => this.preview = card,
        displayMode: 'library',
        imageMode: 'overspread',
        imageIns: backgroundImage
      }

      option.height = option.width * 1.25
      option.x = 24 + parseInt(index % 4) * (option.width + 12)
      option.y = 96 + parseInt(index / 4) * (option.height + 12) + this.teamSelectHeight + this.teamHeight - this.emptyHeight + safeTop

      return new Card(option)
    })
  }

  instancePreview() {
    const option = {
      width: windowWidth * 0.7,
      card: this.preview,
      displayMode: 'preview',
      imageMode: 'overspread',
      imageIns: backgroundImage
    }

    option.height = option.width * 1.5
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 80

    this.InstancePreview = new Card(option)
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]
      this.drawTeamSelect(offsetY)
      this.drawTeam(offsetY)
      this.drawCard(offsetY)
    }

    this.InstanceScroll.render(event)
  }

  drawTeam(offsetY) {
    if (this.team.length === 0) return

    const option = { x: 12, y: 72 + safeTop + this.teamSelectHeight - offsetY, width: windowWidth - 24, height: this.teamHeight, radius: 12 }

    if (!ifScreenCover(option, this.InstanceScroll.option)) return

    drawRadius(option)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fill()

    this.InstanceTeam.forEach((i) => {
      if (!ifScreenCover({ ...option, y: i.y - offsetY }, this.InstanceScroll.option)) return

      i.offsetY = 0 - offsetY
      i.touchAble = this.preview ? false : true
      i.render()
    })
  }

  drawCard(offsetY) {
    const option = { x: 12, y: 84 + this.teamSelectHeight + this.teamHeight - this.emptyHeight + safeTop - offsetY, width: windowWidth - 24, height: this.cardHeight, radius: 12 }

    if (!ifScreenCover(option, this.InstanceScroll.option)) return

    drawRadius(option)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fill()

    this.InstanceCard.forEach((i) => {
      if (!ifScreenCover({ ...option, y: i.y - offsetY }, this.InstanceScroll.option)) return

      i.offsetY = 0 - offsetY
      i.touchAble = this.preview ? false : true
      i.render()
    })
  }

  drawTeamSelect(offsetY) {
    const option = { x: 12, y: 60 - offsetY + safeTop, width: windowWidth - 24, height: this.teamSelectHeight, radius: 12 }

    if (!ifScreenCover(option, this.InstanceScroll.option)) return

    drawRadius(option)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fill()

    new Array(4).fill().forEach((i, index) => {
      const option = { y: 72 - offsetY + safeTop, width: 36, height: 36, fillStyle: 'black', strokeStyle: 'black', text: index + 1 }

      option.x = 24 + (index % 4) * (option.width + 12)

      if (index === Imitation.state.info.teamIndex) {
        new Button({ ...option, lineWidth: 4 }).render()
      }

      if (index !== Imitation.state.info.teamIndex) {
        new Button(option).render()

        if (this.preview) return

        const event = () => {
          Imitation.state.info.teamIndex = index
          this.instance()
        }

        addEventListener('touchstart', event, option)
      }
    })
  }

  drawPreview() {
    if (!this.preview) return

    drawRect({ x: 0, y: 0, width: windowWidth, height: windowHeight })

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'

    ctx.fill()

    this.InstancePreview.card = this.preview

    this.InstancePreview.render()

    const buttonY = windowHeight - this.InstancePreview.y - 160

    var option, option_

    if (this.card.includes(this.preview)) {
      option = { x: windowWidth / 2 - 60, y: buttonY + 40, width: 120, height: 40, radius: 8, text: '装载' }

      new Button(option).render()

      const load = () => {
        this.load(this.preview)
        this.preview = null
      }

      addEventListener('touchstart', load, option)

      option_ = { x: windowWidth / 2 - 60, y: buttonY + 100, width: 120, height: 40, radius: 8, text: '合成' }

      new Button(option_).render()

      const compose = () => {
        this.compose(this.preview)
        this.preview = null
      }

      addEventListener('touchstart', compose, option_)
    }

    if (this.team.includes(this.preview)) {
      const option = { x: windowWidth / 2 - 60, y: buttonY + 40, width: 120, height: 40, radius: 8, text: '卸载' }

      new Button(option).render()

      const unload = () => {
        this.unload(this.preview)
        this.preview = null
      }

      addEventListener('touchstart', unload, option)
    }

    const close = (e) => {
      if (option && ifTouchCover(e, option)) return
      if (option_ && ifTouchCover(e, option_)) return
      this.preview = null
    }

    addEventListenerPure('touchstart', close)
  }

  drawBackground() {
    drawImage(backgroundImage, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  drawButtonHome() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, text: 'Back' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  compose(card) {

  }

  load(card) {
    const library = Imitation.state.info.cardLibrary
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex]

    const teamOrigin = team.find(i => i.key === card.key)

    const libraryFind = library.find(i => i.key === card.key).value.find(i => i.level === card.level)
    const teamFind = teamOrigin.value.find(i => i.level === card.level)

    if (teamFind && teamFind.number === libraryFind.number) return

    if (teamFind) {
      teamFind.number = teamFind.number + 1
    }
    if (!teamFind) {
      teamOrigin.value.push({ key: card.key, level: card.level, number: 1 })
    }

    this.instance()
  }

  unload(card) {
    const team = Imitation.state.info.team

    const index = Imitation.state.info.teamIndex

    const teamCurrent = team[index]

    const teamOrigin = teamCurrent.find(i => i.key === card.key)

    const teamFind = teamOrigin.value.find(i => i.level === card.level)

    teamFind.number = teamFind.number - 1

    if (teamFind.number === 0) {
      teamOrigin.value = teamOrigin.value.filter(i => i !== teamFind)
    }
    if (teamOrigin.value.length === 0) {
      team[index] = team[index].filter(i => i !== teamOrigin)
    }

    this.instance()
  }

  render() {
    this.drawBackground()
    this.drawButtonHome()
    this.drawScroll()
    this.drawPreview()
  }
}

export default PageStore