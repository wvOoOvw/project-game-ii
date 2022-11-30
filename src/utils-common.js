import { originWitch, originMonster } from './source'

import { Canvas } from './instance-canvas'

const parseWitch = (array) => {
  const result = array.reduce((t, i) => {
    const result_ = [...t]

    const origin = originWitch.find(i_ => i.key === i_.key)

    result_.push({ ...origin, ...i, purity_: origin.purity, rational_: origin.rational, perceptual_: origin.perceptual, buff: [] })

    return result_
  }, [])

  return result
}

const parseMonster = (array) => {
  const result = array.reduce((t, i) => {
    const result_ = [...t]

    const origin = originMonster.find(i_ => i.key === i_.key)

    result_.push({ ...origin, ...i, dirty_: origin.dirty, buff: [] })

    return result_
  }, [])

  return result
}

const symbolNumber = (level) => {
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
  if (level === 16) return 'XVI'
}

const searchParams = n => {
  try { if (wx) return null } catch { }

  return new URL(location.href).searchParams.get(n)
}

const wait = async (time, callback) => {
  var current = 0

  const event = (resolve) => {
    if (current === time) resolve()
    if (current !== time) {
      current = current + 1
      requestAnimationFrame(() => event(resolve))
    }
  }

  if (callback) {
    event(callback)
  }

  if (!callback) {
    await new Promise((resolve) => event(resolve))

  }
}

const hash = (n = 12, l = 1) => {
  return new Array(l).fill(undefined).map(i => Array.from(Array(n), () => Math.floor(Math.random() * 36).toString(36)).join('')).join('-').toUpperCase()
}

const numberFix = (n) => {
  return Number(Number(n).toFixed(5))
}

const numberAnimation = (number, time, callback) => {
  const list = new Array(time).fill(Number((number / time).toFixed(5)))
  const event = () => {
    requestAnimationFrame(() => {
      callback(list.shift())
      if (list[0]) event()
    })
  }
  event()
}

const arrayRandom = (array, number) => {
  var r = []
  var c = [...array]

  new Array(number).fill().forEach(() => {
    const index = Math.floor(Math.random() * c.length)
    if (c[index]) {
      r.push(c[index])
      c = c.filter((i, index_) => index_ !== index)
    }
  })

  return r
}

const setArrayRandom = (array) => {
  var result = []
  var origin = [...array]

  while (origin.length) {
    const index = Math.floor(Math.random() * origin.length)

    result.push(origin[index])

    origin = origin.filter((i, index_) => index_ !== index)
  }

  return result
}

const ifTouchCover = (e, option) => {
  const x = option.x
  const y = option.y
  const width = option.width
  const height = option.height

  var x_ = e.x || e.touches[0].clientX
  var y_ = e.y || e.touches[0].clientY

  return x_ >= x && x_ <= x + width && y_ >= y && y_ <= y + height
}

const ifScreenCover = (a, b) => {
  const { x, y, width, height } = a
  const { x: x_, y: y_, width: width_, height: height_ } = b

  return x + width > x_ && x < x_ + width_ && y + height > y_ && y < y_ + height_
}

export { parseWitch, parseMonster, symbolNumber, wait, hash, numberFix, numberAnimation, arrayRandom, setArrayRandom, searchParams, ifTouchCover, ifScreenCover }