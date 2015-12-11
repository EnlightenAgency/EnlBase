(function () {
	'use strict';

	angular
		.module('app')
		.factory('ImageRepo', ImageRepo);
	ImageRepo.$inject = ['$rootScope'];
	function ImageRepo($rootScope) {
		// Define images
		this.empty = null;
		this.background = new Image();
		this.spaceship = new Image();
		this.bullet = new Image();
		this.enemy = new Image();
		this.enemyBullet = new Image();

		var numImages = 5;
		var numLoaded = 0;
		function imageLoaded() {
			numLoaded++;
			if (numLoaded === numImages) {
				$rootScope.$broadcast("Init");
			}
		}
		this.background.onload = function () {
			imageLoaded();
		}
		this.spaceship.onload = function () {
			imageLoaded();
		}
		this.bullet.onload = function () {
			imageLoaded();
		}
		this.enemy.onload = function () {
			imageLoaded();
		}
		this.enemyBullet.onload = function () {
			imageLoaded();
		}

		// Set images src
		this.background.src = "lib/images/bg.png";
		this.spaceship.src = "lib/images/ship.png";
		this.bullet.src = "lib/images/bullet.png";
		this.enemy.src = "lib/images/enemy.png";
		this.enemyBullet.src = "lib/images/bullet_enemy.png";
		return this;
	}
}());
