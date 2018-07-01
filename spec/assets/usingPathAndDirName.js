const fs2json = require('fs-to-json').fs2json

// const path = require('path')
// const input = path.join('spec', 'support', '*')

const pattern = 'spec/support/*'
fs2json({ input: pattern }).then(files => {
  console.log(Object.keys(files))
})


fs2json({ input: 'spec/support/*' }).then(files => {
  console.log(Object.keys(files))
})

