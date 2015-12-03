window.angular.module('vitalityApp').service('JSData', ['$rootScope', function($rootScope){
    // Define Return Object
    var store = {};
	// Create DB Table List
	store.list = {};
	store.list = {
        ActivityList: $rootScope.JSData.defineResource('ActivityList'),
        Goals: $rootScope.JSData.defineResource('Goals'),
        Meals: $rootScope.JSData.defineResource('Meals'),
        Measurements: $rootScope.JSData.defineResource('Measurements'),
        Ratings: $rootScope.JSData.defineResource('Ratings'),
        RewardsList: $rootScope.JSData.defineResource('RewardsList'),
        TimeTracker: $rootScope.JSData.defineResource('TimeTracker'),
        TestClass: $rootScope.JSData.defineResource('TestClass')
    };

    store.getFromList = function(listName, query) {
            // console.warn("Got Request To Get List", listName, query, store);
            return store.list[listName][query.type](query.conditions).then(function(res){
                // console.log("Response From GetList", res);
                return res;
            });
    };
    
    store.save = function(listName, query) {
            // console.warn("Got Request To Get List", listName, query, store);
            return store.list[listName][query.type](query.conditions).then(function(res){
                // console.log("Response From GetList", res);
                return res;
            });
    };
    
    return store;
}]);
