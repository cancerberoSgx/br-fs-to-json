const staticModule = require('static-module')
const fs2json = require('fs-to-json').fs2json
const stream = require('stream')
const resolve = require('resolve')
const path = require('path')


module.exports = function (file, opts) {

  // copied from brfs: 
  if (/\.json$/.test(file)) return through();
  function resolver(p) {
    return resolve.sync(p, { basedir: path.dirname(file) });
  }
  const vars = {
    __filename: file,
    __dirname: path.dirname(file),
    require: { resolve: resolver }
  };
  if (!opts) opts = {};
  if (opts.vars) Object.keys(opts.vars).forEach(function (key) {
    vars[key] = opts.vars[key];
  });

  let counter = 0

  const sm = staticModule({

    'fs-to-json': {
      fs2json: function (config) {

        const readable = new stream.Readable();
        readable._read = function noop() { }
        const output = (data, error) => `${BR_FS_TO_JSON_GLOBAL_NAME}${counter++}__=({
  then: function(handler) {
    handler(${data ? JSON.stringify(data) : 'undefined'});
    return {then: function(){}, catch: function(){}, finally:function(){}}${/*just to comply with the signature so user's code don't fail*/''}
  },
  catch: function() {
    ${/*promise will never be rejected since it will fails at compile time - just want to comply with the signature*/''} 
    return {
      then: function(handler) {${/*for very crazy people that .catch() before .then()*/''}
        handler(${data ? JSON.stringify(data) : 'undefined'});
        return {then: function(){}, catch: function(){}, finally:function(){}}
      }, catch: function(){}, finally:function(){}
    }
  }
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
      }
    }
  },
  
    {
      vars: vars,
      varModules: { path: path },
      parserOpts: opts && opts.parserOpts,
      sourceMap: opts && (opts.sourceMap || opts._flags && opts._flags.debug)
    })

  return sm
};


/*
Heads up - we need to prefix the generated code (a thenable) like this: 

_$XP4ih879_=({
  then: function(handler) {
    handler({....

The prefix global variable initialization has no impact (we hope) and is necessary in case the is a
previous statement that doesn't end with semi colon, for example, the next fails without it: 

var path = require('path')
({
  then: function(handler) {
    handler({....

awful i know but this transformation was created in hours and the real solution is fs-to-json provides a sync API (will do)
*/
const BR_FS_TO_JSON_GLOBAL_NAME = 'this._$XP4ih879$p'