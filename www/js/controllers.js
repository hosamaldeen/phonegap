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
        .controller('ContactCtl', ['$scope', '$rootScope' ,'ngDialog', function($scope, $rootScope , ngDialog) {
                $scope.contact_hide = false ;
                $scope.contact_number = false ;     
               $scope.search = function()
                {
                    $scope.contact_hide = false ;
                    $scope.contact_number = false ;     
//                    var contacts = [] ;
//                    for(var i =0 ; i<10;i++)
//                    {
//                        var con = {} ;
//                        con.displayName  = 'ahmed' ;
//                        con.id  = '1' ;
//                        con.phoneNumbers  =[{'value':'0110'} , {'value':'012'} ] ;
//                        contacts.push(con);
//                    }
//                      $scope.result = contacts ;   

                    var options = new ContactFindOptions();
                    options.filter = $scope.search_val ;
                    options.multiple = true;
                    var fields = ["id" , "displayName","phoneNumbers"];
                    navigator.contacts.find(fields, function(contacts){
                        $scope.result = contacts ;
                    }, function(contactError){
                        alert('onError!');                        
                    } , options);                    
                } 
                
                $scope.show_numbers = function(contact){
                        $scope.contact = contact ;
                        $scope.contact_hide = true ;
                        $scope.contact_number = true ;                    
                }
                    
                $scope.select_number = function(number){
                     $rootScope.contact_number = number ;    
                        ngDialog.closeAll();
                }   
            }])
        .controller('LogoutCtrl', ['$scope', '$location', function($scope, $location) {
                localStorage.removeItem('username');
                $scope.slide = 'slide-left';
                $location.url('/login');

            }])
        .controller('ContactUsCtrl', ['$scope', '$location', function($scope, $location) {
                $scope.send_mail = function (){
                    
                    window.plugin.email.open({
                        to: ['hosam_aldeen2000@yahoo.com'],
                        subject: $scope.title,
                        body: $scope.msg
                    });
                    
                }   

            }])
        .controller('MyAccountCtrl', ['$scope' ,'$rootScope','ngDialog',  '$http', '$route', 'checkLogin', function($scope, $rootScope , ngDialog, $http, $route, checkLogin) {
                $scope.pageTitle = "My Account";
                $scope.image = '';
                $scope.take_photo = function() {
                    navigator.camera.getPicture(
                            function(imageURI) {
                                $('#myImage').attr('src', imageURI);
                                $scope.image = imageURI;
                                var options = new FileUploadOptions();
                                options.fileKey = "file";
                                options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                                options.mimeType = "image/jpeg";
                                var params = new Object();
                                params.value1 = "test";
                                params.value2 = "param";
                                options.params = params;
                                var ft = new FileTransfer();
                                ft.upload(imageURI, site + "save_image", function() {
                                }, function() {
                                }, options);
                            },
                            function(err) {
                                alert(err);
                            }, {quality: 10,
                        destinationType: Camera.DestinationType.FILE_URI});

                };

                $scope.contact_search = function()
                {
                     ngDialog.open({ 
                         template: './partials/contact.html',
                         controller: 'ContactCtl',
                     });

                }

                var page = "getAccount";

                $http.get(site + page)
                        .success(function(response) {
                            $scope.account = response;
                        });

                $('#save').click(function() {
                    var u = $("#username").val();
                    var d = $("#details").val();
                    var con = $("#contact_number").val();
                    //navigator.notification.alert('your account has been edited successfully ');

                    var page = "editAccount?u=" + u + "&d=" + d + "&con=" + con;
                    $http.get(site + page)
                            .success(function() {
                                $scope.showMsg = true;
                                $scope.msg = 'your account has been edited';
                                $scope.account.name = u;
                                $scope.account.details = d;
                                $scope.account.contact_number = con;
                                if ($scope.image != '')
                                    $scope.account.img = $scope.image;
                                window.scrollTo(0, 0);
                            });

                });
                
                $rootScope.$on('ngDialog.closing', function (e, $dialog) {
                    $scope.account.contact_number = $rootScope.contact_number ;
                });

            }])


