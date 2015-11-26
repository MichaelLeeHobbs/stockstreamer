'use strict';

describe('Service: stockGetter', function () {

  // load the service's module
  beforeEach(module('publicHtmlApp'));

  // instantiate service
  var stockGetter;
  beforeEach(inject(function (_stockGetter_) {
    stockGetter = _stockGetter_;
  }));

  it('should do something', function () {
    expect(!!stockGetter).toBe(true);
  });

});
