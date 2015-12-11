(function () {
	'use strict';

	angular
        .module('app')
        .controller('MoveCtrl', MoveCtrl);

	MoveCtrl.$inject = ['$scope', '$rootScope', '$timeout'];

	function MoveCtrl($scope, $rootScope, $timeout) {
		var moveable = this;
		moveable.dotNum = 0;
		moveable.score = 0;
		moveable.dots = [];
		$(window).keydown(_key);

		function _key(e) {
			if ($('.moveable').length) {
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
			}

			function _move(direction) {
				var speed = 16;
				var maxDots = 3;
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
				if (moveable.dots.length < maxDots) {
					_spawnDot();
				}
				for (var i = 0; i < moveable.dots.length; i++) {
					_checkCollision(moveable.dots[i]);
				}
			}
		}

		function _checkCollision(dot) {
			var dbds = _getBounds(dot.id);
			var cbds = _getBounds(".moveable");
			//check for collision with dot
			var cols = collide(dbds, cbds);
			if (cols) {
				_killDot(dot);
			}
		}

		function collide(a, b) {
			return (a.left < b.left + b.width && a.left + a.width > b.left &&
		a.top < b.top + b.height && a.top + a.height > b.top);
		}
		function _spawnDot() {
			var dot = {
				alive: true,
				pos: _dotPos,
				id: ".dot" + moveable.dotNum
			};
			//add new dot to array
			moveable.dots.push(dot);
			$(".dots").append('<div class="dot dot' + moveable.dotNum + '" ng-show="dot.alive"></div>');
			moveable.dotNum++;
			//populate id of dot for reference
			$scope.$digest();
			//set new dots position
			var newDot = $(dot.id);
			var topR = Math.abs(Math.random() * (window.innerHeight - newDot.height()));
			var leftR = Math.abs(Math.random() * (window.innerHeight - newDot.height() - 20));
			newDot.offset({ top: topR, left: leftR });

		}
		function _killDot(dot) {
			//increase score and kill dot
			moveable.score++;
			dot.alive = false;
			var index = moveable.dots.indexOf(dot);
			moveable.dots.splice(index, 1);
			$(dot.id).remove();
			$scope.$digest();
		}

		function _dotPos(dot) {
			return $(dot.id).offset();
		}
		function _getBounds(obj) {
			//return bounds of dot
			return {
				left: $(obj).offset().left,
				right: $(obj).offset().left + $(obj).width(),
				top: $(obj).offset().top,
				bottom: $(obj).offset().top + $(obj).height(),
				width: $(obj).width(),
				height: $(obj).height()
			};
		}

	}

})();