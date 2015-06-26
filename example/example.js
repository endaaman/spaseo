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
    .when('/other', {
        template: '<ul><li ng-repeat="user in users">{{user.name}}: {{user.message}}</li></ul>',
        controller: 'OtherCtrl'
    })
    .otherwise({
        redirectTo: '/'
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
.controller('OtherCtrl', function($scope, $http){
    var cb = spaseo();
    $http.get('/users.json')
    .success(function(data) {
        $scope.users = data;
        cb()
    });
})
.run(function($rootScope, $location){
    $rootScope.$location = $location;
});
