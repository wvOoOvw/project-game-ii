const fs = require('fs')
const path = require('path')

const list = []

{
  const dirs = fs.readdirSync(path.join(__dirname, '../static/image'))

  dirs.forEach(item => {
    if (item.includes('.DS')) return
    list.push(`import I_${item.replace(/\.(jpeg|jpg|png|)/, '').replaceAll('.', '').replaceAll('-', '')} from '../static/image/${item}'`)
  })
}

fs.writeFileSync(path.join(__dirname, './output.js'), list.join('\n'))