const fs2json = require('fs-to-json').fs2json

fs2json({incorrect: 'call'}).then(files=>{
  console.log(Object.keys(files))
})