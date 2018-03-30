(function () {
	'use strict';

	angular
		.module('app')
		.factory('Background', Background);

	Background.$inject = ['Drawable', 'ImageRepo'];

	function Background(Drawable, ImageRepo) {
		function background() {
			this.speed = 1; 
			this.draw = function () {
				//Pan background
				this.y += this.speed;
				this.context.drawImage(ImageRepo.background, this.x, this.y);
				// Draw another image at the top edge of the first image
				this.context.drawImage(ImageRepo.background, this.x, this.y - this.canvasHeight);
				// If the image scrolled off the screen, reset
				if (this.y >= this.canvasHeight) {
					this.y = 0;
				}
			};
		}
		background.prototype = new Drawable();
		return background;
	}
}());