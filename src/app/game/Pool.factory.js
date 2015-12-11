(function () {
	'use strict';

	angular
		.module('app')
		.factory('Pool', Pool);
	Pool.$inject = ['ImageRepo','Bullet','Enemy'];
	function Pool(ImageRepo,Bullet,Enemy) {
		/**
		* Custom Pool object. Holds Bullet objects to be managed to prevent
		* garbage collection.
		*/
		function pool(maxSize) {
			var size = maxSize; // Max bullets allowed in the pool
			var pool = [];
			/*
			 * Populates the pool array with Bullet objects
			 */
			this.init = function (object) {
				if (object == "bullet") {
					for (var i = 0; i < size; i++) {
						// Initalize the object
						var bullet = new Bullet("bullet");
						bullet.init(0, 0, ImageRepo.bullet.width, ImageRepo.bullet.height);
						bullet.collidableWith = "enemy";
						bullet.type = "bullet";
						pool[i] = bullet;
					}
				}
				else if (object == "enemy") {
					for (var i = 0; i < size; i++) {
						var enemy = new Enemy();
						enemy.init(0, 0, ImageRepo.enemy.width, ImageRepo.enemy.height);
						pool[i] = enemy;
					}
				}
				else if (object == "enemyBullet") {
					for (var i = 0; i < size; i++) {
						var bullet = new Bullet("enemyBullet");
						bullet.init(0, 0, ImageRepo.enemyBullet.width, ImageRepo.enemyBullet.height);
						bullet.collidableWith = "ship";
						bullet.type = "enemyBullet";
						pool[i] = bullet;
					}
				}
			};
			this.getPool = function () {
				var obj = [];
				for (var i = 0; i < size; i++) {
					if (pool[i].alive) {
						obj.push(pool[i]);
					}
				}
				return obj;
			}
			/*
			 * Grabs the last item in the list and initializes it and
			 * pushes it to the front of the array.
			 */
			this.get = function (x, y, speed) {
				if (!pool[size - 1].alive) {
					pool[size - 1].spawn(x, y, speed);
					pool.unshift(pool.pop());
				}
			};

			/*
			 * Draws any in use Bullets. If a bullet goes off the screen,
			 * clears it and pushes it to the front of the array.
			 */
			this.animate = function () {
				for (var i = 0; i < size; i++) {
					// Only draw until we find a bullet that is not alive
					if (pool[i].alive) {
						if (pool[i].draw()) {
							pool[i].clear();
							pool.push((pool.splice(i, 1))[0]);
						}
					}
					else
						break;
				}
			};
		}
		return pool;
	}
}());