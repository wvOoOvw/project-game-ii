import { parseCard, parseMaster, parseMoney, symbolNumber, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

var originMonster = [
  {
    key: 1,
    name: '被污染的野猪',
    description: '在丛林中被污染的野猪，具备一定的攻击性。',
    dirty: 1200,
    skill: [
      {
        name: '冲撞',
        type: '伤害',
        description: '蓄势待发，准备向你冲来！做好防御的准备！！！',
        function: (self, opposite, oppositeAll) => {
          return [{ effect: 'Damage', target: opposite, value: Math.floor(100 + Math.random() * 50) }]
        }
      }
    ]
  }
]

var originWitch = [
  {
    key: 1,
    name: '魔女伊迪丝',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '斩击',
        type: '伤害',
        description: '以理性值20%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: opposite, value: self.rational * 0.2 }]
        }
      },
      {
        name: '回旋斩',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve', target: self, key: 'rational', value: self.rational * 0.1 },
            { effect: 'Damage', target: opposite, value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 2,
    name: '魔女伊迪丝',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '斩击',
        type: '伤害',
        description: '以理性值20%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: opposite, value: self.rational * 0.2 }]
        }
      },
      {
        name: '回旋斩',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve', target: self, key: 'rational', value: self.rational * 0.1 },
            { effect: 'Damage', target: opposite, value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 3,
    name: '魔女伊迪丝',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '斩击',
        type: '伤害',
        description: '以理性值20%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: opposite, value: self.rational * 0.2 }]
        }
      },
      {
        name: '回旋斩',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve', target: self, key: 'rational', value: self.rational * 0.1 },
            { effect: 'Damage', target: opposite, value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 4,
    name: '魔女伊迪丝',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '斩击',
        type: '伤害',
        description: '以理性值20%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: opposite, value: self.rational * 0.2 }]
        }
      },
      {
        name: '回旋斩',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve', target: self, key: 'rational', value: self.rational * 0.1 },
            { effect: 'Damage', target: opposite, value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 5,
    name: '魔女伊迪丝',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '斩击',
        type: '伤害',
        description: '以理性值20%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: opposite, value: self.rational * 0.2 }]
        }
      },
      {
        name: '回旋斩',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve', target: self, key: 'rational', value: self.rational * 0.1 },
            { effect: 'Damage', target: opposite, value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 6,
    name: '魔女伊迪丝',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '斩击',
        type: '伤害',
        description: '以理性值20%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: opposite, value: self.rational * 0.2 }]
        }
      },
      {
        name: '回旋斩',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve', target: self, key: 'rational', value: self.rational * 0.1 },
            { effect: 'Damage', target: opposite, value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 7,
    name: '魔女伊迪丝',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '斩击',
        type: '伤害',
        description: '以理性值20%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: opposite, value: self.rational * 0.2 }]
        }
      },
      {
        name: '回旋斩',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve', target: self, key: 'rational', value: self.rational * 0.1 },
            { effect: 'Damage', target: opposite, value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 8,
    name: '魔女伊迪丝',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '斩击',
        type: '伤害',
        description: '以理性值20%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: opposite, value: self.rational * 0.2 }]
        }
      },
      {
        name: '回旋斩',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%的数值攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve', target: self, key: 'rational', value: self.rational * 0.1 },
            { effect: 'Damage', target: opposite, value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
]

const sourceIoad = () => {
  originMonster.forEach(i => i.imageDOM = Picture.get('monster-' + i.key))

  originWitch.forEach(i => {
    i.imageDOM = Picture.get('witch-' + i.key)

    i.skill.forEach((i_, index_) => {
      i_.imageDOM = Picture.get('witch-skill-' + i.key)[index_]
    })
  })
}

export { originMonster, originWitch, sourceIoad }