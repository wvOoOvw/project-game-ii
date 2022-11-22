import { parseCard, parseMaster, parseMoney, levelText, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'
import { drawImage, drawImageFullHeight, drawRect, drawRectRadius, drawRectAngle, drawMultilineText } from './utils-canvas'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

import { Navigation } from './ui-navigation'
import { CardEmpty, CardInPve,CardInPveMessage } from './ui-source'

const numberAnimation = (number, time, callback) => {
  const list = new Array(time).fill(number / time)
  const event = () => {
    requestAnimationFrame(() => {
      callback(list.shift())
      if (list[0]) event()
    })
  }
  event()
}

class RoleMessage {
  constructor() {
    this.queqe = []
    this.time = 60
  }

  play(option) {
    this.queqe.push({ ...option, time: this.time })
  }

  render() {
    this.queqe.forEach(i => {
      const fontSize = i.fontSize
      const text = i.text

      const offsetX = (i.time - this.time) / 4
      const offsetY = (i.time - this.time) / 2

      Canvas.ctx.save()

      Canvas.ctx.globalAlpha = i.time / this.time
      Canvas.ctx.textAlign = 'center'
      Canvas.ctx.textBaseline = 'middle'
      Canvas.ctx.font = `900 ${fontSize}px Courier`

      const width = Canvas.ctx.measureText(text).width + 48

      drawRectRadius({ x: i.x - width / 2 + offsetX, y: i.y - fontSize + offsetY, width: width, height: fontSize * 2, radius: fontSize * 0.2 })
      Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)'
      Canvas.ctx.fill()

      Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
      Canvas.ctx.fillText(text, i.x + offsetX, i.y + offsetY)

      Canvas.ctx.restore()

      i.time = numberFix(i.time - 1)

      if (i.time === 0) this.queqe = this.queqe.filter(i => i.time)
    })
  }
}

class Role {
  constructor(props) {
    this.x = props.x
    this.y = props.y
    this.width = props.width
    this.height = props.height

    this.type = props.type
    this.information = props.information
    this.useCard = props.useCard

    this.InstanceCards = []
    this.touchCard
  }

  get option() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  drawBackground() {
    const { x, y, width, height, information } = this

    drawImageFullHeight(information.master.imageDOM, { x: x, y: y, width: width, height: height })
  }

  drawTitle() {
    const { x, y, width, height, information } = this

    const option = {
      width: width * 0.4,
      height: width * 0.12,
    }
    option.x = x + width / 2 - option.width / 2
    option.y = y + width * 0.02
    option.radius = option.height / 8

    Canvas.ctx.textAlign = 'center'
    Canvas.ctx.textBaseline = 'middle'
    Canvas.ctx.font = `900 ${width * 0.04}px Courier`

    drawRectRadius(option)
    Canvas.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`
    Canvas.ctx.fill()
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fillText([information.master.name, levelText(information.master.level)].join(' '), option.x + option.width / 2, option.y + option.height / 2)
  }

  drawACTION() {
    const { x, y, width, height, information } = this

    const option = {
      width: width * 0.04,
      height: width * 0.04,
    }
    option.x = x + width / 2 + width * 0.2 + width * 0.04
    option.y = y + width * 0.06
    option.radius = option.height / 2

    if (information.master._ACTION && information.master._ACTION > 0) {
      new Array(information.master._ACTION).fill().forEach((i, index) => {
        const option_ = { ...option, x: option.x + index * (option.width + width * 0.04) }
        drawRectAngle(option_)
        Canvas.ctx.fillStyle = `rgba(255, 255, 255, 1)`
        Canvas.ctx.fill()
      })
    }
  }

  drawHA() {
    const { x, y, width, height, information } = this

    Canvas.ctx.textAlign = 'center'
    Canvas.ctx.textBaseline = 'middle'
    Canvas.ctx.font = `900 ${width * 0.04}px Courier`

    const option = {
      width: width * 1.2,
      height: width * 0.12,
    }
    option.x = x + (width - option.width) / 2
    option.y = y + height - option.height - width * 0.02
    option.radius = option.height / 2

    Canvas.ctx.save()

    drawRectRadius(option)

    Canvas.ctx.clip()

    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    Canvas.ctx.fill()

    drawRect({ ...option, width: information.master.HP / information.master.HP_ * option.width })

    Canvas.ctx.fillStyle = `rgba(185, 0, 0, 0.5)`
    Canvas.ctx.fill()

    Canvas.ctx.restore()

    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'

    Canvas.ctx.fillText(`HP ${Math.floor(information.master.HP)} / ${information.master.HP_} - ATTACT ${Math.floor(information.master.ATTACT)}`, option.x + option.width / 2, option.y + option.height / 2)
  }

  drawBuff() {
    const { x, y, width, height, information } = this

    Canvas.ctx.textAlign = 'center'
    Canvas.ctx.textBaseline = 'middle'
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 1)'
    Canvas.ctx.font = `900 ${width * 0.03}px Courier`

    var renderList = information.master.buff
      .reduce((t, i) => {
        const find = t.find(i_ => i_.name === i)
        if (find) find.number = find.number + 1
        if (!find) t.push({ name: i, number: 1 })
        return t
      }, [])

    if (renderList.length === 0) renderList = [{ name: 'BUFF' }]

    renderList
      .forEach((i, index) => {
        const option = {
          width: width * 0.16,
          height: width * 0.08,
        }

        const maxIndex = renderList.length
        const centerIndex = maxIndex / 2 - 0.5
        const diff = index - centerIndex

        option.x = x + (width - option.width) / 2 + diff * (option.width + width * 0.02)
        option.y = y + height + width * 0.02
        option.radius = option.height / 8

        drawRectRadius(option)
        Canvas.ctx.fillStyle = `rgba(0, 0, 0, 0.75)`
        Canvas.ctx.fill()
        Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        Canvas.ctx.fillText(i.number ? `${i.name} X${i.number}` : i.name, option.x + option.width / 2, option.y + option.height / 2)
      })
  }

  drawCard() {
    const width = this.width
    const height = this.height
    const x = this.x - (width - this.width) / 2
    const y = this.y

    this.InstanceCards = this.InstanceCards.filter(i => this.information.card.hand.find(i_ => i_ === i.card))

    this.information.card.hand.forEach((i, index) => {
      const maxIndex = this.information.card.hand.length
      const centerIndex = maxIndex / 2 - 0.5
      const diff = index - centerIndex

      const option = {}
      option.width = width * 0.42
      option.height = option.width * 1.35
      option.x = x + (width - option.width) / 2 + diff * width * 0.45
      option.y = y + (height - option.height) / 2
      option.touchStart = () => this.touchCard = i
      option.touchEnd = () => this.useCard(i)
      option.card = i
      option.type = this.type

      const find = this.InstanceCards.find(i_ => i_.card === i)

      if (find) {
        find.x = option.x
      }

      if (!find) {
        if (this.type === 'self') this.InstanceCards.push(new CardInPve(option))
        if (this.type === 'opposite') this.InstanceCards.push(new CardEmpty(option))
      }
    })

    this.InstanceCards.forEach(i => i.card !== this.touchCard ? i.render() : null)
    this.InstanceCards.forEach(i => i.card === this.touchCard ? i.render() : null)
  }

  render() {
    this.drawBackground()
    this.drawTitle()
    this.drawACTION()
    this.drawHA()
    this.drawBuff()
    this.drawCard()
  }
}

class Round {
  constructor() {
    this.round
  }

  render() {
    const option = {}

    option.width = 120
    option.height = 12
    option.y = 12
    option.x = (Canvas.width - option.width) / 2

    Canvas.ctx.textAlign = 'center'
    Canvas.ctx.textBaseline = 'middle'

    Canvas.ctx.font = `900 24px Courier`
    Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    Canvas.ctx.fillText('ROUND', option.x + option.width / 2, option.y + option.height / 2)

    Canvas.ctx.font = `900 14px Courier`
    Canvas.ctx.fillStyle = 'rgba(255, 255, 255, 1)'
    Canvas.ctx.fillText(`${Math.floor(this.round)}/99`, option.x + option.width / 2, option.y + option.height / 2 + 2)
  }
}

class Page {
  constructor() {
    this.currentUseCard = false
    this.currentRole
    this.round = 0.5
    this.auto = false
    this.log = []

    this.InstanceRound = new Round()
    this.InstanceNavigation
    this.InstanceRoleSelf
    this.InstanceRoleOpposite
    this.InstanceRoleMessage = new RoleMessage()
    this.InstanceCardInPveMessage = new CardInPveMessage()

    this.instanceNavigation()
    this.instanceRoleSelf()
    this.instanceRoleOpposite()

    this.currentRole = this.InstanceRoleSelf
    this.roundStart()
  }

  instanceRoleSelf() {
    const boxHeight = (Canvas.height - this.InstanceNavigation.height - 36) / 2

    const option = {
      width: Math.min(Canvas.width * 0.75, boxHeight * 0.75),
      height: Math.min(Canvas.width * 0.75, boxHeight * 0.75),
      type: 'self',
      information: Imitation.state.battle.self,
      useCard: this.useCard,
    }
    option.x = (Canvas.width - option.width) / 2
    option.y = Canvas.height - this.InstanceNavigation.height - 24 - boxHeight + (boxHeight - option.height) / 2

    this.InstanceRoleSelf = new Role(option)
  }

  instanceRoleOpposite() {
    const boxHeight = (Canvas.height - this.InstanceNavigation.height - 36) / 2

    const option = {
      width: Math.min(Canvas.width * 0.75, boxHeight * 0.75),
      height: Math.min(Canvas.width * 0.75, boxHeight * 0.75),
      type: 'opposite',
      information: Imitation.state.battle.opposite,
      useCard: this.useCard
    }
    option.x = (Canvas.width - option.width) / 2
    option.y = (boxHeight - option.height) / 2 + 24

    this.InstanceRoleOpposite = new Role(option)
  }

  instanceNavigation() {
    const option = {
      content: [
        [
          {
            justifyContent: 'left',
            text: '退出战斗',
            event: () => {
              Imitation.state.page.current = 'transition'
              Imitation.state.page.next = 'explore'
            }
          },
          {
            justifyContent: 'left',
            text: '自动战斗',
            active: this.auto,
            event: () => {
              this.auto = !this.auto
              this.instanceNavigation()
              this.oppositeAI()
            }
          },
          {
            justifyContent: 'right',
            text: '结束回合',
            event: this.roundOver
          },
        ],
      ]
    }

    this.InstanceNavigation = new Navigation(option)
  }

  pumpCard = (card, role) => {
    if (role.information.card.hand.length === 2) {
      role.information.card.cemetery.push(card)
    }
    if (role.information.card.hand.length < 2) {
      role.information.card.hand.push(card)
    }
  }

  useCard = async (card) => {
    if (this.currentUseCard) return

    const currentRole = this.currentRole

    const [self, opposite] = currentRole === this.InstanceRoleSelf ? [this.InstanceRoleSelf, this.InstanceRoleOpposite] : [this.InstanceRoleOpposite, this.InstanceRoleSelf]

    this.currentUseCard = true

    self.information.card.hand = self.information.card.hand.filter(i => i !== card)
    self.information.master._ACTION = self.information.master._ACTION - 1

    this.InstanceCardInPveMessage.play(card)
    if (Imitation.state.soundSource) Sound.play(card.soundAction)

    await wait(120)

    var result = card.function(card, self.information, opposite.information)

    self.information.master.skill.forEach(skill => skill.function(card, skill, result, self.information, opposite.information))

    var roleMessageTimeSelf = 0
    var roleMessageTimeOpposite = 0

    while (result.length) {
      const current = result.shift()

      if (current.custom) {
        current.custom(card, result, self.information, opposite.information)
      }

      if (current.message) {
        Message.play(current.message, 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
      }

      if (current.animation) {
        if (current.target === 'self') {
          Animation.play(current.animation, (img) => [self.x + self.width / 2 - img.width / 2, self.y + self.height / 2 - img.height / 2])
        }
        if (current.target === 'opposite') {
          Animation.play(current.animation, (img) => [opposite.x + opposite.width / 2 - img.width / 2, opposite.y + opposite.height / 2 - img.height / 2])
        }
      }

      if (current.roleMessage) {
        if (current.target === 'self') {
          wait(roleMessageTimeSelf * 30, () => {
            this.InstanceRoleMessage.play({ text: current.roleMessage, x: self.x + self.width / 2, y: self.y + self.height / 2, fontSize: this.InstanceRoleSelf.width * 0.04 })
          })
          roleMessageTimeSelf = roleMessageTimeSelf + 1
        }
        if (current.target === 'opposite') {
          wait(roleMessageTimeOpposite * 30, () => {
            this.InstanceRoleMessage.play({ text: current.roleMessage, x: opposite.x + opposite.width / 2, y: opposite.y + opposite.height / 2, fontSize: this.InstanceRoleSelf.width * 0.04 })
          })
          roleMessageTimeOpposite = roleMessageTimeOpposite + 1
        }
      }

      if (current.effect) {
        if (current.effect === 'HP') {
          if (current.target === 'self') {
            numberAnimation(current.value, 32, i => self.information.master.HP = Math.min(self.information.master.HP + i, self.information.master.HP_))
          }
          if (current.target === 'opposite') {
            numberAnimation(current.value, 32, i => opposite.information.master.HP = Math.min(opposite.information.master.HP + i, opposite.information.master.HP_))
          }
        }

        if (current.effect === 'ATTACT') {
          if (current.target === 'self') {
            numberAnimation(current.value, 32, i => self.information.master.ATTACT = self.information.master.ATTACT + i)
          }
          if (current.target === 'opposite') {
            numberAnimation(current.value, 32, i => opposite.information.master.ATTACT = opposite.information.master.ATTACT + i)
          }
        }

        if (current.effect === 'BUFF') {
          if (current.target === 'self') {
            if (current.number > 0) {
              self.information.master.buff.push(...new Array(current.number).fill(current.name))
            }
            if (current.number < 0) {
              let count = 0
              self.information.master.buff = self.information.master.buff.filter(i => {
                if (i === current.name && count !== current.number) {
                  count = count - 1
                  return false
                }
                return true
              })
            }
          }
          if (current.target === 'opposite') {
            if (current.number > 0) {
              opposite.information.master.buff.push(...new Array(current.number).fill(current.name))
            }
            if (current.number < 0) {
              let count = 0
              opposite.information.master.buff = opposite.information.master.buff.filter(i => {
                if (i === current.name && count !== current.number) {
                  count = count - 1
                  return false
                }
                return true
              })
            }
          }
        }

        if (current.effect = 'LEVEL') {
          if (current.target === 'self') {
            self.information.card.team.forEach(i => {
              if (i.key === current.key) i.level = i.level + current.number
            })
          }
          if (current.target === 'opposite') {
            opposite.information.card.team.forEach(i => {
              if (i.key === current.key) i.level = i.level + current.number
            })
          }
        }
      }
    }

    this.log.push({ card, user: currentRole === this.InstanceRoleSelf ? 'self' : 'opposite', round: this.round })

    await wait(120)

    this.roundContinue()
  }

  oppositeAI = async () => {
    const currentRole = this.currentRole

    var result

    if (currentRole.information.AI) {
      result = currentRole.information.AI(currentRole.information, this.InstanceRoleSelf.information)
    }

    if (!currentRole.information.AI) {
      result = arrayRandom(currentRole.information.card.hand, 1)[0]
    }

    await wait(60)
    await this.useCard(result)
    await wait(60)
  }

  roundStart = async () => {
    this.round = this.round + 0.5

    const currentRole = this.currentRole

    currentRole.information.roundCache = null
    currentRole.information.master._ACTION = currentRole.information.master.ACTION
    currentRole.information.card.hand = arrayRandom(currentRole.information.card.team, 2)

    if (currentRole === this.InstanceRoleOpposite || this.auto) this.oppositeAI()
  }

  roundContinue = async () => {
    const currentRole = this.currentRole

    if (currentRole.information.master._ACTION > 0) {
      currentRole.information.card.hand = arrayRandom(currentRole.information.card.team, 2)
      if (currentRole === this.InstanceRoleOpposite || this.auto) this.oppositeAI()
    }

    if (currentRole.information.master._ACTION === 0) {
      this.roundOver()
    }

    this.currentUseCard = false
  }

  roundOver = async () => {
    const currentRole = this.currentRole

    currentRole.information.master._ACTION = 0
    currentRole.information.card.hand = []

    if (this.currentRole === this.InstanceRoleSelf) {
      this.currentRole = this.InstanceRoleOpposite
      await this.roundStart()
      return
    }

    if (this.currentRole === this.InstanceRoleOpposite) {
      this.currentRole = this.InstanceRoleSelf
      await this.roundStart()
      return
    }
  }

  battlerOver = () => {
    if (this.InstanceRoleOpposite.information.master.HP <= 0) {
      const reward = Imitation.state.battle.reward()

      Message.play('战斗胜利', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
      Imitation.state.reward = { value: reward, back: 'explore', title: '战斗胜利' }
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'reward'
      return
    }
    if (this.InstanceRoleSelf.information.master.HP <= 0) {
      Message.play('战斗失败', 'rgba(0, 0, 0, 1)', 'rgba(255, 255, 255, 1)')
      Imitation.state.reward = { value: [], back: 'explore', title: '战斗失败' }
      Imitation.state.page.current = 'transition'
      Imitation.state.page.next = 'reward'
      return
    }
  }

  render() {
    drawImage(Picture.get('background-page'), { x: 0, y: 0, width: Canvas.width, height: Canvas.height })

    this.InstanceRound.round = this.round

    this.InstanceRound.render()
    this.InstanceNavigation.render()
    this.InstanceRoleOpposite.render()
    this.InstanceRoleSelf.render()
    this.InstanceCardInPveMessage.render()
    this.InstanceRoleMessage.render()

    this.battlerOver()
  }
}

export default Page