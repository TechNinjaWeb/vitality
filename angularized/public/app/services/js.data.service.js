window.angular.module('vitalityApp').service('JSData', [function(){
   var DB = {};
   DB.store = new window.JSData.DS();
   DB.store.registerAdapter('localforage', new window.DSLocalForageAdapter(), { default: true });
   DB.list = {
        ActivityList: DB.store.defineResource('ActivityList'),
        Goals: DB.store.defineResource('Goals'),
        Meals: DB.store.defineResource('Meals'),
        Measurements: DB.store.defineResource('Measurements'),
        Ratings: DB.store.defineResource('Ratings'),
        RewardsList: DB.store.defineResource('RewardsList'),
        TimeTracker: DB.store.defineResource('TimeTracker'),
        TestClass: DB.store.defineResource('TestClass')
    };
    
    return DB;
}]);
