(function () {
	'use strict';

	angular
		.module('app')
		.factory('Drawable', Drawable);

	function Drawable() {
		function drawable() {
			this.init = function (x, y, width, height) {
				// Default variables
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
			};
			this.speed = 0;
			this.canvasWidth = 0;
			this.canvasHeight = 0;
			this.collidableWith = "";
			this.isColliding = false;
			this.type = "";
			// Define abstract function to be implemented in child objects
			this.draw = function () {
			};
			this.move = function () {
			};
			this.isCollidableWith = function (object) {
				return (this.collidableWith === object.type);
			};
		}
		return drawable;
	}

}());
