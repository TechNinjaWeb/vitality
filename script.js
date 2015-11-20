// Add your javascript here
Parse.initialize("1TzcjXBFcvaFF3UURc6eKSvRspfVz1Yo7sY3pg8b", "MPljLULeWDIMk3i3GHSrXmS40PqiAc8UpNhPpYK3");

var commands = window.commands = {};
var userName;
if (Parse.User.current()) userName = Parse.User.current().get('username');
else userName = window.commands.userName = "Ray";
console.log("USERNAME", userName);

window.onload = function() {
    var pageTitle = window.commands.pageTitle = document.getElementsByTagName('body');

    if (pageTitle[0].id == "homePage") {
        console.log("This is Home Screen");

    }
    else if (pageTitle[0].id == "ratingsPage") {
        console.log("This is Ratings Page");

    }
    else if (pageTitle[0].id == "goalsPage") {
        console.log("This is Goals Page");

    }
    else if (pageTitle[0].id == "progressScreen") {
        console.log("This is Progress Screen");

    }
    else if (pageTitle[0].id == "trackerPage") {
        console.log("This is Tracker Page");

    }
    else if (pageTitle[0].id == "activityList") {

    }
    else if (pageTitle[0].id == "activityDescription") {

    }
    else if (pageTitle[0].id == "activityTimer") {
        console.log("This is Activity Timer Screen");
        // var typeList = ["Physical", "Emotional", "Self-Image"];
        var postData = JSON.parse(decodeURIComponent(window.location.search).replace("?", ""));

        var timers = document.querySelectorAll("#timespan, .timer-controls");
        var stopwatch = document.querySelectorAll("#stopwatch, .stopwatch-controls");
        var isComplete = false;

        window.commands.timers = {
            timespan: timers,
            stopwatch: stopwatch
        };

        (function unHideTimer() {
            var d = JSON.parse(decodeData(window.location.search));

            // console.log(["TIMERS AND CONTROLS", {timers: timers, stopwatch: stopwatch}] );

            if (d.data.trackBy == 1) {
                // console.log("Activity Type is " + d.data.trackBy);

                stopwatch[0].classList.remove("hidden");
                stopwatch[1].classList.remove("hidden");

            }
            else if (d.data.trackBy == 2) {
                // console.log("Activity Type is " + d.data.trackBy);

                timers[0].classList.remove("hidden");
                timers[1].classList.remove("hidden");

            }
            else if (d.data.trackBy == 3) {
                // console.log("Activity Type is " + d.data.trackBy);

                timers[0].classList.remove("hidden");
                timers[1].classList.remove("hidden");
            }

        })();

        function saveActivity() {
            var stopwatch = document.getElementById('stopwatch');
            var timespan = document.getElementById('timespan');
            var lapTimes = document.getElementsByClassName('lap-times');
            var data, url, d;
            var laps = [];

            isComplete = true;
            document.getElementById('saveActivity').classList.remove('hidden');

            if (lapTimes.length >= 1 && isComplete == true) {
                console.log("There are Laps to be tracked");
                Array.prototype.forEach.call(lapTimes, function(e) {
                    // console.log(e.children);
                    laps.push([e.children[0].innerHTML, e.children[1].innerHTML]);
                });
                data = {
                    userName: postData.data.userName,
                    item: postData.data.item,
                    time: stopwatch.innerHTML,
                    laps: laps
                };
            }
            else if (lapTimes.length <= 0) {
                console.log("No Laptimes, Must be countdown function");
                data = {
                    userName: postData.data.userName,
                    item: postData.data.item
                };
            }
            else {
                console.log("No lap information");
            }
            // console.log("Finished Tracking", laps);


            var DB = Parse.Object.extend("TimeTracker");
            var s = new DB();

            s.save(data, {
                success: function(res) {
                    console.log(["Saved Data with response", res]);
                },
                error: function(res, err) {
                    console.warn(["Error Occured", err], ["Response", res]);
                }
            });

            if (postData.data.trackBy == 1 || postData.data.trackBy == 2) {
                url = "/trackerPage.html";
                d = {
                    message: "You've Completed " + postData.data.item + " Activity!"
                };
            }
            else {
                url = "/emotionRatings.html";
                d = {
                    message: ""
                };
            }

            return encodeAndSend(url, d);
        }


        window.commands.saveActivity = saveActivity;


    }
    else if (pageTitle[0].id == "mealDescriptionPage") {
        console.log("This is Meal Description Page");

    }
    else if (pageTitle[0].id == "activityScreen") {
        console.log("This is Activity Screen");

    }
    else if (pageTitle[0].id == "rewardsScreen") {
        console.log("This is Rewards Page");

    }
    else if (pageTitle[0].id == "caloricGoalPage") {
        console.log("This is Caloric Goals Page");

    }
};

function encodeAndSend(url, data) {
        var h = window.location.pathname.split("/");
        h.shift(), h.pop(), host = h.join("/");

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

    window.commands.sendData = encodeAndSend;
    window.commands.grabData = decodeData;

function queryParse(Class, method, actions) {
    var query = new Parse.Query(Class);
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

window.commands.queryParse = queryParse;

function createUser(userDetails) {
    var user = new Parse.User();
    // console.log("Received Parse Test User Data", "Attempting to Create Parse User");

    // Using Parses user.set() method to set the Users
    // login data before querying the server
   
   var userDetailsLength = Object.keys(userDetails).length
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
            window.commands.sendData('/index.html');
        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
        }
    });

};

function login(username, password) {
    // Capture the length of the array
    // The last item in userDetailsLength array is the
    // most recent data from the user
    // Grab the username & password and send it
    // into a Parse.User.logIn function
    Parse.User.logIn(username, password, {
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
};

function logout(sessionUser) {
    console.log("I heard your request to logout")

    if (Parse.User.current()) {
        Parse.User.logOut();
        console.log("User Logged Out");
        window.commands.sendData('/index.html');
    }
    else {
        console.log("Please Login");
        window.commands.sendData('login.html');
    }
};
window.commands.createUser = createUser;
window.commands.login = login;
window.commands.logout = logout;