class Sound {
  constructor() {
    this.map = {

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