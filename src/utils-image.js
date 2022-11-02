import { addEventListener, addEventListenerPure, createImage, ifTouchCover, ifScreenCover, setArrayRandom, arrayRandom, numberFix, levelText, wait } from './utils-common'

import music_56280e428411459c823ce172d97da20c0 from '../media/background/music_56280e428411459c823ce172d97da20c0.jpg'
import music_cacbcd0fe27247e69c12d67f3ea1673e0 from '../media/background/music_cacbcd0fe27247e69c12d67f3ea1673e0.jpg'
import music_3fc1533a1a964121b783582911d683330 from '../media/background/music_3fc1533a1a964121b783582911d683330.jpg'

import J_music_2fec7f9242b44b64a914f7cc19d25abe0 from '../media/card/music_2fec7f9242b44b64a914f7cc19d25abe0.jpg'
import J_music_4d7f219082ba4d86b1543c982d1156560 from '../media/card/music_4d7f219082ba4d86b1543c982d1156560.jpg'
import J_music_6e9e96c75cf04411baa154b1d6a3c7360 from '../media/card/music_6e9e96c75cf04411baa154b1d6a3c7360.jpg'
import J_music_88c8411d068c455099456851ec84f65c0 from '../media/card/music_88c8411d068c455099456851ec84f65c0.jpg'
import J_music_98a7a38ce58546a7841d18c96e41e3760 from '../media/card/music_98a7a38ce58546a7841d18c96e41e3760.jpg'
import J_music_c753fd717be543eaa25f4a1aa9240d7d0 from '../media/card/music_c753fd717be543eaa25f4a1aa9240d7d0.jpg'
import J_music_c12894d6ce644a37a16069502d98c9b80 from '../media/card/music_c12894d6ce644a37a16069502d98c9b80.jpg'
import J_tiku_2e150939d1e635d0b03b06dfcd2f414885dd8724662bcd88687fb1e9ce46fa0e from '../media/card/tiku_2e150939d1e635d0b03b06dfcd2f414885dd8724662bcd88687fb1e9ce46fa0e.jpg'
import J_tiku_7758d073971ffb4a8d1ec164c2a88e73bf9b29048cbe9c971c0c3d8e8ab6afea from '../media/card/tiku_7758d073971ffb4a8d1ec164c2a88e73bf9b29048cbe9c971c0c3d8e8ab6afea.jpg'
import J_tiku_b264d1ca656e2db92407cf8574ac3394dc12cb193a151c0e6631f5485ce1e2a4 from '../media/card/tiku_b264d1ca656e2db92407cf8574ac3394dc12cb193a151c0e6631f5485ce1e2a4.jpg'

import J_tiku_faa32e072f102bc653036b6f46fb58c34aa0fea084ec672919a43c9d40821dcf from '../media/shop/tiku_faa32e072f102bc653036b6f46fb58c34aa0fea084ec672919a43c9d40821dcf.jpg'

import J_music_47a83799595b4a5b97145a6e594620310 from '../media/explore/music_47a83799595b4a5b97145a6e594620310.jpg'

import J_music_1107cbd537144759999fbd7dc0fdb6650 from '../media/master/music_1107cbd537144759999fbd7dc0fdb6650.jpg'
import J_music_b6f0b1c512ad42fab204d79b85d07c140 from '../media/master/music_b6f0b1c512ad42fab204d79b85d07c140.jpg'
import J_music_b40316005b55465b80ae4eecad8447960 from '../media/master/music_b40316005b55465b80ae4eecad8447960.jpg'

import J_music_5c3cdbd72894434e891ce792de441feb0 from '../media/money/music_5c3cdbd72894434e891ce792de441feb0.jpg'

class Image {
  constructor() {
    this.map = {
      'background-home': createImage(music_56280e428411459c823ce172d97da20c0),
      'background-transition': createImage(music_cacbcd0fe27247e69c12d67f3ea1673e0),
      'background-page': createImage(music_3fc1533a1a964121b783582911d683330),
    }

    this.map_s = {

    }
  }

  get(key) {
    return this.map[key]
  }
}

const ImageInstance = new Image()

export { ImageInstance as Image }