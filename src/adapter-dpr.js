(function () {
  // const dpr = window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || 1
  const dpr = 2
  
  const oldWidth = canvas.width
  const oldHeight = canvas.height
  canvas.width = Math.round(oldWidth * dpr)
  canvas.height = Math.round(oldHeight * dpr)
  canvas.style.width = oldWidth + 'px'
  canvas.style.height = oldHeight + 'px'

  window.dpr = 2
})()