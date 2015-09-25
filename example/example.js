angular.module('app', [
  'ngRoute'
])
.config(function($locationProvider) {
  $locationProvider
  .html5Mode(true)
  .hashPrefix('!');
})
.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    template: '<p>{{message}}</p>',
    controller: 'HomeCtrl'
  })
  .when('/users', {
    template: '<ul><li ng-repeat="user in users">{{user.name}}: {{user.message}}</li></ul>',
    controller: 'UsersCtrl'
  })
  .when('/:path', {
    template: '<h1>404</h1>',
    controller: '404Ctrl'
  });
})
.controller('HomeCtrl', function($scope, $timeout){
  var cb = spaseo();
  $scope.message = 'this should not be rendered..'
  $timeout(function() {
    $scope.message = 'this should be rendered!!'
    cb();
  }, 2000);
})
.controller('UsersCtrl', function($scope, $http){
  var cb = spaseo();
  $http.get('/users.json')
  .success(function(data) {
    $scope.users = data;
    cb()
  });
})
.controller('404Ctrl', function($scope){
  spaseo()(404);
})
.run(function($rootScope, $location){
    $rootScope.$location = $location;
    spaseo.wrap(function (cb){
      $rootScope.$evalAsync(cb);
    })
});
