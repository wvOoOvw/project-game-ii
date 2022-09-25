import J_162926_76690565815 from '../media/162926_76690565815.jpeg'

const origin = [
  {
    key: 1,
    name: '燃烧',
    type: '进攻卡',
    attribute: '火',
    cost: 0,
    image: J_162926_76690565815,
    description: l => `造成 ${l * 15 + 100} 伤害，并附加给目标一层灼烧印记。`,
    function: (self, target, round) => {

    }
  },
  {
    key: 2,
    name: '冰冻',
    type: '魔法卡',
    attribute: '水',
    cost: 0,
    image: J_162926_76690565815,
    description: l => `造成 ${l * 15 + 30} 伤害，恢复 30MP。`,
    function: (self, target, round) => {

    }
  },
  {
    key: 3,
    name: '缠绕',
    type: '治疗卡',
    attribute: '木',
    cost: 0,
    image: J_162926_76690565815,
    description: l => `恢复 50HP、20MP`,
    function: (self, target, round) => {

    }
  }
]

export { origin }

const parse = (card) => {
  const c = origin.find(i => card.key === i.key)
  return { ...c, ...card }
}

export { parse }

const mock = (number = 12) => new Array(number).fill(origin).reduce((t, i) => [...t, ...i], [])

export { mock }