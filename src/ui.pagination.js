import { addEventListener, addEventListenerPure } from './utils.common'
import { drawRadiusRect } from './utils.canvas'

const ctx = canvas.getContext('2d')

class Pagination {
  constructor(option) {
    const option_ = () => ({ x: 12, y: canvas.height - 90, width: 40, height: 40, radius: 20, text: '' })

    new Array(5).fill().map((i, index) => {
      var currentIndex = index - 2 + this.pageIndex

      currentIndex = (currentIndex < 1) || (currentIndex > this.pageCount) ? null : currentIndex

      if (currentIndex === null) return

      const option = option_()
      option.x = canvas.width / 2 - 20 + (index - 2) * 50
      option.text = currentIndex

      if (this.pageIndex === currentIndex) drawButtonBlack(option)
      if (this.pageIndex !== currentIndex) drawButtonWhite(option)

      if (this.largeCard) return

      const event = () => {
        this.pageIndex = currentIndex
      }
      addEventListener('touchstart', event, option)
    })
  }

  setProperty(key, value) {
    this[key] = value
  }

  render() {
  }
}

export default Pagination