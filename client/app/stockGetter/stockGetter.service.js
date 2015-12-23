'use strict';

angular.module('publicHtmlApp')
  .service('stockGetter', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
      get: function (stockSymbol, callBack) {

        var startDate = new Date();
        startDate.setYear(startDate.getUTCFullYear() - 1);
        startDate = (startDate.getUTCFullYear()) + '-' + (startDate.getUTCMonth()) + '-' + (startDate.getUTCDate());

        $http({
          method: 'GET',
          url:    'https://www.quandl.com/api/v3/datasets/WIKI/' + stockSymbol + '.json?start_date=' + startDate + '&api_key=ryj9aeja8R-59_bvByzo',
          cache:  true
        })
        .success(function (data) {
          callBack(stockSymbol, data);
        });
      }
    };

  });
