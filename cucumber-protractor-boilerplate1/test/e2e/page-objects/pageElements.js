/**
 * Created by panhuisi on 26-9-2017.
 */


var generalPO = require('./general.page');

var pageElements = function () {

    var selectPage = {
        general: generalPO()
    };

    return {
        selectPage: selectPage
    }
};

module.exports = pageElements;




