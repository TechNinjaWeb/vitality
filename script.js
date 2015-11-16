// Add your javascript here
Parse.initialize("1TzcjXBFcvaFF3UURc6eKSvRspfVz1Yo7sY3pg8b", "MPljLULeWDIMk3i3GHSrXmS40PqiAc8UpNhPpYK3");

var commands = window.commands = {};
var userName = window.commands.userName = "Ray";

$(document).ready(function() {
    var pageTitle = window.commands.pageTitle = document.getElementsByTagName('body');

    if (pageTitle[0].id == "homePage") {
        console.log("This is Home Screen");

    } else if (pageTitle[0].id == "ratingsPage") {
        console.log("This is Ratings Page");

    } else if (pageTitle[0].id == "goalsPage") {
        console.log("This is Goals Page");

    } else if (pageTitle[0].id == "progressScreen") {
        console.log("This is Progress Screen");

    } else if (pageTitle[0].id == "trackerPage") {
        console.log("This is Tracker Page");

    } else if (pageTitle[0].id == "activityList") {
        console.log("This is Activity List Screen");

        var activities = window.commands.activities = new Parse.Query("ActivityList");
        var activityList = [];

        // Grab All Users Activities
        activities.equalTo("userName", userName);
        activities.find({
            success: function(res) {
                // console.log(res, "Amount of items", res.length);
                res.forEach(function(e, i, a) {
                    // console.log(["Each Item", e], "ID", e.id);
                    e.attributes.objectId = e.id;
                    activityList.push({data: e.attributes, id: e.id});
                });
            },
            error: function(res, err) {
                console.warn(res, err, "Error has occured");
            }
        }).then(function(res) {
            console.log("Here is Activities Avail:", activityList);

            createActivies(activityList);
        });
        
        
        function createActivies(al) {
        	// console.log(["Activity List", al], ["Type", typeof al], ["Is Array?", Array.isArray(al)]);

        	al.forEach(function(e,i,a){
        	   // console.log("ELEMENT", e);
        		var table = window.commands.table = document.getElementById('activitiesTable');
        		var nameList = ["Physical", "Emotional", "Social"];
        		var itemName = e.data.item;
        		var itemType = e.data.type;
        		var itemInstructions = e.data.instructions;
        		var objId = e.id;
        		
        		var tr = document.createElement('tr');
        		tr.className = "table-data";
        		tr.addEventListener("click", function(ev){
        		  //  console.log(["Clicked with Data", ev], ["Children", ev.target.parentNode.children]);
        		    var children = ev.target.parentNode.children;
        		    var o = { id: children[3].innerHTML };
        		    var url = "/activityDescription.html";
        		    
        		    console.log("Object to send", o);
        		    encodeAndSend(url, o);
        		    
        		}, false);

        		var td1 = document.createElement('td');
        		var td2 = document.createElement('td');
        		var td3 = document.createElement('td');
        		var hd = document.createElement('td');

        		var text1 = document.createTextNode(itemName);
        		var text2 = document.createTextNode(nameList[itemType -1]);
        		var text3 = document.createTextNode(itemInstructions);
        		var hidden = document.createTextNode(objId);

        		td1.appendChild(text1);
        		td2.appendChild(text2);
        		td3.appendChild(text3);
        		
        		hd.appendChild(hidden);
        		hd.className = "table-id";
        		hd.style.visibility = "hidden";
        		hd.style.display = "none";

        		tr.appendChild(td1);
        		tr.appendChild(td2);
        		tr.appendChild(td3);
        		
        		tr.appendChild(hd);
        		
        		table.tBodies[0].appendChild(tr);

        		// console.log(["Table", table], ["tr", tr], ["instructions", e.instructions]);
        		// console.log("This is Table tr To Add", tr);
        		

        	});
        }



    } else if (pageTitle[0].id == "activityDescription") {
        console.log("This is Activity Description Screen");
        
        var postData = window.location.search;
        var d = decodeData(postData);
        
        // console.log("Post Data", d);
        
        var activities = new Parse.Query("ActivityList");
        var activity = [];

        // Grab All Users Activities
        activities.equalTo("objectId", d.id);
        activities.find({
            success: function(res) {
                // console.log(res, "Amount of items", res.length);
                res.forEach(function(e, i, a) {
                    
                    e.attributes.objectId = e.id;
                    activity.push({data: e.attributes, id: e.id});
                    
                    console.log(["activity object", activity]);
                });
            },
            error: function(res, err) {
                console.warn(res, err, "Error has occured");
            }
        }).then(function(res) {
            console.log("Here is the data:", d);

            var query = new Parse.Query("ActivityList");
            var a = [];
            var obj = JSON.parse(d);
            
            console.log("Searching for ID", obj.id);
            
            query.get(obj.id, {
                success: function(res) {
                    // console.log(["Response from Activity Get", res]);
                    
                    activity.push({ data: res.attributes, id: res.id });
                },
                error: function(res, err) {
                    console.warn(res, err, "Error has occured");
                }
            }).then(function(res){
            	var nameList = ["Physical", "Emotional", "Social"];
                var data = res.attributes;
                var pTitle = document.getElementsByClassName('activity-title');
                var pType = document.getElementsByClassName('activity-type');
                var pInst = document.getElementsByClassName('activity-instructions');
                
                // console.log("Attribs", data);
                
                pTitle[0].innerHTML = data.item;
                pType[0].innerHTML = nameList[data.trackBy -1];
                pInst[0].innerHTML = data.instructions;
                
            });
        });

		var startBtn = document.getElementsByClassName('start-btn');
        startBtn[0].addEventListener("click", function(e){
        	console.log("Starting Activity", activity);

        	var url = "/activityTimer.html";
        	encodeAndSend(url, activity[0]);
        });
        
        

    }  else if (pageTitle[0].id == "activityTimer") {
        console.log("This is Activity Timer Screen");
        // var typeList = ["Physical", "Emotional", "Self-Image"];
        var postData = JSON.parse(decodeURIComponent(window.location.search).replace("?", ""));

        var timers = document.querySelectorAll("#timespan, .timer-controls");
    	var stopwatch = document.querySelectorAll("#stopwatch, .stopwatch-controls");
    	var isComplete = false;

    	window.commands.timers = {timespan: timers, stopwatch: stopwatch};

        (function unHideTimer() {
        	var d = JSON.parse(decodeData(window.location.search));

        	// console.log(["TIMERS AND CONTROLS", {timers: timers, stopwatch: stopwatch}] );

        	if (d.data.trackBy == 1) {
        		// console.log("Activity Type is " + d.data.trackBy);
        		
        		stopwatch[0].classList.remove("hidden");
        		stopwatch[1].classList.remove("hidden");
        		
        	} else if (d.data.trackBy == 2) {
        		// console.log("Activity Type is " + d.data.trackBy);

        		timers[0].classList.remove("hidden");
        		timers[1].classList.remove("hidden");

        	} else if (d.data.trackBy == 3) {
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
        		Array.prototype.forEach.call(lapTimes, function(e){
					// console.log(e.children);
					laps.push([e.children[0].innerHTML, e.children[1].innerHTML]);
				});
				data = {userName: postData.data.userName, item: postData.data.item, time: stopwatch.innerHTML, laps: laps};
        	} else if (lapTimes.length <= 0) {
        		console.log("No Laptimes, Must be countdown function");
        		data = {userName: postData.data.userName, item: postData.data.item};
        	} else {
        		console.log("No lap information");
        	}
        	// console.log("Finished Tracking", laps);

        	
        	var DB = Parse.Object.extend("TimeTracker");
        	var s = new DB();
        	
        	s.save(data, {
    			success: function(res) {
    				console.log(["Saved Data with response", res]);
    			},
    			error: function(res,err) {
    				console.warn(["Error Occured", err], ["Response", res]);
    			}
    		});

        	if (postData.data.trackBy == 1 || postData.data.trackBy == 2) {
        		url = "/trackerPage.html";
        		d = {message: "You've Completed "+ postData.data.item + " Activity!"};
        	} else {
        		url = "/ratingsPage.html";
        		d = {message: ""};
        	}

        	return encodeAndSend(url, d);
        }


        window.commands.saveActivity = saveActivity;


    } else if (pageTitle[0].id == "mealDescriptionPage") {
        console.log("This is Meal Description Page");

    } else if (pageTitle[0].id == "activityScreen") {
        console.log("This is Activity Screen");

    } else if (pageTitle[0].id == "rewardsScreen") {
        console.log("This is Rewards Page");

    } else if (pageTitle[0].id == "caloricGoalPage") {
        console.log("This is Caloric Goals Page");

    }
    
    function encodeAndSend(url, data) {
    	var h = window.location.pathname.split("/");
			h.shift(), h.pop(), host = h.join("/");
			
        var s = JSON.stringify(data);
        var u = url + "?";
        var encData = encodeURIComponent(s);

        if (!data || data == 'undefined' || data == null)
        	data = {message: "Data is null"};

        if (window.location.href[0] == "f") {
        	u = "file:///" + host + u;
        	console.log(["You're running on local host"], ["pathname", window.location.pathname], ["Sending to u", u]);

        	return window.location.replace(u+encData);
        }
        
        window.location.replace(u+encData);
        
    }
    
    function decodeData(data) {
        var d = data.replace("?", "");
        var o = decodeURIComponent(d);
        
        return o;
        
    }
    
    window.commands.sendData = encodeAndSend;
    window.commands.grabData = decodeData;
});

// POST DATA TO NEW URL
// function postAndRedirect(url, postData)
// {
//     var postFormStr = "<form method='POST' action='" + url + "'>\n";

//     for (var key in postData)
//     {
//         if (postData.hasOwnProperty(key))
//         {
//             postFormStr += "<input type='hidden' name='" + key + "' value='" + postData[key] + "'></input>";
//         }
//     }

//     postFormStr += "</form>";

//     var formElement = $(postFormStr);

//     $('body').append(formElement);
//     $(formElement).submit();
// }

// OR

// var myRedirect = function(redirectUrl, arg, value) {
//   var form = $('<form action="' + redirectUrl + '" method="post">' +
//   '<input type="hidden" name="'+ arg +'" value="' + value + '"></input>' + '</form>');
//   $('body').append(form);
//   $(form).submit();
// };

// SEND WITH 
// myRedirect("/yourRedirectingUrl", "arg", "argValue");

// OR
// //your variable
// var data = "brightcherry";

// //passing the variable into the window.location URL
// window.location.replace("/newpage/page.php?id=" + product_id);