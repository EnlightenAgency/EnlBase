(function () {
	'use strict';

	angular
        .module('app')
        .controller('MoveCtrl', MoveCtrl);

	MoveCtrl.$inject = ['$scope', '$rootScope', '$timeout'];

	function MoveCtrl($scope, $rootScope, $timeout) {
		var moveable = this;
		var dot = {
			alive: false,
			pos: _dotPos
		}
		moveable.score = 0;
		moveable.dot = dot;
		$(window).keydown(_key);

		function _key(e) {
			var event = window.event ? window.event : e;
			switch (event.keyCode) {
				case 37: //left
					_move('l');
					e.preventDefault();
					break;
				case 38: //up
					_move('u');
					e.preventDefault();
					break;
				case 39: //right
					_move('r');
					e.preventDefault();
					break;
				case 40: //down
					_move('d');
					e.preventDefault();
					break;
			}

			function _move(direction) {
				var speed = 16;
				var size = $('.moveable').height();
				var character = $('.moveable');
				//get current position
				var pos = character.offset();
				//modify by speed and direction
				switch (direction) {
					case 'l':
						if (pos.left - speed > 0) {
							character.offset({ left: pos.left - speed });
						}
						else {
							character.offset({ left: 0 });
						}
						break;
					case 'r':
						if (pos.left + (size + speed + 20) < window.innerWidth) {
							character.offset({ left: pos.left + speed });
						}
						else {
							character.offset({ left: window.innerWidth - (size + 20) });
						}
						break;
					case 'u':
						if (pos.top - speed > 0) {
							character.offset({ top: pos.top - speed });
						}
						else {
							character.offset({ top: 0 });
						}
						break;
					case 'd':
						if (pos.top + (size + speed) < window.innerHeight) {
							character.offset({ top: pos.top + speed });
						}
						else {
							character.offset({ top: window.innerHeight - size });
						}
						break;
				}
				//spawn dot on first move
				_spawnDot();
				_checkCollision();
			}
		}

		function _checkCollision() {
			var dbds = _getBounds(".dot");
			var cbds = _getBounds(".moveable");
			//check for collision with dot
			var cols = doBoxesIntersect(dbds, cbds)
			if (cols) {
				_killDot()
			}
		}

		function doBoxesIntersect(a, b) {
			return (Math.abs(a.left - b.left)  <= (a.width + b.width)/2) &&
				   (Math.abs(a.top - b.top)  <= (a.height + b.height)/2);
		}
		function _spawnDot() {
			//if not visible make visisble and choose random starting spot
			if (!moveable.dot.alive) {
				moveable.dot.alive = true;
				$scope.$digest();
				var newDot = $(".dot");
				var topR = Math.random() * (window.innerHeight - newDot.height())
				var leftR = Math.random() * (window.innerHeight - newDot.height() - 20)
				newDot.offset({ top: topR, left: leftR })
			}

		}
		function _killDot() {
			console.log("Collides!")
			//increase score and kill dot
			moveable.score++;
			moveable.dot.alive = false;
			$scope.$digest();
		}

		function _dotPos() {
			return $('.dot').offset();
		}
		function _getBounds(obj) {
			//return bounds of dot
			var bounds = {
				left: $(obj).offset().left,
				right: $(obj).offset().left + $(obj).width(),
				top: $(obj).offset().top,
				bottom: $(obj).offset().top + $(obj).height(),
				width: $(obj).width(),
				height: $(obj).height()
			}
			return bounds;
		}

	}

})();