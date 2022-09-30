import J_162926_76690565815 from '../media/162926_76690565815.jpg'

const origin = [
  {
    key: 1,
    name: '燃烧',
    type: '进攻卡',
    attribute: '火',
    image: J_162926_76690565815,
    description: l => `消耗10MP，造成 ${l * 15 + 100} 伤害，并附加给目标一层灼烧印记。`,
    function: (self, target, round) => {

    }
  },
  {
    key: 2,
    name: '冰冻',
    type: '魔法卡',
    attribute: '水',
    image: J_162926_76690565815,
    description: l => `造成 ${l * 15 + 30} 伤害，恢复 30MP。`,
    function: (self, target, round) => {

    }
  },
  {
    key: 3,
    name: '自然',
    type: '治疗卡',
    attribute: '木',
    image: J_162926_76690565815,
    description: l => `恢复 50HP、20MP`,
    function: (self, target, round) => {

    }
  },
  {
    key: 4,
    name: '堕天',
    type: '进攻卡',
    attribute: '暗',
    image: J_162926_76690565815,
    description: l => `消耗50MP，造成 ${l * 30 + 300} 伤害`,
    function: (self, target, round) => {

    }
  },
]

export { origin }