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
      return arrayRandom(self.card.hand, 1)[0]
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
      return arrayRandom(self.card.hand, 1)[0]
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
    description: '可能包含: 火焰领主 Exp 50 - 100, 炎魔 Exp 50 - 100',
    type: 'alltime',
    money: {
      key: 2,
      number: 1000
    },
    reward: () => {
      return [
        { master: true, key: 2, exp: Math.floor(Math.random() * 50 + 50) },
        { master: true, key: 3, exp: Math.floor(Math.random() * 50 + 50) },
      ]
    },
  },
]

var originMaster = [
  {
    key: 1,
    name: '艾露恩',
    HP: l => LevelRise(10000, l),
    ATTACT: l => LevelRise(800, l),
    ACTION: 2,
    skill: [
      {
        name: '庇护 I',
        description: l => `使用卡牌后, 回复 5% HP`,
        function: (card, skill, result, self, opposite, env) => {
          const cure = Math.floor(self.master.HP_ * 0.05)

          result.push({ roleMessage: `${skill.name} HP + ${cure}`, target: 'self' })
          result.push({ effect: 'HP', target: 'self', value: cure })
        }
      },
      {
        name: '庇护 II',
        description: l => `使用卡牌后, 提升 5% 基础ATTACT`,
        function: (card, skill, result, self, opposite, env) => {
          const value = Math.floor(self.master.ATTACT_ * 0.05)

          result.push({ roleMessage: `${skill.name} ATTACT + ${value}`, target: 'self' })
          result.push({ effect: 'ATTACT', target: 'self', value: value })
        }
      },
    ],
  },
  {
    key: 2,
    name: '火焰领主',
    HP: l => LevelRise(10000, l),
    ATTACT: l => LevelRise(800, l),
    ACTION: 2,
    skill: [
      {
        name: '欲火',
        description: l => `使用火系卡牌后, 给予对方 20%ATTACT 的伤害`,
        function: (card, skill, result, self, opposite, env) => {
          if (card.race === '火') {
            const damage = Math.floor(self.master.ATTACT * 0.2)

            result.push({ roleMessage: `${skill.name} HP - ${damage}`, target: 'opposite' })
            result.push({ effect: 'HP', target: 'opposite', value: -damage })
          }
        }
      }
    ],
  },
  {
    key: 3,
    name: '炎魔',
    HP: l => LevelRise(10000, l),
    ATTACT: l => LevelRise(800, l),
    ACTION: 2,
    skill: [
      {
        name: '火焰控制',
        description: l => `使用火系卡牌后, 提升 5% ATTACT`,
        function: (card, skill, result, self, opposite, env) => {
          if (card.race === '火') {
            const value = Math.floor(self.master.ATTACT * 0.05)

            result.push({ roleMessage: `${skill.name} ATTACT + ${value}`, target: 'self' })
            result.push({ effect: 'ATTACT', target: 'self', value: value })
          }
        }
      },
      {
        name: '欲火',
        description: l => `使用火系卡牌后, 给予对方 20%ATTACT 伤害`,
        function: (card, skill, result, self, opposite, env) => {
          if (card.race === '火') {
            const damage = Math.floor(self.master.ATTACT * 0.2)

            result.push({ roleMessage: `${skill.name} HP - ${damage}`, target: 'opposite' })
            result.push({ effect: 'HP', target: 'opposite', value: -damage })
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
    description: l => `造成 ${100 + (l - 1) * 5}%ATTACT 伤害, 并附加给目标 1 层 '燃'`,
    function: (card, self, opposite, round) => {
      const damage = Math.floor(self.master.ATTACT * (1 + (card.level - 1) * 0.05))

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} HP - ${damage}`, target: 'opposite' },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'HP', target: 'opposite', value: -damage },
        { effect: 'BUFF', target: 'opposite', name: '燃', number: 1 }
      ]
    }
  },
  {
    key: 2,
    name: '大火把',
    type: '进攻卡',
    race: '火',
    description: l => `造成 ${50 + (l - 1) * 2.5}%ATTACT 伤害, 并附加给目标 2 层 '燃'`,
    function: (card, self, opposite, round) => {
      const damage = Math.floor(self.master.ATTACT * (0.5 + (card.level - 1) * 0.025))

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} HP - ${damage}`, target: 'opposite' },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'HP', target: 'opposite', value: -damage },
        { effect: 'BUFF', target: 'opposite', name: '燃', number: 2 }
      ]
    }
  },
  {
    key: 3,
    name: '点燃',
    type: '进攻卡',
    race: '火',
    description: l => `造成目标 '燃' 层数 * ${35 + (l - 1) * 2}%ATTACT 伤害`,
    function: (card, self, opposite, round) => {
      const damage = Math.floor(opposite.master.buff.filter(i => i === '燃').length * self.master.ATTACT * (0.35 + (card.level - 1) * 0.02))

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} HP - ${damage}`, target: 'opposite' },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'HP', target: 'opposite', value: -damage },
      ]
    }
  },
  {
    key: 4,
    name: '火焰冲击',
    type: '进攻卡',
    race: '火',
    description: l => `造成 ${100 + (l - 1) * 5}%ATTACT 伤害, 若目标拥有 '燃' 则伤害 * 1.5`,
    function: (card, self, opposite, round) => {
      const damage = Math.floor(opposite.master.buff.find(i => i === '燃') ? self.master.ATTACT * (1 + (card.level - 1) * 0.05) * 1.5 : self.master.ATTACT * (1 + (card.level - 1) * 0.05))

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} HP - ${damage}`, target: 'opposite' },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'HP', target: 'opposite', value: -damage },
      ]
    }
  },
  {
    key: 5,
    name: '火焰聚能',
    type: '魔法卡',
    race: '火',
    description: l => `消耗对手的所有 '燃' , 提升自身 '燃' 层数 * ${10 + (l - 1) * 0.5} 基础ATTACT`,
    function: (card, self, opposite, round) => {
      const value = Math.floor(opposite.master.buff.filter(i => i === '燃').length * self.master.ATTACT_ * (0.1 + (card.level - 1) * 0.005))

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} ATTACT + ${value}`, target: 'self' },
        { animation: 'red-hit', target: 'self' },
        { effect: 'ATTACT', target: 'self', value: value },
        { effect: 'BUFF', target: 'opposite', name: '燃', number: -opposite.master.buff.filter(i => i === '燃').length }
      ]
    }
  },
  {
    key: 6,
    name: '火球术',
    type: '进攻卡',
    race: '火',
    description: l => `造成 ${120 + (l - 1) * 6}%ATTACT 伤害`,
    function: (card, self, opposite, round) => {
      const damage = Math.floor(self.master.ATTACT * (1.2 + (card.level - 1) * 0.06))

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} HP - ${damage}`, target: 'opposite' },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'HP', target: 'opposite', value: -damage },
      ]
    }
  },
  {
    key: 7,
    name: '火球燃烧',
    type: '进攻卡',
    race: '火',
    description: l => `造成 ${60 + (l - 1) * 3} 伤害, 提升一次牌库 '火球术' 等级`,
    function: (card, self, opposite, round) => {
      const damage = Math.floor(self.master.ATTACT * (0.6 + (card.level - 1) * 0.03))

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} HP - ${damage}`, target: 'opposite' },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'HP', target: 'opposite', value: -damage },
        { effect: 'LEVEL', target: 'self', key: 6, number: 1 },
      ]
    }
  },
  {
    key: 8,
    name: '自燃',
    type: '魔法卡',
    race: '火',
    description: l => `扣除自身当前生命值 10%, 提升 ${20 + (l - 1) * 1}% 基础ATTACT`,
    function: (card, self, opposite, round) => {
      const value = Math.floor(self.master.ATTACT_ * (0.2 + (card.level - 1) * 0.01))
      const damage = Math.floor(self.master.HP * 0.1)

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} ATTACT + ${value}`, target: 'self' },
        { roleMessage: `${card.name} HP - ${damage}`, target: 'self' },
        { animation: 'red-hit', target: 'self' },
        { effect: 'ATTACT', target: 'self', value: value },
        { effect: 'HP', target: 'self', value: -damage },
      ]
    }
  },

  {
    key: 9,
    name: '火焰蓄能',
    type: '魔法卡',
    race: '火',
    description: l => `提升 ${10 + (l - 1) * 0.5}% 基础ATTACT`,
    function: (card, self, opposite, round) => {
      const value = Math.floor(self.master.ATTACT_ * (0.1 + (card.level - 1) * 0.005))

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} ATTACT + ${value}`, target: 'self' },
        { animation: 'red-hit', target: 'self' },
        { effect: 'ATTACT', target: 'self', value: value },
      ]
    }
  },
]

originMoney.forEach(i => i.imageDOM = Picture.get('money-' + i.key))
originExplore.forEach(i => i.imageDOM = Picture.get('explore-' + i.key))
originShop.forEach(i => i.imageDOM = Picture.get('shop-' + i.key))
originMaster.forEach(i => i.imageDOM = Picture.get('master-' + i.key))
originCard.forEach(i => i.imageDOM = Picture.get('card-' + i.key))

export { originMoney, originMaster, originCard, originExplore, originShop }