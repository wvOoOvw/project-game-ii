// import S_audiofreehighqps_DA_B0_CKwRINsEIkYTAAWoHgCR2Utt from '../media/_storages_386a-audiofreehighqps_DA_B0_CKwRINsEIkYTAAWoHgCR2Utt.mp3'
// import S_5c88acd3ccdc817369 from '../media/5c88acd3ccdc817369.mp3'

class Sound {
  constructor() {
    this.map = {
      // JOJO_HBY: S_audiofreehighqps_DA_B0_CKwRINsEIkYTAAWoHgCR2Utt,
      // hit: S_5c88acd3ccdc817369,
    }

    this.audioQueue = new Array(8).fill().map(i => new Audio())
  }

  play(key, loop = false) {
    const current = this.audioQueue.find(i => !i.playing)

    current.onended = () => current.playing = false
    current.playing = true
    current.loop = loop
    current.src = this.map[key]
    current.play()
  }
}

const SoundInstance = new Sound()

export { SoundInstance as Sound }