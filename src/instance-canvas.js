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
    body.style.overflow = 'hidden'

    const canvas = document.createElement('canvas')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.touchAction = 'none'
    canvas.setAttribute('oncontextmenu', 'return false')

    this.canvas_ = canvas

    body.appendChild(canvas)
  }

  flex() {
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
    return this.canvas_
  }

  get ctx() {
    return this.canvas_.getContext('2d')
  }

  get width() {
    return this.canvas_.offsetWidth
  }

  get height() {
    return this.canvas_.offsetHeight
  }

  get maxWidth() {
    return window.ontouchstart === undefined ? this.height * 0.5 : this.width
  }

  get safeArea() {
    try {
      if (wx) {
        if (!this.wx_safeArea) this.wx_safeArea = wx.getSystemInfoSync().safeArea
        return this.wx_safeArea
      }
    } catch { }

    return { top: 0, left: 0, right: this.width, bottom: this.height, width: this.width, height: this.height }
  }
}

const CanvasInstance = new Canvas()

export { CanvasInstance as Canvas }