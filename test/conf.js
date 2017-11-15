// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://192.168.2.171:4444/wd/hub',
  specs: ['spec.js'],
  capabilities: {
    browserName: 'firefox'
  }
}
