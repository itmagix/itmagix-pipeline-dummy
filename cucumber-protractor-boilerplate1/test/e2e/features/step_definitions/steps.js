/**
 * Created by panhuisi on 26-9-2017.
 */

var actions = require('../../support/actions');


/*jshint validthis:true */
function given () {
    'use strict';

    this.Given(/^I have a clear browser$/, actions().clearBrowser);

    this.Then(/^I am on the (url|site) "([^"]*)?"$/, actions().openWebsite);

    this.Given(/^I am logged in as a client()*$/, actions().loginAsClient);

    this.Given(/^I am logged in as a client "([^"]*)"$/, actions().loginAsClient);

    this.Then(/^I type "([^"]*)" in "([^"]*)" on page "([^"]*)"$/, actions().typeText);

    this.Then(/^I expect the result of the api call to have (code|substring) "([^"]*)"$/, actions().checkApiResponse);

    this.Then(/^I expect the result of query "([^"]*)" on the response to (be|contain|have length) "([^"]*)"$/, actions().checkApiResponseQuery);

    this.When(/^I logout$/, actions().logout);

    this.Given(/^the checkbox "([^"]*)" in the element "([^"]*)" is (un)*checked on page "([^"]*)"$/, actions().checkBoxIschecked);

    this.Then(/^the checkboxes in the element "([^"]*)" on page "([^"]*)" are (un)*checked$/, actions().checkboxesWithinElementAreChecked);

    this.Given(/^the element "([^"]*)" has property "([^"]*)" (with|containing) value "([^"]*)" on the page "([^"]*)"$/, actions().elementHasPropertyWithValueX);

    this.Then(/^the element "([^"]*)" has an element "([^"]*)" with property "([^"]*)" with value "([^"]*)" on the page "([^"]*)"$/, actions().elementHasChildElementWithPropertyXAndValueY);

    this.Then(/^the element "([^"]*)" (contains|does not contain) an element "([^"]*)" on page "([^"]*)"$/, actions().elementContainsChildElement);

    this.Given(/^the element "([^"]*)" (contains|does not contain) elements on page "([^"]*)"$/, actions().elementContainsMultipleChildElements);

    this.Given(/^the element "([^"]*)" (does not contain|contains) text "([^"]*)" on the page "([^"]*)"$/, actions().elementHasText)

    this.Given(/^the element "([^"]*)" is( not)* displayed on the page "([^"]*)"$/, actions().elementIsDisplayed);

    this.Then(/^the element "([^"]*)" is( not)* displayed on the page "([^"]*)" inside the element "([^"]*)"$/, actions().elementIsDisplayedInsideElement);

    this.Given(/^the elements are( not)* displayed on the page "([^"]*)" inside the element "([^"]*)"$/, actions().multipleElementsDisplayedInsideElement);

    this.Then(/^I take a screenshot with the name "([^"]*)"$/, actions().storeScreenShot);

    this.Then(/^I send a Get-message to: "([^"]*)" and expect the key: "([^"]*)" to be value: "([^\"]*)"$/, actions().getRestAndQuery);

    this.Then(/^I send a Soap-message to: "([^"]*)" and expect the element: "([^"]*)" to contain the value "([^"]*)"$/, actions().postSoapAndQuery);

    this.When(/^I click on element "([^"]*)" on page "([^"]*)"$/, actions().clickOnElement);

    this.Then(/^I click on element "([^"]*)" using a Xpath selector on page "([^"]*)"$/, actions().clickOnElementXpath);

    this.When(/^I select the radiobutton "([^"]*)" on page "([^"]*)"$/, actions().clickOnElement);

    this.When(/^I take the attribute "([^"]*)" of the element "([^"]*)" from "([^"]*)" and extract it's values, starting from string position "([^"]*)", using "([^"]*)" as a seperator$/, actions().getStringAndExtractValues);

    this.When(/^I retrieve the child elements that exist in parent element "([^"]*)" on the page "([^"]*)"$/, actions().getElementChilds);

    this.Then(/^I compare array "([^"]*)" with "([^"]*)" on the page "([^"]*)"$/, actions().compareArrays);

    this.Then(/^I mine the stub data from: "([^"]*)"$/, actions().extractStubData);

    this.When(/^I send an authenticated api get call to "([^"]*)"$/, actions().getApiAsAClient);

    this.Then(/^all subs of "([^"]*)" are displayed$/, actions().checkArrayPoc);

    this.Then(/^all elements of css "([^"]*)" have a "([^"]*)" that contain "([^"]*)"$/, actions().checkArrayPocMultiple);


    //

    this.Before(function (scenario, callback) {
        browser.currentTestData = {};
        browser.sleep(1).then(callback);

        /* Example usage of the currentTestData object to pass data between steps:

         browser.currentTestData['one'] = 1;
         browser.currentTestData['two'] = [2, 3, 4, 5];
         browser.currentTestData['three'] = 'hallo';
         browser.currentTestData['four'] = {'hallo': 'leuk'};
         console.log(browser.currentTestData)
         console.log(browser.currentTestData.two);
         console.log(browser.currentTestData.two[1])
         console.log(browser.currentTestData['three'])
         console.log(browser.currentTestData.four['hallo'])
         browser.sleep(1).then(callback)*/

    });

    this.After(function (scenario, callback) {
        actions().clearBrowser();
        browser.currentTestData = null;
        browser.sleep(1).then(callback);

    })
}
module.exports = given;
