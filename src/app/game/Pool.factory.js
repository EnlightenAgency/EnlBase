(function () {
	'use strict';

	angular
		.module('app')
		.factory('Pool', Pool);
	Pool.$inject = ['ImageRepo', 'Bullet', 'Enemy'];
	function Pool(ImageRepo, Bullet, Enemy) {
		/**
		* Custom Pool object. Holds Bullet objects to be managed to prevent
		* garbage collection.
		*/
		function pools(maxSize) {
			this.size = maxSize; // Max bullets allowed in the pool
			var pool = [];
			/*
			 * Populates the pool array with Bullet objects
			 */
			this.init = function (object) {
				if (object == "bullet") {
					for (var i = 0; i < this.size; i++) {
						// Initalize the object
						var bullet = new Bullet("bullet");
						bullet.init(0, 0, ImageRepo.bullet.width, ImageRepo.bullet.height);
						bullet.collidableWith = "enemy";
						bullet.type = "bullet";
						pool[i] = bullet;
					}
				}
				else if (object == "enemy") {
					for (var j = 0; j < this.size; j++) {
						var enemy = new Enemy();
						enemy.init(0, 0, ImageRepo.enemy.width, ImageRepo.enemy.height);
						pool[j] = enemy;
					}
				}
				else if (object == "enemyBullet") {
					for (var k = 0; k < this.size; k++) {
						var bullet = new Bullet("enemyBullet");
						bullet.init(0, 0, ImageRepo.enemyBullet.width, ImageRepo.enemyBullet.height);
						bullet.collidableWith = "ship";
						bullet.type = "enemyBullet";
						pool[k] = bullet;
					}
				}
			};
			this.getPool = function () {
				var obj = [];
				for (var l = 0; l < this.size; l++) {
					if (pool[l].alive) {
						obj.push(pool[l]);
					}
				}
				return obj;
			};
			/*
			 * Grabs the last item in the list and initializes it and
			 * pushes it to the front of the array.
			 */
			this.get = function (x, y, speed) {
				if (!pool[this.size - 1].alive) {
					pool[this.size - 1].spawn(x, y, speed, this.size);
					pool.unshift(pool.pop());
				}
			};

			/*
			 * Draws any in use Bullets. If a bullet goes off the screen,
			 * clears it and pushes it to the front of the array.
			 */
			this.animate = function () {
				for (var i = 0; i < this.size; i++) {
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
			this.clear = function () {
				for (var i = 0; i < this.size; i++) {
						pool[i].clear();
				}
			}
		}
		return pools;
	}
}());