import red_hit_0 from '../media/animation/red-hit/0.png'
import red_hit_1 from '../media/animation/red-hit/1.png'
import red_hit_2 from '../media/animation/red-hit/2.png'
import red_hit_3 from '../media/animation/red-hit/3.png'
import red_hit_4 from '../media/animation/red-hit/4.png'
import red_hit_5 from '../media/animation/red-hit/5.png'

const ctx = canvas.getContext('2d')

class Animation {
  constructor() {
    const parse = (origin) => {
      Object.entries(origin).forEach(i => {
        i[1].forEach((i_, index_) => {
          const image = new Image()
          image.src = i[1][index_]
          i[1][index_] = image
        })
      })
    }

    this.map = {
      'red-hit': [red_hit_0, red_hit_0, red_hit_1, red_hit_1, red_hit_2, red_hit_2, red_hit_3, red_hit_3, red_hit_4, red_hit_4, red_hit_5, red_hit_5]
    }

    this.queqe = []

    parse(this.map)
  }

  play(key, option) {
    if (!this.map[key]) return

    this.queqe.push({
      index: 0,
      imgs: this.map[key],
      option, option
    })
  }

  render() {
    this.queqe.forEach((i, index) => {
      const img = i.imgs[i.index]

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

export { Animation }