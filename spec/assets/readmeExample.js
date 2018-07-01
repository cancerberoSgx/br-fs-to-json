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
