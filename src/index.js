var staticModule = require('static-module');
// var quote = require('quote-stream');


const fs2json = require('fs-to-json').fs2json
var fs = require('fs');
const stream = require('stream');

var sm = staticModule({

  'fs-to-json': {
    fs2json: function (userConfig) {
      var readable = new stream.Readable();
      readable._read = function noop() { }
      const writable = new stream.Writable()
      // override user output to a stream ignored 
      const config = userConfig//Object.assign({}, userConfig, { output: writable })

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
          writable.destroy()
          readable.push(output(data))
          readable.push(null);
        })
        .catch(error => {
          writable.destroy()
          console.error('An error occurred while calling fs-to-json: ' + error + '\n' + error.stack)
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
