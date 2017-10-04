exports.config = {
    seleniumAddress: 'http://192.168.2.130:4444/wd/hub',
    getPageTimeout: 600001,
    allScriptsTimeout: 5000001,
    framework: 'custom',
    // path relative to the current config file
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    capabilities: {
        'browserName': 'MicrosoftEdge',
    },


    // Spec patterns are relative to this directory.
    specs: [
        'test/e2e/features/e2e.feature'
    ],

    ignoreUncaughtExceptions: true,

    baseUrl: 'https://www.google.nl/',


    cucumberOpts: {
        require: ['test/e2e/features/step_definitions/*.js',
        'test/e2e/conf/env.js'],
        tags: '@checkApi',
        format: 'pretty',
        profile: false,
        'no-source': true
    },
    onPrepare: function () {
        global.chai = require('chai');
        var chaiAsPromised = require('chai-as-promised')
        chai.use(chaiAsPromised);
        global.expect = chai.expect;
    }
};
