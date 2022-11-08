const fs = require('fs')
const path = require('path')

const list = []

{
  const dirs = fs.readdirSync(path.join(__dirname, '../media/image-a'))

  dirs.forEach(item => {
    if (item.includes('.DS')) return
    list.push(`import ${item.replace(/\.(jpeg|jpg|png)/, '')} from '../media/image-a/${item}'`)
  })
}

list.push('')

{
  const dirs = fs.readdirSync(path.join(__dirname, '../media/image-s'))

  dirs.forEach(item => {
    if (item.includes('.DS')) return
    list.push(`import ${item.replace(/\.(jpeg|jpg|png)/, '')} from '../media/image-s/${item}'`)
  })
}

// list.push('')

// {
//   const dirs = fs.readdirSync(path.join(__dirname, '../media/image-c'))

//   dirs.forEach(item => {
//     if (item.includes('.DS')) return
//     list.push(`import ${item.replace(/\.(jpeg|jpg|png)/, '')} from '../media/image-c/${item}'`)
//   })
// }


fs.writeFileSync(path.join(__dirname, './output.js'), list.join('\n'))