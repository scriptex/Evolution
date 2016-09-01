'use strict';

angular.module('Game', ['Grid', 'ngCookies'])
	.service('GameManager', function($q, $timeout, GridService, $cookieStore) {
		this.getHighScore = function() {
			return parseInt($cookieStore.get('highScore')) || 0;
		};

		this.grid = GridService.grid;
		this.tiles = GridService.tiles;
		this.gameSize = GridService.getSize();

		this.winningValue = 2048;

		this.reinit = function() {
			this.gameOver = false;
			this.win = false;
			this.currentScore = 0;
			this.highScore = this.getHighScore();
		};

  		this.reinit();

		this.newGame = function() {
			GridService.buildEmptyGameBoard();
			GridService.buildStartingPosition();
			this.reinit();
		};

		this.move = function(key) {
			var self = this;
			var f = function() {
	  			if ( self.win ) { 
	  				return false; 
	  			};

	  			var positions = GridService.traversalDirections(key);
	  			var hasMoved = false;
	  			var hasWon = false;

				GridService.prepareTiles();

				positions.x.forEach(function(x) {
					positions.y.forEach(function(y) {
						var originalPosition = {x:x,y:y};
						var tile = GridService.getCellAt(originalPosition);

						if ( tile ) {
							var cell = GridService.calculateNextPosition(tile, key),
								next = cell.next;

							if ( next && next.value === tile.value && !next.merged ) {
								var newValue = tile.value * 2;
								var merged = GridService.newTile(tile, newValue);

								merged.merged = [tile, cell.next];

								GridService.insertTile(merged);
								GridService.removeTile(tile);

								GridService.moveTile(merged, next);

								self.updateScore(self.currentScore + cell.next.value);

								if ( merged.value >= self.winningValue ) {
									hasWon = true;
								};

								hasMoved = true; 
							} else {
								GridService.moveTile(tile, cell.newPosition);
							};

							if ( !GridService.samePositions(originalPosition,cell.newPosition) ) {
								hasMoved = true;
							};
						};
					});
				});

				if ( hasWon && !self.win ) {
					self.win = true;
				};

				if ( hasMoved ) {
					GridService.randomlyInsertNewTile();

					if ( self.win || !self.movesAvailable() ) {
						self.gameOver = true;
					};
				};
			};
			
			return $q.when(f());
		};

		this.movesAvailable = function() {
			return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
		};

		this.updateScore = function(newScore) {
			this.currentScore = newScore;
			
			if ( this.currentScore > this.getHighScore() ) {
				this.highScore = newScore;
				
				$cookieStore.put('highScore', newScore);
			};
		};
	});
