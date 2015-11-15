/* xhrREQUEST SETUP TO SEND DATA TO PARSE
	ITEM = "SEARCH TERM" || "FOOD URL"
	IF !!FOOD URL => arguments[1] = BOOL (true)
	ARGUMENT #2 = PAGE NUMBER (1),(2),(3)
*/
function searchNutritionSiteFor(item) {
    window.console.warn('Searching for item - ' + item);
    var args = Array.prototype.slice.call(arguments);
    	!args[2] ? args[2] = "1" : args[2] = args[2];

    var xhr;
    var url;
    // IF URL IS FOOD ITEM
    // ELSE URL IS SEARCH ITEM
    !args[1] ? url = "http://nutritiondata.self.com/foods-" + encodeURIComponent(item) + "000000000000000000000"+ "-"+args[2]+".html" : url = item;

    // IEXPLORER XHR OBJECT
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xhr = new window.XMLHttpRequest();
    } else { // code for IE6, IE5
        xhr = new ActiveXObject("Microsoft.xhr");
    }
    // IF SUCCESS RETURN DATA
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
        	// console.log("Arguments", args);
            var results = !arguments[1] ? getResultsList() : getNutritionData();

            function getResultsList() {
                // Dummy Element
                var site = document.createElement('html');
                	site.innerHTML = xhr.responseText;
                var pagTable = Array.prototype.slice.call(site.getElementsByClassName('pagination'));
                var pagTableLen = pagTable[pagTable.length -1].getElementsByTagName('a').length;
                var maxPages = pagTable[pagTable.length -1].getElementsByTagName('a').length > 0
                    ? parseInt(pagTable[pagTable.length -1].getElementsByTagName('a')[pagTableLen - pagTableLen].innerHTML)
                    : 0



                console.log(["Max Pagination", maxPages]);
                
                var res = maxPages <= 1 
                ? buildResultsObject(site.getElementsByTagName('tbody')[site.getElementsByTagName('tbody').length - 1].children)
                : buildResultsObject(site.getElementsByTagName('tbody')[site.getElementsByTagName('tbody').length - 2].children);

                console.log("Max Pages", maxPages);

                function buildResultsObject(table) {
                    var l = [];

                    // console.log("Interacting on Table 1", table, "Other Tables", site.getElementsByTagName('tbody'))

                    for (var i = 1; i < table.length; i++) {
                        // console.warn(["Iterating Res -" +i], ["RESPONSE -" + i, table[i]] ,["ENTIRE RESPONSE", table]);
                        var itemName = table[i].children[0].getElementsByClassName('list')[0].innerHTML;
                        var href = table[i].children[0].getElementsByClassName('list')[0].href;
                        var data = table[i];
                        var pages = table[i];

                        l.push({
                            name: itemName,
                            href: href,
                            maxPages: maxPages
                        });
                    }

                    return l;
                }
                return res;
            }

            console.log("Results", results);
            return results;
        }
    }

    xhr.open('GET', url, true);
    // console.log(["ITEM IS FOOD?", !!arguments[1]],["ITEM", item],
    // 	[]);

    // xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send();

}

function getNutritionData() {
    // GRAB NUTRITION DATA
    // http://nutritiondata.self.com/facts/fruits-and-fruit-juices/1843/2
    var nutritionInformation = document.querySelectorAll('.clearer.m-t13')
    var servingSize = document.getElementById('servingsize3');
    var table = {};
    table.servingSize = servingSize.innerHTML;

    Array.prototype.forEach.call(nutritionInformation, function(e) {
        var cat = e.children[0].children[0].innerHTML;
        var data = e.children[0];
        // Build Object Data
        table[cat] = returnNutList(data);
        // console.log("Keys", returnNutList(data))

        // Helper Function
        function returnNutList(a) {
            // 0 is category
            // 1 is data
            var d = a.children[1].children;
            // Get Nutrition List
            if (d[0].className == "nutList")
                return {
                    cat: a.children[0].innerHTML,
                    nutList: buildNutList(d[0].children)
                };
            if (d[0].className != "nutList")
                return {
                    cat: a.children[0].innerHTML,
                    nutList: buildNutList(d)
                };

            function buildNutList(list) {
                var o = {
                    headings: [],
                    items: []
                };
                // console.log("List to build", list.length, "ORIG LIST", list);

                for (var i = 0; i < list.length; i++) {
                    // console.log(["This is row " + i],
                    // 	["Data", list[i]]);
                    if (list[i].className == "clearer")
                    // console.log("This is a value row #" + i, list[i]);
                        o.items.push(parseItemNames(list[i].children));
                    if (list[i].className != "clearer")
                    // console.log("This is a headings row #" + i, list[i]);
                        o.headings.push(list[i].innerHTML);
                }

                function parseItemNames(item) {
                    return {
                        name: item[0].innerText,
                        value: item[1].innerText,
                        unit: item[2].innerText,
                        dv: item[3].innerText
                    };
                }
                // console.log("OBJECT TO BUILD", o)
                return o;
            }
        }
    });

    // console.log("Table", table);
}