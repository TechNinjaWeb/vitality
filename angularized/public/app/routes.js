window.angular.module('vitalityApp').config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '',
            abstract: true,
            views: {
            }
        })
        .state('home.index', {
            url: '/home',
            views: {
                'body@': {
                    templateUrl: './app/pages/home.html',
                    controller: 'HomeController'
                }
            }
        })
        .state('home.login', {
            url: '/login',
            views: {
                'body@': {
                    templateUrl: './app/pages/login.html',
                    controller: 'LoginController'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'LoginController'
                }
            }
        })
        .state('home.account', {
            url: '/account',
            views: {
                'body@': {
                    templateUrl: './app/pages/createAccount.html',
                    controller: 'CreateAccountController'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'CreateAccountController'
                }
            }
        })
        .state('profile', {
            url: '/profile',
            abstract: true
        })
        .state('profile.user', {
            url: '/user',
            views: {
                'body@': {
                    templateUrl: './app/pages/profile.html'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'ProfileController'
                }
            }
        })
        .state('profile.progress', {
            url: '/progress',
            views: {
                'body@': {
                    templateUrl: './app/pages/progress.html',
                    controller: 'ProgressController'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'ProgressController'
                }
            }
        })
        .state('profile.edit', {
            url: '/edit',
            views: {
                'body@': {
                    templateUrl: './app/pages/profileEdit.html',
                    controller: 'ProfileEditController'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'ProfileEditController'
                }
            }
        })
        .state('rateme', {
            url: '/rateme',
            abstract: true
        })
        .state('rateme.emotional', {
            url: '/emotional',
            views: {
                'body@': {
                    templateUrl: './app/pages/emotionRatings.html',
                    controller: 'RatemeController'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'RatemeController'
                }
            }
        })
        .state('rateme.fitness', {
            url: '/fitness',
            views: {
                'body@': {
                    templateUrl: './app/pages/fitnessRatings.html',
                    controller: 'RatemeController'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'RatemeController'
                }
            }
        })
        .state('rateme.nutrition', {
            url: '/nutrition',
            views: {
                'body@': {
                    templateUrl: './app/pages/nutritionRatings.html',
                    controller: 'RatemeController'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'RatemeController'
                }
            }
        })
        .state('rateme.self-image', {
            url: '/self-image',
            views: {
                'body@': {
                    templateUrl: './app/pages/selfRatings.html',
                    controller: 'RatemeController'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'RatemeController'
                }
            }
        })
        .state('progress', {
            url: '/progress',
            views: {
                'body@': {
                    templateUrl: './app/pages/home.html'
                }
            }
        })
        .state('goals', {
            url: '/goals',
            abstract: true
        })
        .state('goals.list', {
            url: '/list',
            views: {
                'body@': {
                    templateUrl: './app/pages/goalsPage.html',
                    controller: 'GoalsController'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'GoalsController'
                }
            }
        })
        .state('goals.add', {
            url: '/list/add',
            views: {
                'body@': {
                    // templateUrl: './app/pages/goalsCreate.html',
                    // controller: ''
                    template: '<div>Add A Goal</div>'
                },
                'nav@': {
                    // templateUrl: './app/templates/navigation.html',
                    // controller: ''
                    template: '<div>Nav Template</div>'
                }
            }
        })
        .state('home.tracker', {
            url: '/tracker',
            views: {
                'body@': {
                    templateUrl: './app/pages/trackerPage.html',
                    controller: 'TrackerController'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'TrackerController'
                }
            }
        })
        .state('home.tracker.body', {
            url: '/body',
            views: {
                'body@': {
                    templateUrl: './app/pages/bodyTracker.html',
                    controller: 'TrackerController'
                    // template: '<div>Body Tracker Template</div>'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'TrackerController'
                    // template: '<nav>Nav Template</Nav>'
                }
            }
        })
        .state('home.tracker.meals', {
            url: '/meals',
            views: {
                'body@': {
                    templateUrl: './app/pages/mealTracker.html',
                    controller: 'TrackerController'
                    // template: '<div>Meal Tracker Template</div>'
                },
                'nav@': {
                    templateUrl: './app/templates/navigation.html',
                    controller: 'TrackerController'
                    // template: '<nav>Nav Template</Nav>'
                }
            }
        })
        .state('activity', {
            url: '/activity',
            abstract: true
        })
        .state('activity.list', {
            url: '/list',
            views: {
                'body@': {
                    // templateUrl: './app/pages/activityList.html',
                    // controller: ''
                    template: '<div>Activity List Template</div>'
                },
                'nav@': {
                    // templateUrl: './app/templates/navigation.html',
                    // controller: ''
                    template: '<nav>Nav Template</Nav>'
                }
            }
        })
        .state('activity.create', {
            url: '/create',
            views: {
                'body@': {
                    // templateUrl: './app/pages/activityList.html',
                    // controller: ''
                    template: '<div>Activity List Template</div>'
                },
                'nav@': {
                    // templateUrl: './app/templates/navigation.html',
                    // controller: ''
                    template: '<nav>Nav Template</Nav>'
                }
            }
        });
        
    $urlRouterProvider.otherwise('/home');
});