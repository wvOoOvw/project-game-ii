import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parse, levelText, numberFix } from './utils-common'
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

class CardInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.card = props.card

    this.touchEvent = props.touchEvent

    this.touchDelayTime = props.touchDelayTime

    this.touchArea = props.touchArea

    this.touchTimeout
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
    const x = this.x + this.offsetX
    const y = this.y + this.offsetY
    const width = this.width
    const height = this.height
    const card = this.card

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(this.card.imageDOM, { x: x, y: y, width: width, height: height })

    const width_ = width * 0.6
    const height_ = width * 0.2
    const x_ = x + width / 2 - width_ / 2
    const y_ = y + height - height_ - (x_ - x)
    const radius_ = width * 0.08

    const text = [card.name, levelText(card.level)]

    if (card.number) text.push('x' + card.number)

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${width * 0.075}px monospace`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(text.join(' '), x_ + width_ / 2, y_ + height_ / 2)

    ctx.restore()

    addEventListener('touchstart', this.eventDown.bind(this), { x, y, width, height })
    addEventListenerPure('touchmove', this.eventMove.bind(this))
    addEventListenerPure('touchend', this.eventUp.bind(this))
  }
}

class CardInPreview {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.card = props.card

    this.novaTime = 0
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height
    const card = this.card

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(this.card.imageDOM, { x: x, y: y, width: width, height: height })

    const width_ = height * this.novaTime
    const height_ = height * this.novaTime
    const x_ = x + (width - width_) / 2
    const y_ = y + (height - height_) / 2
    const radius_ = width_ / 2

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `bold ${width * 0.075}px monospace`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(card.name, x + width / 2, y + width * 0.12)

    ctx.textAlign = 'end'

    if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.08, y + width * 0.36)

    ctx.textAlign = 'start'

    ctx.fillText('Lv' + card.level, x + width * 0.08, y + width * 0.36)
    ctx.fillText(`${card.race} · ${card.type}`, x + width * 0.08, y + width * 0.48)

    drawText({ x: x + width * 0.08, y: y + width * 0.60, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })

    ctx.restore()
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
      this.card = parse(Imitation.state.info.team[Imitation.state.info.teamIndex], true)
    }
    if (this.type === 'library') {
      this.card = parse(Imitation.state.info.cardLibrary)
    }

    this.card = this.card.sort((a, b) => {
      const a_ = String(a[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
      const b_ = String(b[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)

      return b_ - a_
    })
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
        touchAble: true,
        touchArea: this.InstanceScroll.option,
        touchEvent: () => this.preview = card,
      }

      option.height = option.width * 1.35
      option.x = 12 + parseInt(index % 4) * (option.width + 12)
      option.y = 72 + parseInt(index / 4) * (option.height + 12) + this.bannerHeight + safeTop

      return new CardInList(option)
    })
  }

  instancePreview() {
    const option = {
      width: windowWidth * 0.7,
      card: this.preview,
    }

    option.height = option.width * 1.35
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 60

    this.InstancePreview = new CardInPreview(option)
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
      const option_ = { x: 24, y: option.y + option.height - 42, width: 60, height: 30, font: 10, opacity: 0.5, text: '查看仓库' }

      if (!ifScreenCover(option_, this.InstanceScroll.option)) return

      if (this.type === 'library') option_.opacity = 1

      new Button(option_).render()

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
      const array = [['name', '名称'], ['level', '等级'], ['type', '类型'], ['race', '种类']]
      new Array(...array).forEach((i, index) => {
        const option_ = { x: 24 + index * 72, y: 54 + option.y, width: 60, height: 30, font: 10, opacity: 0.5, text: i[1] }

        if (!ifScreenCover(option_, this.InstanceScroll.option)) return

        if (i[0] === this.sort) option_.opacity = 1

        new Button(option_).render()

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

    ctx.restore()
  }

  drawCard(offsetY) {
    this.InstanceCard.forEach((i) => {
      if (!ifScreenCover({ ...i.option, y: i.y - offsetY }, this.InstanceScroll.option)) return

      i.offsetY = 0 - offsetY
      i.render()
    })
  }

  drawPreview() {
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
        this.InstancePreview.novaTime = 0
      }

      addEventListener('touchstart', load, option)

      option_ = { x: windowWidth / 2 - 60, y: buttonY + 60, width: 120, height: 40, radius: 8, text: '合成' }

      new Button(option_).render()

      const compose = () => {
        this.compose(this.preview)
        this.preview = null
        this.InstancePreview.novaTime = 0
      }

      addEventListener('touchstart', compose, option_)
    }

    if (this.type === 'team') {
      const option = { x: windowWidth / 2 - 60, y: buttonY, width: 120, height: 40, radius: 8, text: '卸载' }

      new Button(option).render()

      const unload = () => {
        this.unload(this.preview)
        this.preview = null
        this.InstancePreview.novaTime = 0
      }

      addEventListener('touchstart', unload, option)
    }

    const close = (e) => {
      if (option && ifTouchCover(e, option)) return
      if (option_ && ifTouchCover(e, option_)) return
      this.preview = null
      this.InstancePreview.novaTime = 0
    }

    addEventListenerPure('touchstart', close)
  }


  drawBackground() {
    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  drawButtonHome() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, font: 12, text: '返回' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  compose(card) {
    const library = Imitation.state.info.cardLibrary
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex]

    const findInLibrary = library.find(i_ => i_.key === card.key && i_.level === card.level)
    const findInLibraryUpper = library.find(i_ => i_.key === card.key && i_.level === card.level + 1)
    const findInTeam = team.find(i_ => i_.key === card.key && i_.level === card.level)

    if (findInLibrary.number < 3) {
      Imitation.state.function.message('卡牌数量不足', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    findInLibrary.number = findInLibrary.number - 3

    if (findInLibrary.number === 0) {
      const index = library.indexOf(findInLibrary)
      library.splice(index, 1)
    }

    if (findInLibraryUpper) {
      findInLibraryUpper.number = findInLibraryUpper.number + 1
    }

    if (!findInLibraryUpper) {
      library.push({ key: card.key, level: card.level + 1, number: 1 })
    }

    if (findInTeam) {
      if (findInTeam.number > findInLibrary.number) {
        findInTeam.number = findInLibrary.number
      }

      if (findInTeam.number === 0) {
        const index = team.indexOf(findInTeam)
        team.splice(index, 1)
      }
    }

    this.initCard()
    this.instanceScroll()
    this.instanceCard()
    Imitation.state.function.message('合成成功', 'rgba(125, 125, 125, 1)', 'rgba(255, 255, 255, 1)')
  }

  load(card) {
    const library = Imitation.state.info.cardLibrary
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex]

    const findInLibrary = library.find(i_ => i_.key === card.key && i_.level === card.level)
    const findInTeam = team.find(i_ => i_.key === card.key && i_.level === card.level)

    if (team.reduce((t, i) => t + i.number, 0) > 40) {
      Imitation.state.function.message('超出卡组数量限制', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    if (team.filter(i => i.key === card.key).reduce((t, i) => t + i.number, 0) >= card.limit) {
      Imitation.state.function.message('超出卡牌数量限制', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    if (findInTeam && findInTeam.number === findInLibrary.number) {
      Imitation.state.function.message('卡组数量不足', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    if (findInTeam) {
      find.number = find.number + 1
    }

    if (!findInTeam) {
      team.push({ key: card.key, level: card.level, number: 1 })
    }

    this.initCard()
    this.instanceScroll()
    this.instanceCard()

    Imitation.state.function.message('装载成功', 'rgba(125, 125, 125, 1)', 'rgba(255, 255, 255, 1)')
  }

  unload(card) {
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex]

    const findInTeam = team.find(i_ => i_.key === card.key && i_.level === card.level)

    findInTeam.number = findInTeam.number - 1

    if (findInTeam.number === 0) {
      const index = team.indexOf(findInTeam)
      team.splice(index, 1)
    }

    this.initCard()
    this.instanceScroll()
    this.instanceCard()
    Imitation.state.function.message('卸载成功', 'rgba(125, 125, 125, 1)', 'rgba(255, 255, 255, 1)')
  }

  render() {
    this.drawBackground()

    if (this.preview) {
      this.drawPreview()
    }

    if (!this.preview) {
      this.drawButtonHome()
      this.drawScroll()
    }
  }
}

export default Page