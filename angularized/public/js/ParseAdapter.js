'use strict';

function ParseAdapter() {
    var localStorageObject = {};
    // Check For Parse
    if (!window.Parse) throw new Error("Parse Not Loaded. Please include parse api");
    // Default Add Method
    function addLocalDataTo(definedResourceClassObject) {
        if (definedResourceClassObject.name !== localStorageObject) {
            localStorageObject[definedResourceClassObject.name] = {};
            localStorageObject[definedResourceClassObject.name].randomizedId = 1;
            localStorageObject[definedResourceClassObject.name].index = {};
            localStorageObject[definedResourceClassObject.name].collection = [];
        }
    }
    // Custom Return From Adapter
    ParseAdapter.prototype.returnAll = function() {
        return {
            thisObject: this,
            localStorageObject: localStorageObject
        };
    };
    
    // Custom Return From Adapter
    ParseAdapter.prototype.returnSaveObject = function(definedResourceClassObject, res) {
        // Defined Save Properties
        let objectToSyncInMemory = {};
        let id = res.id;
        let attrs = res.attributes;
        // Conserve Reference To Saved Object
        // Add New ObjectID as ID
        objectToSyncInMemory[definedResourceClassObject.idAttribute] = id;
        // Save New Properties to objectToSyncInMemory
        for (let property in attrs) {
            objectToSyncInMemory[property] = attrs[property];
        }
        // Save Local Object In Storage by ID
        localStorageObject[definedResourceClassObject.name].index[objectToSyncInMemory.id] = objectToSyncInMemory;
        // Save Local Object In Collection
        localStorageObject[definedResourceClassObject.name].collection.push(objectToSyncInMemory);
        // Return Object To Client or Function
        return objectToSyncInMemory;
    };
    
    // Default Create Method
    this.create = function(definedResourceClassObject, objectToSave, options) {
        addLocalDataTo(definedResourceClassObject);
        if (objectToSave[definedResourceClassObject.idAttribute] && localStorageObject[definedResourceClassObject.name].index[objectToSave[definedResourceClassObject.idAttribute]] && options.upsert) {
            return this.update(definedResourceClassObject, objectToSave[definedResourceClassObject.idAttribute], objectToSave, options);
        } else {
            // Save Reference to Adapter
            var that = this;
            // Create Parse Object
            let SaveToParse = window.Parse.Object.extend(definedResourceClassObject.name);
            let Table = new SaveToParse();
            // Return A Promise To Client
            return new Promise(function(resolve, reject){
                return Table.save(objectToSave, {
                    success: function(res) {
                        // Create Save Object
                        let savedObject = that.returnSaveObject(definedResourceClassObject, res);
                        resolve(savedObject);
                    },
                    error: function(res, err) {
                        let error = {message: 'Parse Failed To Save Object', response: res, error: err, objectToSave: objectToSave};
                        reject(error);
                    }
                });
            });
        }
    };
    // Default Find Method
    this.find = function(definedResourceClassObject, objectId, options) {
        addLocalDataTo(definedResourceClassObject);
        // Save Reference to Adapter
        var that = this;
        let localStore = localStorageObject;
        return new Promise(function(resolve, reject) {
            if (localStorageObject[definedResourceClassObject.name].index[objectId]) {
                console.info(["LocalStorageObject", localStorageObject], ["Options", options]);
                resolve(localStorageObject[definedResourceClassObject.name].index[objectId]);
            } else {
                // Create Parse Query
                let ParseClass = new window.Parse.Query(definedResourceClassObject.name);
                // Get ObjectID
                return ParseClass.get(objectId, {
                    success: function(res) {
                        // Create Save Object
                        that.returnSaveObject(definedResourceClassObject, res);
                        // Return Resolved Save Object to Client
                        resolve(localStore[definedResourceClassObject.name].index[objectId]);
                    },
                    error: function(res,err) {
                        let error = {message: 'Parse Failed To Save Object', response: res, error: err, id: objectId};
                        reject(error);
                    }
                });
            }
        });
    };

    this.findAll = function(definedResourceClassObject, params, options) {
        addLocalDataTo(definedResourceClassObject);
        // Save Reference to Adapter
        var that = this;
        let localStore = localStorageObject;
        return new Promise(function(resolve, reject) {
            if (localStorageObject[definedResourceClassObject.name].collection.length > 0) {
                // pass collection, params, options and classname to default filter, then
                resolve(window.angularData.defaults.defaultFilter(localStorageObject[definedResourceClassObject.name].collection, definedResourceClassObject.name, params, options));
            } else {
                // Make New Parse Query, then
                let ParseClass = new window.Parse.Query(definedResourceClassObject.name);
                // set basic existent property
                ParseClass.exists('objectId');
                // Iterate over conditions
                params.conditions = Array.isArray(params.conditions) ?  params.conditions : [{}];
                params.conditions.forEach(function(condition){
                    if(!!condition.type) ParseClass[condition.type](condition.col, condition.val);
                });
                ParseClass.find({
                    success: function(res) {
                // Save Results Array to Collection, then
                        res.forEach(function(item){
                            // Add Item To Local Storage Tree
                            that.returnSaveObject(definedResourceClassObject, item);
                        });
                        // pass collection, params, options and classname to default filter, then
                        resolve(window.angularData.defaults.defaultFilter(localStorageObject[definedResourceClassObject.name].collection, definedResourceClassObject.name, params, options));
                    },
                    error: function(res,err) {
                        let error = {message: 'Parse Failed To Save Object', response: res, error: err, params: params};
                        reject(error);
                    }
                });
                // console.info('localStorage', localStore);
            }
        });
    };

    this.update = function(definedResourceClassObject, objectId, objectToSave, options) {
        addLocalDataTo(definedResourceClassObject);
        return this.find(definedResourceClassObject, objectId, options).then(function(item) {
            window.JSData.DSUtils.deepMixIn(item, objectToSave);
            return item;
        }).then(function(item){
            // Create Parse Query
            let ParseClass = new window.Parse.Query(definedResourceClassObject.name);
            // Get ObjectID
            return new Promise(function(resolve, reject){
                ParseClass.get(objectId, {
                    success: function(res) {
                        console.log(res);
                        for(let property in objectToSave) {
                            res.set(property, objectToSave[property]);
                        }
                        res.save({
                            success: function(res) {
                                return resolve(res);
                            },
                            error: function(res,err) {
                                let error = {message: 'Parse Failed To Save Object', response: res, error: err, id: objectId};
                                return reject(error);
                            }
                        });
                        return res;
                    },
                    error: function(res,err) {
                        let error = {message: 'Parse Failed To Save Object', response: res, error: err, id: objectId};
                        console.warn(res,err);
                        return error;
                    }
                });
            });
        });
    };

    this.updateAll = function(definedResourceClassObject, params, objectToSave, options) {
        addLocalDataTo(definedResourceClassObject);
        var that = this;
        return this.findAll(definedResourceClassObject, params, options).then(function(items) {
            console.log("Items To Update", items);
            var tasks = [];
            window.JSData.DSUtils.forEach(items, function(item) {
                tasks.push(that.update(definedResourceClassObject, item[definedResourceClassObject.idAttribute], objectToSave, options));
            });
            return Promise.all(tasks);
        });
    };

    this.destroy = function(definedResourceClassObject, objectId, options) {
        addLocalDataTo(definedResourceClassObject);
        // Save Reference to Adapter
        var that = this;
        let localStore = localStorageObject;
        // Make New Parse Query
        let ParseClass = new Parse.Query(definedResourceClassObject.name);
        return this.find(definedResourceClassObject, objectId, options).then(function(item) {
            window.JSData.DSUtils.remove(localStore[definedResourceClassObject.name].collection, item);
            delete localStore[definedResourceClassObject.name].index[objectId];
            return objectId;
        }).then(function(id){
            ParseClass.get(id, {
                success: function(res) {
                    res.destroy({
                        success: function(res) {
                            return res;
                        },
                        error: function(res,err) {
                            let error = {message: 'Parse Failed To Save Object', response: res, error: err, id: objectId};
                            return error;
                        }
                    });
                },
                error: function(res,err) {
                    console.warn(res,err);
                }
            });
            return id;
        });
    };

    this.destroyAll = function(definedResourceClassObject, params, options) {
        addLocalDataTo(definedResourceClassObject);
        var _this = this;
        let localStore = localStorageObject;
        return this.findAll(definedResourceClassObject, params, options).then(function(items) {
            console.log("What are the items?", items);
            var tasks = [];
            window.JSData.DSUtils.forEach(items, function(item) {
                console.log("Adding Destroy to Task List", item);
                tasks.push(_this.destroy(definedResourceClassObject, item[definedResourceClassObject.idAttribute], options));
            });
            return Promise.all(tasks);
        });
    };
    
    ParseAdapter.prototype.special = function(definedResourceClassObject, params, options) {
        console.warn("Argz in special func", arguments);
        addLocalDataTo(definedResourceClassObject);
        // Save Reference to Adapter
        var that = this;
        let localStore = localStorageObject;
        console.log("This", that, definedResourceClassObject);
        // Set Defaults
        if (params == 'undefined' || params == null) params = {};
        if (options == 'undefined' || options == null) options = {};
        // Return Promise to resolve data
        return new Promise(function(resolve, reject) {
            console.log(["Getting All", arguments], ["Collection Length", localStorageObject[definedResourceClassObject.name].collection.length > 0]);
            if (localStorageObject[definedResourceClassObject.name].collection.length > 0) {
                console.info(["LocalStorageObject", localStorageObject], ["Options", options]);
                resolve(localStorageObject[definedResourceClassObject.name].collection);
            } else {
                console.log("Querying Parse");
                // Create Parse Query
                let ParseClass = new window.Parse.Query(definedResourceClassObject.name);
                // Iterate over conditions
                params.conditions = Array.isArray(params.conditions) ?  params.conditions : [{}];
                params.conditions.forEach(function(condition){
                    if(!!condition.type) ParseClass[condition.type](condition.col, condition.val);
                });
                // Get ObjectID
                return ParseClass.find({
                    success: function(res) {
                        // Create Save Object
                        res.forEach(function(item){
                            // Add Item To Local Storage Tree
                            that.returnSaveObject(definedResourceClassObject, item);
                        });
                        // Return Resolved Save Object to Client
                        resolve(localStore[definedResourceClassObject.name].collection);
                    },
                    error: function(res,err) {
                        let error = {message: res.message, response: res, error: err};
                        reject(error);
                    }
                });
            }
        });
    };
}

window.ParseAdapter = ParseAdapter;
window.angularData = new window.JSData.DS();