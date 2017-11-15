// spec.js
describe('IT Magix Pipeline Demo', function() {
  it('should have a title', function() {
    browser.waitForAngularEnabled(false);
    browser.get('http://192.168.2.121:11666');
    expect(browser.getTitle()).toEqual('IT Magix Pipeline Dummy Application');
  });

  it('should be able to open pipeline app', function() {
    browser.waitForAngularEnabled(false);
    browser.get('http://192.168.2.121:11666/pipeline');
    expect(browser.getTitle()).toEqual('IT Magix Pipeline Dummy Application');
  });
});
