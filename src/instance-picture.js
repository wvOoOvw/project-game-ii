import I_aiyafala37be7922 from '../static/image/aiyafala.37be7922.png'
import I_chenb65023b5 from '../static/image/chen.b65023b5.png'
import I_cuoec908ed3c from '../static/image/cuoe.c908ed3c.png'
import I_fengdi72b31ee1 from '../static/image/fengdi.72b31ee1.png'
import I_hei6cc6018a from '../static/image/hei.6cc6018a.png'
import I_heijiane5f9b0d1 from '../static/image/heijian.e5f9b0d1.png'
import I_huanga3fc17ce from '../static/image/huang.a3fc17ce.png'
import I_kongxiande9b3926 from '../static/image/kongxian.de9b3926.png'
import I_linguangacf5bd67 from '../static/image/linguang.acf5bd67.png'
import I_nengtianshi3189957b from '../static/image/nengtianshi.3189957b.png'
import I_nianafb4fd28 from '../static/image/nian.afb4fd28.png'
import I_niyan0a121257 from '../static/image/niyan.0a121257.png'
import I_saileiya1d6838fc from '../static/image/saileiya.1d6838fc.png'
import I_senran4ce470a9 from '../static/image/senran.4ce470a9.png'
import I_shanec3e6c6d from '../static/image/shan.ec3e6c6d.png'
import I_shier4eb733a9 from '../static/image/shier.4eb733a9.png'
import I_tuijin5a8f324f from '../static/image/tuijin.5a8f324f.png'
import I_w86ab2d3c from '../static/image/w.86ab2d3c.png'
import I_xif1b31093 from '../static/image/xi.f1b31093.png'
import I_yanwei29b3239c from '../static/image/yanwei.29b3239c.png'
import I_yifulite8bc864d4 from '../static/image/yifulite.8bc864d4.png'

class Picture {
  constructor() {
    this.map = {
      'home': I_niyan0a121257,

      'monster-1': I_saileiya1d6838fc,

      'witch-1': I_aiyafala37be7922,
      'witch-skill-1': [I_shanec3e6c6d, I_saileiya1d6838fc],

      'witch-2': I_tuijin5a8f324f,
      'witch-skill-2': [I_shanec3e6c6d, I_saileiya1d6838fc],

      'witch-3': I_cuoec908ed3c,
      'witch-skill-3': [I_shanec3e6c6d, I_saileiya1d6838fc],

      'witch-4': I_linguangacf5bd67,
      'witch-skill-4': [I_shanec3e6c6d, I_saileiya1d6838fc],

      'witch-5': I_yifulite8bc864d4,
      'witch-skill-5': [I_shanec3e6c6d, I_saileiya1d6838fc],

      'witch-6': I_yanwei29b3239c,
      'witch-skill-6': [I_shanec3e6c6d, I_saileiya1d6838fc],

      'witch-7': I_xif1b31093,
      'witch-skill-7': [I_shanec3e6c6d, I_saileiya1d6838fc],

      'witch-8': I_w86ab2d3c,
      'witch-skill-8': [I_shanec3e6c6d, I_saileiya1d6838fc],
    }
  }

  load() {
    return Promise.all(Object.entries(this.map).map(i => {
      return new Promise(r => {
        if (typeof this.map[i[0]] === 'string') {
          const image = new Image()
          image.onload = r
          image.src = this.map[i[0]]
          this.map[i[0]] = image
          return
        }
        if (typeof this.map[i[0]] === 'object') {
          Promise.all(this.map[i[0]].map((i_, index_) => new Promise(r_ => {
            const image = new Image()
            image.onload = r_
            image.src = i_
            this.map[i[0]][index_] = image
          }))).then(r)
          return
        }
      })
    }))
  }

  get(key) {
    if (!this.map[key]) console.error(key)

    return this.map[key]
  }
}

const PictureInstance = new Picture()

export { PictureInstance as Picture }