/**
 * Project: angular-popup
 * File:
 * User: Evgeny Reznichenko "<kusakyky@gmail.com>"
 */


angular
    .module('firstApp', ['ui.Popup'])
    .controller('firstCtrl', ['$scope', 'Popup', function ($scope, Popup) {
        var popup;

        $scope.open = function () {
            popup = new Popup({
                templateUrl: 'popup.html',
                data: {
                    message: 'Hello! my super duper popup!'
                }
            });
        };

        $scope.close = function () {
            if (popup) popup.close();
        };

    }]);