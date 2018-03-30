(function () {
	'use strict';

	angular
		.module('app')
		.factory('Bullet', Bullet);

	Bullet.$inject = ["Drawable","ImageRepo"];
	function Bullet(Drawable, ImageRepo) {
		function bullet(object) {
			this.alive = false; // Is true if the bullet is currently in use
			var self = object;
			/*
			 * Sets the bullet values
			 */
			this.spawn = function (x, y, speed) {
				this.x = x;
				this.y = y;
				this.speed = speed;
				this.alive = true;
			};
			this.draw = function () {
				this.context.clearRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
				this.y -= this.speed;
				if (this.isColliding) {
					return true;
				}
				else if (self === "bullet" && this.y <= 0 - this.height) {
					return true;
				}
				else if (self === "enemyBullet" && this.y >= this.canvasHeight) {
					return true;
				}
				else {
					if (self === "bullet") {
						this.context.drawImage(ImageRepo.bullet, this.x, this.y);
					}
					else if (self === "enemyBullet") {
						this.context.drawImage(ImageRepo.enemyBullet, this.x, this.y);
					}
					return false;
				}
			};
			/*
			 * Resets the bullet values
			 */
			this.clear = function () {
				this.x = 0;
				this.y = 0;
				this.speed = 0;
				this.alive = false;
				this.isColliding = false;
			};
		}
		bullet.prototype = new Drawable();
		return bullet;
	}
}());