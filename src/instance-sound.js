// import I_1011_ch4_act1 from '../static/sound/1011_ch4_act1.mp3'
// import I_119_1013_AVG09 from '../static/sound/119_1013_AVG09.mp3'
// import I_Vo1002_Lup01 from '../static/sound/Vo1002_Lup01.mp3'
// import I_bgm from '../static/sound/bgm.m4a'
// import I_pve from '../static/sound/pve.m4a'

class Sound {
  constructor() {
    this.map = {
      // 'background-main': I_bgm,
      // 'background-pve': I_pve,
    }

    this.queqe = []
  }

  load() {
    return Promise.all(Object.entries(this.map).map(i => {
      return new Promise(r => {
        const audio = new Audio()
        audio.onloadeddata = r
        audio.src = this.map[i[0]]
        this.map[i[0]] = audio
        audio.load()
      })
    }))
  }

  get(key) {
    if (!this.map[key]) console.error(key)
    
    return this.map[key]
  }
}

const SoundInstance = new Sound()

export { SoundInstance as Sound }