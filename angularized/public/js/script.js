// Add your javascript here
Parse.initialize("1TzcjXBFcvaFF3UURc6eKSvRspfVz1Yo7sY3pg8b", "MPljLULeWDIMk3i3GHSrXmS40PqiAc8UpNhPpYK3");

var commands = window.commands = {};

window.onload = function() {
    var pageTitle = window.commands.pageTitle = document.getElementsByTagName('body');
    
};

// PRIMARY APP FUNCTIONS
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

commands.sendData = encodeAndSend;
commands.grabData = decodeData;

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

commands.queryParse = queryParse;

Date.prototype.daysBetween = function( date1, date2 ) {
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