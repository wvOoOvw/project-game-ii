import red_hit_0 from '../media/animation/red-hit/0.png'
import red_hit_1 from '../media/animation/red-hit/1.png'
import red_hit_2 from '../media/animation/red-hit/2.png'
import red_hit_3 from '../media/animation/red-hit/3.png'
import red_hit_4 from '../media/animation/red-hit/4.png'
import red_hit_5 from '../media/animation/red-hit/5.png'

const ctx = canvas.getContext('2d')

class Animation {
  constructor() {
    this.map = {
      'red-hit': [red_hit_0, red_hit_1, red_hit_2, red_hit_3, red_hit_4, red_hit_5].map(i => this.createImage(i))
    }

    this.animationQueue = []
  }

  createImage = (src) => {
    const image = new Image()
    image.src = src
  
    return image
  }

  play(key, option) {
    this.animationQueue.push({
      index: 0,
      imgs: this.map[key],
      option, option
    })
  }

  render() {
    this.animationQueue.forEach((i, index) => {
      if (i.imgs[i.index]) {
        ctx.drawImage(i.imgs[i.index], ...i.option)
        i.index = i.index + 1
      }

      if (!i.imgs[i.index]) {
        this.animationQueue.splice(index, 1)
      }
    })
  }
}

export { Animation }