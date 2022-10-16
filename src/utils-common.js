import { originCard, originBoss, originExplore } from './source'

const parse = (array, numberFlat) => {
  const result = array.reduce((t, i) => {
    const result_ = [...t]

    const origin = originCard.find(i_ => i.key === i_.key)

    if (numberFlat) {
      const item = { ...origin, ...i }
      delete item.number
      result_.push(...new Array(i.number).fill().map(i => ({ ...item })))
    }
    if (!numberFlat) {
      result_.push({ ...origin, ...i })
    }

    return result_
  }, [])

  return result
}

export { parse }

const levelText = (level) => {
  if (level === 1) return 'I'
  if (level === 2) return 'II'
  if (level === 3) return 'III'
  if (level === 4) return 'IV'
  if (level === 5) return 'V'
  if (level === 6) return 'VI'
  if (level === 7) return 'VII'
  if (level === 8) return 'VIII'
  if (level === 9) return 'IX'
  if (level === 10) return 'X'
  if (level === 11) return 'XI'
  if (level === 12) return 'XII'
  if (level === 13) return 'XIII'
  if (level === 14) return 'XIV'
  if (level === 15) return 'XV'
}

export { levelText }

const wait = async (time) => await new Promise((resolve) => setTimeout(() => resolve(), time))

const hash = (n = 12, l = 1) => {
  return new Array(l).fill(undefined).map(i => Array.from(Array(n), () => Math.floor(Math.random() * 36).toString(36)).join('')).join('-').toUpperCase()
}

const numberFix = (n) => Number(Number(n).toFixed(2))

const arrayRandom = (array, number) => {
  if (array.length <= number) return array

  var r = []
  var c = array.map(i => i)

  new Array(number).fill().forEach(() => {
    const index = Math.floor(Math.random() * c.length)
    r.push(c[index])
    c = c.filter((i, index_) => index_ !== index)
  })

  return r
}

const setArrayRandom = (array) => {
  var result = []
  var origin = array

  while (origin.length) {
    const index = Math.floor(Math.random() * origin.length)

    result.push(origin[index])

    origin = origin.filter((i, index_) => index_ !== index)
  }

  return result
}

export { wait, hash, numberFix, arrayRandom, setArrayRandom }

const addEventListener = (type, callback, option) => {
  const event = e => ifTouchCover(e, option) ? callback(e) : null

  canvas.addEventListener(type, event, { passive: true })

  if (false) {
    if (type === 'touchstart') type = 'mousedown'
    if (type === 'touchmove') type = 'mouseup'
    if (type === 'touchend') type = 'mousedown'
  }

  Imitation.state.removeEventListener.push(() => canvas.removeEventListener(type, event))
}

const addEventListenerPure = (type, callback) => {
  const event = e => callback(e)

  canvas.addEventListener(type, event, { passive: true })

  if (false) {
    if (type === 'touchstart') type = 'mousedown'
    if (type === 'touchmove') type = 'mouseup'
    if (type === 'touchend') type = 'mousedown'
  }

  Imitation.state.removeEventListener.push(() => canvas.removeEventListener(type, event))
}

const ifTouchCover = (e, option) => {
  const x = option.x
  const y = option.y
  const width = option.width
  const height = option.height

  const x_ = e.x || e.touches[0].clientX
  const y_ = e.y || e.touches[0].clientY

  return x_ >= x && x_ <= x + width && y_ >= y && y_ <= y + height
}

const ifScreenCover = (inner, outer) => {
  const { x, y, width, height } = inner
  const { x: x_, y: y_, width: width_, height: height_ } = outer

  return x + width > x_ && x < x_ + width_ && y + height > y_ && y < y_ + height_
}

export { addEventListener, addEventListenerPure, ifTouchCover, ifScreenCover }

const createImage = (src) => {
  const image = new Image()
  image.src = src

  return image
}

export { createImage }