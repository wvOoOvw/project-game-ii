import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, parseCard, parseMaster, parseMoney, levelText, numberFix } from './utils-common'
import { drawText, drawImage, drawRect, drawRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Button } from './ui-button'

import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/background/music_1c31bcc267a545ef971109512053f3e50.jpeg'

const ctx = canvas.getContext('2d')

const ImageBackground = createImage(J_music_1c31bcc267a545ef971109512053f3e50)

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class ShopInList {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.shop = props.shop

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
    const shop = this.shop

    ctx.save()

    drawRadius({ x, y, width, height, radius: 12 })

    ctx.clip()

    drawImage(this.shop.imageDOM, { x: x, y: y, width: width, height: height })

    const width_ = height * 0.85
    const height_ = height * 0.85
    const x_ = x + (height - height_) / 2
    const y_ = y + (height - height_) / 2
    const radius_ = width_ / 2

    ctx.font = `900 ${height * 0.1}px ${window.fontFamily}`

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })
    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(shop.name, x_ + width_ / 2, y_ + height_ / 2 - height * 0.07)
    ctx.fillText(`¥${shop.money.number}`, x_ + width_ / 2, y_ + height_ / 2 + height * 0.07)

    drawRadius({ x: x_ + width_ + (height - height_) / 2, y: y_ + (height - height_) / 2, width: width - width_ - (height - height_) * 1.5, height: height_ - (height - height_), radius: height * 0.1 })
    ctx.fillStyle = `rgba(255, 255, 255, 0.5)`
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'
    drawText({ x: x_ + width_ + (height - height_), y: y_ + (height - height_), width: width - width_ - (height - height_) * 3, fontHeight: height * 0.15, text: shop.description })

    ctx.restore()

    addEventListener('touchstart', this.eventDown.bind(this), { x, y, width, height })
    addEventListenerPure('touchmove', this.eventMove.bind(this))
    addEventListenerPure('touchend', this.eventUp.bind(this))
  }
}

class ShopInPreview {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.shop = props.shop

    this.novaTime = 0
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const x = this.x
    const y = this.y
    const width = this.width
    const height = this.height
    const shop = this.shop

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(this.shop.imageDOM, { x: x, y: y, width: width, height: height })

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
    ctx.font = `900 ${width * 0.07}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(shop.name, x + width / 2, y + width * 0.12)
    ctx.fillText(`¥${shop.money.number}`, x + width / 2, y + width * 0.24)

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'

    drawText({ x: x + width * 0.08, y: y + width * 0.6, width: width - width * 0.25, fontHeight: width * 0.105, text: shop.description })

    ctx.restore()
  }
}

class Page {
  constructor() {
    this.preview = null

    this.money = 1
    this.type = 'alltime'

    this.shop

    this.InstanceScroll
    this.InstanceShop
    this.InstanceShopPreview

    this.init()
  }

  get bannerHeight() {
    return 96
  }

  get shopHeight() {
    const row = this.shop.length

    if (row === 0) return -12

    const real = ((windowWidth - 60) / 4 * 1.35) * row

    const margin = row ? 12 * (row - 1) : 0

    return real + margin
  }

  init() {
    this.shop = Imitation.state.shop.filter(i => i.type === this.type && i.money.key === this.money)

    this.instanceScroll()
    this.instanceShop()
    this.instanceShopPreview()
  }

  instanceScroll() {
    const scrollOption = { x: 12, y: 60 + safeTop, width: windowWidth - 24, height: windowHeight - 120 - safeTop, radius: 12 }

    this.InstanceScroll = new Scroll(scrollOption)

    this.InstanceScroll.scrollY = this.bannerHeight + this.shopHeight - this.InstanceScroll.height + 24
  }

  instanceShop() {
    this.InstanceShop = this.shop.map((shop, index) => {
      const option = {
        width: windowWidth - 24,
        shop: shop,
        touchAble: true,
        touchArea: this.InstanceScroll.option,
        touchEvent: () => this.preview = shop,
      }

      option.height = (windowWidth - 60) / 4 * 1.35
      option.x = 12
      option.y = 72 + index * (option.height + 12) + this.bannerHeight + safeTop

      return new ShopInList(option)
    })
  }

  instanceShopPreview() {
    const option = {
      width: windowWidth * 0.7,
      shop: this.preview,
    }

    option.height = option.width * 1.35
    option.x = windowWidth * 0.15
    option.y = (windowHeight - option.width * 1.5) / 2 - 60

    this.InstanceShopPreview = new ShopInPreview(option)
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]
      this.drawBanner(offsetY)
      this.drawShop(offsetY)
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

    const _drawMoneyButton = () => {
      const array = parseMoney(Imitation.state.info.money)

      array.forEach((i, index) => {
        const option_ = { x: 24 + index * 84, y: 12 + option.y, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, text: i.name }

        option_.fillStyle = i.key === this.money ? ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)'] : ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)']

        if (!ifScreenCover(option_, this.InstanceScroll.option)) return

        new Button(option_).render()

        const event = (e) => {
          if (!ifTouchCover(e, this.InstanceScroll.option)) return

          this.money = i.key
          this.init()
        }

        addEventListener('touchstart', event, option_)
      })
    }

    _drawMoneyButton()

    const _drawTypeButton = () => {
      const array = [['alltime', '常驻'], ['week_' + new Date().getDay(), '周活动']]

      array.forEach((i, index) => {
        const option_ = { x: 24 + index * 84, y: 54 + option.y, width: 72, height: 30, radius: 8, font: `900 10px ${window.fontFamily}`, text: i[1] }

        option_.fillStyle = i[0] === this.type ? ['rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)'] : ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)']

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

    ctx.restore()
  }

  drawShop(offsetY) {
    this.InstanceShop.forEach((i) => {
      if (!ifScreenCover({ ...i.option, y: i.y - offsetY }, this.InstanceScroll.option)) return

      i.offsetY = 0 - offsetY
      i.render()
    })
  }

  drawPreview() {
    var closeCover = []

    const buttonY = this.InstanceShopPreview.y + this.InstanceShopPreview.height

    this.InstanceShopPreview.shop = this.preview

    this.InstanceShopPreview.render()

    const option = { x: windowWidth / 2 - 60, y: buttonY + 40, width: 120, height: 40, radius: 8, font: `900 14px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: '购买' }

    new Button(option).render()

    const buy = () => {
      this.buy(this.preview)
      this.preview = null
      this.InstanceShopPreview.novaTime = 0
    }

    addEventListener('touchstart', buy, option)

    closeCover.push(option)

    const close = (e) => {
      if (closeCover.some(i => ifTouchCover(e, i))) return
      this.preview = null
      this.InstanceShopPreview.novaTime = 0
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

  drawInfo() {
    const array = parseMoney(Imitation.state.info.money)

    array.forEach((i, index) => {
      const maxIndex = array.length
      const centerIndex = maxIndex / 2 - 0.5
      const diff = index - centerIndex

      const option = { y: windowHeight - 48, width: 84, height: 32, radius: 8, font: `900 10px ${window.fontFamily}`, fillStyle: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)'], text: `${i.name} ${i.number}` }

      option.x = (windowWidth - option.width) / 2 + diff * (option.width + 8)

      new Button(option).render()
    })
  }

  buy(shop) {
    const findInMoney = Imitation.state.info.money.find(i => i.key === shop.money.key)

    if (findInMoney.number < shop.money.number) {
      Imitation.state.function.message('货币不足', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    findInMoney.number = findInMoney.number - shop.money.number

    const library = Imitation.state.info.library
    const reward = shop.reward()

    reward.forEach(i => {
      if (i.card) {
        const findInLibrary = library.card.find(i_ => i_.key === i.key && i_.level === i.level)
        if (findInLibrary) {
          findInLibrary.number = findInLibrary.number + i.number
        }
        if (!findInLibrary) {
          library.push({ key: i.key, level: i.level, number: i.number })
        }
      }
      if (i.master) {
        const findInLibrary = library.master.find(i_ => i_.key === i.key)
        if (findInLibrary) {
          findInLibrary.exp = findInLibrary.exp + i.number / Math.pow(2, (findInLibrary.level - 1))

          if (findInLibrary.exp > 100) {
            findInLibrary.level = findInLibrary.level + 1
            findInLibrary.exp = (findInLibrary.exp - 100) * 0.5
          }
        }
        if (!findInLibrary) {
          library.push({ key: i.key, level: 1, exp: i.number })
        }
      }
    })

    Imitation.state.function.message('购买成功', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.function.saveInfo()
    Imitation.state.reward = { value: reward, back: 'shop', title: '购买获得' }
    Imitation.state.page.current = 'transition'
    Imitation.state.page.next = 'reward'
  }

  render() {
    this.drawBackground()

    if (!this.preview) {
      this.drawButtonHome()
      this.drawScroll()
      this.drawInfo()
    }

    if (this.preview) {
      this.drawPreview()
      this.drawInfo()
    }
  }
}

export default Page