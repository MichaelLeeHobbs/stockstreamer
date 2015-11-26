'use strict';
(function () {

  function MainController($scope, $http, socket, stockGetter) {
    var self           = this;
    this.awesomeThings = [];
    this.stocks        = getStocks();


    function getStocks() {
      var symbols = [];
      self.awesomeThings.forEach(function (ele) {
        symbols.push(ele.name);
      });
      return stockGetter.get(symbols);
    }

    $scope.$watchCollection(angular.bind(this, function (awesomeThings) {
      return self.awesomeThings;
    }), function (newVal, oldVal) {
      console.log('thing changed');
      getStocks();
    });

    $http.get('/api/things').then(function (response) {
      self.awesomeThings = response.data;
      socket.syncUpdates('thing', self.awesomeThings);
    });

    this.addThing = function () {
      if (self.newThing === '') {
        return;
      }
      $http.post('/api/things', {name: self.newThing});
      self.newThing = '';
    };

    this.deleteThing = function (thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  }

  angular.module('publicHtmlApp')
    .controller('MainController', MainController);

})();
