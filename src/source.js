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
    exp: 20,
    skill: [
      {
        name: '冲撞',
        type: '伤害',
        description: '蓄势待发，准备向你冲来！做好防御的准备！！！',
        function: (self, opposite, oppositeAll) => {
          return [
            { effect: 'Damage', target: [opposite], value: Math.floor(100 + Math.random() * 50) },
          ]
        }
      },
      {
        name: '休息',
        type: '回复',
        description: '躺在了地上！',
        function: (self, opposite, oppositeAll) => {
          return [
            { effect: 'Damage', target: [opposite], value: Math.floor(20 + Math.random() * 50) },
          ]
        }
      }
    ]
  }
]

var originWitch = [
  {
    key: 1,
    name: '自由滑轮',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '圆舞',
        type: '伤害',
        description: '以理性值20%攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: [opposite], value: self.rational * 0.2 }]
        }
      },
      {
        name: '零落',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve-Rational', target: [self], value: self.rational * 0.1 },
            { effect: 'Damage', target: [opposite], value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 2,
    name: '甜食守卫',
    type: '进攻',
    description: '',
    purity: 1150,
    rational: 960,
    perceptual: 1040,
    skill: [
      {
        name: '舜生',
        type: '伤害',
        description: '以感性值18%攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: [opposite], value: self.perceptual * 0.18 }]
        }
      },
      {
        name: '刹那',
        type: '伤害',
        description: '以理性值18%攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Damage', target: [opposite], value: self.rational * 0.18 }
          ]
        }
      }
    ]
  },
  {
    key: 3,
    name: '疯人院',
    type: '辅助',
    description: '',
    purity: 1000,
    rational: 820,
    perceptual: 1200,
    skill: [
      {
        name: '绯红之刃',
        type: '伤害',
        description: '以感性值12%攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: [opposite], value: self.perceptual * 0.12 }]
        }
      },
      {
        name: '绯红治疗',
        type: '回复',
        description: '以感性值8%治疗友方全体',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Cure', target: selfAll, value: self.perceptual * 0.08 }
          ]
        }
      }
    ]
  },
  {
    key: 4,
    name: '致命音符',
    type: '防御',
    description: '',
    purity: 1500,
    rational: 920,
    perceptual: 700,
    skill: [
      {
        name: '闪光独奏',
        type: '伤害',
        description: '以理性值15%攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: [opposite], value: self.rational * 0.15 }]
        }
      },
      {
        name: '爆裂节拍',
        type: '防御',
        description: '本回合内提升自身减伤70%',
        function: (self, opposite, selfAll) => {
          const buff = (result) => {
            if (result.effect === 'Damage' && result.target === self) {
              result.value = numberFix(result.value * 0.3)
            }
          }

          return [
            { effect: 'Buff', target: [self], value: buff, name: '减伤', time: 1 }
          ]
        }
      }
    ]
  },
  {
    key: 5,
    name: '晚安故事',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '放音',
        type: '伤害',
        description: '以理性值20%攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: [opposite], value: self.rational * 0.2 }]
        }
      },
      {
        name: '夜半',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve-Rational', target: [self], value: self.rational * 0.1 },
            { effect: 'Damage', target: [opposite], value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 6,
    name: '场外焦点',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '偶像身姿',
        type: '伤害',
        description: '以理性值20%攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: [opposite], value: self.rational * 0.2 }]
        }
      },
      {
        name: '闪烁打击',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve-Rational', target: [self], value: self.rational * 0.1 },
            { effect: 'Damage', target: [opposite], value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 7,
    name: '纯真',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '飞叶',
        type: '伤害',
        description: '以理性值20%攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: [opposite], value: self.rational * 0.2 }]
        }
      },
      {
        name: '香气',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve-Rational', target: [self], value: self.rational * 0.1 },
            { effect: 'Damage', target: [opposite], value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 8,
    name: '不良',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '惩戒',
        type: '伤害',
        description: '以理性值20%攻击目标',
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage', target: [opposite], value: self.rational * 0.2 }]
        }
      },
      {
        name: '利刃回旋',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%攻击目标',
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve-Rational', target: [self], value: self.rational * 0.1 },
            { effect: 'Damage', target: [opposite], value: self.rational * 0.15 }
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