'use strict';
(function () {

  function MainController($scope, $http, socket, stockGetter) {
    var self           = this;
    this.awesomeThings = [];
    //this.stocks        = [];
    //this.stockData     = [];
    var rawStockData   = [];
    var stockSymboles  = [];

    $scope.stockData = [
      {name: 'Greg', score: 50},
      {name: 'Ari', score: 96},
      {name: 'Q', score: 75},
      {name: 'Loser', score: 48}
    ];

    Array.prototype.diff = function(a) {
      return this.filter(function(i) {return a.indexOf(i) < 0;});
    };

    function getStocks(symbols) {
      stockGetter.get(symbols, newStockData);
    }

    function deleteStockData(name){
      stockSymboles.splice(stockSymboles.indexOf(name), 1);
      rawStockData.forEach(ele => delete ele[name]);
    }

    function newStockData(name, data) {
      // add new stockSymbol
      stockSymboles.push(name);


      var dateDiff = function (start, end) {
        return Math.floor((end - start)/(1000*60*60*24));
      };

      // get date for 1 year ago
      var startDate = new Date();
      startDate.setYear(startDate.getUTCFullYear() - 1);

      data.dataset.data.forEach(function (ele) {
        // working with dates is ugly =(
        var stockDateString = ele[0].split('-');
        startDate = new Date();
        startDate.setFullYear(startDate.getUTCFullYear() - 1);
        var stockDate = new Date();
        stockDate.setUTCFullYear(Number(stockDateString[0]), Number(stockDateString[1]) - 1, Number(stockDateString[2]));
        stockDate.setUTCHours(0);
        stockDate.setUTCMinutes(0);
        stockDate.setUTCSeconds(0);

        var index = dateDiff(startDate, stockDate);
        if (index > -1) {
          if (rawStockData[index] === undefined) {
            rawStockData[index] = {};
          }
          rawStockData[index]['date'] = stockDate;
          rawStockData[index][name]   = ele[4];
        } // endif

        // remap the data to fill in holes and make sure each key has a value
        // fill in missing values with the previous value
        var temp = [];
        var keys = stockSymboles;
        var prevEle = {};

        rawStockData.forEach(function(ele){
          keys.forEach(function(key){
            if (ele[key] === undefined) {
              if (prevEle !== undefined) {
                ele[key] = prevEle[key];
              } else {
                ele[key] = 0;
              } // end if
            } // end if
          });//end foreach
          prevEle = ele;
          temp.push(ele);
        });//end foreach

        self.stockData = temp;
      });

    }

    function isDuplicate(item, objCollection, key) {
      return objCollection.some(ele => ele[key] === item);
    }

    $scope.$watchCollection(angular.bind(this, function (awesomeThings) {
      return self.awesomeThings;
    }), function (newVal, oldVal) {

      if (oldVal) {
        var oldDiff = oldVal.diff(newVal);
        oldDiff.forEach(function(ele){
          deleteStockData(ele.name);
        });
      }
      if (newVal) {
        var newDiff = newVal.diff(oldVal);
        newDiff.forEach(function(ele){
          getStocks(ele.name);
        });
      }
    });

    $http.get('/api/things').then(function (response) {
      self.awesomeThings = response.data;
      socket.syncUpdates('thing', self.awesomeThings);
    });

    this.addThing = function () {
      self.newThing = self.newThing.toUpperCase();
      if (isDuplicate(self.newThing, self.awesomeThings, 'name')) {
        self.newThing = '';
        return;
      }
      if (self.newThing === '') {
        return;
      }
      $http.post('/api/things', {name: self.newThing});
      self.newThing = '';
    };

    this.deleteThing = function (thing) {
      deleteStockData(thing.name);
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  }

  angular.module('publicHtmlApp')
    .controller('MainController', MainController);

})();
