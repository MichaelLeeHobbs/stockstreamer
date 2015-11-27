'use strict';

describe('Directive: d3StockChart', function () {

  // load the directive's module
  beforeEach(module('publicHtmlApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<d3-stock-chart></d3-stock-chart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the d3StockChart directive');
  }));
});
