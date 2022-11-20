const fs = require('fs')
const path = require('path')

const s = '../static/sound'

const list = []

{
  const dirs = fs.readdirSync(path.join(__dirname, s))

  dirs.forEach(item => {
    if (item.includes('.DS')) return
    list.push(`import I_${item.replace(/\.(jpeg|jpg|png|m4a)/, '').replace(/\./g, '').replace(/\-/g, '')} from '${s}/${item}'`)
  })
}

fs.writeFileSync(path.join(__dirname, './output.js'), list.join('\n'))