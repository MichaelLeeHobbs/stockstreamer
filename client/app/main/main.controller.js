'use strict';
(function () {

  function MainController($scope, $http, socket, stockGetter) {
    var self           = this;
    this.awesomeThings = [];
    this.stocks        = [];
    this.stockData     = [];

    $scope.stockData = [
      {name: 'Greg', score: 50},
      {name: 'Ari', score: 96},
      {name: 'Q', score: 75},
      {name: 'Loser', score: 48}
    ];

    function getStocks(symbols) {
      stockGetter.get(symbols, function(name, data){
        if (self.stockData[name] === undefined) {
          self.stockData[name] = [];
        }

        data.dataset.data.forEach(function(ele) {
          self.stockData[name].push({date: ele[0], close: ele[4]});
        });
        console.log(self.stockData);
        //self.stockData[name] = {date: data.dataset.data[0], close: data.dataset.data[4]};
        //console.log(name);
        //console.log(data);
      });
    }

    function isDuplicate(item, objCollection, key) {
      return objCollection.some(ele => ele[key] === item);
    }

    $scope.$watchCollection(angular.bind(this, function (awesomeThings) {
      return self.awesomeThings;
    }), function (newVal, oldVal) {

      // custom array compare as we dont need deep compare
      // todo - seems like we could do this better?
      var newItems = [];
      newVal.forEach(ele => newItems[ele.name] = ele.name);

      oldVal.forEach(function(ele){
        if (newItems[ele.name] === ele.name) {
          delete newItems[ele.name];
        }
      });

      console.log(newItems);
      if (getStocks) {
        getStocks(newItems);
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
      self.stockData[thing.name] = undefined;
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  }

  angular.module('publicHtmlApp')
    .controller('MainController', MainController);

})();
