const fs = require('fs')
const path = require('path')

const list = []

{
  const dirs = fs.readdirSync(path.join(__dirname, '../media/image'))

  dirs.forEach(item => {
    if (item.includes('.DS')) return
    list.push(`import ${item.replace('.jpg', '')} from '../media/image/${item}'`)
  })
}

list.push('')

{
  const dirs = fs.readdirSync(path.join(__dirname, '../media/image-s'))

  dirs.forEach(item => {
    if (item.includes('.DS')) return
    list.push(`import ${item.replace('.jpg', '')} from '../media/image-s/${item}'`)
  })
}

fs.writeFileSync(path.join(__dirname, './output.js'), list.join('\n'))