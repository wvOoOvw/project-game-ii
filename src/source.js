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
    dirty: 1200,
    description: '在丛林中被污染的野猪，具备一定的攻击性。',
    skill: [
      {
        name: '冲撞',
        type: '伤害',
        description: '蓄势待发，准备向你冲来！做好防御的准备！！！',
        function: (result, self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: Math.floor(100 + Math.random() * 50) })
        }
      }
    ]
  }
]

var originWitch = [
  {
    key: 1,
    name: '修女',
    purity: 1200,
    rational: 980,
    perceptual: 880,
    skill: [
      {
        key: 1,
        name: '净化',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
        }
      },
      {
        key: 2,
        name: '冲撞',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
        }
      }
    ]
  },
  {
    key: 2,
    name: '修女',
    purity: 1200,
    rational: 980,
    perceptual: 880,
    skill: [
      {
        key: 1,
        name: '净化',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
        }
      },
      {
        key: 2,
        name: '冲撞',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
        }
      }
    ]
  },
  {
    key: 3,
    name: '修女',
    purity: 1200,
    rational: 980,
    perceptual: 880,
    skill: [
      {
        key: 1,
        name: '净化',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
        }
      },
      {
        key: 2,
        name: '冲撞',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
        }
      }
    ]
  },
  {
    key: 4,
    name: '修女',
    purity: 1200,
    rational: 980,
    perceptual: 880,
    skill: [
      {
        key: 1,
        name: '净化',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
        }
      },
      {
        key: 2,
        name: '冲撞',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
        }
      }
    ]
  },
  {
    key: 5,
    name: '修女',
    purity: 1200,
    rational: 980,
    perceptual: 880,
    skill: [
      {
        key: 1,
        name: '净化',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
        }
      },
      {
        key: 2,
        name: '冲撞',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
        }
      }
    ]
  },
  {
    key: 6,
    name: '修女',
    purity: 1200,
    rational: 980,
    perceptual: 880,
    skill: [
      {
        key: 1,
        name: '净化',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
        }
      },
      {
        key: 2,
        name: '冲撞',
        type: '伤害',
        description: '去除污秽！以理性值20%的数值净化目标',
        function: (self, opposite) => {
          result.push({ effect: 'Damage', target: 'opposite', value: self.rational * 0.2 })
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