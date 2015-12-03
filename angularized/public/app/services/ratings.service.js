window.angular.module('vitalityApp').service('RatingsService', ['$rootScope', 'JSData', function($rootScope, DB) {
    var s = {};
    var ratings = {};
    var srefMap = ['rateme.emotional', 'rateme.fitness', 'rateme.nutrition', 'rateme.self-image'];
    
    s.next = function(pageId, data) {
		var idx = srefMap.indexOf(pageId);
		var field;
		// console.warn("Got PageID & Data", arguments);
		if (pageId == 'rateme.self-image') {
			field = pageId.split('.'),
			field.shift();
			field = field[0].split('-').shift().toString();
			ratings[field] = data[pageId.split('.')[1]];
			// console.warn("Saving this data", ratings);
			$rootScope.$emit('ratings', {name: 'add', ratings});
			s.saveData();
		} else {
			field = pageId.split('.');
			ratings[field[1]] = data[field[1]];
			
			$rootScope.$broadcast('pageId', {id: srefMap[idx + 1]});
			$rootScope.$emit('ratings', {name: 'add', ratings});
			$rootScope.$emit('sendTo', srefMap[idx + 1]);
		}
	};
	
	s.back = function(pageId) {
		var idx = srefMap.indexOf(pageId);
		
		$rootScope.$broadcast('pageId', {id: srefMap[idx - 1]});
		$rootScope.$emit('sendTo', srefMap[idx - 1]);
		// console.warn("Routing To " + pageId);
	};
	
	s.saveData = function() {
		return new Promise(function(resolve, reject){
			$rootScope.ratings.userName = $rootScope.user.username;
			// console.warn("Save Data", $rootScope.ratings);
			DB.save('Ratings', { conditions: $rootScope.ratings, type: 'create' }).then(function(res){
				console.info("Saved!!", res);
				$rootScope.$emit('sendTo', 'activity.list');
			});
		});
	};

    return s;
}]);