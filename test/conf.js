// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://192.168.2.120:4444/wd/hub',
  specs: ['spec.js'],
  capabilities: {
    browserName: 'firefox'
  }
}
