Browserify transformation to embed files (globs) as JSON as JSON variables

In general you will have the same limitations as with [brfs](https://github.com/browserify/brfs).

Based on [fs-to-json](https://github.com/cancerberoSgx/fs-to-json).

```sh
npm install --save-dev br-fs-to-json
```

# Usage

## Command line example

```sh
browserify -t br-fs-to-json -o dist/bundle.js src/index.js
```

## Code examples

You can use `path` module and variables `__dirname` and `__filename`, example: 

```javascript
var path = require('path')   
fs2json({ input: path.join(__dirname, 'spec', 'support', '**')})
.then(files => {
  console.log(Object.keys(files))
})
```

"Real life" example: packing all handlebars templates in a variable:

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

**TypeScript** example:

```typescript
import { fs2json } from 'fs-to-json'

export interface ExampleFile {
  fileName: string
  content: string
  isBinary: boolean
}

let examples: ExampleFile[]

fs2json({
  input: 'dist/src/examples/**/*',
  formatted: true,
  filenamePropertyName: 'fileName',
  contentPropertyName: 'content',
  outputStyle: 'array'
}).then((files: any) => {
  examples = files
  examples.forEach(file => { // fix the names
    file.fileName = file.fileName.substring('dist/src/examples/'.length, file.fileName.length)
  })
})

export function getFiles(): ExampleFile[] {
  return examples
}
```


# Captchas / TIPS

 * **async won't work**

 * Make sure you **only call fs2json once!** Each time you make the call, the files will get embedded again in your code!

 * Don't be too inventive. **use simple expressions like above's** :
 
   - **Use only one `then()`** - don't use `catch()` 
   - **pass a plain configuration object** - don't use funcions to calculate properties
   - `transformFileName` property won't work - modify file names in the client side

 * Isolate this code in **its own file containing only these code** and getters for the embedded data, nothing more.

 * Asynchronous call: **asynchronous call is not adequate for this** but fs-to-json doesn't support a synchronous call, **yet**. However, you can be sure that the `then()` handler will be called synchronously, so you assign the result in a variable in the handler and can access it right away in the next statement. 

The same limitations as with brfs. Only supports [staticable analizable expressions](http://npmjs.org/package/static-eval). 

## Examples that won't work: 

doesn't work and will generate a very big file including fs2json ! **don't do it!**

```javascript
var pattern = 'spec/support/*' 
fs2json({ input: pattern }).then(files => {
  console.log(Object.keys(files))
})
```

The following will work but will generate a very big file including fs2json ! **don't do it!**

```javascript
fs2json({ input: require('path').join(__dirname, 'spec', 'support', '**') }).then(files => {
  console.log(Object.keys(files))
})
```

# TODO

 * override config.output so i
 * test with await