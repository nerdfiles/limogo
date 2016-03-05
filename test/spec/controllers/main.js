'use strict';

describe('Controller: MainCtrl', function () {

  beforeEach(module('blocknext'));

  var MainCtrl,
    scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of available rides to the scope', function () {
    expect(scope.rides.length).toBeTruthy();
  });
});
