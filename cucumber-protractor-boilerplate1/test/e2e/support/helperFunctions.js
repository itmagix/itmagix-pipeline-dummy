/**
 * Created by panhuisi on 26-9-2017.
 */

var pageElements = require('../page-objects/pageElements');
var fs = require('fs');

var helper = function () {
    'use strict';

     var convertToHex = function (r, g, b) {
        var rgb = b | (g << 8) | (r << 16);
        var hex = (0x1000000 | rgb).toString(16).substring(1);
        hex = ('#' + hex);
        return hex;
    };


    var getElement = function (page, elem, superElem) {
        if (superElem) {
            return element(by.css(pageElements().selectPage[page].selectors[superElem])).element(by.css(pageElements().selectPage[page].selectors[elem]));
        } else {
            return element(by.css(pageElements().selectPage[page].selectors[elem]));
        }
    };

    var getElements = function (elem) {
        return element.all(by.css(elem));
    };

    var writeScreenShot = function (data, filename) {
        var stream = fs.createWriteStream(filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
    };

    return {
        convertToHex: convertToHex,
        getElement: getElement,
        getElements: getElements,
        writeScreenShot: writeScreenShot
    };
};
module.exports = helper;

