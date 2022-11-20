import red_hit_0 from '../static/animation/red-hit/0.png'
import red_hit_1 from '../static/animation/red-hit/1.png'
import red_hit_2 from '../static/animation/red-hit/2.png'
import red_hit_3 from '../static/animation/red-hit/3.png'
import red_hit_4 from '../static/animation/red-hit/4.png'
import red_hit_5 from '../static/animation/red-hit/5.png'

const ctx = canvas.getContext('2d')

class Animation {
  constructor() {
    this.map = {
      'red-hit': [red_hit_0, red_hit_0, red_hit_1, red_hit_1, red_hit_2, red_hit_2, red_hit_3, red_hit_3, red_hit_4, red_hit_4, red_hit_5, red_hit_5]
    }

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
    if (!this.map[key]) return

    this.queqe.push({ key: key, src: this.map[key], option, index: 0 })
  }

  stop(key) {
    this.queqe = this.queqe.filter(i => i.key !== key)
  }

  render() {
    this.queqe.forEach((i, index) => {
      const img = i.src[i.index]

      if (img) {
        ctx.drawImage(img, ...i.option(img))
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