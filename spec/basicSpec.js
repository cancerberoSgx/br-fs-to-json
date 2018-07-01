const shell = require('shelljs')
// shell.config.silent = true

describe('basic', () => {

  // beforeEach(() => {
  //   shell.mkdir('-p', 'spec/assets/bundles/')
  // })

  // afterEach(() => {
  //   shell.rm('-rf', 'spec/assets/bundles')
  // })

  it('should not fail if called correctly', () => {
    let p = shell.exec('npx browserify -t . -o spec/assets/bundles/test1.js spec/assets/test1.js')
    expect(p.code).toBe(0)
  })

  it('output should contain a promise like object', () => {
    shell.exec('npx browserify -t . -o spec/assets/bundles/test1.js spec/assets/test1.js')
    const bundle = shell.cat('spec/assets/bundles/test1.js')
    expect(bundle.replace(/\s+/gm, '')).toContain('constpromise=({then:function(handler){handler({"spec/basicSpec.js":{"')
  })

  it('bundle output when executed should be equals as the original file', () => {
    shell.exec('npx browserify -t . -o spec/assets/bundles/test1.js spec/assets/test1.js')
    const output = shell.exec('node spec/assets/test1.js').stdout
    const bundleOutput = shell.exec('node spec/assets/bundles/test1.js').stdout
    expect(output).toEqual(bundleOutput)
  })

  it('incorrect call to library should exit with error', () => {
    const p = shell.exec('npx browserify -t . spec/assets/erroed.js')
    expect(p.code).not.toBe(0)
    expect(p.stderr.toString()).toContain('An error occurred while calling fs-to-json')
  })

  it('readmeExample should not fail', () => {
    const p = shell.exec('npx browserify -t . spec/assets/readmeExample.js')
    expect(p.code).toBe(0)
  })

  xit('user can user path module and __dirname variable ', () => {
    const p = shell.exec('npx browserify -t . spec/assets/usingPathAndDirName.js -o spec/assets/bundles/usingPathAndDirName.js')
    expect(p.code).toBe(0)
    const output = shell.exec('node spec/assets/usingPathAndDirName.js').stdout
    const bundleOutput = shell.exec('node spec/assets/bundles/usingPathAndDirName.js').stdout
    expect(output).toEqual(bundleOutput)
  })
})