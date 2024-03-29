const fs = require('fs')
const path = require('path')

const s = '../static/image'

const list = []

{
  const dirs = fs.readdirSync(path.join(__dirname, s))

  dirs.forEach(item => {
    if (item.includes('.DS')) return
    list.push(`import I_${item.replace(/\.(jpeg|jpg|png|m4a|mp3)/, '').replace(/\./g, '').replace(/\-/g, '')} from '${s}/${item}'`)
  })
}

fs.writeFileSync(path.join(__dirname, './output.js'), list.join('\n'))