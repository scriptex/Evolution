angular.module('ng2048', ['ionic', 'Game', 'Grid', 'Keyboard', 'ngAnimate', 'ngCookies'])

	.config(function($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('app', {
				url: '/app', 
				templateUrl: 'views/main.html',
				controller: 'MainController'
			});

		$urlRouterProvider.otherwise('/app');
	})

	.run(function($ionicPlatform) {
		$ionicPlatform.ready(function() {
			if ( window.cordova && window.cordova.plugins.Keyboard ) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			};

			if ( window.StatusBar ) {
				StatusBar.styleDefault();
			};
		});
	})

	.controller('MainController', function($scope, $ionicModal) {
		$ionicModal.fromTemplateUrl('views/help.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});

		$scope.showHelp = function() {
			$scope.modal.show();
		};

		$scope.hideHelp = function() {
			$scope.modal.hide();
		};
	})

	.controller('GameController', function(GameManager, KeyboardService) {
		this.game = GameManager;

		this.newGame = function() {
			KeyboardService.init();
			this.game.newGame();
			this.startGame();
		};

		this.startGame = function() {
			var self = this;
			
			KeyboardService.on(function(key) {
				self.game.move(key);
			});
		};

		this.newGame();
	});
