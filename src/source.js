import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'


import J_music_2fec7f9242b44b64a914f7cc19d25abe0 from '../media/card/music_2fec7f9242b44b64a914f7cc19d25abe0.jpeg'
import J_music_4d7f219082ba4d86b1543c982d1156560 from '../media/card/music_4d7f219082ba4d86b1543c982d1156560.jpeg'
import J_music_6e9e96c75cf04411baa154b1d6a3c7360 from '../media/card/music_6e9e96c75cf04411baa154b1d6a3c7360.jpeg'
import J_music_88c8411d068c455099456851ec84f65c0 from '../media/card/music_88c8411d068c455099456851ec84f65c0.jpeg'
import J_music_98a7a38ce58546a7841d18c96e41e3760 from '../media/card/music_98a7a38ce58546a7841d18c96e41e3760.jpeg'
import J_music_a7e9436348e6456eb47f32a75f7392370 from '../media/card/music_a7e9436348e6456eb47f32a75f7392370.jpeg'
import J_music_ff2679ad919b47bcbb8968bd92fd8dd10 from '../media/card/music_ff2679ad919b47bcbb8968bd92fd8dd10.jpeg'

import J_music_47a83799595b4a5b97145a6e594620310 from '../media/explore/music_47a83799595b4a5b97145a6e594620310.jpeg'

import J_music_1107cbd537144759999fbd7dc0fdb6650 from '../media/master/music_1107cbd537144759999fbd7dc0fdb6650.jpg'
import J_music_b6f0b1c512ad42fab204d79b85d07c140 from '../media/master/music_b6f0b1c512ad42fab204d79b85d07c140.jpeg'
import J_music_b40316005b55465b80ae4eecad8447960 from '../media/master/music_b40316005b55465b80ae4eecad8447960.jpeg'


var originMaster = [
  {
    key: 1,
    name: '艾露恩',
    image: J_music_a7e9436348e6456eb47f32a75f7392370,
    HP: l => 900 + l * 100,
    MP: l => 190 + l * 10,
    skill: [
      {
        name: '庇护 I',
        description: l => `使用卡牌时, 回复 ${l * 15} MP`,
        function: (card, result, self, target, env) => {
          result.push({ type: 'cure-mp', target: 'self', value: self.master.level * 15 })
        }
      },
      {
        name: '庇护 II',
        description: l => `使用卡牌时, 回复 ${l * 15} HP`,
        function: (card, result, self, target, env) => {
          result.push({ type: 'cure-hp', target: 'self', value: self.master.level * 15 })
        }
      },
    ],
  },
  {
    key: 2,
    name: '火焰领主',
    image: J_music_b6f0b1c512ad42fab204d79b85d07c140,
    HP: l => 900 + l * 100,
    MP: l => 190 + l * 10,
    skill: [
      {
        name: '欲火',
        description: l => `使用火系卡牌时, 额外造成 ${l * 15} 伤害`,
        function: (card, result, self, target, env) => {
          if (card.race === '火') {
            result.push({ type: 'hit', target: 'opposite', value: -self.master.level * 15 })
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
        { effect: 'hit', target: 'opposite', value: -(card.level * 20 + 80) },
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
        { effect: 'hit', target: 'opposite', value: -(card.level * 10 + 40) },
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
        { effect: 'cost-mp', target: 'self', value: -100 },
        { effect: 'hit', target: 'opposite', value: -opposite.master.buff.reduce((t, i) => i === '燃' ? t + 1 : t, 0) * card.level * 5 + 20 },
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
    description: l => `消耗 20 MP, 造成 ${l * 30 + 120} 伤害, 并消耗目标 1 层'燃'`,
    function: (card, self, opposite, round) => {
      if (self.MP < 20) return [{ error: 'MP 不足' }]
      if (!opposite.master.buff.find(i => i === '燃')) return [{ error: `目标'燃'印记不足` }]

      return [
        { animation: 'red-hit', target: 'opposite' },
        { effect: 'cost-mp', target: 'self', value: -20 },
        { effect: 'hit', target: 'opposite', value: -(card.level * 30 + 120) },
        { effect: 'cost-buff', target: 'opposite', value: '燃', number: 1 }
      ]
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
    name: '梦境 I',
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
        { key: 1, level: 1, number: 1 },
        { key: 2, level: 1, number: 1 },
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

export { originMaster, originCard, originExplore }