import { Canvas } from './instance-canvas'

class Animation {
  constructor() {
    this.map = {

    }

    Object.keys(this.map).forEach((i) => {
      this.map[i] = this.map[i].reduce((t, i) => [...t, ...new Array(4).fill(i)], [])
    })

    this.queqe = []
  }

  load() {
    return Promise.all(Object.entries(this.map).map(i => {
      return Promise.all(i[1].map((i_, index_) => {
        return new Promise(r => {
          const image = new Image()
          image.src = i[1][index_]
          image.onload = r
          i[1][index_] = image
        })
      }))
    }))
  }

  play(key, option) {
    if (!this.map[key]) console.error(key)

    this.queqe.push({ key: key, src: this.map[key], option, index: 0 })
  }

  render() {
    this.queqe.forEach((i, index) => {
      const img = i.src[i.index]

      if (img) {
        Canvas.ctx.drawImage(img, ...i.option(img))
        i.index = i.index + 1
      }

      if (!img) {
        this.queqe.splice(index, 1)
      }
    })
  }
}

const AnimationInstance = new Animation()

export { AnimationInstance as Animation }