window.angular.module('vitalityApp').service('LoginService', ['$rootScope', function($rootScope) {
    var s = {};

    s.createUser = function createUser(userDetails) {
        var user = new window.Parse.User();

        var userDetailsLength = Object.keys(userDetails).length;
        //   console.log("USER DETS LEN", userDetailsLength);

        for (var i = 0; i < userDetailsLength; i++) {
            var field = Object.keys(userDetails)[i];
            var value = userDetails[field];
            user.set(field, value);
            //   console.log("Setting Parse.User on", [field, value]);

        }

        user.signUp(null, {
            success: function(user) {
                console.info("Redirecting You To Home State");
                $rootScope.$broadcast('loggedIn', {
                    state: 'home.index'
                });
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                $rootScope.AlertSystem.show("Error: " + error.code + " " + error.message);
            }
        });

    };

    s.login = function login(username, password) {
        // Capture the length of the array
        // The last item in userDetailsLength array is the
        // most recent data from the user
        // Grab the username & password and send it
        // into a Parse.User.logIn function
        window.Parse.User.logIn(username, password, {
            success: function(user) {
                // Do stuff after successful login.
                console.info("Success! Parse has logged in the user: " + username);
                // Reload Window To Update Scope
                $rootScope.$broadcast('loggedIn', {
                    state: 'home.index'
                });
            },
            error: function(user, error) {
                // The login failed. Check error to see why.
                $rootScope.AlertSystem.show(error.message, 'alert-danger');
                console.error({
                    message: error,
                    where: user.className,
                    numberOfErrors: user._objCount,
                    attribs: user.attributes
                });
            }
        });
    };


    s.logout = function logout(sessionUser) {
        console.log("I heard your request to logout");

        if (window.Parse.User.current()) {
            window.Parse.User.logOut();
            console.info("User Logged Out");
            $rootScope.$broadcast('loggedOut', {
                state: 'home.index'
            });
        }
        else {
            console.warn("Please Login");
            $rootScope.AlertSystem.show('Already Logged Out!', 'alert-danger');
            // console.warn({message:error, where: user.className, numberOfErrors: user._objCount, attribs: user.attributes});
        }
    };

    s.saveUserDetails = function(userDetails) {
        var user = window.Parse.User.current();

        for (var prop in userDetails) {

            var field = prop;
            var value = userDetails[prop];

            if (value != undefined) user.set(field, value);
            // else console.warn("Not Setting Value For " + prop);
        }
        user.save(null, {
            success: function(res) {
                console.info("DATA UPDATED", res);
                return res;
            },
            error: function(err, res) {
                console.error("ERROR", err, "RES", res);
                return {
                    response: res,
                    error: err
                };
            }
        }).then(function(res) {
            user.fetch({
                success: function(res) {
                    console.info("FETCH DATA", res);
                    $rootScope.$broadcast('loggedIn', {
                        state: 'profile.user',
                        user: res.attributes
                    });
                },
                error: function(err, res) {
                    console.error("ERROR", err, "RES", res);
                    $rootScope.AlertSystem.show("Error: " + err.code + " " + err.message);
                }
            });
        });
    };

    return s;
}]);