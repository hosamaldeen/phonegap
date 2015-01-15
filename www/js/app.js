'use strict';
var site = "http://estore.ematajer.com/phonegap/";

angular.module('myApp', [
    'shoppinpal.mobile-menu',
    'ngTouch',
    'ngRoute',
    'ngAnimate',
    'myApp.controllers',
    'myApp.memoryServices',
])
        .factory('checkLogin', ['$location',
            function($location) {
                if (typeof (window.localStorage["username"]) == 'undefined')
                {
                    console.log("redirect to login");

                    $location.url("/login");
                    return false;
                }

                else
                    console.log(window.localStorage["username"]);
            }])
        .config(['$routeProvider', function($routeProvider) {
                $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
                $routeProvider.when('/logout', {templateUrl: 'partials/login.html', controller: 'LogoutCtrl'});
                $routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: 'HomeCtrl'});
                $routeProvider.when('/my_account', {templateUrl: 'partials/my_account.html', controller: 'MyAccountCtrl'});
                $routeProvider.when('/take_photo', {templateUrl: 'partials/take_photo.html', controller: 'TakePhotoCtrl'});
                $routeProvider.otherwise({redirectTo: '/home'});
            }])
        