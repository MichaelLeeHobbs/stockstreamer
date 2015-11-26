'use strict';

angular.module('publicHtmlApp')
  .directive('footer', function () {
    return {
      templateUrl: 'components/footer/footer.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        element.addClass('footer');
        scope.attrs = attrs;
      }
    };
  });
