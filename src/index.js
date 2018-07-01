var staticModule = require('static-module')
const fs2json = require('fs-to-json').fs2json
var fs = require('fs')
const stream = require('stream')
const resolve = require('resolve')
const path = require('path')

module.exports = function (file, opts) {
  // console.log('SEBA', opts);
  
  // copied from brfs: 
  if (/\.json$/.test(file)) return through();
    
  function resolver (p) {
      return resolve.sync(p, { basedir: path.dirname(file) });
  }
  var vars = {
    __filename: file,
    __dirname: path.dirname(file),
    // require: { resolve: resolver }
  };
  if (!opts) opts = {};
  if (opts.vars) Object.keys(opts.vars).forEach(function (key) {
      vars[key] = opts.vars[key];
  });


  const sm = staticModule({
  
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
    // varMods: {
    //   path: require('path')
    // }
  },
  
  {
    vars: vars,
    varModules: { path: path },
    parserOpts: opts && opts.parserOpts,
    sourceMap: opts && (opts.sourceMap || opts._flags && opts._flags.debug)
}
  );

  return fs.createReadStream(file).pipe(sm)
};
