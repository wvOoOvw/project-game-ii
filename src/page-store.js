import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard } from './utils-common'
import { drawText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Button } from './ui-button'

import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/music_1c31bcc267a545ef971109512053f3e50.jpeg'
import J_music_47a83799595b4a5b97145a6e594620310 from '../media/music_47a83799595b4a5b97145a6e594620310.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_1c31bcc267a545ef971109512053f3e50)
const ImageBanner = createImage(J_music_47a83799595b4a5b97145a6e594620310)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Card {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.card = props.card

    this.touchAble = props.touchAble

    this.touchEvent = props.touchEvent

    this.touchDelayTime = props.touchDelayTime

    this.touchArea = props.touchArea

    this.touchTimeout

    this.displayMode = props.displayMode

    this.imageDOM
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  eventDown(e) {
    if (this.touchArea && !ifTouchCover(e, this.touchArea)) return

    this.touchTimeout = true
  }

  eventUp(e) {
    if (this.touchTimeout === true) this.touchEvent()
    this.touchTimeout = false
  }

  eventMove(e) {
    this.touchTimeout = false
  }

  render() {
    if (!this.imageDOM || this.imageDOM.src !== this.card.image) this.imageDOM = createImage(this.card.image)

    const x = this.x + this.offsetX
    const y = this.y + this.offsetY
    const width = this.width
    const height = this.height
    const card = this.card

    drawImage(this.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.fillStyle = `rgba(255, 255, 255, 1)`

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = `bold ${width * 0.075}px monospace`

    if (this.displayMode === 'card') {
      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)

      drawText({ x: x + width * 0.08, y: y + width * 0.48, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })
    }

    if (this.displayMode === 'preview') {
      ctx.fillText(card.name, x + width / 2, y + width * 0.12)

      if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.12, y + width * 0.12)

      ctx.textAlign = 'start'

      ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)
      ctx.fillText(`${card.race} · ${card.type}`, x + width * 0.08, y + width * 0.48)

      drawText({ x: x + width * 0.08, y: y + width * 0.60, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })
    }

    if (!this.touchAble) return

    addEventListener('touchstart', this.eventDown.bind(this), { x, y, width, height })
    addEventListenerPure('touchmove', this.eventMove.bind(this))
    addEventListenerPure('touchend', this.eventUp.bind(this))
  }
}

class Page {
  constructor() {
    this.preview = null

    this.type = 'team'
    this.sort = 'name'

    this.card

    this.InstanceScroll
    this.InstanceCard
    this.InstancePreview

    this.initCard()
    this.instanceScroll()
    this.instanceCard()
    this.instancePreview()
  }

  get bannerHeight() {
    return 180
  }

  get cardHeight() {
    const row = Math.ceil(this.card.length / 4)

    if (row === 0) return 0

    const real = ((windowWidth - 60) / 4 * 1.35) * row

    const margin = row ? 12 * (row - 1) : 0

    return real + margin
  }

  initCard() {
    if (this.type === 'team') {
      this.card = parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex], true).sort((a, b) => b[this.sort] - a[this.sort])
    }
    if (this.type === 'library') {
      this.card = parseCard(Imitation.state.info.cardLibrary).sort((a, b) => b[this.sort] - a[this.sort])
    }
  }

  instanceScroll() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 72 - safeTop, radius: 12 }

    this.InstanceScroll = new Scroll(scrollOption)

    this.InstanceScroll.scrollY = this.bannerHeight + this.cardHeight - this.InstanceScroll.height + 12
  }

  instanceCard() {
    this.InstanceCard = this.card.map((card, index) => {
      const option = {
        width: (windowWidth - 60) / 4,
        card: card,
        displayMode: 'card',
        touchArea: this.InstanceScroll.option,
        touchEvent: () => this.preview = card,
      }

      option.height = option.width * 1.35
      option.x = 12 + parseInt(index % 4) * (option.width + 12)
      option.y = 72 + parseInt(index / 4) * (option.height + 12) + this.bannerHeight + safeTop

      return new Card(option)
    })
  }

  instancePreview() {
    const option = {
      width: windowWidth * 0.7,
      card: this.preview,
      displayMode: 'preview',
    }

    option.height = option.width * 1.35
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 60

    this.InstancePreview = new Card(option)
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]
      this.drawBanner(offsetY)
      this.drawCard(offsetY)
    }

    this.InstanceScroll.render(event)
  }

  drawBanner(offsetY) {
    const option = { x: 12, y: 60 - offsetY + safeTop, width: windowWidth - 24, height: this.bannerHeight, radius: 12 }

    if (!ifScreenCover(option, this.InstanceScroll.option)) return

    ctx.save()

    drawRadius(option)

    ctx.clip()

    drawImage(ImageBanner, option)

    const _drawTeamButton = () => {
      new Array(Imitation.state.info.team.length).fill().forEach((i, index) => {

        const option_ = { x: 24 + index * 72, y: 12 + option.y, width: 60, height: 30, font: 10, opacity: 0.5, text: `队伍 ${index + 1}` }

        if (!ifScreenCover(option_, this.InstanceScroll.option)) return

        if (index === Imitation.state.info.teamIndex) option_.opacity = 1

        new Button(option_).render()

        if (this.preview) return

        const event = (e) => {
          if (!ifTouchCover(e, this.InstanceScroll.option)) return

          Imitation.state.info.teamIndex = index
          this.type = 'team'
          this.initCard()
          this.instanceScroll()
          this.instanceCard()
        }

        addEventListener('touchstart', event, option_)
      })
    }

    _drawTeamButton()

    const _drawLibraryButton = () => {
      const option_ = { x: windowWidth - 54, y: 12 + option.y, width: 30, height: 30, font: 10, opacity: 0.5, radius: 15, text: `S` }

      if (!ifScreenCover(option_, this.InstanceScroll.option)) return

      if (this.type === 'library') option_.opacity = 1

      new Button(option_).render()

      if (this.preview) return

      const event = (e) => {
        if (!ifTouchCover(e, this.InstanceScroll.option)) return

        if (this.type === 'team') {
          this.type = 'library'
          this.initCard()
          this.instanceScroll()
          this.instanceCard()
          return
        }
        if (this.type === 'library') {
          this.type = 'team'
          this.initCard()
          this.instanceScroll()
          this.instanceCard()
          return
        }
      }

      addEventListener('touchstart', event, option_)
    }

    _drawLibraryButton()

    const _drawSort = () => {
      const array = [['name', '名称'], ['level', '等级'], ['type', '类型'], ['race', '种类'],]
      new Array(...array).forEach((i, index) => {
        const option_ = { x: 24 + index * 72, y: option.y + option.height - 42, width: 60, height: 30, font: 10, opacity: 0.5, text: i[1] }

        if (!ifScreenCover(option_, this.InstanceScroll.option)) return

        if (i[0] === this.sort) option_.opacity = 1

        new Button(option_).render()

        if (this.preview) return

        const event = (e) => {
          if (!ifTouchCover(e, this.InstanceScroll.option)) return

          this.sort = i[0]
          this.initCard()
          this.instanceScroll()
          this.instanceCard()
        }

        addEventListener('touchstart', event, option_)
      })
    }

    _drawSort()

    const _drawText = () => {
      const option_ = { x: 24, y: 54 + option.y, width: option.width, height: 12 }

      if (this.type === 'team') {
        option_.text = `队伍 ${Imitation.state.info.teamIndex + 1}`
      }
      if (this.type === 'library') {
        option_.text = '仓库'
      }

      ctx.textAlign = 'start'
      ctx.textBaseline = 'top'
      ctx.font = `bold 12px monospace`
      ctx.lineWidth = 1

      ctx.fillText(option_.text, option_.x, option_.y)
    }

    // _drawText()

    ctx.restore()
  }

  drawCard(offsetY) {
    this.InstanceCard.forEach((i) => {
      if (!ifScreenCover({ ...i.option, y: i.y - offsetY }, this.InstanceScroll.option)) return

      i.offsetY = 0 - offsetY
      i.touchAble = this.preview ? false : true
      i.render()
    })
  }

  drawPreview() {
    if (!this.preview) return

    drawRect({ x: 0, y: 0, width: windowWidth, height: windowHeight })

    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)'

    ctx.fill()

    this.InstancePreview.card = this.preview

    this.InstancePreview.render()

    const buttonY = windowHeight - this.InstancePreview.y - 120

    var option, option_

    if (this.type === 'library') {
      option = { x: windowWidth / 2 - 60, y: buttonY, width: 120, height: 40, radius: 8, text: '装载' }

      new Button(option).render()

      const load = () => {
        this.load(this.preview)
        this.preview = null
      }

      addEventListener('touchstart', load, option)

      option_ = { x: windowWidth / 2 - 60, y: buttonY + 60, width: 120, height: 40, radius: 8, text: '合成' }

      new Button(option_).render()

      const compose = () => {
        this.compose(this.preview)
        this.preview = null
      }

      addEventListener('touchstart', compose, option_)
    }

    if (this.type === 'team') {
      const option = { x: windowWidth / 2 - 60, y: buttonY, width: 120, height: 40, radius: 8, text: '卸载' }

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
    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  drawButtonHome() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, text: 'Home' }

    new Button(option).render()

    if (this.preview) return

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  compose(card) {
    const library = Imitation.state.info.cardLibrary

    const libraryFind = library.find(i => i.key === card.key)

    const libraryLevelFind = libraryFind.value.find(i => i.level === card.level)

    if (libraryLevelFind.number < 3) return

    libraryLevelFind.number = libraryLevelFind.number - 3

    if (libraryLevelFind.number === 0) {
      libraryFind.value = libraryFind.value.filter(i => i !== libraryLevelFind)
    }

    const libraryLevelUpFind = libraryFind.value.find(i => i.level === card.level + 1)

    if (libraryLevelUpFind) {
      libraryLevelUpFind.number = libraryLevelUpFind.number + 1
    }
    if (!libraryLevelUpFind) {
      libraryFind.value.push({ level: card.level + 1, number: 1 })
    }

    this.initCard()
    this.instanceScroll()
    this.instanceCard()
  }

  load(card) {
    const library = Imitation.state.info.cardLibrary
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex]

    const teamOrigin = team.find(i => i.key === card.key)

    const final = () => {
      this.initCard()
      this.instanceScroll()
      this.instanceCard()
      this.instancePreview()
    }

    if (!teamOrigin) {
      team.push({ key: card.key, value: [{ level: card.level, number: 1 }] })
      final()
      return
    }

    const total = teamOrigin.value.reduce((t, i) => t + i.number, 0)

    if (total === card.limit) return

    const teamFind = teamOrigin.value.find(i => i.level === card.level)

    if (!teamFind) {
      teamOrigin.value.push({ level: card.level, number: 1 })
      final()
      return
    }

    const libraryFind = library.find(i => i.key === card.key).value.find(i => i.level === card.level)

    if (teamFind && teamFind.number < libraryFind.number) {
      teamFind.number = teamFind.number + 1
      final()
      return
    }
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

    this.initCard()
    this.instanceScroll()
    this.instanceCard()
  }

  render() {
    this.drawBackground()
    this.drawButtonHome()
    this.drawScroll()
    this.drawPreview()
  }
}

export default Page