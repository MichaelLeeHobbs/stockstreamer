'use strict';

describe('Directive: d3LinearChart', function () {

  // load the directive's module and view
  beforeEach(module('publicHtmlApp'));
  beforeEach(module('app/d3LinearChart/d3LinearChart.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<d3-linear-chart></d3-linear-chart>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the d3LinearChart directive');
  }));
});
