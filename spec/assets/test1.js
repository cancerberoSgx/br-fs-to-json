const fs2json = require('fs-to-json').fs2json

fs2json({ input: 'spec/**/*Spec.js' }).then(files => {
  console.log(Object.keys(files))
})
.catch(ex=>{})

const promise = require('fs-to-json').fs2json({ input: 'spec/**/*Spec.js' })

promise.then(files => {
  console.log(Object.keys(files))
})
.catch(ex=>{})

