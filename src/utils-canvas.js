// context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height)

// img	规定要使用的图像、画布或视频。
// sx	可选。开始剪切的 x 坐标位置。
// sy	可选。开始剪切的 y 坐标位置。
// swidth	可选。被剪切图像的宽度。
// sheight	可选。被剪切图像的高度。
// x	在画布上放置图像的 x 坐标位置。
// y	在画布上放置图像的 y 坐标位置。
// width	可选。要使用的图像的宽度。（伸展或缩小图像）
// height	可选。要使用的图像的高度。（伸展或缩小图像）

const ctx = canvas.getContext('2d')

const ctxInit = () => {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = '#000000'
  ctx.strokeStyle = '#000000'
  ctx.shadowBlur = 0
  ctx.shadowColor = '#000000'
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0
  ctx.lineWidth = 1
  ctx.font = 'bold 14px monospace'
  ctx.textAlign = 'start'
  ctx.textBaseline = 'alphabetic'
}

export { ctxInit }

const drawImage = (image, option) => {
  const x = option.x
  const y = option.y
  const width = option.width
  const height = option.height

  var sx = 0
  var sy = 0
  var swidth = image.width
  var sheight = image.height

  const ratio = Math.max(width / image.width, height / image.height)

  const realWidth = image.width * ratio
  const realHeight = image.height * ratio

  const widthDiff = realWidth - width
  const heightDiff = realHeight - height

  if (widthDiff) {
    sx = widthDiff / 2 / ratio
    swidth = swidth - widthDiff / ratio
  }

  if (heightDiff) {
    sy = heightDiff / 2 / ratio
    sheight = sheight - heightDiff / ratio
  }

  ctx.drawImage(image, sx, sy, swidth, sheight, x, y, width, height)
}

const drawRadius = (option) => {
  const x = option.x
  const y = option.y
  const width = option.width
  const height = option.height
  const radius = option.radius

  ctx.beginPath()
  ctx.moveTo(x, y + radius)
  ctx.arcTo(x, y, x + radius, y, radius)
  ctx.lineTo(x + width - radius, y)
  ctx.arcTo(x + width, y, x + width, y + radius, radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
  ctx.lineTo(x + radius, y + height)
  ctx.arcTo(x, y + height, x, y + height - radius, radius)
  ctx.closePath()
}

const drawRect = (option) => {
  const x = option.x
  const y = option.y
  const width = option.width
  const height = option.height

  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x + width, y)
  ctx.lineTo(x + width, y + height)
  ctx.lineTo(x, y + height)
  ctx.closePath()
}

const drawText = (option) => {
  const x = option.x
  const y = option.y
  const width = option.width
  const fontHeight = option.fontHeight
  const text = option.text

  let test = text.split('')
  let temp = ''
  let row = []
  test.forEach(i => {
    if (ctx.measureText(temp).width > width) {
      row.push(temp)
      temp = ''
    }
    temp = temp + i
  })
  row.push(temp)
  row.forEach((i, index) => {
    ctx.fillText(i, x, y + (index + 1) * fontHeight)
  })
}

export { drawImage, drawRect, drawRadius, drawText }