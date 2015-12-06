var app = window.angular.module('vitalityApp', [
    'ui.router', 
    'ngAnimate'
]);

app.run(function($rootScope, $timeout, $state){
    // Enable Alert System Messages
    $rootScope.AlertSystem = window.AlertSystem = (function($state) {
        "use strict";
    
        var elem,
            hideHandler,
            that = {};
    
        that.init = function(options) {
            elem = $(options.selector);
        };
    
        that.show = function(text, alertType) {
            clearTimeout(hideHandler);
    
            if (!!alertType) {
                elem.removeClass(elem.attr("class").split(' ')[2]);
                elem.addClass(alertType);
            }
    
            elem.find("span").html(text);
            // console.log("ELEM -- FIND CLASS", $(elem));
            elem.delay(200).fadeIn().delay(4000).fadeOut();
        };
    
        return that;
    }());
    // Instantiate Alert System
    (function() {
        $rootScope.AlertSystem.init({
            "selector": ".alert-system"
        });
    }());
    // Determine Page Id On Reload
    var sref = window.location.href;
    sref = sref.split('/');
    sref.splice(0, 4);
    // console.warn("Sref", sref);
    sref = sref.join('.').replace(window.location.host, '');
    $rootScope.pageId = sref;
    // Set Page ID for Routing
    $rootScope.$on('pageId', function(event, params){
        $rootScope.pageId = params.id;
    });
    // Create Empty User Object
    $rootScope.user = {};
    // Set User On Login
    $rootScope.$on('loggedIn', function(event, params) {
        console.log("Got Info", params);
        // Set Username
        if (!!params.user) setUser(params.user);
        else setUser();
        // Send to state
        $state.go(params.state);
    });
    // Set User On Logout
    $rootScope.$on('loggedOut', function(event, params) {
        console.log("Got Info", params);
        // Set Username
        setUser();
        // Send to state
        $state.go(params.state);
    });
    
    $rootScope.ratings = {}; 
    $rootScope.$on('ratings', function(ev, task){
        if (task.name == 'add') {
            for (var prop in task.ratings) {
                $rootScope.ratings[prop] = task.ratings[prop];
            }
            console.log("Added Item to Ratings", $rootScope.ratings);
        } else {
            console.error('unknown Taks', task.name);
        }
    });
    
    setUser();
    // Set User Function
    function setUser(user) {
        if (window.Parse.User.current()) {
            $rootScope.user.username = window.Parse.User.current().get('username');
            $rootScope.user.email = window.Parse.User.current().get('email');
            $rootScope.user.firstName = window.Parse.User.current().get('firstName');
            $rootScope.user.lastName = window.Parse.User.current().get('lastName');
            $rootScope.user.userAge = window.Parse.User.current().get('userAge');
            $rootScope.user.userHeight = window.Parse.User.current().get('userHeight');
            console.log("User Loaded", $rootScope.user);
        } else {
            $rootScope.user.username = '';
            $rootScope.user.email = '';
            $rootScope.user.firstName = '';
            $rootScope.user.lastName = '';
            $rootScope.user.userAge = '';
            $rootScope.user.userHeight = '';
            console.warn("No User", $rootScope.user);
        }
    }
    
    $rootScope.$on('sendTo', function(event, state){
        $state.go(state);
    });
});
app.controller('AppController', ['$scope', function($scope) {

}]);