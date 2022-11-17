import { ifTouchCover, ifScreenCover, parseCard, parseMaster, parseMoney, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRectRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Navigation } from './ui-navigation'
import { ShopInList, ShopInPreview } from './ui-source'

import { Picture } from './utils-picture'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

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
    return ((windowWidth - 60) / 4 * 1.35) * row + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.shop = window.Imitation.state.shop.filter(i => i.type === this.type).map(i => { i.money = parseMoney([i.money])[0]; return i })

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
              window.Imitation.state.page.current = 'transition'
              window.Imitation.state.page.next = 'home'
            }
          },
          {
            active: true,
            justifyContent: 'left',
            text: new Array(['alltime', '常驻'], ['week_' + new Date().getDay(), '周活动']).find(i => i[0] === this.type)[1],
            event: () => {
              var r
              if (!r && this.type === 'alltime') r = 'week_' + new Date().getDay()
              if (!r && this.type === 'week_' + new Date().getDay()) r = 'alltime'
              this.type = r
              this.init()
            }
          },
          {
            justifyContent: 'right',
            text: '商店',
          }
        ],
      ]
    }

    this.InstanceNavigation = new Navigation(option)
  }

  instanceScroll() {
    const option = { x: 12, y: 12 + safeTop, width: windowWidth - 24, height: windowHeight - this.InstanceNavigation.height - 36 - safeTop, contentHeight: this.shopHeight }

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
    this.InstanceShopPreview = new ShopInPreview()
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]

      this.InstanceShop.forEach((i) => {
        i.offsetY = 0 - offsetY
        const cover = ifScreenCover(i.option, this.InstanceScroll.option)
        if (cover) i.render()
        if (!cover) i.novaTime = 0
      })
    }

    this.InstanceScroll.render(event)
  }

  drawPreview() {
    const close = (e) => {
      this.preview = null
      this.InstanceShopPreview.novaTime = 0
      this.InstanceShop.forEach(i => i.novaTime = 0)
    }

    const buy = () => {
      this.buy(this.preview)
      this.preview = null
      this.InstanceShopPreview.novaTime = 0
    }

    if (!this.preview.inTeam) {
      this.InstanceShopPreview.extra = [
        {
          name: '购买',
          event: () => buy()
        }
      ]
    }
    this.InstanceShopPreview.close = close
    this.InstanceShopPreview.shop = this.preview
    this.InstanceShopPreview.render()
  }

  buy(shop) {
    const findInMoney = window.Imitation.state.info.money.find(i => i.key === shop.money.key)

    if (findInMoney.number < shop.money.number) {
      window.Imitation.state.function.message('货币不足', 'rgba(255, 50 ,50, 1)', 'rgba(255, 255, 255, 1)')
      return
    }

    findInMoney.number = findInMoney.number - shop.money.number

    const reward = shop.reward()

    window.Imitation.state.function.message('购买成功', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
    window.Imitation.state.reward = { value: reward, back: 'shop', title: '购买获得' }
    window.Imitation.state.page.current = 'transition'
    window.Imitation.state.page.next = 'reward'
  }

  render() {
    drawImage(Picture.get('background-page'), { x: 0, y: 0, width: windowWidth, height: windowHeight })

    if (this.preview) {
      this.drawPreview()
    }

    if (!this.preview) {
      this.InstanceNavigation.render()
      this.drawScroll()
    }
  }
}

export default Page