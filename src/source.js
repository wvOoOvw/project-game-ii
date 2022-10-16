import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'

import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/music_1c31bcc267a545ef971109512053f3e50.jpeg'

import J_music_88c8411d068c455099456851ec84f65c0 from '../media/music_88c8411d068c455099456851ec84f65c0.jpeg'
import J_music_2fec7f9242b44b64a914f7cc19d25abe0 from '../media/music_2fec7f9242b44b64a914f7cc19d25abe0.jpeg'
import J_music_4d7f219082ba4d86b1543c982d1156560 from '../media/music_4d7f219082ba4d86b1543c982d1156560.jpeg'
import J_music_6e9e96c75cf04411baa154b1d6a3c7360 from '../media/music_6e9e96c75cf04411baa154b1d6a3c7360.jpeg'
import J_music_98a7a38ce58546a7841d18c96e41e3760 from '../media/music_98a7a38ce58546a7841d18c96e41e3760.jpeg'

import J_music_8abd849fe01a4fb68dceacc6018190fc0 from '../media/music_8abd849fe01a4fb68dceacc6018190fc0.jpeg'
import J_music_47a83799595b4a5b97145a6e594620310 from '../media/music_47a83799595b4a5b97145a6e594620310.jpeg'
import J_music_072c59684f6c401dad40cadf0d0dd6290 from '../media/music_072c59684f6c401dad40cadf0d0dd6290.jpeg'

import J_music_56280e428411459c823ce172d97da20c0 from '../media/music_56280e428411459c823ce172d97da20c0.jpeg'
import J_music_a7e9436348e6456eb47f32a75f7392370 from '../media/music_a7e9436348e6456eb47f32a75f7392370.jpeg'
import J_music_b6f0b1c512ad42fab204d79b85d07c140 from '../media/music_b6f0b1c512ad42fab204d79b85d07c140.jpeg'
import J_music_b40316005b55465b80ae4eecad8447960 from '../media/music_b40316005b55465b80ae4eecad8447960.jpeg'
import J_music_ff2679ad919b47bcbb8968bd92fd8dd10 from '../media/music_ff2679ad919b47bcbb8968bd92fd8dd10.jpeg'

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
        { type: 'hit', target: 'opposite', value: -(card.level * 20 + 80) },
        { type: 'buff', target: 'opposite', value: '燃', number: 1 }
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
    description: l => `造成 ${l * 30 + 120} 伤害, 并附加给目标 2 层'燃'`,
    function: (card, self, opposite, round) => {
      return [
        { type: 'hit', target: 'opposite', value: -(card.level * 30 + 120) },
        { type: 'buff', target: 'opposite', value: '燃', number: 2 }
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
    description: l => `消耗 100 MP, 造成目标'燃'层数 * ${l * 50} 伤害`,
    function: (card, self, opposite, round) => {
      if (self.MP < 100) return

      return [
        { type: 'cost-mp', target: 'self', value: -100 },
        { type: 'hit', target: 'opposite', value: -opposite.buff.reduce((t, i) => i === '燃' ? t + 1 : t, 0) * card.level * 50 },
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
    description: l => `从牌库以及墓地抽取 1 张除自身外的火系卡牌, 回复 ${l * 20} MP`,
    function: (card, self, opposite, round) => {
      const rt = [
        { type: 'cure-mp', target: 'self', value: card.level * 20 },
      ]

      const cardInStore = self.card.store.find(i => i.race === '火' && i.key !== card.key)

      if (cardInStore) rt.push({ type: 'pump-store-point', target: 'self', value: [cardInStore] })

      const cardInCemetery = self.card.cemetery.find(i => i.race === '火' && i.key !== card.key)

      if (cardInCemetery) rt.push({ type: 'pump-cemetery-point', target: 'self', value: [cardInCemetery] })

      return rt
    }
  },
  // {
  //   key: 4,
  //   name: '堕天',
  //   type: '进攻卡',
  //   race: '暗',
  //   limit: 3,
  //   image: J_music_98a7a38ce58546a7841d18c96e41e3760,
  //   description: l => `消耗50MP，造成 ${l * 30 + 300} 伤害`,
  //   function: (card, self, opposite, round) => {
  //     return [
  //       { type: 'cost-mp', target: 'self', value: -50 },
  //       { type: 'hit', target: 'opposite', value: -(card.level * 30 + 300) }
  //     ]
  //   }
  // },
  // {
  //   key: 5,
  //   name: '坠地',
  //   type: '进攻卡',
  //   race: '暗',
  //   limit: 3,
  //   image: J_music_6e9e96c75cf04411baa154b1d6a3c7360,
  //   description: l => `消耗50MP，造成 ${l * 50 + 200} 伤害`,
  //   function: (card, self, opposite, round) => {
  //     return [
  //       { type: 'cost-mp', target: 'self', value: -50 },
  //       { type: 'hit', target: 'opposite', value: -(card.level * 50 + 200) }
  //     ]
  //   }
  // },
]

originCard = originCard.map(i => {
  i.imageDOM = new Image()
  i.imageDOM.src = i.image

  return i
})

var originBoss = [
  {
    key: 1,
    name: '梦境守卫',
    image: J_music_8abd849fe01a4fb68dceacc6018190fc0,
    HP: 1000,
    MP: 1000,
    card: [
      { ...originCard.find(i => i.key === 1), level: 3 },
      { ...originCard.find(i => i.key === 2), level: 3 },
    ],
    AI: (self, opposite, round) => {
      return arrayRandom(self.card, 2)
    },
  },

  {
    key: 2,
    name: '梦魇',
    image: J_music_8abd849fe01a4fb68dceacc6018190fc0,
    HP: 1500,
    MP: 1000,
    card: [
      { ...originCard.find(i => i.key === 1), level: 8 },
      { ...originCard.find(i => i.key === 2), level: 8 },
    ],
    AI: (self, opposite, round) => {
      return arrayRandom(self.card, 2)
    },
  }
]

originBoss = originBoss.map(i => {
  i.imageDOM = new Image()
  i.imageDOM.src = i.image

  return i
})

var originExplore = [
  {
    name: '梦境 I',
    image: J_music_47a83799595b4a5b97145a6e594620310,
    boss: { ...originBoss.find(i => i.key === 1) },
    reward: () => {
      return [
        { ...originCard.find(i => i.key === 1), level: 1 },
        { ...originCard.find(i => i.key === 2), level: 1 },
      ]
    }
  },
  {
    name: '梦境 II',
    image: J_music_072c59684f6c401dad40cadf0d0dd6290,
    boss: { ...originBoss.find(i => i.key === 2) },
    reward: () => {
      return [
        { ...originCard.find(i => i.key === 1), level: 1 },
        { ...originCard.find(i => i.key === 2), level: 1 },
      ]
    }
  },
]

originExplore = originExplore.map(i => {
  i.imageDOM = new Image()
  i.imageDOM.src = i.image

  return i
})

export { originCard, originBoss, originExplore }