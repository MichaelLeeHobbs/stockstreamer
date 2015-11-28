'use strict';

angular.module('publicHtmlApp')
  .service('stockGetter', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
      get: function (stockSymbols, callBack) {
        console.log(stockSymbols);
        if (stockSymbols.length === 0) {
          return;
        }

        stockSymbols.forEach(function (ele) {
          /*
          $http({
            method: 'GET',
            url:    'https://www.quandl.com/api/v3/datasets/WIKI/' + ele + '.json?api_key=ryj9aeja8R-59_bvByzo',
            cache:  true
          })
            .success(function (data) {
              callBack(ele, data);
            });
            */
        });
      }
    };

  });
