// Add your javascript here
window.Parse.initialize("1TzcjXBFcvaFF3UURc6eKSvRspfVz1Yo7sY3pg8b", "MPljLULeWDIMk3i3GHSrXmS40PqiAc8UpNhPpYK3");

var commands = window.commands = {};
var userName;
if (window.Parse.User.current()) userName = window.Parse.User.current().get('username');
else userName = window.commands.userName = "Ray";
console.log("USERNAME", userName);

window.onload = function() {
    var pageTitle = window.commands.pageTitle = document.getElementsByTagName('body');
};

/**
 * This tiny script just helps us demonstrate
 * what the various example callbacks are doing
 */
var AlertSystem = window.AlertSystem = (function() {
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
        console.log("ELEM -- FIND CLASS", $(elem));
        elem.delay(200).fadeIn().delay(4000).fadeOut();
    };

    return that;
}());

(function() {
    window.AlertSystem.init({
        "selector": ".alert-system"
    });
}());
// PRIMARY APP FUNCTIONS
function encodeAndSend(url, data) {
    var h = window.location.pathname.split("/");
    h.shift(), h.pop(); var host = h.join("/");

    var s = JSON.stringify(data);
    var u = url + "?";
    var encData = encodeURIComponent(s);

    if (!data || data == 'undefined' || data == null)
        data = {
            message: "Data is null"
        };

    if (window.location.href[0] == "f") {
        u = "file:///" + host + u;
        console.log(["You're running on local host"], ["pathname", window.location.pathname], ["Sending to u", u]);

        return window.location.replace(u + encData);
    }

    window.location.replace(u + encData);

}

function decodeData(data) {
    var d = data.replace("?", "");
    var o = decodeURIComponent(d);

    return o;

}

commands.sendData = encodeAndSend;
commands.grabData = decodeData;

function queryParse(Class, method, actions) {
    var query = new window.Parse.Query(Class);
    var response = [];

    // Grab All Users query
    // query.equalTo("objectId", d.id);
    if (!!actions) {
        actions.forEach(function(e) {
            query[e.condition](e.col, e.val);
            !!e.limit ? query["limit"](e.limit) : null;
        });
    }
    if (method == "find") {
        // console.log("THIS IS FIND", query);
        return query[method]({
            success: function(res) {
                // console.log("RESPONSE FROM QUERYPARSE", res);
                res.forEach(function(e, i, a) {
                    response.push({
                        el: e,
                        idx: i,
                        arr: a
                    });
                });
                return res;
            },
            error: function(res, err) {
                console.warn(res, err, "Error has occured");
                response.push({
                    response: res,
                    error: err
                });
                return err + ": " + res;
            }
        });
    }
    else {
        // console.log("THIS IS GET", query);
        return query[method](actions[0].val, {
            success: function(res) {
                response.push({
                    el: res,
                    idx: null,
                    arr: null
                });
                return res;
            },
            error: function(res, err) {
                console.warn(res, err, "Error has occured");
                response.push({
                    response: res,
                    error: err
                });
                return err + ": " + res;
            }
        });
    }
    // console.log("ARGUMENTS", Class, method, actions);

    return response;
}

commands.queryParse = queryParse;

function createUser(userDetails) {
    var user = new window.Parse.User();
    // console.log("Received Parse Test User Data", "Attempting to Create Parse User");

    // Using Parses user.set() method to set the Users
    // login data before querying the server
   
   var userDetailsLength = Object.keys(userDetails).length;
   console.log("USER DETS LEN", userDetailsLength);
   
   for (var i = 0; i < userDetailsLength; i++) {
       var field = Object.keys(userDetails)[i];
       var value = userDetails[field];
       user.set(field, value);
       console.log("Setting Parse.User on", [field, value]);

   }

    user.signUp(null, {
        success: function(user) {
            console.log("Redirecting You To Home State");
            return (function createDemoActivities(u){
                var activities = [{ instructions: {"0":"Find a quiet place","1":"Sit undisturbed for 20 minutes","2":"Concentrate on mindfullness"},
                        item: 'Meditate',
                        trackBy: 1,
                        type: 1,
                        userName: u.get('username')
                    },
                    { instructions: {"0":"Run around the block","1":"Two times"},
                        item: 'Job',
                        trackBy: 1,
                        type: 0,
                        userName: u.get('username')
                    },
                    { instructions: {"0":"Ham Sandwich","1":"Pork Chops","2":"Cereal"},
                        item: 'Prepare A Healthy Meal',
                        trackBy: 1,
                        type: 2,
                        userName: u.get('username')
                    },
                    { instructions: {"0":"Find a local charity","1":"Apply to volunteer","2":"Offer 20 minutes of your time"},
                        item: 'Volunteer',
                        trackBy: 1,
                        type: 3,
                        userName: u.get('username')
                    }];
                console.warn("Sign Up Success:", u, ["Activities", activities]);
                var o = window.Parse.Object.extend('ActivityList');
                var q = new o();
                return new Promise(function(res, rej){
                    res((function(){
                        for (var i = 0; i < activities.length; i++)
                        q.save(activities[i], {
                            success: function(res) {console.info("Saved Activity: Response -", res)},
                            error: function(err, res) {console.error("Could Not Save Activity", [err, res])}
                        });
                    }()));
                }).then(function(user){
                    debugger;
                    window.commands.sendData('/index.html');
                });
            }(user));
            
        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
        }
    });

}

commands.createUser = createUser;

function login(username, password) {
    // Capture the length of the array
    // The last item in userDetailsLength array is the
    // most recent data from the user
    // Grab the username & password and send it
    // into a Parse.User.logIn function
    window.Parse.User.logIn(username, password, {
        success: function(user) {
            // Do stuff after successful login.
            console.log("Success! Parse has logged in the user: " + username);
            // Reload Window To Update Scope
            window.commands.sendData("/index.html");
        },
        error: function(user, error) {
            // The login failed. Check error to see why.
            console.log(user, error);
        }
    });
}

commands.login = login;

function logout(sessionUser) {
    console.log("I heard your request to logout");

    if (window.Parse.User.current()) {
        window.Parse.User.logOut();
        console.log("User Logged Out");
        window.commands.sendData('/index.html');
    }
    else {
        console.log("Please Login");
        window.commands.sendData('login.html');
    }
}

commands.logout = logout;

Date.daysBetween = function( date1, date2 ) {
  //Get 1 day in milliseconds
  var one_day=1000*60*60*24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;
    
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
};

// handles the click event, sends the query
function getSuccessOutput() {
    return new Promise(function(resolve, reject){
        $.ajax({
            url: 'http://dev.alphanerdsmedia.com/techninja/jeff/request2.php',
            method: 'POST',
            data: {message: 'Yo Nigga!'},
            success: function(response) {
                var html = document.createElement('html');
                html.innerHTML = response;
                console.info("Response", html);
                resolve(response);
            },
            error: function(response) {
                resolve(response);
            },
        });
    });
}

window.commands.getAjax = getSuccessOutput;