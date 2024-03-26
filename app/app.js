'use strict';

// Declare app level module which depends on views, and core components

angular.module('nAuthApp', [
    'ngRoute',
    'ngCookies',
    'ngMaterial',
    'nAuthApp.services'
])
    .config(function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/auth/:provider', {
                templateUrl: 'views/dashboard.html',
                controller: 'OAuthController'
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardController'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'LoginController'
            })
            .when('/reset', {
                templateUrl: 'views/reset.html',
                controller: 'LoginController'
            })
            .when('/', {
                templateUrl: 'views/welcome.html',
                controller: 'WelcomeController'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .controller('WelcomeController', function() {

    })
    .controller('LoginController', function($scope, $location, UserService) {
        $scope.signup = {};
        $scope.login = {};
        $scope.reset = {};
        

        $scope.signup = function() {
            UserService.signup({
                name: $scope.signup.username,
                email: $scope.signup.email,
                password: $scope.signup.password
            })
                .then(function(user) {
                    $location.path('/dashboard');
                    UserService.setCurrentUser(user.name);
                }, function(reason) {
                    $scope.signup.errors = reason;
                });
        };

        $scope.login = function() {
            UserService.login({
                email: $scope.login.email,
                password: $scope.login.password
            })
                .then(function(user) {
                    $location.path('/dashboard');
                    UserService.setCurrentUser(user.user.name);
                }, function(reason) {
                    $scope.login.errors = reason;
                });
        };

        $scope.reset = function(){
            UserService.reset({
                email: $scope.reset.email,
                password: $scope.reset.password
            })
                .then(function(user) {
                    console.log("reseted");
                    $location.path('/dashboard');
                    UserService.setCurrentUser(user.user.name);
                }, function(reason) {
                    $scope.reset.errors = reason;
                });
        }

    })
    .controller('DashboardController', function($scope, $location, UserService) {
        $scope.dashboard = UserService.getCurrentUser();
        console.log("hello")
        console.log($scope.dashboard)
        $scope.logout = function() {
            UserService.setCurrentUser(null);
            $location.path('/');
                
        };
    })
    .controller('OAuthController', function($routeParams, $location, UserService) {

        UserService.login({
            provider: $routeParams.provider,
        })
            .then(function(user) {
                $location.path('/dashboard');
            }, function(reason) {
                $location.path('/');
            });

    });