import { parseCard, parseMaster, parseMoney, symbolNumber, wait, hash, numberFix, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover } from './utils-common'

import { Animation } from './instance-animation'
import { Canvas } from './instance-canvas'
import { Event } from './instance-event'
import { Imitation } from './instance-imitation'
import { Message } from './instance-message'
import { Picture } from './instance-picture'
import { Sound } from './instance-sound'

var originCharacteristic = [
  {
    key: 1,
    name: '勇敢',
    description: '提升理性值',
    function: (characteristic, self) => {
      self.rational = (1 + ((characteristic.level) * 0.04)) * self.rational
      self.rational_ = (1 + ((characteristic.level) * 0.04)) * self.rational_
    }
  },
  {
    key: 2,
    name: '冷静',
    description: '提升感性值',
    function: (characteristic, self) => {
      self.perceptual = (1 + ((characteristic.level) * 0.04)) * self.perceptual
      self.perceptual_ = (1 + ((characteristic.level) * 0.04)) * self.perceptual_
    }
  },
  {
    key: 3,
    name: '活力',
    description: '提升清醒值',
    function: (characteristic, self) => {
      self.purity = (1 + ((characteristic.level) * 0.04)) * self.purity
      self.purity_ = (1 + ((characteristic.level) * 0.04)) * self.purity_
    }
  }
]

var originMonster = [
  {
    key: 1,
    name: '被污染的野猪',
    description: '在丛林中被污染的野猪，具备一定的攻击性。',
    dirty: 1200,
    reward: [
      {
        name: 'exp',
        value: 20
      }
    ],
    skill: [
      {
        name: '冲撞',
        type: '伤害',
        description: '蓄势待发，准备向你冲来！做好防御的准备！！！',
        speed: 5,
        function: (self, opposite, oppositeAll) => {
          return [
            { effect: 'Damage-Purity', origin: self, target: opposite, value: Math.floor(100 + Math.random() * 50) },
          ]
        }
      },
      {
        name: '休息',
        type: '伤害',
        description: '躺在了地上！',
        speed: 9,
        function: (self, opposite, oppositeAll) => {
          return [
            { effect: 'Damage-Purity', origin: self, target: opposite, value: Math.floor(20 + Math.random() * 50) },
          ]
        }
      }
    ],
    characteristic: []
  }
]

var originWitch = [
  {
    key: 1,
    name: '加百列',
    type: '进攻',
    description: '',
    purity: 1200,
    rational: 1180,
    perceptual: 880,
    skill: [
      {
        name: '技能 A',
        type: '伤害',
        description: '以理性值20%攻击目标',
        speed: 4,
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage-Dirty', origin: self, target: opposite, value: self.rational * 0.2 }]
        }
      },
      {
        name: '技能 B',
        type: '伤害 提升',
        description: '提升自身理性值10%，并以理性值15%攻击目标',
        speed: 4,
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Improve-Rational', origin: self, target: self, value: self.rational * 0.1 },
            { effect: 'Damage-Dirty', origin: self, target: opposite, value: self.rational * 0.15 }
          ]
        }
      }
    ]
  },
  {
    key: 2,
    name: '乌利尔',
    type: '进攻',
    description: '',
    purity: 1150,
    rational: 960,
    perceptual: 1040,
    skill: [
      {
        name: '技能 A',
        type: '伤害',
        description: '以感性值18%攻击目标',
        speed: 4,
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage-Dirty', origin: self, target: opposite, value: self.perceptual * 0.18 }]
        }
      },
      {
        name: '技能 B',
        type: '伤害',
        description: '以理性值18%攻击目标',
        speed: 4,
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Damage-Dirty', origin: self, target: opposite, value: self.rational * 0.18 }
          ]
        }
      }
    ]
  },
  {
    key: 3,
    name: '米加勒',
    type: '辅助',
    description: '',
    purity: 1000,
    rational: 820,
    perceptual: 1200,
    skill: [
      {
        name: '技能 A',
        type: '伤害',
        description: '以感性值12%攻击目标',
        speed: 6,
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage-Dirty', origin: self, target: opposite, value: self.perceptual * 0.12 }]
        }
      },
      {
        name: '技能 B',
        type: '回复',
        description: '以感性值8%治疗友方全体',
        speed: 8,
        function: (self, opposite, selfAll) => {
          return selfAll.map(i => {
            return { effect: 'Cure-Purity', origin: self, target: i, value: self.perceptual * 0.08 }
          })
        }
      }
    ]
  },
  {
    key: 4,
    name: '乌列',
    type: '防御',
    description: '',
    purity: 1500,
    rational: 920,
    perceptual: 700,
    skill: [
      {
        name: '技能 A',
        type: '伤害',
        description: '以理性值15%攻击目标',
        speed: 6,
        function: (self, opposite, selfAll) => {
          return [{ effect: 'Damage-Dirty', origin: self, target: opposite, value: self.rational * 0.15 }]
        }
      },
      {
        name: '技能 B',
        type: '防御',
        description: '3回合内提升自身减伤70%',
        speed: 2,
        function: (self, opposite, selfAll) => {
          const buff = (buff, when, result, current) => {
            if (when === 'result') {
              if (current.effect === 'Damage-Purity' && current.target === self) {
                current.value = numberFix(current.value * 0.3)
              }
            }
          }
          return [
            { effect: 'Buff', origin: self, target: self, value: buff, name: '减伤', time: 3 }
          ]
        }
      }
    ]
  },
  {
    key: 5,
    name: '切茜娅',
    type: '进攻',
    description: '',
    purity: 870,
    rational: 1200,
    perceptual: 1000,
    skill: [
      {
        name: '技能 A',
        type: '伤害',
        description: '以理性值10%感性值10%攻击目标',
        speed: 4,
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Damage-Dirty', origin: self, target: opposite, value: self.rational * 0.1 + self.perceptual * 0.1 }
          ]
        }
      },
      {
        name: '技能 B',
        type: '伤害 回复',
        description: '以理性值15%感性值攻击目标，并以感性值5%治疗自己',
        speed: 7,
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Damage-Dirty', origin: self, target: opposite, value: self.rational * 0.15 },
            { effect: 'Cure-Purity', origin: self, target: i, value: self.perceptual * 0.05 }
          ]
        }
      }
    ]
  },
  {
    key: 6,
    name: '迦勒',
    type: '辅助',
    description: '',
    purity: 1050,
    rational: 880,
    perceptual: 1100,
    skill: [
      {
        name: '技能 A',
        type: '伤害 辅助',
        description: '以感性值10%攻击目标，以感性值8%提升其他友方的理性值',
        speed: 6,
        function: (self, opposite, selfAll) => {
          return [
            { effect: 'Damage-Dirty', origin: self, target: opposite, value: self.rational * 0.2 },
            ...selfAll.filter(i => i !== self).map(i => {
              return { effect: 'Improve-Rational', origin: self, target: i, value: self.perceptual * 0.08 }
            })
          ]
        }
      },
      {
        name: '技能 B',
        type: '辅助',
        description: '以感性值10%提升所有友方的理性值',
        speed: 6,
        function: (self, opposite, selfAll) => {
          return [
            ...selfAll.map(i => {
              return { effect: 'Improve-Rational', origin: self, target: i, value: self.perceptual * 0.1 }
            })
          ]
        }
      }
    ]
  }
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

const parseCharacteristic = (array) => {
  const result = array.reduce((t, i) => {
    const result_ = [...t]

    const origin = originCharacteristic.find(i_ => i.key === i_.key)

    const compose = { ...origin, ...i }

    result_.push(compose)

    return result_
  }, [])

  return result
}

const parseWitch = (array) => {
  const result = array.reduce((t, i) => {
    const result_ = [...t]

    const origin = originWitch.find(i_ => i.key === i_.key)

    const compose = { ...origin, ...i }

    compose.purity = compose.purity * Math.pow(1.2, i.level)
    compose.rational = compose.rational * Math.pow(1.2, i.level)
    compose.perceptual = compose.perceptual * Math.pow(1.2, i.level)
    compose.purity_ = compose.purity
    compose.rational_ = compose.rational
    compose.perceptual_ = compose.perceptual
    compose.buff = []
    compose.buff_ = []
    compose.characteristic = parseCharacteristic(compose.characteristic)
    compose.characteristic.forEach(i => i.function(i, compose))

    compose.purity = Math.ceil(compose.purity)
    compose.rational = Math.ceil(compose.rational)
    compose.perceptual = Math.ceil(compose.perceptual)
    compose.purity_ = Math.ceil(compose.purity_)
    compose.rational_ = Math.ceil(compose.rational_)
    compose.perceptual_ = Math.ceil(compose.perceptual_)

    result_.push(compose)

    return result_
  }, [])

  return result
}

const parseMonster = (array) => {
  const result = array.reduce((t, i) => {
    const result_ = [...t]

    const origin = originMonster.find(i_ => i.key === i_.key)

    const compose = { ...origin, ...i }

    compose.dirty = Math.ceil(compose.dirty * Math.pow(1.2, i.level))
    compose.dirty_ = compose.dirty
    compose.buff = []
    compose.buff_ = []
    compose.characteristic = parseCharacteristic(compose.characteristic)
    compose.characteristic.forEach(i => i.function(i, compose))

    compose.dirty = Math.ceil(compose.dirty)
    compose.dirty_ = Math.ceil(compose.dirty_)

    result_.push(compose)

    return result_
  }, [])

  return result
}

export { originCharacteristic, originMonster, originWitch, sourceIoad, parseCharacteristic, parseWitch, parseMonster }