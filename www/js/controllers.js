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
               $scope.search = function()
                {
//                    var contacts = [] ;
//                    for(var i =0 ; i<10;i++)
//                    {
//                        var con = {} ;
//                        con.displayName  = 'ahmed' ;
//                        con.id  = '1' ;
//                        con.phoneNumbers  =[{'value':'0110'} , 'sdfsdf'] ;
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
                
                $scope.show_numbers = function(id){
                   
                    var options = new ContactFindOptions();
                    options.filter =  ""+id ;
                    var fields = ["id" , "displayName","phoneNumbers"];
                    navigator.contacts.find(fields, function(contacts){
                        $scope.result = contacts ;
                    }, function(contactError){
                        alert('onError!');                        
                    } , options);
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
        .controller('TakePhotoCtrl', ['$scope', '$location', function($scope, $location) {

                document.addEventListener("deviceready", onDeviceReady, false);

                function id(element) {
                    return document.getElementById(element);
                }

                function onDeviceReady() {
                    cameraApp = new cameraApp();
                    cameraApp.run();

                    navigator.splashscreen.hide();
                }



                function cameraApp() {
                }

                cameraApp.prototype = {
                    _pictureSource: null,
                    _destinationType: null,
                    run: function() {
                        var that = this;
                        that._pictureSource = navigator.camera.PictureSourceType;
                        that._destinationType = navigator.camera.DestinationType;
                        id("capturePhotoButton").addEventListener("click", function() {
                            that._capturePhoto.apply(that, arguments);
                        });
                        id("capturePhotoEditButton").addEventListener("click", function() {
                            that._capturePhotoEdit.apply(that, arguments)
                        });
                        id("getPhotoFromLibraryButton").addEventListener("click", function() {
                            that._getPhotoFromLibrary.apply(that, arguments)
                        });
                        id("getPhotoFromAlbumButton").addEventListener("click", function() {
                            that._getPhotoFromAlbum.apply(that, arguments);
                        });
                    },
                    _capturePhoto: function() {
                        var that = this;
                        navigator.notification.alert('hi');
                        // Take picture using device camera and retrieve image as base64-encoded string.
                        navigator.camera.getPicture(function() {
                            that._onPhotoDataSuccess.apply(that, arguments);
                        }, function() {
                            that._onFail.apply(that, arguments);
                        }, {
                            quality: 50,
                            destinationType: that._destinationType.DATA_URL
                        });
                    },
                    _capturePhotoEdit: function() {
                        var that = this;
                        // Take picture using device camera, allow edit, and retrieve image as base64-encoded string. 
                        // The allowEdit property has no effect on Android devices.
                        navigator.camera.getPicture(function() {
                            that._onPhotoDataSuccess.apply(that, arguments);
                        }, function() {
                            that._onFail.apply(that, arguments);
                        }, {
                            quality: 20, allowEdit: true,
                            destinationType: cameraApp._destinationType.DATA_URL
                        });
                    },
                    _getPhotoFromLibrary: function() {
                        var that = this;
                        // On Android devices, pictureSource.PHOTOLIBRARY and
                        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
                        that._getPhoto(that._pictureSource.PHOTOLIBRARY);
                    },
                    _getPhotoFromAlbum: function() {
                        var that = this;
                        // On Android devices, pictureSource.PHOTOLIBRARY and
                        // pictureSource.SAVEDPHOTOALBUM display the same photo album.
                        that._getPhoto(that._pictureSource.SAVEDPHOTOALBUM)
                    },
                    _getPhoto: function(source) {
                        var that = this;
                        // Retrieve image file location from specified source.
                        navigator.camera.getPicture(function() {
                            that._onPhotoURISuccess.apply(that, arguments);
                        }, function() {
                            cameraApp._onFail.apply(that, arguments);
                        }, {
                            quality: 50,
                            destinationType: cameraApp._destinationType.FILE_URI,
                            sourceType: source
                        });
                    },
                    _onPhotoDataSuccess: function(imageData) {
                        var smallImage = document.getElementById('smallImage');
                        smallImage.style.display = 'block';

                        // Show the captured photo.
                        smallImage.src = "data:image/jpeg;base64," + imageData;
                    },
                    _onPhotoURISuccess: function(imageURI) {
                        var smallImage = document.getElementById('smallImage');
                        smallImage.style.display = 'block';

                        // Show the captured photo.
                        smallImage.src = imageURI;
                    },
                    _onFail: function(message) {
                        alert(message);
                    }
                }

            }])
        .controller('MyAccountCtrl', ['$scope' ,'$rootScope','ngDialog', '$http', '$route', 'checkLogin', function($scope, $rootScope , ngDialog, $http, $route, checkLogin) {
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
                     $scope.account.contact_number = '1222';
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


