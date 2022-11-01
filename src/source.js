import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'


import J_music_2fec7f9242b44b64a914f7cc19d25abe0 from '../media/card/music_2fec7f9242b44b64a914f7cc19d25abe0.jpeg'
import J_music_4d7f219082ba4d86b1543c982d1156560 from '../media/card/music_4d7f219082ba4d86b1543c982d1156560.jpeg'
import J_music_6e9e96c75cf04411baa154b1d6a3c7360 from '../media/card/music_6e9e96c75cf04411baa154b1d6a3c7360.jpeg'
import J_music_88c8411d068c455099456851ec84f65c0 from '../media/card/music_88c8411d068c455099456851ec84f65c0.jpeg'
import J_music_98a7a38ce58546a7841d18c96e41e3760 from '../media/card/music_98a7a38ce58546a7841d18c96e41e3760.jpeg'
import J_music_c753fd717be543eaa25f4a1aa9240d7d0 from '../media/card/music_c753fd717be543eaa25f4a1aa9240d7d0.jpeg'
import J_music_c12894d6ce644a37a16069502d98c9b80 from '../media/card/music_c12894d6ce644a37a16069502d98c9b80.jpeg'
import J_tiku_2e150939d1e635d0b03b06dfcd2f414885dd8724662bcd88687fb1e9ce46fa0e from '../media/card/tiku_2e150939d1e635d0b03b06dfcd2f414885dd8724662bcd88687fb1e9ce46fa0e.jpeg'
import J_tiku_7758d073971ffb4a8d1ec164c2a88e73bf9b29048cbe9c971c0c3d8e8ab6afea from '../media/card/tiku_7758d073971ffb4a8d1ec164c2a88e73bf9b29048cbe9c971c0c3d8e8ab6afea.jpeg'
import J_tiku_b264d1ca656e2db92407cf8574ac3394dc12cb193a151c0e6631f5485ce1e2a4 from '../media/card/tiku_b264d1ca656e2db92407cf8574ac3394dc12cb193a151c0e6631f5485ce1e2a4.jpeg'

import J_music_ff2679ad919b47bcbb8968bd92fd8dd10 from '../media/shop/music_ff2679ad919b47bcbb8968bd92fd8dd10.jpeg'

import J_music_47a83799595b4a5b97145a6e594620310 from '../media/explore/music_47a83799595b4a5b97145a6e594620310.jpeg'

import J_music_1107cbd537144759999fbd7dc0fdb6650 from '../media/master/music_1107cbd537144759999fbd7dc0fdb6650.jpg'
import J_music_b6f0b1c512ad42fab204d79b85d07c140 from '../media/master/music_b6f0b1c512ad42fab204d79b85d07c140.jpeg'
import J_music_b40316005b55465b80ae4eecad8447960 from '../media/master/music_b40316005b55465b80ae4eecad8447960.jpeg'

import J_music_16193381303a4584989ac395336fd4880 from '../media/money/music_16193381303a4584989ac395336fd4880.jpeg'
import J_music_a7e9436348e6456eb47f32a75f7392370 from '../media/money/music_a7e9436348e6456eb47f32a75f7392370.jpeg'
import J_music_a2835cfbbeea40d6971fd36c0a44870d0 from '../media/money/music_a2835cfbbeea40d6971fd36c0a44870d0.jpeg'

var originMoney = [
  {
    key: 1,
    name: '金币',
    image: J_music_16193381303a4584989ac395336fd4880,
  },
  {
    key: 2,
    name: '钻石',
    image: J_music_a7e9436348e6456eb47f32a75f7392370,
  },
  {
    key: 3,
    name: '碎片',
    image: J_music_a2835cfbbeea40d6971fd36c0a44870d0,
  },
]

originMoney = originMoney.map(i => {
  i.imageDOM = new Image()
  i.imageDOM.src = i.image

  return i
})

var originMaster = [
  {
    key: 1,
    name: '艾露恩',
    image: J_music_1107cbd537144759999fbd7dc0fdb6650,
    HP: l => 900 + l * 100,
    MP: l => 190 + l * 10,
    skill: [
      {
        name: '庇护 I',
        description: l => `使用卡牌时, 回复 ${l * 15} MP`,
        function: (card, result, self, opposite, env) => {
          result.push({ effect: 'cure-mp', target: 'self', value: self.master.level * 15 })
        }
      },
      {
        name: '庇护 II',
        description: l => `使用卡牌时, 回复 ${l * 15} HP`,
        function: (card, result, self, opposite, env) => {
          result.push({ effect: 'cure-hp', target: 'self', value: self.master.level * 15 })
        }
      },
    ],
  },
  {
    key: 2,
    name: '火焰领主',
    image: J_music_b6f0b1c512ad42fab204d79b85d07c140,
    HP: l => 700 + l * 50,
    MP: l => 140 + l * 10,
    skill: [
      {
        name: '欲火',
        description: l => `使用火系卡牌时, 额外造成 ${l * 15} 伤害`,
        function: (card, result, self, opposite, env) => {
          if (card.race === '火') {
            result.push({ effect: 'hit', target: 'opposite', value: -self.master.level * 15 })
          }
        }
      }
    ],
  },
  {
    key: 3,
    name: '炎魔',
    image: J_music_b40316005b55465b80ae4eecad8447960,
    HP: l => 500 + l * 50,
    MP: l => 190 + l * 10,
    skill: [
      {
        name: '火焰控制',
        description: l => `使用火系卡牌时, 若目标的 '燃' 层数大于等于5, 从牌库抽取一张卡, 并消耗目标 1 层 '燃'`,
        function: (card, result, self, opposite, env) => {
          if (card.race === '火' && opposite.master.buff.filer(i => i === '燃')) {
            result.push({ effect: 'pump-store-positive', target: 'self', value: 1 })
            result.push({ effect: 'cost-buff', target: 'opposite', value: '燃', number: 1 })
          }
        }
      },
      {
        name: '欲火',
        description: l => `使用火系卡牌时, 额外造成 ${l * 15} 伤害`,
        function: (card, result, self, opposite, env) => {
          if (card.race === '火') {
            result.push({ effect: 'hit', target: 'opposite', value: -self.master.level * 15 })
          }
        }
      }
    ],
  },
]

originMaster = originMaster.map(i => {
  i.imageDOM = new Image()
  i.imageDOM.src = i.image

  return i
})

var originCard = [
  {
    key: 1,
    name: '小火把',
    type: '进攻卡',
    race: '火',
    limit: 3,
    image: J_music_88c8411d068c455099456851ec84f65c0,
    description: l => `造成 ${l * 20 + 80} 伤害, 并附加给目标 1 层'燃'`,
    function: (card, self, opposite, round) => {
      return [
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'hit', target: 'opposite', value: card.level * 20 + 80 },
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
    image: J_music_2fec7f9242b44b64a914f7cc19d25abe0,
    description: l => `造成 ${l * 10 + 40} 伤害, 并附加给目标 2 层'燃'`,
    function: (card, self, opposite, round) => {
      return [
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'hit', target: 'opposite', value: card.level * 10 + 40 },
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
    image: J_music_4d7f219082ba4d86b1543c982d1156560,
    description: l => `消耗 100 MP, 造成目标'燃'层数 * ${l * 5 + 20} 伤害`,
    function: (card, self, opposite, round) => {
      if (self.MP < 100) return [{ error: 'MP 不足' }]

      return [
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'cost-mp', target: 'self', value: 100 },
        { effect: 'hit', target: 'opposite', value: opposite.master.buff.reduce((t, i) => i === '燃' ? t + 1 : t, 0) * (card.level * 5 + 20) },
      ]
    }
  },
  {
    key: 4,
    name: '火之纽带',
    type: '魔法卡',
    race: '火',
    limit: 3,
    image: J_music_6e9e96c75cf04411baa154b1d6a3c7360,
    description: l => `从牌库以及墓地抽取 1 张除自身外的火系卡牌, 回复 ${l * 5 + 20} MP`,
    function: (card, self, opposite, round) => {
      const rt = [
        { animation: 'red-hit', target: 'self' },
        { effect: 'cure-mp', target: 'self', value: card.level * 5 + 20 },
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
    image: J_music_98a7a38ce58546a7841d18c96e41e3760,
    description: l => `消耗 20 MP, 造成 ${l * 30 + 120} 伤害, 并消耗目标 1 层 '燃'`,
    function: (card, self, opposite, round) => {
      if (self.MP < 20) return [{ error: 'MP 不足' }]
      if (!opposite.master.buff.find(i => i === '燃')) return [{ error: `目标'燃'印记不足` }]

      return [
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'cost-mp', target: 'self', value: 20 },
        { effect: 'hit', target: 'opposite', value: card.level * 30 + 120 },
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
    image: J_music_c753fd717be543eaa25f4a1aa9240d7d0,
    description: l => `造成 ${l * 20 + 80} 伤害, 若目标拥有'燃'则伤害 * 1.5`,
    function: (card, self, opposite, round) => {
      return [
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'hit', target: 'opposite', value: opposite.master.buff.find(i => i === '燃') ? (card.level * 20 + 80) * 1.5 : (card.level * 20 + 80) },
      ]
    }
  },
  {
    key: 7,
    name: '火焰聚能',
    type: '治疗卡',
    race: '火',
    limit: 3,
    image: J_music_c12894d6ce644a37a16069502d98c9b80,
    description: l => `吸收对手的所有'燃', 每有一层回复自身 ${l * 20 + 30} HP`,
    function: (card, self, opposite, round) => {
      return [
        { animation: 'red-hit', target: 'self' },
        { effect: 'cure-hp', target: 'self', value: opposite.master.buff.reduce((t, i) => i === '燃' ? t + 1 : t, 0) * (card.level * 20 + 30) },
      ]
    }
  },
  {
    key: 8,
    name: '火球术',
    type: '进攻卡',
    race: '火',
    limit: 3,
    image: J_tiku_2e150939d1e635d0b03b06dfcd2f414885dd8724662bcd88687fb1e9ce46fa0e,
    description: l => `造成 ${l * 30 + 120} 伤害`,
    function: (card, self, opposite, round) => {
      return [
        { animation: 'red-hit', target: 'self' },
        { effect: 'hit', target: 'opposite', value: card.level * 30 + 120 },
      ]
    }
  },
  {
    key: 9,
    name: '火球萌生',
    type: '魔法卡',
    race: '火',
    limit: 3,
    image: J_tiku_7758d073971ffb4a8d1ec164c2a88e73bf9b29048cbe9c971c0c3d8e8ab6afea,
    description: l => `消耗 20 MP, 造成 ${l * 10 + 40} 伤害, 从牌库抽取一张 '火球术'`,
    function: (card, self, opposite, round) => {
      const rt = [
        { animation: 'red-hit', target: 'self' },
        { effect: 'hit', target: 'opposite', value: card.level * 10 + 40 },
      ]

      const cardInStore = self.card.store.find(i => i.key === 8)

      if (cardInStore) rt.push({ effect: 'pump-store-point', target: 'self', value: [cardInStore] })

      return rt
    }
  },
]

originCard = originCard.map(i => {
  i.imageDOM = new Image()
  i.imageDOM.src = i.image

  return i
})

var originExplore = [
  {
    name: '故事 I',
    description: '可能包含: 金币0-500枚',
    difficulty: 1,
    type: 'alltime',
    image: J_music_47a83799595b4a5b97145a6e594620310,
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
    name: '梦境 I',
    description: '可能包含: 小火把(等级1)0-3张, 大火把(等级1)0-3张',
    difficulty: 2,
    type: 'alltime',
    image: J_music_47a83799595b4a5b97145a6e594620310,
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
        { card: true, key: 1, level: 1, number: Math.floor(Math.random() * 3) },
        { card: true, key: 2, level: 1, number: Math.floor(Math.random() * 3) },
      ]
    },
    AI: (self, opposite, env) => {
      return arrayRandom(self.card.hand, 1)
    }
  },
]

originExplore = originExplore.map(i => {
  i.imageDOM = new Image()
  i.imageDOM.src = i.image

  return i
})

var originShop = [
  {
    name: '火系基础礼盒I',
    description: '可能包含: 小火把(等级1)2-5张, 大火把(等级1)2-5张',
    type: 'alltime',
    image: J_music_ff2679ad919b47bcbb8968bd92fd8dd10,
    money: {
      key: 1,
      number: 1000
    },
    reward: () => {
      return [
        { card: true, key: 1, level: 1, number: Math.floor(Math.random() * 4 + 2) },
        { card: true, key: 2, level: 1, number: Math.floor(Math.random() * 4 + 2) },
        { card: true, key: 4, level: 1, number: Math.floor(Math.random() * 4 + 2) },
      ]
    },
  },
  {
    name: '火系基础礼盒II',
    description: '可能包含: 点燃(等级1)2-5张, 引燃(等级1)2-5张, 火焰领主经验50-100',
    type: 'alltime',
    image: J_music_ff2679ad919b47bcbb8968bd92fd8dd10,
    money: {
      key: 2,
      number: 1000
    },
    reward: () => {
      return [
        { card: true, key: 3, level: 1, number: Math.floor(Math.random() * 4 + 2) },
        { card: true, key: 5, level: 1, number: Math.floor(Math.random() * 4 + 2) },
        { master: true, key: 2, number: Math.floor(Math.random() * 50 + 50) },
      ]
    },
  },
]

originShop = originShop.map(i => {
  i.imageDOM = new Image()
  i.imageDOM.src = i.image

  return i
})

export { originMoney, originMaster, originCard, originExplore, originShop }