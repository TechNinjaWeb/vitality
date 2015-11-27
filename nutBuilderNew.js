function searchNutritionSiteFor(item) {
    window.console.warn('Searching for item - ' + item);
    var args = Array.prototype.slice.call(arguments);
    !args[2] ? args[2] = "1" : args[2] = args[2];

    var xhr;
    var url;
    // IF URL IS FOOD ITEM
    // ELSE URL IS SEARCH ITEM
    !args[1] ? url = "http://www.nutritionvalue.org/search.php?food_query=" + item.replace(" ", "+") + "&page=" + args[2] : url = item;

    // console.log("URL", url);
    // IEXPLORER XHR OBJECT
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new window.XMLHttpRequest();
    } else { // code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.xhr");
    }
    
    return new Promise(function(resolve, reject) {
        // IF SUCCESS RETURN DATA
        xhr.onreadystatechange = function() {
            // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            // xhr.setRequestHeader('Origin', 'http://vitality-techninja.c9users.io/');
        
            if (xhr.readyState == 4) {
                // console.log("Arguments", args);
                // console.log("ARGUMENTS", arguments, "ARGS", args);
                var results = !args[1] ? getResultsList() : getNutritionData();

                function getNutritionData() {
                    // GRAB NUTRITION DATA
                    // Dummy Element
                    var site = document.createElement('html');
                    site.innerHTML = xhr.responseText;
                    // console.log("XHR RESPONSE", xhr.responseText);
                    // http://nutritiondata.self.com/facts/fruits-and-fruit-juices/1843/2
                    var nutritionInformation = Array.prototype.slice.call(site.querySelectorAll('tbody'));
                        nutritionInformation.splice(0,3);
                    
                    // console.log("SITE ", site);
                    
                    var servingSize = window.commands.servingSize = site.querySelectorAll('tbody');
                    var table = {};
                    var newData = window.commands.data = [];
                    // console.log("SERVING SIZE", !!servingSize, servingSize);
                    table.servingSize = !!servingSize ? servingSize.innerHTML : "None Given";

                    // console.log("TABLE", table, "NUTRITION INFORMATION", nutritionInformation);

                    Array.prototype.forEach.call(nutritionInformation, function(e) {
                        var table = Array(e);
                        var data = document.createElement('tbody')
                        data.innerHTML = table[0].innerHTML, data = Array(data);

                        newData.push(data);

                        function getCategoryName(el) {

                            return el;
                        }
                        return data;
                    });
                    // REMOVE FIRST TABLE DATA = NO GOOD
                    newData.shift();
                    // console.log("NUTRITION TABLE", window.commands.data, "TABLE", table);
                    var listObject = Array.prototype.slice.call(newData).reduce(function(p,c,i,a){var temp = buildNutritionList(c); 
                        // console.log("type", typeof temp, "KEY", temp.key, !temp.key, "DATA", temp); 
                        !!temp.key ? p[temp.key] = temp[temp.key] : null; return p;
                    }, {});
                    // console.log("List Object", listObject);
					return resolve(listObject);
                }

                function getResultsList() {
                    // Dummy Element
                    var site = document.createElement('html');
                    site.innerHTML = xhr.responseText;
                    var table = Array.prototype.slice.call(site.querySelectorAll('tr.results'));
                        table.shift(), table.pop();
                    var pagination = site.querySelectorAll('th.left.results');
                    var maxPages = pagination[0].children[pagination[0].children.length -1];

                    var results = [];

                    console.log("RUNNING GETRESULTSLIST FUNCTION", table, "PAGINATION", pagination);
                    table.forEach(function(e){
                        results.push({
                            name: e.children[0].innerText,
                            href: "http://www.nutritionvalue.org/" + e.children[0].children[0].pathname,
                            maxPages: maxPages.innerHTML
                        });
                    });
                    
                    // console.log("RESULTS?", Array.isArray(results), "What are they?", results);
                    Array.isArray(results) == true 
                        ? results.length <= 0 
                            ? AlertSystem.show('No Results Found', 'alert-danger')
                            : null
                        : null;
                    return resolve(results);
                }
                return results;
            }
        };

        xhr.open('GET', 'http://dev.alphanerdsmedia.com/techninja/jeff/request2.php?' +serialize({data: encodeURIComponent(url)}) , true);

        xhr.send();
    });

}

window.commands.searchNutritionSiteFor = searchNutritionSiteFor;

// Array.prototype.slice.call(commands.data).reduce(function(p,c,i,a){var temp = ken(c); console.log("type", typeof temp, "KEY", temp.key, !temp.key); !!temp.key ? p[temp.key] = temp : null; return p;}, {});
// Array.prototype.slice.call(commands.data).forEach(function(e){ken(e)});
var buildNutritionList = function(data) {
    var elems = [];
    var results = {};
    var el = document.createElement('div');
        el.innerHTML = data[0].innerHTML;
    
    // console.log(["DOESN'T HAVE CELLS", Array(el), typeof el, el.childNodes, el.childNodes.length], ["DATA IN", data]);
    // console.log("LOOPING EL", el.childNodes);
    Array.prototype.slice.call(el.childNodes).forEach(function(e) {
        var n = !!e.nodeValue ? e.nodeValue : null;
        var t = !!e.innerHTML ? e.innerHTML : null;
        var item = !!n ? n : !!t ? t : "";
        item = item.replace("&nbsp;", " "), item = item.replace(/\n|\r\n|\r/g, ' '), item = item.trim();
        // console.log("Items Null?", item.length <= 0 ? true : false, "item", item.length > 0 ? Array(item) : "No Value");
        if (item != null) elems.push(item);

    });

    // console.log("BUILDING TABLE FOR EL", el);
    return (function buildTable(el, d) {
        el = el.filter(function(n){ return n.length > 0 });
        // console.log(["USING DATA TO BUILD ELEMS", el, Array.isArray(el)], ["D", d]);
        var nutrientList = ["Nutrition Facts", "Vitamins", "Minerals", "Proteins and Aminoacids", "Carbohydrates", "Fats and Fatty Acids", "Sterols", "Other"];
        
        return (function returnFullTable(e) {
            // console.log("Building Table To Return");
            var o = {};
            nutrientList.forEach(function(nutrient){
                var nutItem = e[0].indexOf(nutrient) != -1 ? nutrient : null;
                var newList = Array.prototype.slice.call(e);
                var prop;
                // if (nutItem != null) console.log(["WORKING ON " + nutItem], newList.length);
                if (nutItem == nutrientList[0]) {
                    // console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
                    var servingSize = newList.splice(newList.length - newList.length, 1);
                        servingSize[0] = servingSize[0].replace("Nutrition Facts  Serving Size", "");
                    var disclaimer = newList.splice(newList.length -1, 1);
                    var vitamins = newList.splice(newList.length -2, 2);
                    // console.log("Serving Size", servingSize, "DISCLAIMER", disclaimer, "VITAMINS", vitamins, newList.length, "SERVING SIZE", servingSize[0]);
                    var facts = [["Calories", 1], ["Total Fat", 2], ["Saturated", 2, true], ["Cholesterol", 2], ["Sodium", 2], ["Total Carbohydrate", 2], 
                        ["Fiber", 2, true], ["Sugar", 0], ["Protein", 2]];

                    // Remove Amount Per Serving
                    newList.shift();
                    // o[nutItem].servingSize = servingSize;
                    o[nutItem] = results[nutItem] = newList.reduce(function(pr, cr, idx, arr){
                        // if (cr.search("% Daily Value") >= 0) console.log("THIS IS DAILY VALUE", idx);
                        // console.log("Prev", pr, "Curr", cr, "Idx", idx, "Arr", arr);
                        facts.forEach(function(e){

                            if (cr.search(e[0]) >= 0) {
                                // console.log(["FACT", e[0], cr.search(e[0])], ["Idx", idx], ["Items to grab", e[1], e[2]]); 
                                return pr[e[0]] = e[1] <= 0 ? {dv: null, amount: arr[idx].replace(e[0], "")} : {dv: e[2] ? arr[idx + 1] : arr[idx + 2], amount: e[2] ? arr[idx].replace(e[0], "").replace("Dietary", "").replace("Fat", "").trim() : arr[idx+1]};
                            }
                        });
                        return pr;
                    }, {});
                    
                    o[nutItem].servingSize = {amount: servingSize[0].trim(), dv: null};
                    for(prop in o) o.key = prop;
                    
                    // console.log("LIST", list, "e", e);
                }
                if (nutItem == nutrientList[1]) {
                    // console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
                    // Remove Amount Per Serving
                    newList.shift();
                    o[nutItem] = newList.reduce(function(p,c,i,a){
                        // console.log(["Is Divisible By 2?",i % 2 == 0], ["P", p, "C", c]);
                        var label = c.replace("&nbsp;", "").replace(",", "");
                        if (i % 2 == 0) p[label] = a[i+1];
                        return p;
                    }, {});
                    
                    for(prop in o) o.key = prop;
                   
                }
                if (nutItem == nutrientList[2] || nutItem == nutrientList[3]
                    || nutItem == nutrientList[4] || nutItem == nutrientList[5]
                    || nutItem == nutrientList[6]) {
                    // console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
                    // Remove Amount Per Serving
                    newList.shift();
                    o[nutItem] = newList.reduce(function(p,c,i,a){
                        // console.log(["Is Divisible By 2?",i % 2 == 0], ["P", p, "C", c]);
                        var label = c.replace("&nbsp;", "").replace(",", "");
                        var data = a[i+1];
                        if (i % 2 == 0 && i != i.length-1) {data = a[i+1]; p[label] = {units: data[0] + "mg", dv: data[1] + "%"};}
                        return p;
                    }, {});
                 
                    for(prop in o) o.key = prop;
                }
                if (nutItem == nutrientList[7]) {
                    // console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
                    // Remove Amount Per Serving
                    newList.shift();
                    o[nutItem] = newList.reduce(function(p,c,i,a){
                        // console.log(["Is Divisible By 2?",i % 2 == 0], ["P", p, "C", c]);
                        var label = c.replace("&nbsp;", "").replace(",", "");
                        if (i % 2 == 0) p[label] = a[i+1];
                        return p;
                    }, {});
                    
                    for(prop in o) o.key = prop;
                }
            });
            // console.log("FINAL RETURN", o);
            return o;
        }(el));
    }(elems, {}));
};


function serialize(obj) {
   var str = [];
   for(var p in obj){
       if (obj.hasOwnProperty(p)) {
           str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
       }
   }
   return str.join("&");
}

window.commands.serialize = serialize;