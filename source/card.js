import J_music_1c31bcc267a545ef971109512053f3e50 from '../media/music_1c31bcc267a545ef971109512053f3e50.jpeg'
import J_music_47a83799595b4a5b97145a6e594620310 from '../media/music_47a83799595b4a5b97145a6e594620310.jpeg'
import J_music_6e9e96c75cf04411baa154b1d6a3c7360 from '../media/music_6e9e96c75cf04411baa154b1d6a3c7360.jpeg'
import J_music_072c59684f6c401dad40cadf0d0dd6290 from '../media/music_072c59684f6c401dad40cadf0d0dd6290.jpeg'
import J_music_56280e428411459c823ce172d97da20c0 from '../media/music_56280e428411459c823ce172d97da20c0.jpeg'


const origin = [
  {
    key: 1,
    name: '燃烧',
    type: '进攻卡',
    race: '火',
    limit: 3,
    image: J_music_1c31bcc267a545ef971109512053f3e50,
    description: l => `消耗10MP，造成 ${l * 15 + 100} 伤害，并附加给目标一层灼烧印记。`,
    function: (card, self, target, round) => {
      return [
        { type: 'hit', value: card.level * 15 + 100}
      ]
    }
  },
  {
    key: 2,
    name: '冰冻',
    type: '魔法卡',
    race: '水',
    limit: 3,
    image: J_music_47a83799595b4a5b97145a6e594620310,
    description: l => `造成 ${l * 15 + 30} 伤害，恢复 30MP。`,
    function: (self, target, round) => {

    }
  },
  {
    key: 3,
    name: '自然',
    type: '治疗卡',
    race: '木',
    limit: 3,
    image: J_music_6e9e96c75cf04411baa154b1d6a3c7360,
    description: l => `恢复 50HP、20MP`,
    function: (self, target, round) => {

    }
  },
  {
    key: 4,
    name: '堕天',
    type: '进攻卡',
    race: '暗',
    limit: 3,
    image: J_music_072c59684f6c401dad40cadf0d0dd6290,
    description: l => `消耗50MP，造成 ${l * 30 + 300} 伤害`,
    function: (self, target, round) => {

    }
  },
]

export { origin }