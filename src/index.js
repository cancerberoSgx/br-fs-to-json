var staticModule = require('static-module')
const fs2json = require('fs-to-json').fs2json
var fs = require('fs')
const stream = require('stream')

var sm = staticModule({

  'fs-to-json': {
    fs2json: function (config) {
      var readable = new stream.Readable();
      readable._read = function noop() { }
      const output = (data, error) => `({
  then: function(handler) {
    handler(${data ? JSON.stringify(data) : 'undefined'});
  }, 
  catch: function(handler) {
    handler(${error ? (function () { try { return JSON.stringify(error) } catch (ex) { return ex + '' } })() : 'undefined'});
  }, 
})`
      fs2json(config)
        .then(data => {
          readable.push(output(data))
          readable.push(null)
        })
        .catch(error => {
          console.error('An error occurred while calling fs-to-json: ' + error + '\n' + error.stack)
          readable.push(null)
          throw error
        })
      return readable
    },
  },
  varMods: {
    path: require('path')
  }
},
  {
    vars: { __dirname: __dirname }
  }
);

module.exports = function (file) {
  return fs.createReadStream(file).pipe(sm)
};
