(function () {
	'use strict';

	angular
		.module('app')
		.factory('Lives', Lives);

	Lives.$inject = ['Drawable', 'ImageRepo'];

	function Lives(Drawable, ImageRepo) {
		this.lifeCount = 0;
		function lives(x,y) {
			this.draw = function () {
				//Draw lives for each life left
				for (var i = 0; i < this.lifeCount; i++) {
					this.context.drawImage(ImageRepo.spaceship, i * this.width, this.y);
				}
			};
		}
		lives.prototype = new Drawable();
		return lives;
	}
}());