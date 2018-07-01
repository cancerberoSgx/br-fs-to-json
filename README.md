Browserify transformation to embed files (globs) as JSON as JSON variables

Based on [fs-to-json](https://github.com/cancerberoSgx/fs-to-json)

```sh
npm install --save-dev br-fs-to-json
```

# Usage

## Command line example

```sh
browserify -t br-fs-to-json -o dist/bundle.js src/index.js
```

## Code example

```javascript
const fs2json = require('fs-to-json').fs2json

const templates = {}

fs2json({ input: 'src/templates/**.html' }).then(files => {
  Object.keys(files).forEach(fileName => {
    templates[fileName] = handlebars.compile(files[fileName].content)
  })
})

module.exports = function renderTemplate(templateFile, context) {
  return templates[templateFile](context)
}
```


# TODO
 * static analisys doesnt work: 
 
const pattern = 'spec/support/*'
fs2json({ input: pattern })

 * and so path or __dirname doesn't work
 
 * test with await