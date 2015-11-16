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
                    var nutritionInformation = site.querySelectorAll('.clearer.m-t13')
                    console.log("SITE ", $(site));
                    var servingSize = window.commands.servingSize = site.querySelectorAll('#servingsize3');
                    var table = {};
                    console.log("SERVING SIZE", !!servingSize, servingSize);
                    table.servingSize = !!servingSize ? servingSize.innerHTML : "None Given";

                    console.log("TABLE", table, "NUTRITION INFORMATION", nutritionInformation);

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
                            console.log("CHILDREN TO BUILDNUTLIST 1.children", a);
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
                                	// console.log("Parse Names of Item", item);
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
                        return table;
                    });
					return resolve(table);
                }

                function getResultsList() {
                    // Dummy Element
                    var site = document.createElement('html');
                    site.innerHTML = xhr.responseText;

                    var pagTable = Array.prototype.slice.call(site.getElementsByClassName('pagination'));
                    var pagTableLen = pagTable[pagTable.length - 1].getElementsByTagName('a').length;
                    var maxPages = pagTableLen > 0 ? args[2] >= 1 ? parseInt(pagTable[pagTable.length - 1].getElementsByTagName('a')[pagTableLen - 2].innerHTML) : pagTable[pagTable.length - 1].getElementsByTagName('a')[pagTableLen - 3].innerHTML : 0;

                    console.log("PagTable A Links", pagTable[pagTable.length - 1].getElementsByTagName('a'));

                    var infoTable = site.getElementsByTagName('tbody');
                    var res = maxPages <= 1 ? buildResultsObject(infoTable[infoTable.length - 1].children) : buildResultsObject(infoTable[infoTable.length - 2].children);

                    console.log(["Max Pagination", maxPages], ["Pag Table", pagTable], ["Paglen", pagTableLen], ["Response", res]);

                    function buildResultsObject(table) {
                        var l = [];
                        console.log("Heres the table I'm bulding for", table);
                        for (var i = 1; i < table.length; i++) {
                            // console.warn(["Iterating Res -" +i], ["RESPONSE -" + i, table[i]] ,["ENTIRE RESPONSE", table]);
                            var itemName = table[i].children[0].getElementsByClassName('list')[0].innerHTML;
                            var href = "http://nutritiondata.self.com" + table[i].children[0].getElementsByClassName('list')[0].pathname;
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
                    return resolve(res);
                }
                return results;
            }
        }

        xhr.open('GET', url, true);

        xhr.send();
    })

}