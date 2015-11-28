'use strict';

angular.module('publicHtmlApp')
  .service('stockGetter', function ($http, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
      get: function (stockSymbols) {
        console.log(stockSymbols);
        if (stockSymbols.length === 0) {
          // return a promise that resolves to [] as callers are expecting a promise not an empty []
          return $q(function(resolve){
            resolve([]);
          });
        }
        return $http({
          method: 'GET',
          url: 'http://www.google.com/finance/info?q=NSE:' + stockSymbols.join(','),
          cache: false
        })
          .success(function (data) {
            return data;
          });
      }
    };

  });
