const addEventListener = (type, callback, option) => {
  const event = e => ifTouchCover(e, option) ? callback(e) : null

  canvas.addEventListener(type, event, { passive: true })

  Imitation.state.removeEventListener.push(() => canvas.removeEventListener(type, event))
}

const addEventListenerPure = (type, callback) => {
  const event = e => callback(e)

  canvas.addEventListener(type, event, { passive: true })

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

export { addEventListener, addEventListenerPure, ifTouchCover }

const createImage = (src) => {
  const image = new Image()
  image.src = src

  return image
}

export { createImage }