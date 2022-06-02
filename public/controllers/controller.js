var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

  var flag = 0;

  var refresh = function(contact={}, error=false) {
    $http.get('/contactlist').success(function(response){
      $scope.disable_add = false;
      $scope.contactlist = response;
      $scope.contact = contact;
      $scope.error = error;
    });
  };

  refresh();

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const validateNumber = (number) => {
    return number.match(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    );
  };

  const validate = (contact, error = {}) => {
    if(angular.equals($scope.contact, {})) return false;
    if(!validateEmail(contact.email)) error["email"] = true;
    if(!validateNumber(contact.number)) error["number"] = true;
    refresh(contact, error=error);

    if(error.email || error.number) {
      return false;
    } else {
      return true;
    }
  }

  $scope.addContact = function() {
    if(flag != 1) {
      if(!validate($scope.contact)) return 0;
      $http.post('/contactlist', $scope.contact).success(function(response){
        $scope.contactlist = response;
        refresh();
      });
      flag = 0;
    }
  };

  $scope.remove = function(id) {
    $http.delete('/contactlist/' + id).success(function(response){
      refresh();
    });
  };

  $scope.edit = function(id) {
    flag = 1;
    $http.get('/contactlist/' + id).success(function(response){
      $scope.contact = response;
      $scope.disable_add = true;
    });
  };

  $scope.update = function() {
    if(!validate($scope.contact)) return 0;
    $http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(repsonse){
      refresh();
    });
    flag = 0;
  };
}]);
