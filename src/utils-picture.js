import I_backgroundblurd92af6bcjpg from '../static/image/background-blur.d92af6bc.jpg'
import I_chenb65023b5png from '../static/image/chen.b65023b5.png'
import I_cuoec908ed3cpng from '../static/image/cuoe.c908ed3c.png'
import I_fengdi72b31ee1png from '../static/image/fengdi.72b31ee1.png'
import I_huanga3fc17cepng from '../static/image/huang.a3fc17ce.png'
import I_linguangacf5bd67png from '../static/image/linguang.acf5bd67.png'
import I_nianafb4fd28png from '../static/image/nian.afb4fd28.png'
import I_niyan0a121257png from '../static/image/niyan.0a121257.png'
import I_saileiya1d6838fcpng from '../static/image/saileiya.1d6838fc.png'
import I_senran4ce470a9png from '../static/image/senran.4ce470a9.png'
import I_shanec3e6c6dpng from '../static/image/shan.ec3e6c6d.png'
import I_shier4eb733a9png from '../static/image/shier.4eb733a9.png'
import I_tuijin5a8f324fpng from '../static/image/tuijin.5a8f324f.png'
import I_yanwei29b3239cpng from '../static/image/yanwei.29b3239c.png'
import I_yinhui3c5f7f39png from '../static/image/yinhui.3c5f7f39.png'

class Picture {
  constructor() {
    this.map = {
      'background-home': I_backgroundblurd92af6bcjpg,
      'background-transition': I_backgroundblurd92af6bcjpg,
      'background-page': I_backgroundblurd92af6bcjpg,

      'money-1': I_chenb65023b5png,
      'money-2': I_chenb65023b5png,
      'money-3': I_chenb65023b5png,

      'explore-1': I_chenb65023b5png,
      'explore-2': I_chenb65023b5png,

      'shop-1': I_chenb65023b5png,
      'shop-2': I_chenb65023b5png,
      'shop-3': I_chenb65023b5png,
      'shop-4': I_chenb65023b5png,
      'shop-5': I_chenb65023b5png,

      'master-1': I_chenb65023b5png,
      'master-2': I_cuoec908ed3cpng,
      'master-3': I_fengdi72b31ee1png,
      'master-4': I_linguangacf5bd67png,
      'master-5': I_nianafb4fd28png,

      'card-1': I_niyan0a121257png,
      'card-2': I_saileiya1d6838fcpng,
      'card-3': I_senran4ce470a9png,
      'card-4': I_shanec3e6c6dpng,
      'card-5': I_shier4eb733a9png,
      'card-6': I_tuijin5a8f324fpng,
      'card-7': I_yanwei29b3239cpng,
      'card-8': I_yinhui3c5f7f39png,
      'card-9': I_huanga3fc17cepng,
      'card-10': I_huanga3fc17cepng,
      'card-11': I_huanga3fc17cepng,
      'card-12': I_huanga3fc17cepng,
    }
  }

  load() {
    return Promise.all(Object.entries(this.map).map(i => {
      return new Promise(r => {
        const image = new Image()
        image.src = this.map[i[0]]
        image.onload = r
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