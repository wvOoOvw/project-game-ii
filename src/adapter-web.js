(function () {
  try { if (wx) return } catch { }

  window.wx = {
    _web: true,
    getSystemInfoSync: () => {
      return {
        safeArea: {
          top: 0
        },
        windowWidth: document.querySelector('canvas').clientWidth,
        windowHeight: document.querySelector('canvas').clientHeight,
      }
    }
  }

  const body = document.querySelector('body')

  body.style.padding = '0'
  body.style.margin = 'auto'
  body.style.left = 0
  body.style.right = 0
  body.style.top = 0
  body.style.bottom = 0
  body.style.position = 'absolute'
  body.style.width = '100%'
  body.style.height = '100%'
  // body.style.background = 'black'
  // body.style['max-width'] = '425px'

  const canvas = document.createElement('canvas')

  canvas.width = body.clientWidth
  canvas.height = body.clientHeight
  canvas.style.display = 'block'
  canvas.style.touchAction = 'none'

  body.appendChild(canvas)

  window.canvas = canvas
})()