'use strict';
angular.module('myApp.controllers', [])
        .controller('MainCtrl', ['$scope', '$rootScope', '$window', '$location', function($scope, $rootScope, $window, $location) {
                $scope.slide = '';
                $rootScope.back = function() {
                    $scope.slide = 'slide-right';
                    $window.history.back();
                }
                $rootScope.go = function(path) {
                    $scope.slide = 'slide-left';
                    $location.url(path);
                }
            }])
        .controller('HomeCtrl', ['$scope', '$http', 'checkLogin', function($scope, $http, checkLogin) {
                $scope.pageTitle = "Home";

                var page = "getArticles";
                $http.get(site + page)
                        .success(function(response) {
                            $scope.articles = response;
                        });
            }])
        .controller('LoginCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
                $scope.pageTitle = "Login";
                $scope.hideMenu = true;
                $scope.login = function() {
                    var u = $scope.username;
                    var p = $scope.password;
                    $http.get(site + "checkLogin?username=" + u + "&" + "password=" + p)
                            .success(function(response) {
                                if (response.login == true)
                                {
                                    window.localStorage["username"] = u;
                                    $scope.slide = 'slide-left';
                                    $location.url('/home');
                                }

                                else
                                    $scope.wrongPasswod = true;
                            });

                };
            }])
        .controller('LogoutCtrl', ['$scope', '$location', function($scope, $location) {
                localStorage.removeItem('username');
                $scope.slide = 'slide-left';
                $location.url('/login');

            }])
        .controller('TakePhotoCtrl', ['$scope', '$location', function($scope, $location) {
                
            }])
        .controller('MyAccountCtrl', ['$scope', '$http','$route' ,  'checkLogin', function($scope, $http, $route ,  checkLogin) {
               $scope.pageTitle = "My Account";
               if(typeof (window.localStorage["msg"]) != "undefined")
               {
                    $scope.showMsg =true ;
                    $scope.msg =window.localStorage["msg"] ;
                    localStorage.removeItem('msg');
               }
                $scope.take_photo = function() {
                    navigator.notification.alert('hi');
                    
//                        navigator.camera.getPicture(onSuccess, onFail, {
//                            quality: 60,
//                            destinationType: navigator.camera.DestinationType,
//                            sourceType: 1
//                        });
//                    
//
//                    function onSuccess(imageData) {
//                        var image = document.getElementById('myImage');
//                        image.src = "data:image/jpeg;base64," + imageData;
//                    }
//                    function onFail(message) {
//                        alert('Failed because ' + message);
//                    }
                };
               
                var page = "getAccount";
                $http.get(site + page)
                        .success(function(response) {
                            $scope.account = response;
                        });
                        
                $('#save').click(function(){
                    var u = $("#username").val();
                    var d = $("#details").val();
                    
                     var page = "editAccount?u="+u+"&d="+d;
                    $http.get(site + page)
                        .success(function(response) {
                           window.localStorage["msg"] = 'your account has been edited'; 
                           $route.reload();
                   
                        });
                        
                });

            }])


