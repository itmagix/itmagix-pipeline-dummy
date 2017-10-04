/* global browser, driver, by */

var pageElements = require('../page-objects/pageElements');
var helper = require('./helperFunctions');
var jp = require('jsonpath');
var request = require('superagent');
var parseString = require('xml2js').parseString;

var actions = function () {
    'use strict';

    /**
     * Checks the reponse body for a response that has been stored in currentTestData.apiRes.
     * @param expectedType String "code" or "substring" (not implemented yet)
     * @param expectedValue
     */
    var checkApiResponse = function (expectedType, expectedValue) {
        switch (expectedType) {
            case 'code': {
                return expect('' + browser.currentTestData['apiRes'].statusCode, 'Expected responsecode was ' + expectedValue + 'but was: ' + browser.currentTestData['apiRes'].statusCode).to.equal(expectedValue);
                break;
            }
            case 'substring': {
                console.log('sub');
                break;
            }
            default: {
                console.log('This test does nothing, please review')
            }
        }
    };

    /**
     * Checks the reponse body for a response that has been stored in currentTestData.apiRes. Uses jsonPath query
     * @param queryString String with jsonPath, specified in Scenario
     * @param beOrContain String "be" or "contain" (specified in Scenario
     * @param expectedValue the expected result (String)
     */
    var checkApiResponseQuery = function (queryString, beOrContain, expectedValue) {
        console.log('apiRes =============>> ', browser.currentTestData.apiRes.body)
        var queryResult = jp.query(browser.currentTestData['apiRes'].body, queryString);
        if (beOrContain === 'be') {
            return expect('' + queryResult, 'Expected the query "' + queryString + '" on the api result to yield the result ' + expectedValue + ' but was: ' + queryResult)
                .to.be.equal(expectedValue);
        }
        else if (beOrContain === 'contain') {
            return expect('' + queryResult, 'Expected the query "' + queryString + '" on the api result to yield a result containing ' + expectedValue + ' but was: ' + queryResult)
                .to.include(expectedValue);
        }
        else if (beOrContain === 'have length') {
            return expect(Object.keys(queryResult).length, 'Expected the query "' + queryString + '" on the api result to yield ' + expectedValue + ' results ' + JSON.stringify(queryResult) + ' were found')
                .to.be.equal(Number(expectedValue));
        }
    };

    /**
     * Checks state of checkboxes within an element
     * @param superElem String with reference to a css selector specified in page object
     * @param page String with reference to page object
     * @param negator optional string "not"
     * @param dataTable table of Strings specified in Scenario (pipe table in step)
     * @param callback
     */
    var checkboxesWithinElementAreChecked = function (superElem, page, negator, dataTable, callback) {
        var data = dataTable.raw();
        for (var i = 0; i < data.length; i++) {
            checkBoxIsChecked(data[i], superElem, negator, page);
        }
        browser.sleep(50).then(callback);
    }

    /**
     * Checks the state of a checkbox
     * @param elem String with reference to a css selector specified in page object (of checkbox within superElem)
     * @param superElem String with reference to a css selector specified in page object
     * @param negator optional String "un"
     * @param page String with reference to page object
     * @param callback
     */
    var checkBoxIsChecked = function (elem, superElem, negator, page, callback) {
        var expectedResult = negator ? false : true;
        var checkbox = helper().getElement(page, elem, superElem);
        browser.sleep(100)
        checkbox.isSelected().then(function (state) {
            expect(state).to.equal(expectedResult, 'check the state of the checkbox ' + elem + ', expected is "' + expectedResult + '" but was "' + state + '"')
        }).then(callback)
    };

    /**
     * Checks or unchecks a checkbox within an element
     * @param negator optional string "un"
     * @param elem String with reference to a css selector specified in page object (of checkbox within superElem)
     * @param superElem String with reference to a css selector specified in page object
     * @param page String with reference to page object
     * @param callback
     */
    var checkCheckboxWithinElement = function (negator, elem, superElem, page, callback) {
        var expectedState = negator ? true : false;
        var checkbox = helper().getElement(page, elem, superElem);
        checkbox.isSelected().then(function (state) {
            expect(state).to.equal(expectedState, 'in order to check or uncheck the checkbox ' + elem + ' should be in the right state. Expected "' + expectedState + '" but was "' + state + '"')
        }).then(function () {
            checkbox.click()
        }).then(callback);
    };

    /**
     * Checks or unchecks multiple checkboxes within an element based on the data provided in pipe table in scenario
     * @param negator optional string "un"
     * @param superElem String with reference to a css selector specified in page object
     * @param page String with reference to page object
     * @param dataTable table of Strings specified in Scenario (pipe table in step)
     * @param callback
     */
    var checkMultipleCheckboxesWithinElement = function (negator, superElem, page, dataTable, callback) {
        var data = dataTable.raw();
        var expectedState = negator ? true : false;
        var domArray = helper().getDomArray(data, page, superElem);

        function nextSelector(j) {
            var checkbox = domArray[j];
            checkbox.isSelected().then(function (state) {
                expect(state).to.equal(expectedState, 'in order to check or uncheck the checkbox ' + data[j] + ' should be in the right state. Expected "' + expectedState + '" but was "' + state + '"')
            }).then(function () {
                checkbox.click();
            })
        }

        for (var j = 0; j < domArray.length; j++) {
            nextSelector(j);
        }
        browser.sleep(500).then(callback)
    };

    /**
     * clears all the cookies and local and session storage. Is called after each scenario, can be called when needed.
     * @param callback
     */
    var clearBrowser = function (callback) {
        browser.executeScript('return window.location.hostname;').then(function (value) {
            if (value !== '') {
                browser.executeScript('window.sessionStorage.clear();'); //clear session
                browser.executeScript('window.localStorage.clear();'); //clear local storage
                browser.manage().deleteAllCookies()
            }

        }).then(callback);


    }

    /**
     * Clicks on an element
     * @param elem String with reference to a css selector specified in page object
     * @param page String with reference to a page object
     * @param callback
     */
    var clickOnElement = function (elem, page, callback) {
        var elemToClick = helper().getElement(page, elem);
        elemToClick.click().then(function () {
            browser.sleep(150).then(callback)
        });
    };

    /**
     * Clicks on an element within another element
     * @param elem String with reference to a css selector of the element within superElem, specified in page object
     * @param superElem String with reference to a css selector specified in page object
     * @param page String with reference to a page object
     * @param callback
     */
    var clickOnElementWithinElement = function (elem, superElem, page, callback) {
        var elemToClick = helper().getElement(page, elem, superElem);
        elemToClick.click().then(function () {
            browser.sleep(150).then(callback)
        });
    };

    function clickOnElementXpath (elem, page) {
        return new Promise (function(resolve){
              elem = pageElements().selectPage[page].selectors[elem];
                  element(by.xpath(elem))
                    .getText()
                        .then(function(vla){
                             console.log(vla)
                             resolve()
                        })
        })
    }

    var compareArrays = function (a, b, page) {
        return new Promise(function (resolve, reject) {
            var frontendValues = pageElements().selectPage[page].selectors[a];
            var stubValues = pageElements().selectPage[page].selectors[b];
            var expectedLength = stubValues.length;
            for (var i = 0; i < expectedLength; i++) {
                if (frontendValues.length < i + 1) {
                    console.log('There are ' + (expectedLength - i) + ' expected values missing, expected ' + expectedLength + ' but only found ' + i);
                    i = expectedLength; // shortcut to end for loop
                    reject();
                } else if (frontendValues.length >= i + 1) {
                    if (frontendValues[i].x === stubValues[i].x) {
                        if (frontendValues[i].y === stubValues[i].y) {
                            console.log('The actual value of ' + frontendValues[i].x + 'was ' + frontendValues[i].y + ', just as we expected!' + ' ' + (i + 1));
                        } else {
                            console.log('The actual value of "y" was: ' + frontendValues[i].y + ' but we expected is to be: ' + stubValues[i].y + ' ' + (i + 1));
                            reject();
                        }
                    } else {
                        console.log('The actual value of "x" was: ' + frontendValues[i].x + ' but we expected is to be: ' + stubValues[i].x + ' ' + (i + 1));
                        reject();
                    }
                } else {
                    console.log('An uncaught error occurred, please check code!');
                    reject();
                }
            }
            resolve();
        })
    };

    var elementContainsChildElement = function (superElem, containsYesNo, elem, page, callback) {
        var expectedResult = containsYesNo.indexOf('not') !== -1 ? false : true;
        helper().getElement(page, superElem).all(by.css(pageElements().selectPage[page].selectors[elem])).then(function (listOfSubelements) {
            expect(listOfSubelements.length > 0, 'Expected that element ' + superElem + ' ' + containsYesNo + 'child element ' + elem + ' but ' + listOfSubelements.length + 'elements were found').to.equal(expectedResult);
        }).then(callback);
    }

    /**
     * Checks whether an element contains 1 or more child elements (specified in pipe table in scenario)
     * @param superElem String with reference to a css selector specified in page object
     * @param containsYesNo String "contains" or "does not contain", specified in scenario
     * @param page String with reference to a page object
     * @param dataTable table of Strings specified in Scenario (pipe table in step) referring to css selectors for the elements
     * @param callback
     */
    var elementContainsMultipleChildElements = function (superElem, containsYesNo, page, dataTable, callback) {
        var data = dataTable.raw();
        for (var i = 0; i < data.length; i++) {
            elementContainsChildElement(superElem, containsYesNo, data[i], page);
        }
        browser.sleep(50).then(callback);
    }

    /**
     * Checks whether an element has a child element which contains 1 or more granchild elements (specified in pipe table in scenario)
     * @param superElem String with reference to a css selector specified in page object
     * @param elem String with reference to a css selector of the element within superElem, specified in page object
     * @param property String with a property of a web element (e.g. "class")
     * @param value String with the expected value
     * @param page String with reference to a page object
     * @param callback
     */
    var elementHasChildElementWithPropertyXAndValueY = function (superElem, elem, property, value, page, callback) {
        helper().getElement(page, elem, superElem).getAttribute(property).then(function (val) {
            expect(val, 'value of the property should be equal to the expected value').to.equal(value);
        }).then(callback);
    }

    /**
     * Checks whether an element has a property (specified in scenario) with an expected value (specified in scenario)
     * @param elem String with reference to a css selector specified in page object
     * @param property String with a property of a web element (e.g. "class")
     * @param beOrContains string 'with' or 'containing'
     * @param value String with the expected value
     * @param page String with reference to a page object
     * @param callback
     */
    var elementHasPropertyWithValueX = function (elem, property, beOrContains, value, page) {
        console.log('------------------------------>', beOrContains, page)
        if (beOrContains === 'with') {
            return expect(helper().getElement(page, elem).getAttribute(property),
                'value of the property should be equal to the expected value').to.eventually.equal(value);
        } else {
            return expect(helper().getElement(page, elem).getAttribute(property),
                'value of the property should include the expected value').to.eventually.include(value);
        }
    };

    /**
     * Checks whether an element contains a child element with an expected text
     * @param superElem elem String with reference to a css selector specified in page object
     * @param elem String with reference to a css selector specified in page object
     * @param txt String with the expected text
     * @param page String with reference to a page object
     * @param callback
     */
    var elementHasElementWithText = function (superElem, elem, txt, page, callback) {
        helper().getElement(page, elem, superElem).getText().then(function (val) {
            expect(val.includes(txt), 'text on page: "' + val + '" should contain the expected text: "' + txt + '"').to.equal(true);
        }).then(callback);

    };

    /**
     * Checks whether an element has an expected text (or not)
     * @param elem String with reference to a css selector specified in page object
     * @param containsYesNo String with "contains" or "does not contain"
     * @param txt String with the expected text
     * @param page String with reference to a page object
     * @param callback
     */
    var elementHasText = function (elem, containsYesNo, txt, page, callback) {
        var expectedResult = containsYesNo.indexOf('not') !== -1 ? false : true;
        helper().getElement(page, elem).getText().then(function (val) {
            expect(val.includes(txt), 'text on page: "' + val + '" should contain the expected text: "' + txt + '"').to.equal(expectedResult);
        }).then(callback);

    };

    /**
     * Checks whether an element is displayed in the browser
     * @param elem String with reference to a css selector specified in page object
     * @param negator String optional with "not"
     * @param page String with reference to a page object
     * @param callback
     */
    var elementIsDisplayed = function (elem, negator, page, callback) {
        var expectedResult = negator ? false : true;
        helper().getElement(page, elem).isDisplayed().then(function (disp) {
            expect(disp, 'element ' + elem + ' is expected (not) to be displayed').to.equal(expectedResult);
        }).then(callback);
    };

    /**
     * Checks whether an element contains an element that is displayed in the browser
     * @param elem String with reference to a css selector specified in page object
     * @param negator String optional with "not"
     * @param page String with reference to a page object
     * @param superElem elem String with reference to a css selector specified in page object
     * @param callback
     */
    var elementIsDisplayedInsideElement = function (elem, negator, page, superElem, callback) {
        var expectedResult = negator ? false : true;
        helper().getElement(page, elem, superElem).isDisplayed().then(function (disp) {
            expect(disp, 'element ' + elem + ' is expected (not) to be displayed').to.equal(expectedResult);
        }).then(callback);
    };

    var extractStubData = function (url) {
        browser.driver.manage().window().setSize(0, 0);
        return new Promise(function (resolve, reject) {
            browser.stubArray = [];
            request.get(url).end(function (err, response) {
                if (err) {
                    console.log('An error has been thrown:' + ' - error code: ', err.code + ' - error status: ', err.status);
                    reject(err);
                } else if (response) {
                    browser.stubArray = response.body.datapoints;
                    resolve();
                } else {
                    console.log('An uncaught error occurred, please check code!');
                    reject(err);
                }
            });
            return browser.stubArray;
        })
    };

    /**
     * Performs an api get call. Uses the helper apiGet method, first logging in to get the cookies and then performing the actual caal.
     * The response will be stored in browser.currentTestData.apiRes. Checks whether the api call returns a result.
     * It has a possibility for Acc but that does not work yet!
     * @param url String with a reference to a url specified in "general" page-object
     */
    var getApiAsAClient = function (url) {
        var apiUrl = pageElements().selectPage['general'].selectors[url];
        if (browser.baseUrl.indexOf('acpt') === -1) {
            return expect(helper().apiGet(apiUrl), 'something went wrong with the get call to rest api: ').to.eventually.not.equal(null);
        } else {
            return expect(helper().apiGetAcc(apiUrl), 'something went wrong with the get call to rest api: ').to.eventually.not.equal(null);

        }
    };

    var getElementChilds = function (elem, page, callback) {
        browser.classArray = null;
        var parentElement = pageElements().selectPage[page].selectors[elem];
        helper().getElements(parentElement).then(function (result) {
            browser.classArray = result;
        }).then(callback);
    };

    var getMouseOverValues = function (callback) {
        browser.manage().window().maximize();
        browser.elementCenterPosition = null;
        browser.mouseOverArray = [];
        var arrayLength = browser.classArray.length;

        function looper(counter) {
            helper().getElementCenterPosition(browser.classArray[counter])
                .then(function (centerPosition) {
                    browser.elementCenterPosition = centerPosition;
                    browser.actions().mouseMove(browser.classArray[counter], {
                        x: browser.elementCenterPosition,
                        y: -50
                    }).click().perform();
                })
                .then(function () {
                    browser.classArray[counter].getText()
                        .then(function (legend) {
                            browser.mouseOverArray.push({"x": legend, "y": 0});
                            element(by.css('.focus text')).getText()
                                .then(function (onScreenNumber) {
                                    browser.mouseOverArray[counter].y = onScreenNumber;
                                });
                        });
                });
        }

        for (var i = 0; i < arrayLength; i++) {
            looper(i);
        }
        browser.sleep(1)
            .then(callback);
    };

    var getRestAndQuery = function (url, key, expectedValue) {
        return new Promise(function (resolve, reject) {
            request.get(url).end(function (err, response) {
                if (err) {
                    console.log('An error has been thrown:');
                    console.log('- error code: ', err.code);
                    console.log('- error status: ', err.status);
                    reject(err)
                } else if (response) {
                    resolve(response)
                }
                expect(response.body[key], 'Actual Result did not match the expected value').to.equal(expectedValue);
            })
        })
    };

    var getStringAndExtractValues = function (attr, elem, page, startFromPosition, separator, callback) {
        browser.fields = null;
        var attrib = pageElements().selectPage[page].selectors[attr];
        helper().getElement(page, elem).getAttribute(attrib).then(function (value) {
            value = value.substr(startFromPosition);
            browser.fields = value.split(separator);
        }).then(callback);
    };

    /**
     * Logs in on the local, team or acpt environment based on browser.baseUrl specified in the config
     * @param client Optional parameter of a client specified in sam or loginAcpt page objects. If none, defaultUser is used.
     */
    var loginAsClient = function (clientName) {

        browser.manage().window().maximize();
        var client = clientName ? clientName : 'defaultUser';
        if (browser.baseUrl === 'http://localhost/' || browser.baseUrl.indexOf('team') !== -1) {
            var clientNumber = pageElements().selectPage['sam'].selectors[client];
            browser.ignoreSynchronization = true;
            browser.get(browser.baseUrl + 'sam/');
            return element(by.css(pageElements().selectPage['sam'].selectors['developmentLogin'])).click()
                .then(function () {
                    helper().getElement('sam', 'customerDropdown').sendKeys(clientNumber)
                })
                .then(function () {
                    helper().getElement('sam', 'login').click()
                })
                .then(function () {
                    element(by.css('body')).click()
                })


        }
        else if (browser.baseUrl.indexOf('acpt3') !== -1 || browser.baseUrl.indexOf('acpt5') !== -1) {
            var gencode = null;
            browser.ignoreSynchronization = true;
            var login = pageElements().selectPage['loginAcpt'];
            var account = login.selectors[client][0];
            var card = login.selectors[client][1];
            return browser.get(browser.baseUrl + 'klanten/')
                .then(function () {
                    helper().getElement('loginAcpt', 'accountInput').sendKeys(account, card)
                })
                .then(function () {
                    browser.get(browser.baseUrl + 'gencode/')
                })
                .then(function () {
                    helper().getElement('loginAcpt', 'gencodeAccountInput').sendKeys(account)
                })
                .then(function () {
                    helper().getElement('loginAcpt', 'gencodeCardInput').sendKeys(card)
                })
                .then(function () {
                    helper().getElement('loginAcpt', 'gencodeSend').click()
                })
                .then(function () {
                    browser.sleep(1000)
                })
                .then(function () {
                    helper().getElement('loginAcpt', 'gencodeResult').getText().then(function (txt) {
                        gencode = txt;
                        browser.get(browser.baseUrl + 'klanten/')
                    })
                        .then(function () {
                            helper().getElement('loginAcpt', 'loginCode').sendKeys(gencode)
                        })
                        .then(function () {
                            helper().getElement('loginAcpt', 'loginButton').click()
                        })
                })

        }
        else {
            return console.log('There is no login procedure created yet for this environment. Fee free to add one!')
        }
    };

    var logout = function () {
        if (browser.baseUrl === 'http://localhost/' || browser.baseUrl.indexOf('team') !== -1) {
            browser.get(browser.baseUrl + 'sam/')
            return helper().getElement('sam', 'logout').click();
        }

        else if (browser.baseUrl.indexOf('acpt3') !== -1 || browser.baseUrl.indexOf('acpt5') !== -1) {
            var logoutBtn = '#ra_uitloggen';
            var logoutModal = '#logoutmodal_c';
            var logoutBtnInModal = '#ra_logout_link';

            if (element.all(by.css(logoutBtn)).length > 0) {
                element(by.css(logoutBtn)).click().then(function () {
                    element.all(by.css(logoutModal)).count().then(function (count) {
                        if (count > 0) {

                            element(by.css(logoutModal)).getAttribute('style').then(function (style) {
                                if (style.indexOf('visibility: block')) {
                                    element(by.css(logoutBtnInModal)).click();
                                }
                            })
                        }
                    })
                })
            } else return expect(false, 'logout button not found on page').to.equal(false);
        }
    }

    /**
     * Checks whether all of the specified (in pipe-table in scenario) child elements of an element are displayed in the browser
     * @param negator String optional with "not"
     * @param page String with reference to a page object
     * @param superElem elem String with reference to a css selector specified in page object
     * @param dataTable table of Strings referencing css selectors specified in page object. (In the pipe table in scenario. )
     * @param callback
     */
    var multipleElementsDisplayedInsideElement = function (negator, page, superElem, dataTable, callback) {
        var data = dataTable.raw();
        for (var i = 0; i < data.length; i++) {
            elementIsDisplayedInsideElement(data[i], negator, page, superElem);
        }
        browser.sleep(50).then(callback);
    }

    /**
     * Opens an url or site (relative to browser.baseUrl as specified in config file)
     * @param type String "url" (absolute),"site" (relative), or "page" (reference to page-object, it loads the "url" selector specified there)
     * @param link
     * @param environment String. Optional. Secure or Anonymous referencing child objects of url in page object
     */
    var openWebsite = function (type, link) {
        browser.ignoreSynchronization = true;
        browser.driver.manage().window().maximize();
        return new Promise (function(resolve){
            var destinationPage = '';
            switch (type) {
                case 'url':
                    destinationPage = link;
                    break;
                case 'site':
                    destinationPage = browser.baseUrl + link;
                    break;
            }
            browser.get(destinationPage).then(function () {
            browser.getCurrentUrl().then(function (url) {
                // console.log(destinationPage);
            })
            resolve()
            });
        })
    };

    /**
     * Checks whether the pageSource contains a specified string. Expected value can be specified directly in scenario (then page is not necessary)
     * or it can reference a string specified in page object
     * @param expectedValue String
     * @param page String referencing page object, optional
     */
    var pageSourceContains = function (expectedValue, page) {
        expectedValue = page ? pageElements().selectPage[page].selectors[expectedValue] : expectedValue;
        return browser.getPageSource().then(function (pageSource) {
            expect(pageSource.indexOf(expectedValue) !== -1, 'expected to find ' + expectedValue + ' in the pageSource. \n ').to.equal(true);
        })


    }
    var postSoapAndQuery = function (url, element, expectedResult) {
        return new Promise(function (resolve, reject) {
            var soapBody = pageElements().selectPage['general'].selectors['soapBodyGetQuote'];
            var fetchedValue = '<default>';
            request.post(url).type('xml').send(soapBody).end(function (err, response) {
                if (err) {
                    console.log('An error has been thrown:');
                    console.log('- error code: ', err.code);
                    console.log('- error status: ', err.status);
                    reject(err);
                } else if (response) {
                    resolve(response)
                }
                parseString(response.text, function (err, soapReplyToJson) {
                    fetchedValue = jp.query(soapReplyToJson, element);
                });
                var actualResult = JSON.stringify(fetchedValue);
                expect(actualResult, 'Actual result did not contain the expected value').to.include(expectedResult);
            })
        })
    };

    /**
     * Performs an api post call. Uses the helper apiPost method, first logging in to get the cookies and then performing the actual call.
     * @param json String referecing a json string specified in "general" page-object
     * @param url String referencing a url specified in "general" page-object
     */
    var postToApiAsAClient = function (json, url) {
        var jsonString = pageElements().selectPage['general'].selectors[json];
        var apiUrl = pageElements().selectPage['general'].selectors[url];
        return expect(helper().apiPost(apiUrl, jsonString), 'something went wrong with the post call to rest api').to.eventually.not.equal(null);
    };

    var storeScreenShot = function (name, callback) {
        browser.takeScreenshot().then(function (png) {
            helper().writeScreenShot(png, 'report/screenshots/' + name + '.png'); //the folder 'report/screenshots' is excluded by .gitignore, be sure to create folder before running
        }).then(callback);
    };

    var verifyCss = function (css, elem, page, expectedValue) {
        return new Promise(function (resolve, reject) {
            browser.actualValue = null;
            element(by.css(pageElements().selectPage[page].selectors[elem])).getCssValue(css)
                .then(function (value) {
                    switch (css) {
                        case 'color':
                            value = value.substring(4, value.length - 1);
                            var fields = value.split(', ');
                            var red = fields[0];
                            var green = fields[1];
                            var blue = fields[2];
                            browser.actualValue = helper().convertToHex(red, green, blue);
                            break;
                        case 'font-family':
                            value = value.replace(/"/g, '');
                            var fontFamilyArray = value.split(', ');
                            browser.actualValue = fontFamilyArray[0];
                            break;
                        case 'font-size':
                            browser.actualValue = value;
                            break;
                        case 'font-style':
                            browser.actualValue = value;
                            break;
                    }
                });
            browser.sleep(0)
                .then(function () {
                    if (expectedValue === browser.actualValue) {
                        resolve();
                    } else if (expectedValue !== browser.actualValue) {
                        console.log('We expected "' + css + '" of "' + elem + '" to be "' + expectedValue + '" but it turned out to be "' + browser.actualValue + '".');
                        reject();
                    } else {
                        console.log("Undefined error occurred, please check the code!");
                        reject();
                    }
                });
        })
    };


    /**
     * This is a function that shows example implementations of the helper getFilteredAndCheckedArray. It is a function that takes several arguments
     *
     * 1) a function returning a promise of an array of web elements
     * 2) a function that performs a function on a web element used to filter the selection (e.g. elem.getAttribute('id'), resulting in an array of id's)
     * 3) an object that contains:
     *      a) a function taking an inputvalue (element of the filtered array) and an expected result (specified as argument #4.
     *         It returns a boolean to indicate whether (true) that element should be added to the result-array (usually the array of errors!)
     *      b) a String with an message to be added, usually an error message.
     *
     * The function then performs a check on the length of the result-array. Usually this is checking that the length of the array-of-erros is 0.
     */
    var checkArrayPoc = function (superElem) {

        var getThisArray = function () {
            return element(by.css(superElem)).all(by.css('[class*="14"]'))
        }
        var filter1 = function (elem) {
            return elem.getAttribute('id')

        }
        var filter2 = function (elem) {
            return elem.isSelected()
        }

        var filter3 = function (elem) {
            return elem.getSize()
        }

        var checkForError1 = function (inputValue, expectedResult) {
            return {
                result: inputValue.indexOf(expectedResult) < 0,
                message: 'text ' + expectedResult + ' is niet gevonden in  ' + inputValue
            };
        }
        var checkForError2 = function (inputValue, expectedResult) {
            return {result: inputValue === expectedResult < 0, message: 'hij is niet gelijk hoor! \n'};
        }
        var checkForError3 = function (inputValue, expectedResult) {
            return {
                result: (inputValue.width < 40 && inputValue.height < 30) === expectedResult,
                message: 'size smaller than 40X30 ' + inputValue.width + 'X' + inputValue.height + '\n'
            }
        }


        // return helper().getFilteredAndCheckedArray(
        //     getThisArray,
        //     filter3,
        //     checkForError3,
        //     true)
        //     .then(function (expectedErrors) {
        //         expect(expectedErrors.length, expectedErrors).to.equal(0)
        //     })

        return helper().getFilteredAndCheckedArray(
            function () {
                return element(by.css(superElem)).all(by.css('[class*="14"]'))
            },
            function (elem) {
                return elem.getAttribute('id')
            },
            function (inputValue, expectedResult) {
                return {
                    result: inputValue.indexOf(expectedResult) < 0,
                    message: 'text ' + expectedResult + ' is niet gevonden in ==> "' + inputValue + '"\n'
                }
            },
            'antwoord')
            .then(function (expectedErrors) {
                expect(expectedErrors.length, expectedErrors).to.equal(0)
            })

        // return helper().getFilteredAndCheckedArray(
        //     function () {
        //         return element(by.css(superElem)).all(by.css('[class*="14"]'))
        //     },
        //     undefined,
        //     function (inputValue, expectedResult) {
        //         return {
        //             result: inputValue===inputValue,
        //             message: 'added element ==> "' + inputValue +'"\n'
        //         }
        //     },
        //     'none')
        //     .then(function (expectedErrors) {
        //         expect(expectedErrors.length, expectedErrors).to.equal(100)
        //     })


    }


    /**
     * Sets the value of a specific cookie (by name)
     * @param cookieName String name of the cookie.  Specified in scenario.
     * @param cookieValue String ew value. Specified in scenario.
     * @returns {Promise<R>}
     */
    var setCookieValue = function (cookieName, cookieValue) {
        return browser.manage().deleteCookie(cookieName)
            .then(function () {
                browser.manage().addCookie({name: cookieName, value: cookieValue})
            })
        // .then(function () {
        //     browser.sleep(22000)
        // })
    }

    function typeText (text, elem, page) {
        return new Promise (function(resolve) {
            elem = pageElements().selectPage[page].selectors[elem];
            element(by.css(elem))
                .sendKeys(text);
                resolve()
            })
        }

    var checkArrayPocMultiple = function (elem, attributesString, expectedValuesString) {
        var attributes = attributesString.split('|');
        var expectedValues = expectedValuesString.split('|');
        return helper().getFilteredAndCheckedArray(
            //inptArray:
            function () {
                return element.all(by.css(elem));

            },
            //filterFunction:
            function (elem) {
                var promises = [];
                return new Promise(function (resolve) {
                    attributes.forEach(function (attr) {
                        promises.push(elem.getAttribute(attr))
                    });
                    Promise.all(promises).then(function (arr) {
                        resolve(arr)
                    })
                })
            },
            //CheckinValues:
            function (inputValue, expectedResult) {
                if (inputValue.length !== expectedResult.length) return {
                    result: false,
                    message: 'unequal number of arguments to compare'
                }
                else {
                    for (var i = 0; i < inputValue.length; i++) {
                        return {
                            result: inputValue[i] !== expectedResult[1],
                            message: 'error: "' + [inputValue[0], inputValue[1], inputValue[2]] + '" was expected to be: "' + expectedResult + ' "\n'
                        }
                    }
                }
            },
            //expectedResults
            expectedValues
        ).then(function (expectedErrors) {
            expect(expectedErrors.length, expectedErrors).to.equal(0)
        })

    };


    return {
        checkArrayPoc: checkArrayPoc,
        checkArrayPocMultiple: checkArrayPocMultiple,
        checkApiResponse: checkApiResponse,
        checkApiResponseQuery: checkApiResponseQuery,
        checkCheckboxWithinElement: checkCheckboxWithinElement,
        checkboxesWithinElementAreChecked: checkboxesWithinElementAreChecked,
        checkBoxIschecked: checkBoxIsChecked,
        checkMultipleCheckboxesWithinElement: checkMultipleCheckboxesWithinElement,
        clearBrowser: clearBrowser,
        clickOnElement: clickOnElement,
        clickOnElementWithinElement: clickOnElementWithinElement,
        compareArrays: compareArrays,
        elementContainsChildElement: elementContainsChildElement,
        elementContainsMultipleChildElements: elementContainsMultipleChildElements,
        elementHasElementWithText: elementHasElementWithText,
        elementHasText: elementHasText,
        elementHasChildElementWithPropertyXAndValueY: elementHasChildElementWithPropertyXAndValueY,
        elementHasPropertyWithValueX: elementHasPropertyWithValueX,
        elementIsDisplayed: elementIsDisplayed,
        elementIsDisplayedInsideElement: elementIsDisplayedInsideElement,
        extractStubData: extractStubData,
        getApiAsAClient: getApiAsAClient,
        getElementChilds: getElementChilds,
        getRestAndQuery: getRestAndQuery,
        loginAsClient: loginAsClient,
        logout: logout,
        multipleElementsDisplayedInsideElement: multipleElementsDisplayedInsideElement,
        openWebsite: openWebsite,
        pageSourceContains: pageSourceContains,
        postToApiAsAClient: postToApiAsAClient,
        postSoapAndQuery: postSoapAndQuery,
        setCookieValue: setCookieValue,
        storeScreenShot: storeScreenShot,
        typeText: typeText,
        verifyCss: verifyCss
    };
};

module.exports = actions;
