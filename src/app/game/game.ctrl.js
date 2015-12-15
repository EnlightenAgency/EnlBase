angular
	.module('app')
	.controller('GameCtrl', GameCtrl);

GameCtrl.$inject = ['$scope', '$rootScope', '$timeout', 'ImageRepo', 'Background', 'Ship', 'Bullet',
	'Enemy', 'Pool', 'QuadTree','Lives'];

var game;

var KEY_STATUS = {};

function GameCtrl($scope, $rootScope, $timeout, ImageRepo, Background, Ship, Bullet,
	Enemy, Pool, QuadTree, Lives) {
	var gameVm = this;
	gameVm.gameOver = false;
	gameVm.restart = restart;
	game = new Game();
	var state = "";

	function init() {
		if (game.init()) {
			game.start();
		}
	}
	$scope.$on("Init", init);

	//setup game logic
	function Game() {
		this.init = function () {
			this.playerScore = 0;
			this.bgCanvas = document.getElementById('background');
			this.shipCanvas = document.getElementById('ship');
			this.mainCanvas = document.getElementById('main');
			// Test to see if canvas is supported. Only need to
			// check one canvas
			if (this.bgCanvas.getContext) {
				this.bgContext = this.bgCanvas.getContext('2d');
				this.shipContext = this.shipCanvas.getContext('2d');
				this.mainContext = this.mainCanvas.getContext('2d');
				// Initialize objects to contain their context and canvas
				// information
				Background.prototype.context = this.bgContext;
				Background.prototype.canvasWidth = this.bgCanvas.width;
				Background.prototype.canvasHeight = this.bgCanvas.height;
				Lives.prototype.context = this.bgContext;
				Lives.prototype.canvasWidth = this.bgCanvas.width;
				Lives.prototype.canvasHeight = this.bgCanvas.height;
				Ship.prototype.context = this.shipContext;
				Ship.prototype.canvasWidth = this.shipCanvas.width;
				Ship.prototype.canvasHeight = this.shipCanvas.height;
				Bullet.prototype.context = this.mainContext;
				Bullet.prototype.canvasWidth = this.mainCanvas.width;
				Bullet.prototype.canvasHeight = this.mainCanvas.height;
				Enemy.prototype.context = this.mainContext;
				Enemy.prototype.canvasWidth = this.mainCanvas.width;
				Enemy.prototype.canvasHeight = this.mainCanvas.height;
				// Initialize the background object
				this.background = new Background();
				this.background.init(0, 0); // Set draw point to 0,0

				//initialize lives
				this.lives = new Lives();
				this.lives.lifeCount = 2;
				this.lives.init(0, this.bgCanvas.height - ImageRepo.spaceship.height, ImageRepo.spaceship.width, ImageRepo.spaceship.height);

				// Initialize the ship object
				this.ship = new Ship();

				// Set the ship to start near the bottom middle of the canvas
				this.shipStartX = this.shipCanvas.width / 2 - ImageRepo.spaceship.width;
				this.shipStartY = this.shipCanvas.height / 4 * 3 + ImageRepo.spaceship.height * 2;
				this.ship.init(this.shipStartX, this.shipStartY,
							   ImageRepo.spaceship.width, ImageRepo.spaceship.height);				
				
				// Initialize the enemy pool object
				this.enemyPool = new Pool(30);
				this.enemyPool.init("enemy");
				this.spawnWave();

				this.enemyBulletPool = new Pool(10);
				this.enemyBulletPool.init("enemyBullet");

				this.quadTree = new QuadTree({ x: 0, y: 0, width: this.mainCanvas.width, height: this.mainCanvas.height });
				return true;
			} else {
				return false;
			}
		};

		this.start = function () {
			game.ship.draw();
			animate();
		};

		this.spawnWave = function () {
			var height = ImageRepo.enemy.height;
			var width = ImageRepo.enemy.width;
			var x = 100;
			var y = -height;
			var spacer = y * 1.5;
			for (var i = 1; i <= 18; i++) {
				this.enemyPool.get(x, y, 2);
				x += width + 25;
				if (i % 6 === 0) {
					x = 100;
					y += spacer;
				}
			}
		};

		this.gameOver = function () {
			$('#game-over').css("display","block");
		};

	}

	function restart() {
		$('#game-over').css("display", "none");
		game.bgContext.clearRect(0, 0, game.bgCanvas.width, game.bgCanvas.height);
		game.shipContext.clearRect(0, 0, game.shipCanvas.width, game.shipCanvas.height);
		game.mainContext.clearRect(0, 0, game.mainCanvas.width, game.mainCanvas.height);
		game.quadTree.clear();
		game.background.init(0, 0);
		game.lives.lifeCount = 2;
		game.lives.init(0, this.bgCanvas.height - ImageRepo.spaceship.height, ImageRepo.spaceship.width, ImageRepo.spaceship.height);
		game.ship.init(game.shipStartX, game.shipStartY,
					   ImageRepo.spaceship.width, ImageRepo.spaceship.height);
		game.enemyPool.init("enemy");
		game.spawnWave();
		game.enemyBulletPool.init("enemyBullet");
		game.playerScore = 0;
		game.start();
	}

	KEY_CODES = {
		32: 'space',
		37: 'left',
		39: 'right'
	};
	for (var code in KEY_CODES) {
		KEY_STATUS[KEY_CODES[code]] = false;
	}
	document.onkeydown = function (e) {
		// Firefox and opera use charCode instead of keyCode to
		// return which key was pressed.
		var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
		if (KEY_CODES[keyCode]) {
			e.preventDefault();
			KEY_STATUS[KEY_CODES[keyCode]] = true;
		}
	};
	document.onkeyup = function (e) {
		var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
		if (KEY_CODES[keyCode]) {
			e.preventDefault();
			KEY_STATUS[KEY_CODES[keyCode]] = false;
		}
	};

}

function detectCollision() {
	var objects = [];
	game.quadTree.getAllObjects(objects);
	for (var x = 0, len = objects.length; x < len; x++) {
		game.quadTree.findObjects(obj = [], objects[x]);
		for (y = 0, length = obj.length; y < length; y++) {
			// DETECT COLLISION ALGORITHM
			if (objects[x].collidableWith === obj[y].type &&
			(objects[x].x < obj[y].x + obj[y].width &&
			objects[x].x + objects[x].width > obj[y].x &&
			objects[x].y < obj[y].y + obj[y].height &&
			objects[x].y + objects[x].height > obj[y].y)) {
				objects[x].isColliding = true;
				obj[y].isColliding = true;
			}
		}
	}
}

//constantly loops for game state
function animate() {
	//update score
	document.getElementById('score').innerHTML = game.playerScore;
	// Insert objects into quadtree
	game.quadTree.clear();
	game.quadTree.insert(game.ship);
	game.quadTree.insert(game.ship.bulletPool.getPool());
	game.quadTree.insert(game.enemyPool.getPool());
	game.quadTree.insert(game.enemyBulletPool.getPool());
	detectCollision();
	// No more enemies
	if (game.enemyPool.getPool().length === 0) {
		game.spawnWave();
	}
	// Animate game objects
	if (game.ship.alive) {
	requestAnimFrame(animate);
	game.background.draw();
	game.ship.move();
	game.ship.bulletPool.animate();
	game.enemyPool.animate();
	game.enemyBulletPool.animate();
	game.lives.draw();
	}
}

window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback, element) {
				window.setTimeout(callback, 1000 / 60);
			};
})();

