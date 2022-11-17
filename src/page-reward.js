import { ifTouchCover, ifScreenCover, parseCard, parseMaster, parseMoney, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'
import { drawMultilineText, drawImage, drawRect, drawRectRadius } from './utils-canvas'

import { Scroll } from './ui-scroll'
import { Navigation } from './ui-navigation'
import { MoneyInList, CardInList, MasterInList, CardInPreview, MasterInPreview } from './ui-source'

import { Picture } from './utils-picture'

const ctx = canvas.getContext('2d')

const safeTop = wx.getSystemInfoSync().safeArea.top
const windowWidth = wx.getSystemInfoSync().windowWidth
const windowHeight = wx.getSystemInfoSync().windowHeight

class Page {
  constructor() {
    this.preview = null

    this.type

    this.card = []
    this.master = []
    this.money = []

    this.InstanceNavigation
    this.InstanceScroll
    this.InstanceCard
    this.InstanceCardPreview
    this.InstanceMaster
    this.InstanceMasterPreview
    this.InstanceMoney

    this.init()
    this.compute()
  }

  get masterHeight() {
    const row = this.master.length
    return ((windowWidth - 60) / 4 * 1.35) * row + (row ? 12 * (row - 1) : 0)
  }

  get cardHeight() {
    const row = Math.ceil(this.card.length / 4)
    return ((windowWidth - 60) / 4 * 1.35) * row + (row ? 12 * (row - 1) : 0)
  }

  get moneyHeight() {
    const row = Math.ceil(this.money.length / 4)
    return ((windowWidth - 60) / 4 * 1.35) * row + (row ? 12 * (row - 1) : 0)
  }

  init() {
    this.card = []
    this.master = []
    this.money = []

    if (!this.type && window.Imitation.state.reward.value.some(i => i.card)) {
      this.type = 'card'
    }
    if (!this.type && window.Imitation.state.reward.value.some(i => i.master)) {
      this.type = 'master'
    }
    if (!this.type && window.Imitation.state.reward.value.some(i => i.money)) {
      this.type = 'money'
    }

    if (this.type === 'card') {
      this.card = parseCard(window.Imitation.state.reward.value.filter(i => i.card).map(i => ({ ...i, level: 1 })))
    }
    if (this.type === 'master') {
      this.master = parseMaster(window.Imitation.state.reward.value.filter(i => i.master).map(i => ({ ...i, level: 1 })))
    }
    if (this.type === 'money') {
      this.money = parseMoney(window.Imitation.state.reward.value.filter(i => i.money))
    }

    this.instanceNavigation()
    this.instanceScroll()
    this.instanceCard()
    this.instanceMaster()
    this.instanceMoney()
    this.instanceCardPreview()
    this.instanceMasterPreview()
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
              window.Imitation.state.page.next = window.Imitation.state.reward.back
            }
          },
          {
            active: true,
            justifyContent: 'left',
            text: new Array(['card', '卡牌'], ['master', '队长'], ['money', '资源']).find(i => i[0] === this.type)[1],
            event: () => {
              var r
              if (!r && this.type === 'card') r = 'master'
              if (!r && this.type === 'master') r = 'money'
              if (!r && this.type === 'money') r = 'card'
              this.type = r
              this.init()
            }
          },
          {
            justifyContent: 'right',
            text: window.Imitation.state.reward.title,
          },
        ],
      ]
    }

    this.InstanceNavigation = new Navigation(option)
  }

  instanceScroll() {
    const option = { x: 12, y: 12 + safeTop, width: windowWidth - 24, height: windowHeight - this.InstanceNavigation.height - 36 - safeTop, contentHeight: this.masterHeight + this.cardHeight + this.moneyHeight + 12 }

    this.InstanceScroll = new Scroll(option)
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
      option.y = 12 + index * (option.height + 12) + safeTop

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
      option.y = 12 + parseInt(index / 4) * (option.height + 12) + safeTop

      return new CardInList(option)
    })
  }

  instanceMoney() {
    this.InstanceMoney = this.money.map((money, index) => {
      const option = {
        width: windowWidth - 24,
        money: money,
      }

      option.height = (windowWidth - 60) / 4 * 1.35
      option.x = 12
      option.y = 12 + index * (option.height + 12) + safeTop

      return new MoneyInList(option)
    })
  }

  instanceCardPreview() {
    this.InstanceCardPreview = new CardInPreview()
  }

  instanceMasterPreview() {
    this.InstanceMasterPreview = new MasterInPreview()
  }

  drawScroll() {
    const event = (scroll) => {
      const offsetY = scroll[1]

      this.InstanceMaster.forEach((i) => {
        i.offsetY = 0 - offsetY
        const cover = ifScreenCover(i.option, this.InstanceScroll.option)
        if (cover) i.render()
        if (!cover) i.novaTime = 0
      })
      this.InstanceCard.forEach((i) => {
        i.offsetY = 0 - offsetY
        const cover = ifScreenCover(i.option, this.InstanceScroll.option)
        if (cover) i.render()
        if (!cover) i.novaTime = 0
      })
      this.InstanceMoney.forEach((i) => {
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
      this.InstanceMasterPreview.skillIndex = 0
      this.InstanceMasterPreview.novaTime = 0
      this.InstanceCardPreview.novaTime = 0
      this.InstanceCard.forEach(i => i.novaTime = 0)
      this.InstanceMaster.forEach(i => i.novaTime = 0)
      this.InstanceMoney.forEach(i => i.novaTime = 0)
    }

    if (this.InstanceCard.find(i => i.card === this.preview)) {
      this.InstanceCardPreview.card = this.preview
      this.InstanceCardPreview.close = close
      this.InstanceCardPreview.render()
    }
    if (this.InstanceMaster.find(i => i.master === this.preview)) {
      this.InstanceMasterPreview.master = this.preview
      this.InstanceMasterPreview.close = close
      this.InstanceMasterPreview.render()
    }
  }

  compute() {
    const library = window.Imitation.state.info.library
    const reward = window.Imitation.state.reward.value

    reward.forEach(i => {
      if (i.card) {
        const findInLibrary = library.card.find(i_ => i_.key === i.key)
        if (findInLibrary) {
          findInLibrary.exp = findInLibrary.exp + i.exp
        }
        if (!findInLibrary) {
          library.card.push({ key: i.key, level: 1, exp: i.exp })
        }
        const findInLibrary_ = library.card.find(i_ => i_.key === i.key)
        while (findInLibrary_.exp >= 100 * Math.pow(2, findInLibrary_.level - 1)) {
          findInLibrary_.exp = findInLibrary_.exp - 100 * Math.pow(2, findInLibrary_.level - 1)
          findInLibrary_.level = findInLibrary_.level + 1
        }
      }
      if (i.master) {
        const findInLibrary = library.master.find(i_ => i_.key === i.key)
        if (findInLibrary) {
          findInLibrary.exp = findInLibrary.exp + i.exp
        }
        if (!findInLibrary) {
          library.master.push({ key: i.key, level: 1, exp: i.exp })
        }
        const findInLibrary_ = library.card.find(i_ => i_.key === i.key)
        while (findInLibrary_.exp >= 100 * Math.pow(2, findInLibrary_.level - 1)) {
          findInLibrary_.exp = findInLibrary_.exp - 100 * Math.pow(2, findInLibrary_.level - 1)
          findInLibrary_.level = findInLibrary_.level + 1
        }
      }
    })

    window.Imitation.state.function.setInfo()
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