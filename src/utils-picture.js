import I_music_13984275f7e74916ba204fbeaaae245b0 from '../media/image/music_13984275f7e74916ba204fbeaaae245b0.jpg'
import I_music_3fc1533a1a964121b783582911d683330 from '../media/image/music_3fc1533a1a964121b783582911d683330.jpg'
import I_music_5c3cdbd72894434e891ce792de441feb0 from '../media/image/music_5c3cdbd72894434e891ce792de441feb0.jpg'
import I_music_62a838eadcd148ec84a68cbebc66d1950 from '../media/image/music_62a838eadcd148ec84a68cbebc66d1950.jpg'
import I_music_691867e77bc4438dadad338613ecec940 from '../media/image/music_691867e77bc4438dadad338613ecec940.jpg'
import I_music_98a7a38ce58546a7841d18c96e41e3760 from '../media/image/music_98a7a38ce58546a7841d18c96e41e3760.jpg'
import I_music_b58bc7e6350d4e65ae6c082cb02b39e30 from '../media/image/music_b58bc7e6350d4e65ae6c082cb02b39e30.jpg'
import I_music_e53de317c5b14c4699320ad8d5119e0f0 from '../media/image/music_e53de317c5b14c4699320ad8d5119e0f0.jpg'
import I_music_e68a943eab4c4a17b71a5c7f1c7928600 from '../media/image/music_e68a943eab4c4a17b71a5c7f1c7928600.jpg'
import I_music_e6ebd8cf5e444600b4887df07e9db65b0 from '../media/image/music_e6ebd8cf5e444600b4887df07e9db65b0.jpg'
import I_music_f1c8775faa87442a845a2865325229b60 from '../media/image/music_f1c8775faa87442a845a2865325229b60.jpg'
import I_music_fca2f9d2789a4fc6a6f821098d3e64690 from '../media/image/music_fca2f9d2789a4fc6a6f821098d3e64690.jpg'
import I_tiku_2370518a7d30c7bf6b02aefe4ee7713788317991416cd96a6a299a24a70273fd from '../media/image/tiku_2370518a7d30c7bf6b02aefe4ee7713788317991416cd96a6a299a24a70273fd.jpg'
import I_tiku_26d8971fa322a02278bbd05db933493de77be04391edf756b5569172a3177c63 from '../media/image/tiku_26d8971fa322a02278bbd05db933493de77be04391edf756b5569172a3177c63.jpg'
import I_tiku_3367fcf4fe5f579474168c512d4587950f62caf6702c5920ce200956789b89c5 from '../media/image/tiku_3367fcf4fe5f579474168c512d4587950f62caf6702c5920ce200956789b89c5.jpg'
import I_tiku_79de25fc9f3d427a1d82b509b0c39cef8e91eda06c79ddeab882ba309e7a4c90 from '../media/image/tiku_79de25fc9f3d427a1d82b509b0c39cef8e91eda06c79ddeab882ba309e7a4c90.jpg'
import I_tiku_853447bbb37c404df8ecfdd5ac629e820895ccea0d8aa1dc08e64b0a6441b3a4 from '../media/image/tiku_853447bbb37c404df8ecfdd5ac629e820895ccea0d8aa1dc08e64b0a6441b3a4.jpg'
import I_tiku_8be693403c572c95b6cb6b6eff7fd493813b31a77492e8a9666deb1661a07b75 from '../media/image/tiku_8be693403c572c95b6cb6b6eff7fd493813b31a77492e8a9666deb1661a07b75.jpg'
import I_tiku_976720a8be03f2a484db9437b80b829ccd754f092681f00b3b4307d6e88f9ef7 from '../media/image/tiku_976720a8be03f2a484db9437b80b829ccd754f092681f00b3b4307d6e88f9ef7.jpg'
import I_tiku_e2cd4f29dbec9563c6a415cec238cb947e7332c74f73104325e06b926150b37a from '../media/image/tiku_e2cd4f29dbec9563c6a415cec238cb947e7332c74f73104325e06b926150b37a.jpg'
import I_tiku_faa32e072f102bc653036b6f46fb58c34aa0fea084ec672919a43c9d40821dcf from '../media/image/tiku_faa32e072f102bc653036b6f46fb58c34aa0fea084ec672919a43c9d40821dcf.jpg'


class Picture {
  constructor() {
    const parse = (origin) => {
      Object.entries(origin).forEach(i => {
        const image = new Image()
        image.src = origin[i[0]]
        origin[i[0]] = image
      })
    }

    this.map = {
      'background-home': I_music_3fc1533a1a964121b783582911d683330,
      'background-transition': I_music_13984275f7e74916ba204fbeaaae245b0,
      'background-page': I_tiku_976720a8be03f2a484db9437b80b829ccd754f092681f00b3b4307d6e88f9ef7,

      'money-1': I_tiku_8be693403c572c95b6cb6b6eff7fd493813b31a77492e8a9666deb1661a07b75,
      'money-2': I_tiku_8be693403c572c95b6cb6b6eff7fd493813b31a77492e8a9666deb1661a07b75,
      'money-3': I_tiku_8be693403c572c95b6cb6b6eff7fd493813b31a77492e8a9666deb1661a07b75,

      'explore-1': I_tiku_79de25fc9f3d427a1d82b509b0c39cef8e91eda06c79ddeab882ba309e7a4c90,
      'explore-2': I_tiku_79de25fc9f3d427a1d82b509b0c39cef8e91eda06c79ddeab882ba309e7a4c90,

      'shop-1': I_tiku_853447bbb37c404df8ecfdd5ac629e820895ccea0d8aa1dc08e64b0a6441b3a4,
      'shop-2': I_tiku_853447bbb37c404df8ecfdd5ac629e820895ccea0d8aa1dc08e64b0a6441b3a4,

      'master-1': I_tiku_e2cd4f29dbec9563c6a415cec238cb947e7332c74f73104325e06b926150b37a,
      'master-2': I_tiku_faa32e072f102bc653036b6f46fb58c34aa0fea084ec672919a43c9d40821dcf,
      'master-3': I_tiku_2370518a7d30c7bf6b02aefe4ee7713788317991416cd96a6a299a24a70273fd,

      'card-1': I_music_f1c8775faa87442a845a2865325229b60,
      'card-2': I_music_5c3cdbd72894434e891ce792de441feb0,
      'card-3': I_music_62a838eadcd148ec84a68cbebc66d1950,
      'card-4': I_music_691867e77bc4438dadad338613ecec940,
      'card-5': I_music_98a7a38ce58546a7841d18c96e41e3760,
      'card-6': I_music_b58bc7e6350d4e65ae6c082cb02b39e30,
      'card-7': I_music_e53de317c5b14c4699320ad8d5119e0f0,
      'card-8': I_music_e68a943eab4c4a17b71a5c7f1c7928600,
      'card-9': I_music_e6ebd8cf5e444600b4887df07e9db65b0,
    }

    parse(this.map)
  }

  get(key) {
    if (!this.map[key]) console.error(key)
    return this.map[key]
  }
}

const PictureInstance = new Picture()

export { PictureInstance as Picture }