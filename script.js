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
                    // console.log("Each Item", e);
                    activityList.push(e.attributes);
                })
            },
            error: function(res, err) {
                console.warn(res, err, "Error has occured");
            }
        }).then(function() {
            console.log("Here is Activities Avail:", activityList);

            createActivies(activityList);
        });


        function createActivies(al) {
        	// console.log(["Activity List", al], ["Type", typeof al], ["Is Array?", Array.isArray(al)]);

        	al.forEach(function(e,i,a){
        		var table = window.commands.table = document.getElementById('activitiesTable');
        		var itemName = e.item;
        		var itemType = e.type;
        		var itemInstructions = e.instructions;
        		
        		var tr = document.createElement('tr');

        		var td1 = document.createElement('td');
        		var td2 = document.createElement('td');
        		var td3 = document.createElement('td');

        		var text1 = document.createTextNode(itemName);
        		var text2 = document.createTextNode(itemType);
        		var text3 = document.createTextNode(itemInstructions);

        		td1.appendChild(text1);
        		td2.appendChild(text2);
        		td3.appendChild(text3);

        		tr.appendChild(td1);
        		tr.appendChild(td2);
        		tr.appendChild(td3);
        		
        		table.tBodies[0].appendChild(tr);

        		// console.log(["Table", table], ["tr", tr], ["instructions", e.instructions]);
        		// console.log("This is Table tr To Add", tr);
        		

        	});
        }



    } else if (pageTitle[0].id == "activityScreen") {
        console.log("This is Activity Screen");

    } else if (pageTitle[0].id == "activityScreen") {
        console.log("This is Activity Screen");

    } else if (pageTitle[0].id == "rewardsScreen") {
        console.log("This is Rewards Page");

    } else if (pageTitle[0].id == "caloricGoalPage") {
        console.log("This is Caloric Goals Page");

    }
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