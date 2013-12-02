angular
.module('Logs', ['ngRoute', 'ngCookies'])

.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider.
		when('/', {controller:'ListCtrl', templateUrl:'views/list.html'}).
		when('/login', {controller:'LoginCtrl', templateUrl:'views/login.html'}).
		when('/new', {controller:'NewCtrl', templateUrl:'views/new.html'}).
		otherwise({redirectTo: '/'});
		// $locationProvider.html5Mode(true);
	}
])



.controller('LogsCtrl', ['$scope', '$http', '$q', '$cookies',
	function ($scope, $http, $q, $cookies) {

		$scope.offline = null;

		$scope.data = null;

		$http({method: 'post', url: 'data/data.json'})
		.success(function(data) {

			$scope.offline = false;

			var defer = new $q.defer;

			defer.promise
			.then(function() {

				// Si la data est dispo, on push le local storage, on vide le local storage, on parse la data et on la copie dans $scope.data

				var newData = JSON.parse(localStorage.getItem('newData'));

				if (newData != null && $cookies.connected == 'true')
				{
					$scope.data = data;
					  
					for (var i = newData.length - 1; i >= 0; i--)
					{
						$scope.data.logs.push(newData[i]);
					}

					var newData = null;
					localStorage.setItem('newData', newData);
				}
				else
				{
					$scope.data = data;
				}

				return($scope)
			})
			.then(function($scope) {

				// On enregistre dans data.json et en local dans savedData les nouvelles datas

				$http({method: 'post', url: 'data/save.php', data: $scope.data})
				.success(function(data) {

					$scope.data = data;
					localStorage.setItem('savedData', JSON.stringify(data));

				});
			});

			defer.resolve();
		})

		// Sinon on affiche la data sauvegardée savedData et les nouveaux elements newData

		.error(function() {

			$scope.offline = true;

			var newData = JSON.parse(localStorage.getItem('newData'));

			
			var defer = new $q.defer;

			defer.promise
			.then(function() {

				if (JSON.parse(localStorage.getItem('savedData')) != null)
				{
					$scope.data = JSON.parse(localStorage.getItem('savedData'));
				}
				else
				{
					$scope.data.logs = new Array;
				}

				return($scope)
			})
			.then(function($scope) {

				if (newData != null && $cookies.connected == 'true')
				{
					for (var i = newData.length - 1; i >= 0; i--)
					{
						$scope.data.logs.push(newData[i]);
					}
				}
			});

			defer.resolve();
		})
	}
])

.controller('ListCtrl', ['$scope',
	function ($scope) {

	}
])

.controller('LoginCtrl', ['$scope', '$http', '$cookies',
	function ($scope, $http, $cookies) {

		$scope.login = function() {

			$http({method: 'post', url: 'data/login.php', data: $scope.mdp})
			.success(function(data) {

				$cookies.connected = data;
			})
		}
	}
])


.controller('NewCtrl',  ['$scope', '$q', '$cookies',
	function ($scope, $q, $cookies) {

		$scope.post = function() {

			if ($cookies.connected == 'true' && $scope.content)
			{
				// On initialise la promise

				var defer = new $q.defer;

				defer.promise
				.then(function() {

					// On réccupère les nouvelles data si elles existent

					if (JSON.parse(localStorage.getItem('newData')))
					{
						$scope.new = JSON.parse(localStorage.getItem('newData'));
					}
					else
					{
						$scope.new = new Array;
					}

					return($scope)
				})
				.then(function($scope) {

				// On ajoute la nouvelle data au localstorage newData

					$scope.date = new Date().getTime();

					$scope.new.push({
						content: $scope.content,
						date: $scope.date
					});

					var newData = $scope.new;
					localStorage.setItem('newData', JSON.stringify(newData));

				})

				defer.resolve();

				window.location.replace('');
			}
		}
	}
]);
