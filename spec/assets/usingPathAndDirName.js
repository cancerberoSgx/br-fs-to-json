var fs2json = require('fs-to-json').fs2json

// var pattern = 'spec/support/*'   // doesn't work and will generate a very big file including fs2json ! don't do it
// fs2json({ input: pattern }).then(files => {
//   console.log(Object.keys(files))
// })

// works but will generate a very big file including fs2json ! don't do it!
// fs2json({ input: require('path').join(__dirname, 'spec', 'support', '**') }).then(files => {
//   console.log(Object.keys(files))
// })


// works - it only will include file path-browserify which is fine
var path = require('path')
fs2json({ input: path.join(__dirname, '..', '..', 'spec', 'support', '**') }).then(files => {
  console.log(Object.keys(files))
})


fs2json({ input: 'spec/support/*' }).then(files => { // works and doesn't include any extra file
  console.log(Object.keys(files))
})
