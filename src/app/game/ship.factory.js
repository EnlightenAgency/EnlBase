(function () {
	'use strict';

	angular
		.module('app')
		.factory('Ship', Ship);
	Ship.$inject = ["Drawable", "Pool", "ImageRepo"]
	function Ship(Drawable, Pool, ImageRepo) {
		function ship() {
			this.speed = 5;
			this.bulletPool = new Pool(1);
			this.bulletPool.init("bullet");
			var fireRate = 1;
			var counter = 0;
			this.collidableWith = "enemyBullet";
			this.type = "ship";

			this.init = function (x, y, width, height) {
				// Defualt variables
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
				this.alive = true;
				this.isColliding = false;
				this.bulletPool.init("bullet");
			}

			this.draw = function () {
				this.context.drawImage(ImageRepo.spaceship, this.x, this.y);
			};
			this.move = function () {
				counter++;
				// Determine if the action is move action
				if (KEY_STATUS.left || KEY_STATUS.right) {
					// The ship moved, so erase it's current image so it can
					// be redrawn in it's new location
					this.context.clearRect(this.x, this.y, this.width, this.height);
					// Update x and y according to the direction to move and
					// redraw the ship. Change the else if's to if statements
					// to have diagonal movement.
					if (KEY_STATUS.left) {
						this.x -= this.speed
						if (this.x <= 0) // Keep player within the screen
							this.x = 0;
					} else if (KEY_STATUS.right) {
						this.x += this.speed
						if (this.x >= this.canvasWidth - this.width)
							this.x = this.canvasWidth - this.width;
					}
					// Finish by redrawing the ship
					if (!this.isColliding) {
						this.draw();
					}
					else {
						this.alive = false;
						game.gameOver();
					}
				}
				if (KEY_STATUS.space && counter >= fireRate && !this.isColliding) {
					this.fire();
					counter = 0;
				}
			};
			/*
			 * Fires two bullets
			 */
			this.fire = function () {
				this.bulletPool.get(this.x + 19, this.y - 3, 3);
			};
		}
		ship.prototype = new Drawable();
		return ship;
	}
}());