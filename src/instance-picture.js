import I_aiyafala37be7922 from '../static/image/aiyafala.37be7922.png'
import I_backgroundblurd92af6bc from '../static/image/background-blur.d92af6bc.jpg'
import I_background29e6b3be from '../static/image/background.29e6b3be.jpg'
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
import I_yinhui3c5f7f39 from '../static/image/yinhui.3c5f7f39.png'

class Picture {
  constructor() {
    this.map = {
      'background-transition': I_background29e6b3be,
      'background-home': I_backgroundblurd92af6bc,
      'background-page': I_backgroundblurd92af6bc,
      'background-loading': I_backgroundblurd92af6bc,

      'money-1': I_w86ab2d3c,
      'money-2': I_w86ab2d3c,
      'money-3': I_w86ab2d3c,

      'explore-1': I_nengtianshi3189957b,
      'explore-2': I_nengtianshi3189957b,

      'shop-1': I_kongxiande9b3926,
      'shop-2': I_kongxiande9b3926,
      'shop-3': I_kongxiande9b3926,
      'shop-4': I_kongxiande9b3926,
      'shop-5': I_kongxiande9b3926,

      'master-1': I_chenb65023b5,
      'master-2': I_cuoec908ed3c,
      'master-3': I_fengdi72b31ee1,
      'master-4': I_linguangacf5bd67,
      'master-5': I_nianafb4fd28,

      'card-1': I_niyan0a121257,
      'card-2': I_saileiya1d6838fc,
      'card-3': I_senran4ce470a9,
      'card-4': I_shanec3e6c6d,
      'card-5': I_shier4eb733a9,
      'card-6': I_tuijin5a8f324f,
      'card-7': I_yanwei29b3239c,
      'card-8': I_yinhui3c5f7f39,
      'card-9': I_huanga3fc17ce,
      'card-10': I_aiyafala37be7922,
      'card-11': I_hei6cc6018a,
      'card-12': I_heijiane5f9b0d1,
    }
  }

  load() {
    return Promise.all(Object.entries(this.map).map(i => {
      return new Promise(r => {
        const image = new Image()
        image.onload = r
        image.src = this.map[i[0]]
        this.map[i[0]] = image
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