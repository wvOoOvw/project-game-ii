import { arrayRandom, levelText } from './utils-common'

import { Picture } from './utils-picture'

const LevelRise = (v, l) => Math.floor(v * Math.pow(1.2, (l - 1)))

var originMoney = [
  {
    key: 1,
    name: '金币',
  },
  {
    key: 2,
    name: '钻石',
  },
  {
    key: 3,
    name: '碎片',
  },
]

var originExplore = [
  {
    key: 1,
    name: '故事 I',
    description: '可能包含: 金币 0 - 500 枚',
    difficulty: 1,
    type: 'alltime',
    boss: {
      master: { key: 1, level: 1 },
      card: [
        { key: 1, level: 1, number: 10 },
        { key: 2, level: 1, number: 10 },
      ]
    },
    reward: () => {
      return [
        { money: true, key: 1, number: Math.floor(Math.random() * 500) },
      ]
    },
    AI: (self, opposite, env) => {
      return arrayRandom(self.card.hand, 1)
    }
  },
  {
    key: 2,
    name: '梦境 I',
    description: '可能包含: 小火把 Exp 0 - 20, 大火把 Exp 0 - 20',
    difficulty: 2,
    type: 'alltime',
    boss: {
      master: { key: 2, level: 2 },
      card: [
        { key: 1, level: 3, number: 10 },
        { key: 2, level: 3, number: 10 },
        { key: 3, level: 3, number: 10 },
      ]
    },
    reward: () => {
      return [
        { card: true, key: 1, exp: Math.floor(Math.random() * 20) },
        { card: true, key: 2, exp: Math.floor(Math.random() * 20) },
      ]
    },
    AI: (self, opposite, env) => {
      return arrayRandom(self.card.hand, 1)
    }
  },
]

var originShop = [
  {
    key: 1,
    name: '火系基础礼盒I',
    description: '可能包含: 小火把 Exp 0 - 20, 大火把 Exp 0 - 20',
    type: 'alltime',
    money: {
      key: 1,
      number: 1000
    },
    reward: () => {
      return [
        { card: true, key: 1, exp: Math.floor(Math.random() * 20) },
        { card: true, key: 2, exp: Math.floor(Math.random() * 20) },

      ]
    },
  },
  {
    key: 2,
    name: '火系基础礼盒II',
    description: '可能包含: 点燃 Exp 0 - 20, 引燃 Exp 0 - 20, 火焰领主 Exp 50-100',
    type: 'alltime',
    money: {
      key: 2,
      number: 1000
    },
    reward: () => {
      return [
        { card: true, key: 3, exp: Math.floor(Math.random() * 20) },
        { card: true, key: 5, exp: Math.floor(Math.random() * 20) },
        { master: true, key: 2, exp: Math.floor(Math.random() * 50 + 50) },
      ]
    },
  },
]

var originMaster = [
  {
    key: 1,
    name: '艾露恩',
    HP: l => LevelRise(1000, l),
    MP: l => 1000,
    skill: [
      {
        name: '庇护 I',
        description: l => `使用卡牌时, 回复 5% HP`,
        function: (card, skill, result, self, opposite, env) => {
          result.push({ effect: 'cure-hp', target: 'self', value: Math.floor(self.master.HP_ * 0.05) })
          result.push({ roleMessage: `${skill.name} HP + ${Math.floor(self.master.HP_ * 0.05)}`, fillStyle: 'rgba(0, 255, 0, 1)', target: 'self' })
        }
      },
      {
        name: '庇护 II',
        description: l => `使用卡牌时, 回复 5% MP`,
        function: (card, skill, result, self, opposite, env) => {
          result.push({ effect: 'cure-mp', target: 'self', value: Math.floor(self.master.MP_ * 0.05) })
          result.push({ roleMessage: `${skill.name} MP + ${Math.floor(self.master.HP_ * 0.05)}`, fillStyle: 'rgba(0, 255, 0, 1)', target: 'self' })
        }
      },
    ],
  },
  {
    key: 2,
    name: '火焰领主',
    HP: l => LevelRise(800, l),
    MP: l => 1200,
    skill: [
      {
        name: '欲火',
        description: l => `使用火系卡牌时, 额外造成 ${LevelRise(50, l)} 伤害`,
        function: (card, skill, result, self, opposite, env) => {
          if (card.race === '火') {
            result.push({ effect: 'cost-hp', target: 'opposite', value: LevelRise(50, self.master.level) })
            result.push({ roleMessage: `${skill.name} HP - ${LevelRise(50, self.master.level)}`, fillStyle: 'rgba(255, 0, 0, 1)', target: 'opposite' })
          }
        }
      }
    ],
  },
  {
    key: 3,
    name: '炎魔',
    HP: l => LevelRise(700, l),
    MP: l => 1500,
    skill: [
      {
        name: '火焰控制',
        description: l => `使用火系卡牌时, 若目标的 '燃' 层数大于等于5, 从牌库抽取一张卡, 并消耗目标 1 层 '燃'`,
        function: (card, skill, result, self, opposite, env) => {
          if (card.race === '火' && opposite.master.buff.filter(i => i === '燃') >= 5) {
            result.push({ effect: 'pump-store-positive', target: 'self', value: 1 })
            result.push({ effect: 'cost-buff', target: 'opposite', value: '燃', number: 1 })
          }
        }
      },
      {
        name: '欲火',
        description: l => `使用火系卡牌时, 额外造成 ${LevelRise(50, l)} 伤害`,
        function: (card, skill, result, self, opposite, env) => {
          if (card.race === '火') {
            result.push({ effect: 'cost-hp', target: 'opposite', value: LevelRise(50, self.master.level) })
            result.push({ roleMessage: `${skill.name} HP - ${LevelRise(50, self.master.level)}`, fillStyle: 'rgba(255, 0, 0, 1)', target: 'opposite' })
          }
        }
      }
    ],
  },
]

var originCard = [
  {
    key: 1,
    name: '小火把',
    type: '进攻卡',
    race: '火',
    limit: 3,
    description: l => `造成 ${LevelRise(100, l)} 伤害, 并附加给目标 1 层 '燃'`,
    function: (card, self, opposite, round) => {
      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'cost-hp', target: 'opposite', value: LevelRise(100, card.level) },
        { effect: 'buff', target: 'opposite', value: '燃', number: 1 }
      ]
    }
  },
  {
    key: 2,
    name: '大火把',
    type: '进攻卡',
    race: '火',
    limit: 3,
    description: l => `造成 ${LevelRise(50, l)} 伤害, 并附加给目标 2 层 '燃'`,
    function: (card, self, opposite, round) => {
      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'cost-hp', target: 'opposite', value: LevelRise(50, card.level) },
        { effect: 'buff', target: 'opposite', value: '燃', number: 2 }
      ]
    }
  },
  {
    key: 3,
    name: '点燃',
    type: '魔法卡',
    race: '火',
    limit: 3,
    description: l => `消耗 500 MP, 造成目标 '燃' 层数 * ${LevelRise(50, l)} 伤害`,
    function: (card, self, opposite, round) => {
      if (self.master.MP < 500) return [{ error: 'MP 不足' }]

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'cost-mp', target: 'self', value: 500 },
        { effect: 'cost-hp', target: 'opposite', value: opposite.master.buff.filter(i => i === '燃').length * LevelRise(50, card.level) },
      ]
    }
  },
  {
    key: 4,
    name: '火之纽带',
    type: '魔法卡',
    race: '火',
    limit: 3,
    description: l => `消耗 250 MP, 从牌库以及墓地抽取 1 张除自身外的火系卡牌`,
    function: (card, self, opposite, round) => {
      if (self.master.MP < 250) return [{ error: 'MP 不足' }]

      const rt = [
        { message: [card.name, levelText(card.level)].join(' ') },
        { animation: 'red-hit', target: 'self' },
        { effect: 'cost-mp', target: 'self', value: 25 },
      ]

      const cardInStore = self.card.store.find(i => i.race === '火' && i.key !== card.key)
      if (cardInStore) rt.push({ effect: 'pump-store-point', target: 'self', value: [cardInStore] })

      const cardInCemetery = self.card.cemetery.find(i => i.race === '火' && i.key !== card.key)
      if (cardInCemetery) rt.push({ effect: 'pump-cemetery-point', target: 'self', value: [cardInCemetery] })

      return rt
    }
  },
  {
    key: 5,
    name: '引燃',
    type: '魔法卡',
    race: '火',
    limit: 3,
    description: l => `消耗 200 MP, 造成 ${LevelRise(200, l)} 伤害, 并消耗目标 1 层 '燃'`,
    function: (card, self, opposite, round) => {
      if (self.master.MP < 200) return [{ error: 'MP 不足' }]
      if (!opposite.master.buff.find(i => i === '燃')) return [{ error: `目标 '燃' 不足` }]

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'cost-mp', target: 'self', value: 200 },
        { effect: 'cost-hp', target: 'opposite', value: LevelRise(200, card.level) },
        { effect: 'cost-buff', target: 'opposite', value: '燃', number: 1 }
      ]
    }
  },
  {
    key: 6,
    name: '火焰冲击',
    type: '进攻卡',
    race: '火',
    limit: 3,
    description: l => `造成 ${LevelRise(100, l)} 伤害, 若目标拥有 '燃' 则伤害 * 1.5`,
    function: (card, self, opposite, round) => {
      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'cost-hp', target: 'opposite', value: opposite.master.buff.find(i => i === '燃') ? LevelRise(100, card.level) * 1.5 : LevelRise(100, card.level) },
      ]
    }
  },
  {
    key: 7,
    name: '火焰聚能',
    type: '魔法卡',
    race: '火',
    limit: 3,
    description: l => `消耗 200 MP, 吸收对手的所有 '燃' , 每有一层回复自身 ${LevelRise(100, l)} HP`,
    function: (card, self, opposite, round) => {
      if (self.master.MP < 200) return [{ error: 'MP 不足' }]

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { animation: 'red-hit', target: 'self' },
        { effect: 'cost-mp', target: 'self', value: 200 },
        { effect: 'cost-hp', target: 'self', value: opposite.master.buff.filter(i => i === '燃').length * LevelRise(100, card.level) },
        { effect: 'cost-buff', target: 'opposite', value: '燃', number: opposite.master.buff.filter(i => i === '燃').length }
      ]
    }
  },
  {
    key: 8,
    name: '火球术',
    type: '魔法卡',
    race: '火',
    limit: 3,
    description: l => `消耗 500 MP, 造成 ${LevelRise(150, l)} 伤害`,
    function: (card, self, opposite, round) => {
      if (self.master.MP < 500) return [{ error: 'MP 不足' }]

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'cost-mp', target: 'self', value: 500 },
        { effect: 'cost-hp', target: 'opposite', value: LevelRise(150, card.level) },
      ]
    }
  },
  {
    key: 9,
    name: '火球萌生',
    type: '魔法卡',
    race: '火',
    limit: 3,
    description: l => `消耗 250 MP, 造成 ${LevelRise(50, l)} 伤害, 从牌库抽取一张 '火球术'`,
    function: (card, self, opposite, round) => {
      if (self.master.MP < 250) return [{ error: 'MP 不足' }]

      const rt = [
        { message: [card.name, levelText(card.level)].join(' ') },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'cost-mp', target: 'self', value: 250 },
        { effect: 'cost-hp', target: 'opposite', value: LevelRise(50, card.level) },
      ]

      const cardInStore = self.card.store.find(i => i.key === 8)
      if (cardInStore) rt.push({ effect: 'pump-store-point', target: 'self', value: [cardInStore] })

      return rt
    }
  },
]

originMoney.forEach(i => i.imageDOM = Picture.get('money-' + i.key))
originExplore.forEach(i => i.imageDOM = Picture.get('explore-' + i.key))
originShop.forEach(i => i.imageDOM = Picture.get('shop-' + i.key))
originMaster.forEach(i => i.imageDOM = Picture.get('master-' + i.key))
originCard.forEach(i => i.imageDOM = Picture.get('card-' + i.key))

export { originMoney, originMaster, originCard, originExplore, originShop }