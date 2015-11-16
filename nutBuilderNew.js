function searchNutritionSiteFor(item) {
    window.console.warn('Searching for item - ' + item);
    var args = Array.prototype.slice.call(arguments);
    !args[2] ? args[2] = "1" : args[2] = args[2];

    var xhr;
    var url;
    // IF URL IS FOOD ITEM
    // ELSE URL IS SEARCH ITEM
    !args[1] ? url = "http://www.nutritionvalue.org/search.php?food_query=" + item.replace(" ", "+") + "&page=" + args[2] : url = item;

    console.log("URL", url);
    // IEXPLORER XHR OBJECT
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new window.XMLHttpRequest();
    } else { // code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.xhr");
    }
    return new Promise(function(resolve, reject) {
        // IF SUCCESS RETURN DATA
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // console.log("Arguments", args);
                console.log("ARGUMENTS", arguments, "ARGS", args);
                results = !args[1] ? getResultsList() : getNutritionData();

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
                    console.log("NUTRITION TABLE", window.commands.data, "TABLE", table);
					return resolve(table);
                }

                function getResultsList() {
                    // Dummy Element
                    var site = document.createElement('html');
                    site.innerHTML = xhr.responseText;
                    var table = Array.prototype.slice.call(site.querySelectorAll('tr.results'));
                        table.shift(), table.pop();
                    var pagination = site.querySelectorAll('th.left.results');
                    var maxPages = pagination[0].children[pagination[0].children.length -1].innerHTML;

                    var results = [];

                    console.log("RUNNING GETRESULTSLIST FUNCTION", table, "PAGINATION", pagination);
                    table.forEach(function(e){
                        results.push({
                            name: e.children[0].innerText,
                            href: "http://www.nutritionvalue.org/" + e.children[0].children[0].pathname,
                            maxPages: maxPages
                        });
                    });
                    return resolve(results);
                }
                return results;
            }
        }

        xhr.open('GET', url, true);

        xhr.send();
    })

}



// // Array.prototype.slice.call(commands.data).forEach(function(e){ken(e)});
// var ken = function(data) {
//     var elems = [];
//     var results = {};
//     var el = document.createElement('div');
//         el.innerHTML = data[0].innerHTML;
    
//     // console.log(["DOESN'T HAVE CELLS", Array(el), typeof el, el.childNodes, el.childNodes.length], ["DATA IN", data]);
//     // console.log("LOOPING EL", el.childNodes);
//     Array.prototype.slice.call(el.childNodes).forEach(function(e) {
//         var n = !!e.nodeValue ? e.nodeValue : null;
//         var t = !!e.innerHTML ? e.innerHTML : null;
//         var item = !!n ? n : !!t ? t : "";
//         item = item.replace("&nbsp;", " "), item = item.replace(/\n|\r\n|\r/g, ' '), item = item.trim();
//         // console.log("Items Null?", item.length <= 0 ? true : false, "item", item.length > 0 ? Array(item) : "No Value");
//         if (item != null) elems.push(item);

//     });

//     // console.log("BUILDING TABLE FOR EL", el);
//     return (function buildTable(el, d) {
//         el = el.filter(function(n){ return n.length > 0 });
//         // console.log(["USING DATA TO BUILD ELEMS", el, Array.isArray(el)], ["D", d]);
//         var nutrientList = ["Nutrition Facts", "Vitamins", "Minerals", "Proteins and Aminoacids", "Carbohydrates", "Fats and Fatty Acids", "Sterols", "Other"];
        
//         return (function returnFullTable(e) {
//             // console.log("Building Table To Return");
//             var o = {};
//             nutrientList.forEach(function(nutrient){
//                 var nutItem = e[0].indexOf(nutrient) != -1 ? nutrient : null;
//                 var newList = Array.prototype.slice.call(e);
//                 // if (nutItem != null) console.log(["WORKING ON " + nutItem], newList.length);
//                 if (nutItem == nutrientList[0]) {console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
//                     var servingSize = newList.splice(newList.length - newList.length, 1);
//                         servingSize[0] = servingSize[0].replace("Nutrition Facts  Serving Size", "");
//                     var disclaimer = newList.splice(newList.length -1, 1);
//                     var vitamins = newList.splice(newList.length -2, 2);
//                     // console.log("Serving Size", servingSize, "DISCLAIMER", disclaimer, "VITAMINS", vitamins, newList.length, "SERVING SIZE", servingSize[0]);
//                     var facts = [["Calories", 1], ["Total Fat", 2], ["Saturated", 2, true], ["Cholesterol", 2], ["Sodium", 2], ["Total Carbohydrate", 2], 
//                         ["Fiber", 2, true], ["Sugar", 0], ["Protein", 2]];

//                     // Remove Amount Per Serving
//                     newList.shift();

//                     return o[nutItem] = results[nutItem] = newList.reduce(function(pr, cr, idx, arr){
//                         // if (cr.search("% Daily Value") >= 0) console.log("THIS IS DAILY VALUE", idx);
//                         // console.log("Prev", pr, "Curr", cr, "Idx", idx, "Arr", arr);
//                         facts.forEach(function(e){

//                             if (cr.search(e[0]) >= 0) {
//                                 // console.log(["FACT", e[0], cr.search(e[0])], ["Idx", idx], ["Items to grab", e[1], e[2]]); 
//                                 return pr[e[0]] = e[1] <= 0 ? {dv: null, amount: arr[idx].replace(e[0], "")} : {dv: e[2] ? arr[idx + 1] : arr[idx + 2], amount: e[2] ? arr[idx].replace(e[0], "").replace("Dietary", "").replace("Fat", "").trim() : arr[idx+1]}
//                             }
//                         });
//                         return pr;
//                     }, {})
                    
//                     // console.log("LIST", list, "e", e);
//                 };
//                 if (nutItem == nutrientList[1]) {
//                     console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
//                     // Remove Amount Per Serving
//                     newList.shift();
//                 };
//                 if (nutItem == nutrientList[2]) {
//                     // console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
//                     // Remove Amount Per Serving
//                     newList.shift();
//                 };
//                 if (nutItem == nutrientList[3]) {
//                     // console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
//                     // Remove Amount Per Serving
//                     newList.shift();
//                 };
//                 if (nutItem == nutrientList[4]) {
//                     // console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
//                     // Remove Amount Per Serving
//                     newList.shift();
//                 };
//                 if (nutItem == nutrientList[5]) {
//                     // console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
//                     // Remove Amount Per Serving
//                     newList.shift();
//                 };
//                 if (nutItem == nutrientList[6]) {
//                     // console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
//                     // Remove Amount Per Serving
//                     newList.shift();
//                 };
//                 if (nutItem == nutrientList[7]) {
//                     // console.log(["WORKING ON " + nutItem], ["ELEMENTS TO PARSE", newList]);
//                     // Remove Amount Per Serving
//                     newList.shift();
//                 };
//             });
//             console.log("FINAL RETURN", o);
//             return o;
//         }(el))
//     }(elems, {}));

//     return results;
// }
