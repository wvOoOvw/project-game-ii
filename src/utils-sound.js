import I_pve from '../static/sound/pve.m4a'
import I_bgm from '../static/sound/bgm.m4a'

class Sound {
  constructor() {
    this.map = {
      'bgm': I_bgm,
      'pve': I_pve
    }

    this.queqe = []
  }

  load() {
    return Promise.all(Object.entries(this.map).map(i => {
      return new Promise(r => {
        const audio = new Audio()
        audio.src = this.map[i[0]]
        audio.onloadeddata = r
      })
    }))
  }

  play(key, option) {
    if (!this.map[key]) return

    this.queqe.push({ key: key, option, Audio: new Audio(this.map[key]) })
  }

  stop(key) {
    this.queqe.forEach(i => {
      if (i.key === key) i.stop = true
    })
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