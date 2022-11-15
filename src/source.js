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
    name: '晶石',
  },
]

var originExplore = [
  {
    key: 1,
    name: '故事 I',
    description: '可能包含: 金币 20 - 50 枚',
    difficulty: 1,
    type: 'alltime',
    boss: {
      master: { key: 1, level: 1 },
      card: [
        { key: 1, level: 1 },
        { key: 2, level: 1 },
      ]
    },
    reward: () => {
      return [
        { money: true, key: 1, number: Math.floor(Math.random() * 31) + 20 },
      ]
    },
    // AI: (self, opposite) => {
    //   return arrayRandom(self.card.hand, 1)[0]
    // }
  },
  {
    key: 2,
    name: '梦境 I',
    description: '可能包含: 小火把 Exp 5 - 20, 大火把 Exp 5 - 20',
    difficulty: 2,
    type: 'alltime',
    boss: {
      master: { key: 2, level: 2 },
      card: [
        { key: 1, level: 3 },
        { key: 2, level: 3 },
        { key: 3, level: 3 },
      ]
    },
    reward: () => {
      return [
        { card: true, key: 1, exp: Math.floor(Math.random() * 16) + 5 },
        { card: true, key: 2, exp: Math.floor(Math.random() * 16) + 5 },
      ]
    },
    // AI: (self, opposite) => {
    //   return arrayRandom(self.card.hand, 1)[0]
    // }
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
      number: 388
    },
    reward: () => {
      return [
        { card: true, key: 1, exp: Math.floor(Math.random() * 21) },
        { card: true, key: 2, exp: Math.floor(Math.random() * 21) },

      ]
    },
  },
  {
    key: 2,
    name: '火系基础礼盒II',
    description: '可能包含: 火焰领主 Exp 50 - 100, 炎魔 Exp 50 - 100',
    type: 'alltime',
    money: {
      key: 1,
      number: 388
    },
    reward: () => {
      return [
        { master: true, key: 2, exp: Math.floor(Math.random() * 51 + 50) },
        { master: true, key: 3, exp: Math.floor(Math.random() * 51 + 50) },
      ]
    },
  },
  {
    key: 3,
    name: '新手礼盒I',
    description: '可能包含: 祭司 Exp 50 - 150',
    type: 'alltime',
    money: {
      key: 1,
      number: 188
    },
    reward: () => {
      return [
        { master: true, key: 1, exp: Math.floor(Math.random() * 101 + 50) },
      ]
    },
  },
]

var originMaster = [
  {
    key: 1,
    name: '祭司',
    HP: l => LevelRise(10000, l),
    ATTACT: l => LevelRise(800, l),
    ACTION: 2,
    skill: [
      {
        name: '庇护 I',
        description: l => `使用卡牌后, 回复 2% HP`,
        function: (card, skill, result, self, opposite) => {
          const cure = Math.floor(self.master.HP_ * 0.02)

          result.push({ roleMessage: `${skill.name} HP + ${cure}`, target: 'self' })
          result.push({ effect: 'HP', target: 'self', value: cure })
        }
      },
      {
        name: '庇护 II',
        description: l => `使用卡牌后, 提升 2% 基础ATTACT`,
        function: (card, skill, result, self, opposite) => {
          const value = Math.floor(self.master.ATTACT_ * 0.02)

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
        description: l => `使用火焰系卡牌后, 给予对方 25%ATTACT 的伤害`,
        function: (card, skill, result, self, opposite) => {
          if (card.race === '火焰') {
            const damage = Math.floor(self.master.ATTACT * 0.25)

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
    HP: l => LevelRise(8000, l),
    ATTACT: l => LevelRise(800, l),
    ACTION: 2,
    skill: [
      {
        name: '欲火',
        description: l => `使用火焰系卡牌后, 给予对方 25%ATTACT 的伤害`,
        function: (card, skill, result, self, opposite) => {
          if (card.race === '火焰') {
            const damage = Math.floor(self.master.ATTACT * 0.25)

            result.push({ roleMessage: `${skill.name} HP - ${damage}`, target: 'opposite' })
            result.push({ effect: 'HP', target: 'opposite', value: -damage })
          }
        }
      },
      {
        name: '火焰控制',
        description: l => `使用火焰系卡牌后, 提升 5% ATTACT`,
        function: (card, skill, result, self, opposite) => {
          if (card.race === '火焰') {
            const value = Math.floor(self.master.ATTACT * 0.05)

            result.push({ roleMessage: `${skill.name} ATTACT + ${value}`, target: 'self' })
            result.push({ effect: 'ATTACT', target: 'self', value: value })
          }
        }
      },
    ],
  },
  {
    key: 4,
    name: '丛林守护者',
    HP: l => LevelRise(12000, l),
    ATTACT: l => LevelRise(680, l),
    ACTION: 2,
    skill: [
      {
        name: '自然之力',
        description: l => `使用卡牌后, 回复 4% HP, 并有 25% 几率提升一次牌库随机一张卡牌的等级`,
        function: (card, skill, result, self, opposite) => {
          if (card.race === '自然') {
            const cure = Math.floor(self.master.HP_ * 0.04)

            result.push({ roleMessage: `${skill.name} HP + ${cure}`, target: 'self' })
            result.push({ effect: 'HP', target: 'self', value: cure })

            if (Math.random() > 0.5) {
              const cardFind = arrayRandom(self.card.team, 1)[0]

              result.push({ roleMessage: `{skill.name} ${cardFind.name} LEVEL + 1`, target: 'opposite' })
              result.push({ effect: 'LEVEL', target: 'self', key: card.key, number: 1 })
            }
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
    type: '进攻',
    race: '火焰',
    description: l => `造成 ${100 + (l - 1) * 5}%ATTACT 伤害, 并附加给目标 1 层 '燃'`,
    function: (card, self, opposite) => {
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
    type: '进攻',
    race: '火焰',
    description: l => `造成 ${50 + (l - 1) * 2.5}%ATTACT 伤害, 并附加给目标 2 层 '燃'`,
    function: (card, self, opposite) => {
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
    type: '进攻',
    race: '火焰',
    description: l => `造成目标 '燃' 层数 * ${35 + (l - 1) * 2}%ATTACT 伤害`,
    function: (card, self, opposite) => {
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
    type: '进攻',
    race: '火焰',
    description: l => `造成 ${100 + (l - 1) * 5}%ATTACT 伤害, 若目标拥有 '燃' 则伤害 * 1.5`,
    function: (card, self, opposite) => {
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
    type: '辅助',
    race: '火焰',
    description: l => `消耗对手的所有 '燃' , 提升自身 '燃' 层数 * ${10 + (l - 1) * 0.5} 基础ATTACT`,
    function: (card, self, opposite) => {
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
    type: '进攻',
    race: '火焰',
    description: l => `造成 ${120 + (l - 1) * 6}%ATTACT 伤害`,
    function: (card, self, opposite) => {
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
    type: '进攻',
    race: '火焰',
    description: l => `造成 ${60 + (l - 1) * 3} 伤害, 提升一次牌库 '火球术' 等级`,
    function: (card, self, opposite) => {
      const r = []

      const damage = Math.floor(self.master.ATTACT * (0.6 + (card.level - 1) * 0.03))

      r.push({ message: [card.name, levelText(card.level)].join(' ') })
      r.push({ roleMessage: `${card.name} HP - ${damage}`, target: 'opposite' })
      r.push({ animation: 'red-hit', target: 'opposite' })
      r.push({ effect: 'HP', target: 'opposite', value: -damage })

      if (self.card.team.some(i => i.key === 6)) {
        r.push({ roleMessage: `${card.name} 火球术 LEVEL + 1`, target: 'self' })
        r.push({ effect: 'LEVEL', target: 'self', key: 6, number: 1 })
      }

      return r
    }
  },
  {
    key: 8,
    name: '自燃',
    type: '辅助',
    race: '火焰',
    description: l => `扣除自身当前生命值 10%, 提升 ${20 + (l - 1) * 1}% 基础ATTACT`,
    function: (card, self, opposite) => {
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
    type: '辅助',
    race: '火焰',
    description: l => `提升 ${10 + (l - 1) * 0.5}% 基础ATTACT`,
    function: (card, self, opposite) => {
      const value = Math.floor(self.master.ATTACT_ * (0.1 + (card.level - 1) * 0.005))

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} ATTACT + ${value}`, target: 'self' },
        { animation: 'red-hit', target: 'self' },
        { effect: 'ATTACT', target: 'self', value: value },
      ]
    }
  },
  {
    key: 10,
    name: '自然治愈',
    type: '治疗',
    race: '自然',
    description: l => `回复 ${10 + (l - 1) * 0.5}% HP`,
    function: (card, self, opposite) => {
      const value = Math.floor(self.master.ATTACT_ * (0.1 + (card.level - 1) * 0.005))

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} ATTACT + ${value}`, target: 'self' },
        { animation: 'red-hit', target: 'self' },
        { effect: 'HP', target: 'self', value: value },
      ]
    }
  },
  {
    key: 11,
    name: '自然蓄能',
    type: '辅助',
    race: '自然',
    description: l => `提升 ${10 + (l - 1) * 0.5}% 基础ATTACT`,
    function: (card, self, opposite) => {
      const value = Math.floor(self.master.ATTACT_ * (0.1 + (card.level - 1) * 0.005))

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} ATTACT + ${value}`, target: 'self' },
        { animation: 'red-hit', target: 'self' },
        { effect: 'ATTACT', target: 'self', value: value },
      ]
    }
  },
  {
    key: 12,
    name: '缠绕',
    type: '进攻',
    race: '自然',
    description: l => `造成 ${100 + (l - 1) * 5}%ATTACT 伤害, 并降低目标 5% ATTACT`,
    function: (card, self, opposite) => {
      const damage = Math.floor(self.master.ATTACT * (1 + (card.level - 1) * 0.05))
      const value = Math.floor(opposite.master.ATTACT * 0.05)

      return [
        { message: [card.name, levelText(card.level)].join(' ') },
        { roleMessage: `${card.name} HP - ${damage}`, target: 'opposite' },
        { roleMessage: `${card.name} ATTACT - ${damage}`, target: 'opposite' },
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'HP', target: 'opposite', value: -damage },
        { effect: 'ATTACT', target: 'opposite', value: -value },
      ]
    }
  },
]

const loadPicture = () => {
  originMoney.forEach(i => i.imageDOM = Picture.get('money-' + i.key))
  originExplore.forEach(i => i.imageDOM = Picture.get('explore-' + i.key))
  originShop.forEach(i => i.imageDOM = Picture.get('shop-' + i.key))
  originMaster.forEach(i => i.imageDOM = Picture.get('master-' + i.key))
  originCard.forEach(i => i.imageDOM = Picture.get('card-' + i.key))
}

export { originMoney, originMaster, originCard, originExplore, originShop, loadPicture }