(function () {
	'use strict';

	angular
		.module('app')
		.factory('Enemy', Enemy);
	Enemy.$inject = ["Drawable",  "ImageRepo"];
	function Enemy(Drawable, ImageRepo) {
		function enemy() {
			var percentFire = 0.005;
			var chance = 0;
			this.alive = false;
			this.collidableWith = "bullet";
			this.type = "enemy";
			/*
			 * Sets the Enemy values
			 */
			this.spawn = function (x, y, speed) {
				this.x = x;
				this.y = y;
				this.speed = speed;
				this.speedX = 0;
				this.speedY = speed;
				this.alive = true;
				this.leftEdge = this.x - 90;
				this.rightEdge = this.x + 90;
				this.bottomEdge = this.y + 140;
			};
			/*
			 * Move the enemy
			 */
			this.draw = function () {
				this.context.clearRect(this.x - 1, this.y, this.width + 1, this.height);
				this.x += this.speedX;
				this.y += this.speedY;
				if (this.x <= this.leftEdge) {
					this.speedX = this.speed;
				}
				else if (this.x >= this.rightEdge + this.width) {
					this.speedX = -this.speed;
				}
				else if (this.y >= this.bottomEdge) {
					this.speed = 1.5;
					this.speedY = 0;
					this.y -= 5;
					this.speedX = -this.speed;
				}
				if (!this.isColliding) {
					this.context.drawImage(ImageRepo.enemy, this.x, this.y);
					// Enemy has a chance to shoot every movement
					chance = Math.floor(Math.random() * 101);
					if (chance / 100 < percentFire) {
						this.fire();
					}
					return false;
				}
				else {
					game.playerScore += 10;
					if (game.playerScore % 200 === 0) //every 2000 points gain a life
					{
						game.lives.lifeCount++;
					}
					return true;
				}
			};
			/*
			 * Fires a bullet
			 */
			this.fire = function () {
				game.enemyBulletPool.get(this.x + this.width / 2, this.y + this.height, -2.5);
			};
			/*
			 * Resets the enemy values
			 */
			this.clear = function () {
				this.x = 0;
				this.y = 0;
				this.speed = 0;
				this.speedX = 0;
				this.speedY = 0;
				this.alive = false;
				this.isColliding = false;
			};
		}
		enemy.prototype = new Drawable();
		return enemy;
	}
}());