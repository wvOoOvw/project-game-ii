class Canvas {
  constructor() {
    this.canvas_

    this.create()
    this.flex()
  }

  create() {
    try { if (wx) return this.canvas_ = window.canvas } catch { }

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
    body.style.background = 'black'

    const canvas = document.createElement('canvas')

    this.canvas_ = canvas

    body.appendChild(canvas)
  }

  flex() {
    const safeArea = this.safeArea

    this.canvas_.setAttribute('oncontextmenu', 'return false')

    this.canvas_.style.display = 'block'
    this.canvas_.style.touchAction = 'none'
    this.canvas_.style.position = 'absolute'

    this.canvas_.width = safeArea.width
    this.canvas_.height = safeArea.height

    this.canvas_.style.top = safeArea.top + 'px'
    this.canvas_.style.left = safeArea.left + 'px'

    const dpr = 2

    const oldWidth = this.canvas_.width
    const oldHeight = this.canvas_.height
    this.canvas_.width = oldWidth * dpr
    this.canvas_.height = oldHeight * dpr
    this.canvas_.style.width = oldWidth + 'px'
    this.canvas_.style.height = oldHeight + 'px'

    this.canvas_.getContext('2d').scale(dpr, dpr)
  }

  get canvas() {
    try { if (wx) return window.canvas } catch { }

    return this.canvas_
  }

  get ctx() {
    try { if (wx) return window.canvas.getContext('2d') } catch { }

    return this.canvas_.getContext('2d')
  }

  get width() {
    try { if (wx) return window.canvas.clientWidth } catch { }

    return this.canvas_.clientWidth
  }

  get height() {
    try { if (wx) return window.canvas.clientHeight } catch { }

    return this.canvas_.clientHeight
  }

  get safeArea() {
    try { if (wx) return wx.getSystemInfoSync().safeArea } catch { }

    const width = window.ontouchstart === undefined ? window.document.documentElement.clientHeight * 0.5 : window.document.documentElement.clientWidth
    const height = window.document.documentElement.clientHeight

    const top = 0
    const bottom = height

    const left = window.document.documentElement.clientWidth / 2 - width / 2
    const right = window.document.documentElement.clientWidth / 2 + width / 2

    return { top: top, left: left, right: right, bottom: bottom, width: width, height: height }
  }
}

const CanvasInstance = new Canvas()

export { CanvasInstance as Canvas }