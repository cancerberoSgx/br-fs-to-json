const shell = require('shelljs')
shell.config.silent=true

describe('basic', ()=>{
  afterEach(()=>{
    shell.rm('-rf', 'spec/assets/test1.bundle.js')
  })
  it('should not fail if called correctly', ()=>{
    let p = shell.exec('npx browserify -t . -o spec/assets/test1.bundle.js spec/assets/test1.js')
    expect(p.code).toBe(0)
  })

  it('output should contain a promise like object', ()=>{
    shell.exec('npx browserify -t . -o spec/assets/test1.bundle.js spec/assets/test1.js')
    const bundle = shell.cat('spec/assets/test1.bundle.js')
    expect(bundle.replace(/\s+/gm, '')).toContain('constpromise=({then:function(handler){handler({"spec/basicSpec.js":{"')
   })

  it('bundle output when executed should be equals as the original file', ()=>{
    shell.exec('npx browserify -t . -o spec/assets/test1.bundle.js spec/assets/test1.js')
    const output = shell.exec('node spec/assets/test1.js').stdout
    const bundleOutput = shell.exec('node spec/assets/test1.bundle.js').stdout
    expect(output).toEqual(bundleOutput)
  })

  it('incorrect call to library should throw', ()=>{
    const p = shell.exec('npx browserify -t . spec/assets/erroed.js')
    expect(p.code).not.toBe(0)
    expect(p.stderr.toString()).toContain('An error occurred while calling fs-to-json')
    // console.log(p.stderr)    
  })
})