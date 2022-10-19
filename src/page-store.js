import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, parseMaster, levelText, numberFix } from './utils-common'
import { drawText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Button } from './ui-button'

import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/background/music_1c31bcc267a545ef971109512053f3e50.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_1c31bcc267a545ef971109512053f3e50)

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

    drawRadius({ x, y, width, height, radius: 8 })

    ctx.clip()

    drawImage(this.card.imageDOM, { x: x, y: y, width: width, height: height })

    const width_ = width * 0.75
    const height_ = width * 0.2
    const x_ = x + width / 2 - width_ / 2
    const y_ = y + height - height_ - (x_ - x)
    const radius_ = height_ / 4

    const text = [card.name, levelText(card.level)]

    if (card.number) text.push('x' + card.number)

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.075}px ${window.fontFamily}`
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
    ctx.font = `900 ${width * 0.075}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(card.name, x + width / 2, y + width * 0.12)

    ctx.textAlign = 'end'

    if (card.number) ctx.fillText('X' + card.number, x + width - width * 0.08, y + width * 0.30)

    ctx.textAlign = 'start'

    ctx.fillText('Lv ' + card.level, x + width * 0.08, y + width * 0.30)
    ctx.fillText(`${card.race} · ${card.type}`, x + width * 0.08, y + width * 0.42)

    drawText({ x: x + width * 0.08, y: y + width * 0.54, width: width - width * 0.25, fontHeight: width * 0.12, text: card.description(1) })

    ctx.restore()
  }
}

class MasterInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.master = props.master

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
    const master = this.master

    ctx.save()

    drawRadius({ x, y, width, height, radius: 12 })

    ctx.clip()

    drawImage(this.master.imageDOM, { x: x, y: y, width: width, height: height })

    const width_ = height * 0.85
    const height_ = height * 0.85
    const x_ = x + (height - height_) / 2
    const y_ = y + (height - height_) / 2
    const radius_ = width_ / 2

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${height * 0.1}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText([master.name, levelText(master.level)].join(' '), x_ + width_ / 2, y_ + height_ / 2)

    ctx.restore()

    addEventListener('touchstart', this.eventDown.bind(this), { x, y, width, height })
    addEventListenerPure('touchmove', this.eventMove.bind(this))
    addEventListenerPure('touchend', this.eventUp.bind(this))
  }
}

class MasterInPreview {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.master = props.master

    this.skillIndex = 0

    this.novaTime = 0
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height
    const master = this.master

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(this.master.imageDOM, { x: x, y: y, width: width, height: height })

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
    ctx.font = `900 ${width * 0.075}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(master.name, x + width / 2, y + width * 0.12)

    ctx.textAlign = 'start'

    ctx.fillText('Lv ' + master.level, x + width * 0.08, y + width * 0.30)
    ctx.fillText('HP ' + master.HP, x + width * 0.08, y + width * 0.42)
    ctx.fillText('MP ' + master.MP, x + width * 0.08, y + width * 0.54)

    drawText({ x: x + width * 0.08, y: y + width * 0.66, width: width - width * 0.25, fontHeight: width * 0.12, text: master.skill[this.skillIndex].description(master.level) })

    ctx.restore()
  }
}

class Page {
  constructor() {
    this.preview = null

    this.type = 'team'
    this.sort = 'name'

    this.master
    this.card

    this.InstanceScroll
    this.InstanceMaster
    this.InstanceMasterPreview
    this.InstanceCard
    this.InstanceCardPreview

    this.init()
    this.instanceCardPreview()
    this.instanceMasterPreview()
  }

  get bannerHeight() {
    return 160
  }

  get masterHeight() {
    const row = Math.ceil(this.master.length / 4)

    if (row === 0) return -12

    const real = ((windowWidth - 60) / 4 * 1.35) * row

    const margin = row ? 12 * (row - 1) : 0

    return real + margin
  }

  get cardHeight() {
    const row = Math.ceil(this.card.length / 4)

    if (row === 0) return 0

    const real = ((windowWidth - 60) / 4 * 1.35) * row

    const margin = row ? 12 * (row - 1) : 0

    return real + margin
  }

  init() {
    if (this.type === 'team') {
      this.master = parseMaster([Imitation.state.info.library.master.find(i => i.key === Imitation.state.info.team[Imitation.state.info.teamIndex].master[0].key)])

      this.card = parseCard(Imitation.state.info.team[Imitation.state.info.teamIndex].card, true)
      this.card = this.card.sort((a, b) => {
        const a_ = String(a[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
        const b_ = String(b[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)

        return b_ - a_
      })
    }
    if (this.type === 'library-card') {
      this.master = []

      this.card = parseCard(Imitation.state.info.library.card)
      this.card = this.card.sort((a, b) => {
        const a_ = String(a[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)
        const b_ = String(b[this.sort]).split('').reduce((t, i) => t + String(i).charCodeAt(0), 0)

        return b_ - a_
      })
    }

    if (this.type === 'library-master') {
      this.master = parseMaster(Imitation.state.info.library.master)

      this.card = []
    }

    this.instanceScroll()
    this.instanceMaster()
    this.instanceCard()
  }

  instanceScroll() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 72 - safeTop, radius: 12 }

    this.InstanceScroll = new Scroll(scrollOption)

    this.InstanceScroll.scrollY = this.bannerHeight + this.masterHeight + this.cardHeight - this.InstanceScroll.height + 24
  }

  instanceMaster() {
    this.InstanceMaster = this.master.map((master, index) => {
      const option = {
        width: windowWidth - 24,
        master: master,
        touchAble: true,
        touchArea: this.InstanceScroll.option,
        touchEvent: () => this.preview = master,
      }

      option.height = (windowWidth - 60) / 4 * 1.35
      option.x = 12
      option.y = 72 + index * (option.height + 12) + this.bannerHeight + safeTop

      return new MasterInList(option)
    })
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
      option.y = 84 + parseInt(index / 4) * (option.height + 12) + this.bannerHeight + this.masterHeight + safeTop

      return new CardInList(option)
    })
  }

  instanceCardPreview() {
    const option = {
      width: windowWidth * 0.7,
      card: this.preview,
    }

    option.height = option.width * 1.35
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 60

    this.InstanceCardPreview = new CardInPreview(option)
  }

  instanceMasterPreview() {
    const option = {
      width: windowWidth * 0.7,
      card: this.preview,
    }

    option.height = option.width * 1.35
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 60

    this.InstanceMasterPreview = new MasterInPreview(option)
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]
      this.drawBanner(offsetY)
      this.drawMaster(offsetY)
      this.drawCard(offsetY)
    }

    this.InstanceScroll.render(event)
  }

  drawBanner(offsetY) {
    const option = { x: 12, y: 60 - offsetY + safeTop, width: windowWidth - 24, height: this.bannerHeight, radius: 12 }

    if (!ifScreenCover(option, this.InstanceScroll.option)) return

    ctx.save()

    drawRadius(option)

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'

    ctx.fill()

    ctx.clip()

    const _drawTeamButton = () => {
      new Array(Imitation.state.info.team.length).fill().forEach((i, index) => {

        const option_ = { x: 24 + index * 72, y: 12 + option.y, width: 60, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: [`rgba(255, 255, 255, ${index === Imitation.state.info.teamIndex ? 1 : 0.5})`, 'rgba(0, 0, 0, 1)'], text: `队伍 ${index + 1}` }

        if (!ifScreenCover(option_, this.InstanceScroll.option)) return

        new Button(option_).render()

        const event = (e) => {
          if (!ifTouchCover(e, this.InstanceScroll.option)) return

          Imitation.state.info.teamIndex = index
          this.type = 'team'
          this.init()
        }

        addEventListener('touchstart', event, option_)
      })
    }

    _drawTeamButton()

    const _drawTypeButton = () => {
      const array = [['team', '队伍'], ['library-card', '卡牌仓库'], ['library-master', '队长仓库']]

      new Array(...array).forEach((i, index) => {
        const option_ = { x: 24 + index * 72, y: option.y + option.height - 42, width: 60, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: [`rgba(255, 255, 255, ${i[0] === this.type ? 1 : 0.5})`, 'rgba(0, 0, 0, 1)'], text: i[1] }

        if (!ifScreenCover(option_, this.InstanceScroll.option)) return

        new Button(option_).render()

        const event = (e) => {
          if (!ifTouchCover(e, this.InstanceScroll.option)) return

          this.type = i[0]
          this.init()
        }

        addEventListener('touchstart', event, option_)
      })
    }

    _drawTypeButton()

    const _drawSort = () => {
      const array = [['name', '名称'], ['level', '等级'], ['type', '类型'], ['race', '种类']]
      new Array(...array).forEach((i, index) => {
        const option_ = { x: 24 + index * 72, y: 54 + option.y, width: 60, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: [`rgba(255, 255, 255, ${i[0] === this.sort ? 1 : 0.5})`, 'rgba(0, 0, 0, 1)'], text: i[1] }

        if (!ifScreenCover(option_, this.InstanceScroll.option)) return

        new Button(option_).render()

        const event = (e) => {
          if (!ifTouchCover(e, this.InstanceScroll.option)) return

          this.sort = i[0]
          this.init()
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

  drawMaster(offsetY) {
    this.InstanceMaster.forEach((i) => {
      if (!ifScreenCover({ ...i.option, y: i.y - offsetY }, this.InstanceScroll.option)) return

      i.offsetY = 0 - offsetY
      i.render()
    })
  }

  drawPreview() {
    var closeCover = []

    const buttonY = this.InstanceMasterPreview.y + this.InstanceMasterPreview.height

    if (this.type === 'team') {
      if (this.InstanceCard.find(i => i.card === this.preview)) {
        this.InstanceCardPreview.card = this.preview

        this.InstanceCardPreview.render()

        const option = { x: windowWidth / 2 - 60, y: buttonY + 40, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '卸载' }

        new Button(option).render()

        const unloadCard = () => {
          this.unloadCard(this.preview)
          this.preview = null
          this.InstanceCardPreview.novaTime = 0
        }

        addEventListener('touchstart', unloadCard, option)

        closeCover.push(option)
      }

      if (this.InstanceMaster.find(i => i.master === this.preview)) {
        this.InstanceMasterPreview.master = this.preview

        this.InstanceMasterPreview.render()

        this.preview.skill.forEach((i, index) => {
          const option = { x: windowWidth / 2 - 40, y: buttonY + 20, width: 80, height: 32, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: [`rgba(255, 255, 255, ${index === this.InstanceMasterPreview.skillIndex ? 1 : 0.5})`, 'rgba(0, 0, 0, 1)'], text: i.name }

          const maxIndex = this.preview.skill.length
          const centerIndex = maxIndex / 2 - 0.5

          const diff = (index - centerIndex) * option.width * 1.1

          option.x = option.x + diff

          new Button(option).render()

          const event = (e) => {
            this.InstanceMasterPreview.skillIndex = index
          }

          addEventListener('touchstart', event, option)

          closeCover.push(option)
        })
      }
    }

    if (this.type === 'library-card') {
      this.InstanceCardPreview.card = this.preview

      this.InstanceCardPreview.render()

      const option = { x: windowWidth / 2 - 60, y: buttonY + 40, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '装载' }

      new Button(option).render()

      const loadCard = () => {
        this.loadCard(this.preview)
        this.preview = null
        this.InstanceCardPreview.novaTime = 0
      }

      addEventListener('touchstart', loadCard, option)

      closeCover.push(option)

      const option_ = { x: windowWidth / 2 - 60, y: buttonY + 100, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '合成' }

      new Button(option_).render()

      const composeCard = () => {
        this.composeCard(this.preview)
        this.preview = null
        this.InstanceCardPreview.novaTime = 0
      }

      addEventListener('touchstart', composeCard, option_)

      closeCover.push(option_)
    }

    if (this.type === 'library-master') {
      this.InstanceMasterPreview.master = this.preview

      this.InstanceMasterPreview.render()

      this.preview.skill.forEach((i, index) => {
        const option = { x: windowWidth / 2 - 40, y: buttonY + 20, width: 80, height: 32, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: [`rgba(255, 255, 255, ${index === this.InstanceMasterPreview.skillIndex ? 1 : 0.5})`, 'rgba(0, 0, 0, 1)'], text: i.name }

        const maxIndex = this.preview.skill.length
        const centerIndex = maxIndex / 2 - 0.5

        const diff = (index - centerIndex) * option.width * 1.1

        option.x = option.x + diff

        new Button(option).render()

        const event = (e) => {
          this.InstanceMasterPreview.skillIndex = index
        }

        addEventListener('touchstart', event, option)

        closeCover.push(option)
      })

      const option = { x: windowWidth / 2 - 60, y: buttonY + 80, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '装载' }

      new Button(option).render()

      const loadMaster = () => {
        this.loadMaster(this.preview)
        this.preview = null
        this.InstanceMasterPreview.novaTime = 0
      }

      addEventListener('touchstart', loadMaster, option)

      closeCover.push(option)
    }

    const close = (e) => {
      if (closeCover.some(i => ifTouchCover(e, i))) return
      this.preview = null
      this.InstanceMasterPreview.novaTime = 0
      this.InstanceCardPreview.novaTime = 0
    }

    addEventListenerPure('touchstart', close)
  }

  drawBackground() {
    drawImage(ImageBackground, { x: 0, y: 0, width: windowWidth, height: windowHeight })
  }

  drawButtonHome() {
    const option = { x: 12, y: 12 + safeTop, width: 72, height: 36, radius: 8, font: `900 12px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '返回' }

    new Button(option).render()

    const event = () => {
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'home'
    }

    addEventListener('touchstart', event, option)
  }

  composeCard(card) {
    const library = Imitation.state.info.library.card
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex].card

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

    this.init()
    Imitation.state.function.message('合成成功', 'rgba(125, 125, 125, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.function.saveInfo()
  }

  loadCard(card) {
    const library = Imitation.state.info.library.card
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex].card

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
      findInTeam.number = findInTeam.number + 1
    }

    if (!findInTeam) {
      team.push({ key: card.key, level: card.level, number: 1 })
    }

    this.init()

    Imitation.state.function.message('装载成功', 'rgba(125, 125, 125, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.function.saveInfo()
  }

  unloadCard(card) {
    const team = Imitation.state.info.team[Imitation.state.info.teamIndex].card

    const findInTeam = team.find(i_ => i_.key === card.key && i_.level === card.level)

    findInTeam.number = findInTeam.number - 1

    if (findInTeam.number === 0) {
      const index = team.indexOf(findInTeam)
      team.splice(index, 1)
    }

    this.init()
    Imitation.state.function.message('卸载成功', 'rgba(125, 125, 125, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.function.saveInfo()
  }

  loadMaster(master) {
    Imitation.state.info.team[Imitation.state.info.teamIndex].master[0].key = master.key

    this.init()
    Imitation.state.function.message('装载成功', 'rgba(125, 125, 125, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.function.saveInfo()
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