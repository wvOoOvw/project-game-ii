import I_1011_ch4_act1 from '../static/sound/1011_ch4_act1.mp3'
import I_119_1013_AVG09 from '../static/sound/119_1013_AVG09.mp3'
import I_Vo1002_Lup01 from '../static/sound/Vo1002_Lup01.mp3'
import I_bgm from '../static/sound/bgm.m4a'
import I_pve from '../static/sound/pve.m4a'

class Sound {
  constructor() {
    this.map = {
      'background-main': I_bgm,
      'background-pve': I_pve,

      'master-main-1': I_Vo1002_Lup01,
      'master-main-2': I_Vo1002_Lup01,
      'master-main-3': I_Vo1002_Lup01,
      'master-main-4': I_Vo1002_Lup01,
      'master-main-5': I_Vo1002_Lup01,

      'master-action-1': I_1011_ch4_act1,
      'master-action-2': I_1011_ch4_act1,
      'master-action-3': I_1011_ch4_act1,
      'master-action-4': I_1011_ch4_act1,
      'master-action-5': I_1011_ch4_act1,

      'card-main-1': I_Vo1002_Lup01,
      'card-main-2': I_Vo1002_Lup01,
      'card-main-3': I_Vo1002_Lup01,
      'card-main-4': I_Vo1002_Lup01,
      'card-main-5': I_Vo1002_Lup01,
      'card-main-6': I_Vo1002_Lup01,
      'card-main-7': I_Vo1002_Lup01,
      'card-main-8': I_Vo1002_Lup01,
      'card-main-9': I_Vo1002_Lup01,
      'card-main-10': I_Vo1002_Lup01,
      'card-main-11': I_Vo1002_Lup01,
      'card-main-12': I_Vo1002_Lup01,

      'card-action-1': I_1011_ch4_act1,
      'card-action-2': I_1011_ch4_act1,
      'card-action-3': I_1011_ch4_act1,
      'card-action-4': I_1011_ch4_act1,
      'card-action-5': I_1011_ch4_act1,
      'card-action-6': I_1011_ch4_act1,
      'card-action-7': I_1011_ch4_act1,
      'card-action-8': I_1011_ch4_act1,
      'card-action-9': I_1011_ch4_act1,
      'card-action-10': I_1011_ch4_act1,
      'card-action-11': I_1011_ch4_act1,
      'card-action-12': I_1011_ch4_act1,
    }

    this.queqe = []
  }

  load() {
    return Promise.all(Object.entries(this.map).map(i => {
      return Promise.race([
        new Promise(r => {
          const audio = new Audio()
          audio.onloadeddata = r
          audio.src = this.map[i[0]]
          audio.load()
        }),
        new Promise(r => {
          setTimeout(() => r(), 1000)
        })
      ])
    }))
  }

  play(key, option) {
    if (!this.map[key]) console.error(key)

    this.queqe.push({ key: key, option, Audio: new Audio(this.map[key]) })
  }

  stop(key) {
    this.queqe.forEach(i => {
      if (i.key === key) i.stop = true
    })
  }

  clear() {
    this.queqe = []
  }

  find(key) {
    return this.queqe.filter(i => i.key === key)
  }

  render() {
    this.queqe.forEach((i, index) => {

      Object.assign(i.Audio, i.option)

      i.Audio.onplay = () => i.play = true
      i.Audio.onpause = () => this.queqe = this.queqe.filter(i_ => i_ !== i)

      try {
        if (i.stop) i.Audio.pause()
        if (!i.play) i.Audio.play()
      } catch { }
    })
  }
}

const SoundInstance = new Sound()

export { SoundInstance as Sound }