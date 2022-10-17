(function () {
  window.fontFamily = 'Courier'

  window.font = (fontSize) => {
    canvas.getContext('2d').font(`900 ${fontSize}px ${window.fontFamily}`)
  }
})()