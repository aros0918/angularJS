
angular.module('nAuthApp.services', ['ngCookies']) // Inject ngCookies module for $cookies service
    .service('UserService', function($http, $q) {
        var currentUser = null;
        this.getCurrentUser = function(){
            return currentUser;
        }
        this.setCurrentUser = function(user){
            currentUser = user;
        }

        this.signup = function(params) {
            return $http.post('http://localhost:3000/api/signup', params)
                .then(function(response) {
                    var user = response.data; // Access response data using response.data
                    currentUser = user;
                    return user;
                })
                .catch(function(reason) {
                    return $q.reject(reason);
                });
        };
        this.reset = function(params) {
            return $http.post('http://localhost:3000/api/reset', params)
                .then(function(response) {
                    var user = response.data; // Access response data using response.data
                    currentUser = user;
                    return user;
                })
                .catch(function(reason) {
                    return $q.reject(reason);
                });
        };

        this.login = function(params) {
            var request;
            if (params.provider) {
                request = $http.get('http://localhost:3000/api/auth/' + params.provider);
            } else {
                request = $http.post('http://localhost:3000/api/login', params);
            }

            return request.then(function(response) {
                var user = response.data;
                currentUser = user;
                return user;
            }).catch(function(reason) {
                return $q.reject(reason);
            });
        };

    });