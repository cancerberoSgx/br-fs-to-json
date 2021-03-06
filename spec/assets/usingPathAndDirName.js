var fs2json = require('fs-to-json').fs2json

// HEADS UP - the test expect against stdout. If we switch the next two statements the test will fail because in bundle it is sync but here the second one that calls path.join() will  take bit longer to execute and so test fails.:

 // works and doesn't include any extra file
fs2json({ input: 'spec/support/*' })
.then(files => {
  console.log(Object.keys(files))
})

// works - it only will include file path-browserify which is fine
var path = require('path')
fs2json({ input: path.join(__dirname, '..', '..', 'spec', 'support', '**') }).then(files => {
  console.log(Object.keys(files))
})





// var pattern = 'spec/support/*'   // doesn't work and will generate a very big file including fs2json ! don't do it
// fs2json({ input: pattern }).then(files => {
//   console.log(Object.keys(files))
// })

// works but will generate a very big file including fs2json ! don't do it!
// fs2json({ input: require('path').join(__dirname, 'spec', 'support', '**') }).then(files => {
//   console.log(Object.keys(files))
// })
