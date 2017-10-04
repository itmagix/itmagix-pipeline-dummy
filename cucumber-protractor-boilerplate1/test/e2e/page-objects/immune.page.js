/**
 * Created by panhuisi on 02-10-2017.
 */

var immune = function () {

    var selectors = {
        searchField: '#CustomSearchForm_SearchForm_Search',
        searchButton: '.action.action',
        searchResultMoreButton: 'span > a[href="/werken-bij/functiehuis/test-specialismes/"]'
    };

    return {
        selectors: selectors
    }
};

module.exports = immune;