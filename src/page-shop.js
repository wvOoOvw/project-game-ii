import { createImage, parseCard, parseMaster, parseMoney, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRadius } from './utils-canvas'
import { addEventListener, ifTouchCover, ifScreenCover } from './utils-event'

import { Scroll } from './ui-scroll'
import { Navigation } from './ui-navigation'

import { Picture } from './utils-picture'

const ctx = canvas.getContext('2d')

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
    this.touchArea = props.touchArea
    this.touchTimeout
  }

  get option() {
    return { x: this.x + this.offsetX, y: this.y + this.offsetY, width: this.width, height: this.height }
  }

  eventDown(e) {
    if (!this.touchArea || ifTouchCover(e, this.touchArea)) this.touchTimeout = true
  }

  eventUp(e) {
    if (this.touchTimeout === true) this.touchEvent()
    this.touchTimeout = false
  }

  eventMove(e) {
    this.touchTimeout = false
  }

  drawTitle() {
    const { x, y, width, height } = this.option

    const width_ = width * 0.35
    const height_ = width * 0.07
    const x_ = x + width * 0.03
    const y_ = y + width * 0.03
    const radius_ = width * 0.02

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.025}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText('SHOP 礼盒', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const shop = this.shop

    const width_ = width * 0.35
    const height_ = width * 0.07
    const x_ = x + width - width_ - width * 0.03
    const y_ = y + height - height_ - width * 0.03
    const radius_ = width * 0.02

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.025}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText([shop.name, '¥' + shop.money.number].join(' '), x_ + width_ / 2, y_ + height_ / 2)
  }

  render() {
    const { x, y, width, height } = this.option
    const shop = this.shop

    ctx.save()

    drawRadius({ x, y, width, height, radius: 12 })

    ctx.clip()

    drawImage(shop.imageDOM, { x: x, y: y, width: width, height: height })

    this.drawTitle()
    this.drawName()

    ctx.restore()

    addEventListener('touchstart', this.eventDown.bind(this), { ifTouchCover: this.option })
    addEventListener('touchmove', this.eventMove.bind(this))
    addEventListener('touchend', this.eventUp.bind(this))
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

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawTitle() {
    const { x, y, width, height } = this.option

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.05
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText('SHOP 礼盒', x_ + width_ / 2, y_ + height_ / 2)
  }

  drawName() {
    const { x, y, width, height } = this.option
    const shop = this.shop

    const width_ = width * 0.5
    const height_ = width * 0.12
    const x_ = x + width - width_ - width * 0.05
    const y_ = y + height - height_ - width * 0.05
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText(shop.name, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawMoney() {
    const { x, y, width, height } = this.option
    const shop = this.shop

    const width_ = width * 0.9
    const height_ = width * 0.12
    const x_ = x + width * 0.05
    const y_ = y + width * 0.22
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    ctx.fillText('¥' + shop.money.number, x_ + width_ / 2, y_ + height_ / 2)
  }

  drawDescription() {
    const { x, y, width, height } = this.option
    const shop = this.shop

    const width_ = width * 0.9
    const height_ = width * 0.57
    const x_ = x + width * 0.05
    const y_ = y + width * 0.56
    const radius_ = width * 0.03

    drawRadius({ x: x_, y: y_, width: width_, height: height_, radius: radius_ })

    ctx.fillStyle = `rgba(255, 255, 255, 0.75)`

    ctx.fill()

    ctx.textAlign = 'start'
    ctx.textBaseline = 'top'
    ctx.font = `900 ${width * 0.05}px ${window.fontFamily}`
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'

    drawMultilineText({ x: x_ + width * 0.05, y: y_ + width * 0.05, width: width_ - width * 0.1, wrapSpace: width * 0.075, text: shop.description })
  }

  render() {
    if (this.novaTime < 1) this.novaTime = numberFix(this.novaTime + 0.05)

    const { x, y, width, height } = this.option
    const shop = this.shop

    ctx.save()

    drawRadius({ x, y, width, height, radius: width * 0.08 })

    ctx.clip()

    drawImage(shop.imageDOM, { x: x, y: y, width: width, height: height })

    ctx.globalAlpha = this.novaTime

    this.drawTitle()
    this.drawName()
    this.drawMoney()
    this.drawDescription()

    ctx.restore()
  }
}

class Page {
  constructor() {
    this.preview = null

    this.money = 1
    this.type = 'alltime'

    this.shop

    this.InstanceNavigation
    this.InstanceScroll
    this.InstanceShop
    this.InstanceShopPreview

    this.init()
  }

  get shopHeight() {
    const row = this.shop.length
    return row === 0 ? -12 : (((windowWidth - 60) / 4 * 1.35) * row) + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.shop = Imitation.state.shop.filter(i => i.type === this.type && i.money.key === this.money)

    this.instanceNavigation()
    this.instanceScroll()
    this.instanceShop()
    this.instanceShopPreview()
  }

  instanceNavigation() {
    const option = {
      content: [
        [
          {
            justifyContent: 'left',
            text: '返回',
            event: () => {
              Imitation.state.page.current = 'transition'
              Imitation.state.page.next = 'home'
            }
          },
          {
            justifyContent: 'right',
            text: '商店',
          }
        ],
        [
          ...new Array(['alltime', '常驻'], ['week_' + new Date().getDay(), '周活动']).map((i, index) => {
            return {
              active: i[0] === this.type,
              justifyContent: 'left',
              text: i[1],
              event: () => {
                this.type = i[0]
                this.init()
              }
            }
          })
        ],
        [
          ...parseMoney(Imitation.state.info.money).map((i, index) => {
            return {
              active: i.key === this.money,
              justifyContent: 'left',
              text: `${i.name} ¥${i.number}`,
              width: (windowWidth - 12 * 6) / 3,
              event: () => {
                this.money = i.key
                this.init()
              }
            }
          })
        ],
      ]
    }

    this.InstanceNavigation = new Navigation(option)
  }

  instanceScroll() {
    const option = { x: 12, y: 12 + safeTop, width: windowWidth - 24, height: windowHeight - this.InstanceNavigation.height - 36 - safeTop, radius: 12 }
    option.scrollY = this.shopHeight - option.height + 24

    this.InstanceScroll = new Scroll(option)
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
      option.y = 12 + index * (option.height + 12) + safeTop

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

      this.InstanceShop.forEach((i) => {
        i.offsetY = 0 - offsetY
        if (ifScreenCover(i.option, this.InstanceScroll.option)) i.render()
      })
    }

    this.InstanceScroll.render(event)
  }

  drawPreview() {
    var closeCover = []

    this.InstanceShopPreview.shop = this.preview

    this.InstanceShopPreview.render()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `900 12px ${window.fontFamily}`

    const option = { width: 108, height: 36, radius: 8, y: this.InstanceShopPreview.y + this.InstanceShopPreview.height + 24 }
    option.x = (windowWidth - option.width) / 2

    drawRadius(option)
    ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    ctx.fill()
    ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    ctx.fillText('购买', option.x + option.width / 2, option.y + option.height / 2)

    const buy = () => {
      this.buy(this.preview)
      this.preview = null
      this.InstanceShopPreview.novaTime = 0
    }

    addEventListener('touchstart', buy, { ifTouchCover: option })

    closeCover.push(option)

    const close = (e) => {
      if (closeCover.some(i => ifTouchCover(e, i))) return
      this.preview = null
      this.InstanceShopPreview.novaTime = 0
    }

    addEventListener('touchstart', close)
  }

  buy(shop) {
    const findInMoney = Imitation.state.info.money.find(i => i.key === shop.money.key)

    if (findInMoney.number < shop.money.number) {
      Imitation.state.function.message('货币不足', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    findInMoney.number = findInMoney.number - shop.money.number

    const reward = shop.reward()

    Imitation.state.function.message('购买成功', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
    Imitation.state.reward = { value: reward, back: 'shop', title: '购买获得' }
    Imitation.state.page.current = 'transition'
    Imitation.state.page.next = 'reward'
  }

  render() {
    drawImage(Picture.get('background-page'), { x: 0, y: 0, width: windowWidth, height: windowHeight })
    this.InstanceNavigation.render()

    if (!this.preview) {
      this.drawScroll()
    }

    if (this.preview) {
      this.drawPreview()
    }
  }
}

export default Page