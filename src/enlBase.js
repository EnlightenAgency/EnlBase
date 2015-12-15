(function () {
	'use strict';

	angular
        .module('app', [
            'ui.router',
            'ngAnimate',
            'mm.foundation',
            'ui.event',
            'ui.map'
        ])
    .config(config)
    .run(run);

	config.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider','$urlMatcherFactoryProvider'];

	function run() {

	}
	function config($urlProvider, $locationProvider, $stateProvider, $urlMatcherFactoryProvider) {
		$urlProvider.when('', '/');
		$urlMatcherFactoryProvider.strictMode(false);
		$locationProvider.html5Mode(true).hashPrefix('!');

		$stateProvider
        .state('home', {
        	url: '/',
        	templateUrl: 'app/home/home.view.html',
        	controller: 'HomeCtrl',
        	controllerAs: 'homeVm'
        })
        .state('about', {
        	url: '/about',
        	templateUrl: 'app/about/about.view.html',
        	controller: 'AboutCtrl',
        	controllerAs: 'aboutVm'
        })
        .state('contact', {
        	url: '/contact',
        	templateUrl: 'app/contact/contact.view.html',
        	controller: 'ContactCtrl',
        	controllerAs: 'contactVm'
        })
        .state('portfolio', {
        	url: '/portfolio',
        	templateUrl: 'app/portfolio/portfolio.view.html',
        	controller: 'PortfolioCtrl',
        	controllerAs: 'portfolioVm'
        })
		.state('game', {
			url: '/game',
			templateUrl: 'app/game/game.view.html',
			controller: 'GameCtrl',
			controllerAs: 'gameVm'
		})
        .state('404', {
        	url: '/404',
        	templateUrl: 'app/404/404.view.html'
        });
		$urlProvider.otherwise('/');
	}

})();
;
(function () {
    'use strict';

    angular
        .module('app')
        .controller('AboutCtrl', AboutCtrl);

    function AboutCtrl($scope, $rootScope,$timeout) {
        var aboutVm = this;
        aboutVm.bounds = new google.maps.LatLngBounds();
        $rootScope.title = "About";
    }

    AboutCtrl.$inject = ['$scope', '$rootScope','$timeout'];
})();;
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ContactCtrl', ContactCtrl);

    function ContactCtrl($scope, $rootScope,$timeout) {
        var contactVm = this;
        contactVm.bounds = new google.maps.LatLngBounds();
        $rootScope.title = "Contact";
    }

    ContactCtrl.$inject = ['$scope', '$rootScope','$timeout'];
})();;
(function () {
    'use strict';

    angular
    .module('app')
    .controller('PageCtrl', PageCtrl);

    PageCtrl.$inject = ['$scope', '$rootScope','$state'];

    function PageCtrl($scope, $rootScope,$state) {
        var page = this;
        $rootScope.title = "";

        page.getClass = function (name) {
            if ($state.current.name === name) {
                return 'active';
            } else {
                return '';
            }
        };

    }
})();;
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
}());;
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
}());;
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
;
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
					game.playerScore += 100;
					if (game.playerScore % 2000 === 0) //every 2000 points gain a life
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
}());;
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
		game.lives.init(0, game.bgCanvas.height - ImageRepo.spaceship.height, ImageRepo.spaceship.width, ImageRepo.spaceship.height);
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

;
(function () {
	'use strict';

	angular
		.module('app')
		.factory('ImageRepo', ImageRepo);
	ImageRepo.$inject = ['$rootScope'];
	function ImageRepo($rootScope) {
		// Define images
		this.empty = null;
		this.background = new Image();
		this.spaceship = new Image();
		this.bullet = new Image();
		this.enemy = new Image();
		this.enemyBullet = new Image();

		var numImages = 5;
		var numLoaded = 0;
		function imageLoaded() {
			numLoaded++;
			if (numLoaded === numImages) {
				$rootScope.$broadcast("Init");
			}
		}
		this.background.onload = function () {
			imageLoaded();
		};
		this.spaceship.onload = function () {
			imageLoaded();
		};
		this.bullet.onload = function () {
			imageLoaded();
		};
		this.enemy.onload = function () {
			imageLoaded();
		};
		this.enemyBullet.onload = function () {
			imageLoaded();
		};

		// Set images src
		this.background.src = "lib/images/bg.png";
		this.spaceship.src = "lib/images/ship.png";
		this.bullet.src = "lib/images/bullet.png";
		this.enemy.src = "lib/images/enemy.png";
		this.enemyBullet.src = "lib/images/bullet_enemy.png";
		return this;
	}
}());
;
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
}());;
(function () {
	'use strict';

	angular
		.module('app')
		.factory('Pool', Pool);
	Pool.$inject = ['ImageRepo','Bullet','Enemy'];
	function Pool(ImageRepo,Bullet,Enemy) {
		/**
		* Custom Pool object. Holds Bullet objects to be managed to prevent
		* garbage collection.
		*/
		function pools(maxSize) {
			var size = maxSize; // Max bullets allowed in the pool
			var pool = [];
			/*
			 * Populates the pool array with Bullet objects
			 */
			this.init = function (object) {
				if (object == "bullet") {
					for (var i = 0; i < size; i++) {
						// Initalize the object
						var bullet = new Bullet("bullet");
						bullet.init(0, 0, ImageRepo.bullet.width, ImageRepo.bullet.height);
						bullet.collidableWith = "enemy";
						bullet.type = "bullet";
						pool[i] = bullet;
					}
				}
				else if (object == "enemy") {
					for (var j = 0; j < size; j++) {
						var enemy = new Enemy();
						enemy.init(0, 0, ImageRepo.enemy.width, ImageRepo.enemy.height);
						pool[j] = enemy;
					}
				}
				else if (object == "enemyBullet") {
					for (var k = 0; k < size; k++) {
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
				for (var l = 0; l < size; l++) {
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
				if (!pool[size - 1].alive) {
					pool[size - 1].spawn(x, y, speed);
					pool.unshift(pool.pop());
				}
			};

			/*
			 * Draws any in use Bullets. If a bullet goes off the screen,
			 * clears it and pushes it to the front of the array.
			 */
			this.animate = function () {
				for (var i = 0; i < size; i++) {
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
		}
		return pools;
	}
}());;
(function () {
	'use strict';

	angular
		.module('app')
		.factory('QuadTree', QuadTree);

	function QuadTree() {
		function quadTree(boundBox, lvl) {
			var maxObjects = 10;
			this.bounds = boundBox || {
				x: 0,
				y: 0,
				width: 0,
				height: 0
			};
			var objects = [];
			this.nodes = [];
			var level = lvl || 0;
			var maxLevels = 5;

			/*
			 * Clears the quadTree and all nodes of objects
			 */
			this.clear = function () {
				objects = [];

				for (var i = 0; i < this.nodes.length; i++) {
					this.nodes[i].clear();
				}

				this.nodes = [];
			};

			/*
			 * Get all objects in the quadTree
			 */
			this.getAllObjects = function (returnedObjects) {
				for (var i = 0; i < this.nodes.length; i++) {
					this.nodes[i].getAllObjects(returnedObjects);
				}

				for (var i = 0, len = objects.length; i < len; i++) {
					returnedObjects.push(objects[i]);
				}

				return returnedObjects;
			};

			/*
			 * Return all objects that the object could collide with
			 */
			this.findObjects = function (returnedObjects, obj) {
				if (typeof obj === "undefined") {
					console.log("UNDEFINED OBJECT");
					return;
				}

				var index = this.getIndex(obj);
				if (index != -1 && this.nodes.length) {
					this.nodes[index].findObjects(returnedObjects, obj);
				}

				for (var i = 0, len = objects.length; i < len; i++) {
					returnedObjects.push(objects[i]);
				}

				return returnedObjects;
			};

			/*
			 * Insert the object into the quadTree. If the tree
			 * excedes the capacity, it will split and add all
			 * objects to their corresponding nodes.
			 */
			this.insert = function (obj) {
				if (typeof obj === "undefined") {
					return;
				}

				if (obj instanceof Array) {
					for (var i = 0, len = obj.length; i < len; i++) {
						this.insert(obj[i]);
					}

					return;
				}

				if (this.nodes.length) {
					var node = this.getIndex(obj);
					// Only add the object to a subnode if it can fit completely
					// within one
					if ( node != -1) {
						this.nodes[node].insert(obj);

						return;
					}
				}

				objects.push(obj);

				// Prevent infinite splitting
				if (objects.length > maxObjects && level < maxLevels) {
					if (this.nodes[0] == null) {
						this.split();
					}

					var i = 0;
					while (i < objects.length) {

						var index = this.getIndex(objects[i]);
						if (index != -1) {
							this.nodes[index].insert((objects.splice(i, 1))[0]);
						}
						else {
							i++;
						}
					}
				}
			};

			/*
			 * Determine which node the object belongs to. -1 means
			 * object cannot completely fit within a node and is part
			 * of the current node
			 */
			this.getIndex = function (obj) {

				var index = -1;
				var verticalMidpoint = this.bounds.x + this.bounds.width / 2;
				var horizontalMidpoint = this.bounds.y + this.bounds.height / 2;

				// Object can fit completely within the top quadrant
				var topQuadrant = (obj.y < horizontalMidpoint && obj.y + obj.height < horizontalMidpoint);
				// Object can fit completely within the bottom quandrant
				var bottomQuadrant = (obj.y > horizontalMidpoint);

				// Object can fit completely within the left quadrants
				if (obj.x < verticalMidpoint &&
						obj.x + obj.width < verticalMidpoint) {
					if (topQuadrant) {
						index = 1;
					}
					else if (bottomQuadrant) {
						index = 2;
					}
				}
					// Object can fix completely within the right quandrants
				else if (obj.x > verticalMidpoint) {
					if (topQuadrant) {
						index = 0;
					}
					else if (bottomQuadrant) {
						index = 3;
					}
				}

				return index;
			};

			/*
			 * Splits the node into 4 subnodes
			 */
			this.split = function () {
				// Bitwise or [html5rocks]
				var subWidth = (this.bounds.width / 2) | 0;
				var subHeight = (this.bounds.height / 2) | 0;

				this.nodes[0] = new quadTree({
					x: this.bounds.x + subWidth,
					y: this.bounds.y,
					width: subWidth,
					height: subHeight
				}, level + 1);
				this.nodes[1] = new quadTree({
					x: this.bounds.x,
					y: this.bounds.y,
					width: subWidth,
					height: subHeight
				}, level + 1);
				this.nodes[2] = new quadTree({
					x: this.bounds.x,
					y: this.bounds.y + subHeight,
					width: subWidth,
					height: subHeight
				}, level + 1);
				this.nodes[3] = new quadTree({
					x: this.bounds.x + subWidth,
					y: this.bounds.y + subHeight,
					width: subWidth,
					height: subHeight
				}, level + 1);
			};
		}
		return quadTree;
	}
}());;
(function () {
	'use strict';

	angular
		.module('app')
		.factory('Ship', Ship);
	Ship.$inject = ["Drawable", "Pool", "ImageRepo"];
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
				// Default variables
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
				this.alive = true;
				this.isColliding = false;
				this.bulletPool.init("bullet");
			};

			this.draw = function () {
				// Finish by redrawing the ship
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
						this.x -= this.speed;
						if (this.x <= 0) // Keep player within the screen
							this.x = 0;
					} else if (KEY_STATUS.right) {
						this.x += this.speed;
						if (this.x >= this.canvasWidth - this.width)
							this.x = this.canvasWidth - this.width;
					}
					if (!this.isColliding) {
						this.draw();
					}

				}
				if (KEY_STATUS.space && counter >= fireRate && !this.isColliding) {
					this.fire();
					counter = 0;
				}

				if (this.isColliding && game.lives.lifeCount > 0) {
					game.lives.lifeCount -= 1;
					this.isColliding = false;
				}
				else if (this.isColliding) {
					this.alive = false;
					game.gameOver();
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
}());;
(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$scope', '$rootScope', '$timeout'];

     function HomeCtrl($scope, $rootScope, $timeout) {
        var homeVm = this;
        homeVm.bounds = new google.maps.LatLngBounds();
        homeVm.loadPins = loadPins();
        homeVm.myMarker = {};
        $rootScope.title = "Home";

        var defaultLatLng = new google.maps.LatLng(37.09024, -95.712891);
        var directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        var directionsService = new google.maps.DirectionsService();
        var trafficLayer = new google.maps.TrafficLayer();

        homeVm.mapOptions = {
            zoom: 4,
            center: defaultLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggable: false,
            scrollwheel: false,
            navigationControl: false,
            scaleControl: false,
            mapTypeControl: false
        };

        google.maps.event.addDomListener(window, "resize", function () {
            var center = $scope.map.getCenter();
            google.maps.event.trigger($scope.map, "resize");
            $scope.map.setCenter(center);
        });

        init();

        function init() {
            $timeout(loadPins, 200);
        }

        function loadPins() {
            if ($scope.map) {
                _placeMyself();
                //get current location and place user pin
                if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(_plotLocation);
                }
            }
        }

        function _placeMyself() {
            var location = new google.maps.LatLng("42.240845", "-83.234097");
            homeVm.myMarker = new google.maps.Marker({
                position: location,
                map: $scope.map,
                title: "Damian Strong",
                animation: google.maps.Animation.DROP
            });
            //rebound view
            homeVm.bounds.extend(location);
            $scope.map.fitBounds(homeVm.bounds);
        }


        //drop pin on map for location
        function _plotLocation(position) {
            //create marker
            var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var marker = new google.maps.Marker({
                position: location,
                map: $scope.map,
                title: "You Are Here",
                animation: google.maps.Animation.DROP
            });
            //rebound view
            homeVm.bounds.extend(location);
            $scope.map.fitBounds(homeVm.bounds);

            directionsService.route({
                origin:location,
                destination: homeVm.myMarker.position,
                travelMode: google.maps.TravelMode.DRIVING
            }, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                    directionsDisplay.setMap($scope.map);

                }
            });            
        }

        return {
            loadPins: loadPins
        };
     }
})();;
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

})();;
(function () {
    'use strict';

    angular
        .module('app')
        .controller('PortfolioCtrl', PortfolioCtrl);

    function PortfolioCtrl($scope, $rootScope,$timeout) {
        var portfolioVm = this;
        portfolioVm.bounds = new google.maps.LatLngBounds();
        $rootScope.title = "Portfolio";
    }

    PortfolioCtrl.$inject = ['$scope', '$rootScope','$timeout'];
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmN0cmwuanMiLCJjb250YWN0L2NvbnRhY3QuY3RybC5qcyIsImNvcmUvcGFnZS5jdHJsLmpzIiwiZ2FtZS9iYWNrZ3JvdW5kLmZhY3RvcnkuanMiLCJnYW1lL2J1bGxldC5mYWN0b3J5LmpzIiwiZ2FtZS9EcmF3YWJsZS5mYWN0b3J5LmpzIiwiZ2FtZS9lbmVteS5mYWN0b3J5LmpzIiwiZ2FtZS9nYW1lLmN0cmwuanMiLCJnYW1lL2ltYWdlcmVwby5mYWN0b3J5LmpzIiwiZ2FtZS9saXZlcy5mYWN0b3J5LmpzIiwiZ2FtZS9wb29sLmZhY3RvcnkuanMiLCJnYW1lL3F1YWR0cmVlLmZhY3RvcnkuanMiLCJnYW1lL3NoaXAuZmFjdG9yeS5qcyIsImhvbWUvaG9tZS5jdHJsLmpzIiwiaG9tZS9tb3ZlYWJsZS5qcyIsInBvcnRmb2xpby9wb3J0Zm9saW8uY3RybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZW5sQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJywgW1xyXG4gICAgICAgICAgICAndWkucm91dGVyJyxcclxuICAgICAgICAgICAgJ25nQW5pbWF0ZScsXHJcbiAgICAgICAgICAgICdtbS5mb3VuZGF0aW9uJyxcclxuICAgICAgICAgICAgJ3VpLmV2ZW50JyxcclxuICAgICAgICAgICAgJ3VpLm1hcCdcclxuICAgICAgICBdKVxyXG4gICAgLmNvbmZpZyhjb25maWcpXHJcbiAgICAucnVuKHJ1bik7XHJcblxyXG5cdGNvbmZpZy4kaW5qZWN0ID0gWyckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHN0YXRlUHJvdmlkZXInLCckdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlciddO1xyXG5cclxuXHRmdW5jdGlvbiBydW4oKSB7XHJcblxyXG5cdH1cclxuXHRmdW5jdGlvbiBjb25maWcoJHVybFByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJHN0YXRlUHJvdmlkZXIsICR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyKSB7XHJcblx0XHQkdXJsUHJvdmlkZXIud2hlbignJywgJy8nKTtcclxuXHRcdCR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyLnN0cmljdE1vZGUoZmFsc2UpO1xyXG5cdFx0JGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpLmhhc2hQcmVmaXgoJyEnKTtcclxuXHJcblx0XHQkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcclxuICAgICAgICBcdHVybDogJy8nLFxyXG4gICAgICAgIFx0dGVtcGxhdGVVcmw6ICdhcHAvaG9tZS9ob21lLnZpZXcuaHRtbCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlckFzOiAnaG9tZVZtJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnN0YXRlKCdhYm91dCcsIHtcclxuICAgICAgICBcdHVybDogJy9hYm91dCcsXHJcbiAgICAgICAgXHR0ZW1wbGF0ZVVybDogJ2FwcC9hYm91dC9hYm91dC52aWV3Lmh0bWwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlcjogJ0Fib3V0Q3RybCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyQXM6ICdhYm91dFZtJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnN0YXRlKCdjb250YWN0Jywge1xyXG4gICAgICAgIFx0dXJsOiAnL2NvbnRhY3QnLFxyXG4gICAgICAgIFx0dGVtcGxhdGVVcmw6ICdhcHAvY29udGFjdC9jb250YWN0LnZpZXcuaHRtbCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyOiAnQ29udGFjdEN0cmwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlckFzOiAnY29udGFjdFZtJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnN0YXRlKCdwb3J0Zm9saW8nLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvcG9ydGZvbGlvJyxcclxuICAgICAgICBcdHRlbXBsYXRlVXJsOiAnYXBwL3BvcnRmb2xpby9wb3J0Zm9saW8udmlldy5odG1sJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXI6ICdQb3J0Zm9saW9DdHJsJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXJBczogJ3BvcnRmb2xpb1ZtJ1xyXG4gICAgICAgIH0pXHJcblx0XHQuc3RhdGUoJ2dhbWUnLCB7XHJcblx0XHRcdHVybDogJy9nYW1lJyxcclxuXHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvZ2FtZS9nYW1lLnZpZXcuaHRtbCcsXHJcblx0XHRcdGNvbnRyb2xsZXI6ICdHYW1lQ3RybCcsXHJcblx0XHRcdGNvbnRyb2xsZXJBczogJ2dhbWVWbSdcclxuXHRcdH0pXHJcbiAgICAgICAgLnN0YXRlKCc0MDQnLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvNDA0JyxcclxuICAgICAgICBcdHRlbXBsYXRlVXJsOiAnYXBwLzQwNC80MDQudmlldy5odG1sJ1xyXG4gICAgICAgIH0pO1xyXG5cdFx0JHVybFByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG5cdH1cclxuXHJcbn0pKCk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Fib3V0Q3RybCcsIEFib3V0Q3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gQWJvdXRDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBhYm91dFZtID0gdGhpcztcclxuICAgICAgICBhYm91dFZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJBYm91dFwiO1xyXG4gICAgfVxyXG5cclxuICAgIEFib3V0Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyR0aW1lb3V0J107XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignQ29udGFjdEN0cmwnLCBDb250YWN0Q3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gQ29udGFjdEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIGNvbnRhY3RWbSA9IHRoaXM7XHJcbiAgICAgICAgY29udGFjdFZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJDb250YWN0XCI7XHJcbiAgICB9XHJcblxyXG4gICAgQ29udGFjdEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckdGltZW91dCddO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwJylcclxuICAgIC5jb250cm9sbGVyKCdQYWdlQ3RybCcsIFBhZ2VDdHJsKTtcclxuXHJcbiAgICBQYWdlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyRzdGF0ZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBhZ2VDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkc3RhdGUpIHtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXM7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIHBhZ2UuZ2V0Q2xhc3MgPSBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoJHN0YXRlLmN1cnJlbnQubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdhY3RpdmUnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnQmFja2dyb3VuZCcsIEJhY2tncm91bmQpO1xyXG5cclxuXHRCYWNrZ3JvdW5kLiRpbmplY3QgPSBbJ0RyYXdhYmxlJywgJ0ltYWdlUmVwbyddO1xyXG5cclxuXHRmdW5jdGlvbiBCYWNrZ3JvdW5kKERyYXdhYmxlLCBJbWFnZVJlcG8pIHtcclxuXHRcdGZ1bmN0aW9uIGJhY2tncm91bmQoKSB7XHJcblx0XHRcdHRoaXMuc3BlZWQgPSAxOyBcclxuXHRcdFx0dGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdC8vUGFuIGJhY2tncm91bmRcclxuXHRcdFx0XHR0aGlzLnkgKz0gdGhpcy5zcGVlZDtcclxuXHRcdFx0XHR0aGlzLmNvbnRleHQuZHJhd0ltYWdlKEltYWdlUmVwby5iYWNrZ3JvdW5kLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdFx0Ly8gRHJhdyBhbm90aGVyIGltYWdlIGF0IHRoZSB0b3AgZWRnZSBvZiB0aGUgZmlyc3QgaW1hZ2VcclxuXHRcdFx0XHR0aGlzLmNvbnRleHQuZHJhd0ltYWdlKEltYWdlUmVwby5iYWNrZ3JvdW5kLCB0aGlzLngsIHRoaXMueSAtIHRoaXMuY2FudmFzSGVpZ2h0KTtcclxuXHRcdFx0XHQvLyBJZiB0aGUgaW1hZ2Ugc2Nyb2xsZWQgb2ZmIHRoZSBzY3JlZW4sIHJlc2V0XHJcblx0XHRcdFx0aWYgKHRoaXMueSA+PSB0aGlzLmNhbnZhc0hlaWdodCkge1xyXG5cdFx0XHRcdFx0dGhpcy55ID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRiYWNrZ3JvdW5kLnByb3RvdHlwZSA9IG5ldyBEcmF3YWJsZSgpO1xyXG5cdFx0cmV0dXJuIGJhY2tncm91bmQ7XHJcblx0fVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ0J1bGxldCcsIEJ1bGxldCk7XHJcblxyXG5cdEJ1bGxldC4kaW5qZWN0ID0gW1wiRHJhd2FibGVcIixcIkltYWdlUmVwb1wiXTtcclxuXHRmdW5jdGlvbiBCdWxsZXQoRHJhd2FibGUsIEltYWdlUmVwbykge1xyXG5cdFx0ZnVuY3Rpb24gYnVsbGV0KG9iamVjdCkge1xyXG5cdFx0XHR0aGlzLmFsaXZlID0gZmFsc2U7IC8vIElzIHRydWUgaWYgdGhlIGJ1bGxldCBpcyBjdXJyZW50bHkgaW4gdXNlXHJcblx0XHRcdHZhciBzZWxmID0gb2JqZWN0O1xyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBTZXRzIHRoZSBidWxsZXQgdmFsdWVzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLnNwYXduID0gZnVuY3Rpb24gKHgsIHksIHNwZWVkKSB7XHJcblx0XHRcdFx0dGhpcy54ID0geDtcclxuXHRcdFx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0XHRcdHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuXHRcdFx0XHR0aGlzLmFsaXZlID0gdHJ1ZTtcclxuXHRcdFx0fTtcclxuXHRcdFx0dGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuY29udGV4dC5jbGVhclJlY3QodGhpcy54IC0gMSwgdGhpcy55IC0gMSwgdGhpcy53aWR0aCArIDIsIHRoaXMuaGVpZ2h0ICsgMik7XHJcblx0XHRcdFx0dGhpcy55IC09IHRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0aWYgKHRoaXMuaXNDb2xsaWRpbmcpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChzZWxmID09PSBcImJ1bGxldFwiICYmIHRoaXMueSA8PSAwIC0gdGhpcy5oZWlnaHQpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChzZWxmID09PSBcImVuZW15QnVsbGV0XCIgJiYgdGhpcy55ID49IHRoaXMuY2FudmFzSGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRpZiAoc2VsZiA9PT0gXCJidWxsZXRcIikge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNvbnRleHQuZHJhd0ltYWdlKEltYWdlUmVwby5idWxsZXQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHNlbGYgPT09IFwiZW5lbXlCdWxsZXRcIikge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNvbnRleHQuZHJhd0ltYWdlKEltYWdlUmVwby5lbmVteUJ1bGxldCwgdGhpcy54LCB0aGlzLnkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogUmVzZXRzIHRoZSBidWxsZXQgdmFsdWVzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMueCA9IDA7XHJcblx0XHRcdFx0dGhpcy55ID0gMDtcclxuXHRcdFx0XHR0aGlzLnNwZWVkID0gMDtcclxuXHRcdFx0XHR0aGlzLmFsaXZlID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5pc0NvbGxpZGluZyA9IGZhbHNlO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0YnVsbGV0LnByb3RvdHlwZSA9IG5ldyBEcmF3YWJsZSgpO1xyXG5cdFx0cmV0dXJuIGJ1bGxldDtcclxuXHR9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnRHJhd2FibGUnLCBEcmF3YWJsZSk7XHJcblxyXG5cdGZ1bmN0aW9uIERyYXdhYmxlKCkge1xyXG5cdFx0ZnVuY3Rpb24gZHJhd2FibGUoKSB7XHJcblx0XHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcblx0XHRcdFx0Ly8gRGVmYXVsdCB2YXJpYWJsZXNcclxuXHRcdFx0XHR0aGlzLnggPSB4O1xyXG5cdFx0XHRcdHRoaXMueSA9IHk7XHJcblx0XHRcdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xyXG5cdFx0XHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR0aGlzLnNwZWVkID0gMDtcclxuXHRcdFx0dGhpcy5jYW52YXNXaWR0aCA9IDA7XHJcblx0XHRcdHRoaXMuY2FudmFzSGVpZ2h0ID0gMDtcclxuXHRcdFx0dGhpcy5jb2xsaWRhYmxlV2l0aCA9IFwiXCI7XHJcblx0XHRcdHRoaXMuaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy50eXBlID0gXCJcIjtcclxuXHRcdFx0Ly8gRGVmaW5lIGFic3RyYWN0IGZ1bmN0aW9uIHRvIGJlIGltcGxlbWVudGVkIGluIGNoaWxkIG9iamVjdHNcclxuXHRcdFx0dGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR0aGlzLm1vdmUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdH07XHJcblx0XHRcdHRoaXMuaXNDb2xsaWRhYmxlV2l0aCA9IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuXHRcdFx0XHRyZXR1cm4gKHRoaXMuY29sbGlkYWJsZVdpdGggPT09IG9iamVjdC50eXBlKTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBkcmF3YWJsZTtcclxuXHR9XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdFbmVteScsIEVuZW15KTtcclxuXHRFbmVteS4kaW5qZWN0ID0gW1wiRHJhd2FibGVcIiwgIFwiSW1hZ2VSZXBvXCJdO1xyXG5cdGZ1bmN0aW9uIEVuZW15KERyYXdhYmxlLCBJbWFnZVJlcG8pIHtcclxuXHRcdGZ1bmN0aW9uIGVuZW15KCkge1xyXG5cdFx0XHR2YXIgcGVyY2VudEZpcmUgPSAwLjAwNTtcclxuXHRcdFx0dmFyIGNoYW5jZSA9IDA7XHJcblx0XHRcdHRoaXMuYWxpdmUgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy5jb2xsaWRhYmxlV2l0aCA9IFwiYnVsbGV0XCI7XHJcblx0XHRcdHRoaXMudHlwZSA9IFwiZW5lbXlcIjtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogU2V0cyB0aGUgRW5lbXkgdmFsdWVzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLnNwYXduID0gZnVuY3Rpb24gKHgsIHksIHNwZWVkKSB7XHJcblx0XHRcdFx0dGhpcy54ID0geDtcclxuXHRcdFx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0XHRcdHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuXHRcdFx0XHR0aGlzLnNwZWVkWCA9IDA7XHJcblx0XHRcdFx0dGhpcy5zcGVlZFkgPSBzcGVlZDtcclxuXHRcdFx0XHR0aGlzLmFsaXZlID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLmxlZnRFZGdlID0gdGhpcy54IC0gOTA7XHJcblx0XHRcdFx0dGhpcy5yaWdodEVkZ2UgPSB0aGlzLnggKyA5MDtcclxuXHRcdFx0XHR0aGlzLmJvdHRvbUVkZ2UgPSB0aGlzLnkgKyAxNDA7XHJcblx0XHRcdH07XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIE1vdmUgdGhlIGVuZW15XHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy5jb250ZXh0LmNsZWFyUmVjdCh0aGlzLnggLSAxLCB0aGlzLnksIHRoaXMud2lkdGggKyAxLCB0aGlzLmhlaWdodCk7XHJcblx0XHRcdFx0dGhpcy54ICs9IHRoaXMuc3BlZWRYO1xyXG5cdFx0XHRcdHRoaXMueSArPSB0aGlzLnNwZWVkWTtcclxuXHRcdFx0XHRpZiAodGhpcy54IDw9IHRoaXMubGVmdEVkZ2UpIHtcclxuXHRcdFx0XHRcdHRoaXMuc3BlZWRYID0gdGhpcy5zcGVlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAodGhpcy54ID49IHRoaXMucmlnaHRFZGdlICsgdGhpcy53aWR0aCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zcGVlZFggPSAtdGhpcy5zcGVlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAodGhpcy55ID49IHRoaXMuYm90dG9tRWRnZSkge1xyXG5cdFx0XHRcdFx0dGhpcy5zcGVlZCA9IDEuNTtcclxuXHRcdFx0XHRcdHRoaXMuc3BlZWRZID0gMDtcclxuXHRcdFx0XHRcdHRoaXMueSAtPSA1O1xyXG5cdFx0XHRcdFx0dGhpcy5zcGVlZFggPSAtdGhpcy5zcGVlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKCF0aGlzLmlzQ29sbGlkaW5nKSB7XHJcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuZHJhd0ltYWdlKEltYWdlUmVwby5lbmVteSwgdGhpcy54LCB0aGlzLnkpO1xyXG5cdFx0XHRcdFx0Ly8gRW5lbXkgaGFzIGEgY2hhbmNlIHRvIHNob290IGV2ZXJ5IG1vdmVtZW50XHJcblx0XHRcdFx0XHRjaGFuY2UgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDEpO1xyXG5cdFx0XHRcdFx0aWYgKGNoYW5jZSAvIDEwMCA8IHBlcmNlbnRGaXJlKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZmlyZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdGdhbWUucGxheWVyU2NvcmUgKz0gMTAwO1xyXG5cdFx0XHRcdFx0aWYgKGdhbWUucGxheWVyU2NvcmUgJSAyMDAwID09PSAwKSAvL2V2ZXJ5IDIwMDAgcG9pbnRzIGdhaW4gYSBsaWZlXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGdhbWUubGl2ZXMubGlmZUNvdW50Kys7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIEZpcmVzIGEgYnVsbGV0XHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmZpcmUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0Z2FtZS5lbmVteUJ1bGxldFBvb2wuZ2V0KHRoaXMueCArIHRoaXMud2lkdGggLyAyLCB0aGlzLnkgKyB0aGlzLmhlaWdodCwgLTIuNSk7XHJcblx0XHRcdH07XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFJlc2V0cyB0aGUgZW5lbXkgdmFsdWVzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMueCA9IDA7XHJcblx0XHRcdFx0dGhpcy55ID0gMDtcclxuXHRcdFx0XHR0aGlzLnNwZWVkID0gMDtcclxuXHRcdFx0XHR0aGlzLnNwZWVkWCA9IDA7XHJcblx0XHRcdFx0dGhpcy5zcGVlZFkgPSAwO1xyXG5cdFx0XHRcdHRoaXMuYWxpdmUgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmlzQ29sbGlkaW5nID0gZmFsc2U7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRlbmVteS5wcm90b3R5cGUgPSBuZXcgRHJhd2FibGUoKTtcclxuXHRcdHJldHVybiBlbmVteTtcclxuXHR9XHJcbn0oKSk7IiwiYW5ndWxhclxyXG5cdC5tb2R1bGUoJ2FwcCcpXHJcblx0LmNvbnRyb2xsZXIoJ0dhbWVDdHJsJywgR2FtZUN0cmwpO1xyXG5cclxuR2FtZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCAnSW1hZ2VSZXBvJywgJ0JhY2tncm91bmQnLCAnU2hpcCcsICdCdWxsZXQnLFxyXG5cdCdFbmVteScsICdQb29sJywgJ1F1YWRUcmVlJywnTGl2ZXMnXTtcclxuXHJcbnZhciBnYW1lO1xyXG5cclxudmFyIEtFWV9TVEFUVVMgPSB7fTtcclxuXHJcbmZ1bmN0aW9uIEdhbWVDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQsIEltYWdlUmVwbywgQmFja2dyb3VuZCwgU2hpcCwgQnVsbGV0LFxyXG5cdEVuZW15LCBQb29sLCBRdWFkVHJlZSwgTGl2ZXMpIHtcclxuXHR2YXIgZ2FtZVZtID0gdGhpcztcclxuXHRnYW1lVm0uZ2FtZU92ZXIgPSBmYWxzZTtcclxuXHRnYW1lVm0ucmVzdGFydCA9IHJlc3RhcnQ7XHJcblx0Z2FtZSA9IG5ldyBHYW1lKCk7XHJcblx0dmFyIHN0YXRlID0gXCJcIjtcclxuXHJcblx0ZnVuY3Rpb24gaW5pdCgpIHtcclxuXHRcdGlmIChnYW1lLmluaXQoKSkge1xyXG5cdFx0XHRnYW1lLnN0YXJ0KCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdCRzY29wZS4kb24oXCJJbml0XCIsIGluaXQpO1xyXG5cclxuXHQvL3NldHVwIGdhbWUgbG9naWNcclxuXHRmdW5jdGlvbiBHYW1lKCkge1xyXG5cdFx0dGhpcy5pbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR0aGlzLnBsYXllclNjb3JlID0gMDtcclxuXHRcdFx0dGhpcy5iZ0NhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiYWNrZ3JvdW5kJyk7XHJcblx0XHRcdHRoaXMuc2hpcENhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaGlwJyk7XHJcblx0XHRcdHRoaXMubWFpbkNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJyk7XHJcblx0XHRcdC8vIFRlc3QgdG8gc2VlIGlmIGNhbnZhcyBpcyBzdXBwb3J0ZWQuIE9ubHkgbmVlZCB0b1xyXG5cdFx0XHQvLyBjaGVjayBvbmUgY2FudmFzXHJcblx0XHRcdGlmICh0aGlzLmJnQ2FudmFzLmdldENvbnRleHQpIHtcclxuXHRcdFx0XHR0aGlzLmJnQ29udGV4dCA9IHRoaXMuYmdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHRcdFx0XHR0aGlzLnNoaXBDb250ZXh0ID0gdGhpcy5zaGlwQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0XHRcdFx0dGhpcy5tYWluQ29udGV4dCA9IHRoaXMubWFpbkNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgb2JqZWN0cyB0byBjb250YWluIHRoZWlyIGNvbnRleHQgYW5kIGNhbnZhc1xyXG5cdFx0XHRcdC8vIGluZm9ybWF0aW9uXHJcblx0XHRcdFx0QmFja2dyb3VuZC5wcm90b3R5cGUuY29udGV4dCA9IHRoaXMuYmdDb250ZXh0O1xyXG5cdFx0XHRcdEJhY2tncm91bmQucHJvdG90eXBlLmNhbnZhc1dpZHRoID0gdGhpcy5iZ0NhbnZhcy53aWR0aDtcclxuXHRcdFx0XHRCYWNrZ3JvdW5kLnByb3RvdHlwZS5jYW52YXNIZWlnaHQgPSB0aGlzLmJnQ2FudmFzLmhlaWdodDtcclxuXHRcdFx0XHRMaXZlcy5wcm90b3R5cGUuY29udGV4dCA9IHRoaXMuYmdDb250ZXh0O1xyXG5cdFx0XHRcdExpdmVzLnByb3RvdHlwZS5jYW52YXNXaWR0aCA9IHRoaXMuYmdDYW52YXMud2lkdGg7XHJcblx0XHRcdFx0TGl2ZXMucHJvdG90eXBlLmNhbnZhc0hlaWdodCA9IHRoaXMuYmdDYW52YXMuaGVpZ2h0O1xyXG5cdFx0XHRcdFNoaXAucHJvdG90eXBlLmNvbnRleHQgPSB0aGlzLnNoaXBDb250ZXh0O1xyXG5cdFx0XHRcdFNoaXAucHJvdG90eXBlLmNhbnZhc1dpZHRoID0gdGhpcy5zaGlwQ2FudmFzLndpZHRoO1xyXG5cdFx0XHRcdFNoaXAucHJvdG90eXBlLmNhbnZhc0hlaWdodCA9IHRoaXMuc2hpcENhbnZhcy5oZWlnaHQ7XHJcblx0XHRcdFx0QnVsbGV0LnByb3RvdHlwZS5jb250ZXh0ID0gdGhpcy5tYWluQ29udGV4dDtcclxuXHRcdFx0XHRCdWxsZXQucHJvdG90eXBlLmNhbnZhc1dpZHRoID0gdGhpcy5tYWluQ2FudmFzLndpZHRoO1xyXG5cdFx0XHRcdEJ1bGxldC5wcm90b3R5cGUuY2FudmFzSGVpZ2h0ID0gdGhpcy5tYWluQ2FudmFzLmhlaWdodDtcclxuXHRcdFx0XHRFbmVteS5wcm90b3R5cGUuY29udGV4dCA9IHRoaXMubWFpbkNvbnRleHQ7XHJcblx0XHRcdFx0RW5lbXkucHJvdG90eXBlLmNhbnZhc1dpZHRoID0gdGhpcy5tYWluQ2FudmFzLndpZHRoO1xyXG5cdFx0XHRcdEVuZW15LnByb3RvdHlwZS5jYW52YXNIZWlnaHQgPSB0aGlzLm1haW5DYW52YXMuaGVpZ2h0O1xyXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgdGhlIGJhY2tncm91bmQgb2JqZWN0XHJcblx0XHRcdFx0dGhpcy5iYWNrZ3JvdW5kID0gbmV3IEJhY2tncm91bmQoKTtcclxuXHRcdFx0XHR0aGlzLmJhY2tncm91bmQuaW5pdCgwLCAwKTsgLy8gU2V0IGRyYXcgcG9pbnQgdG8gMCwwXHJcblxyXG5cdFx0XHRcdC8vaW5pdGlhbGl6ZSBsaXZlc1xyXG5cdFx0XHRcdHRoaXMubGl2ZXMgPSBuZXcgTGl2ZXMoKTtcclxuXHRcdFx0XHR0aGlzLmxpdmVzLmxpZmVDb3VudCA9IDI7XHJcblx0XHRcdFx0dGhpcy5saXZlcy5pbml0KDAsIHRoaXMuYmdDYW52YXMuaGVpZ2h0IC0gSW1hZ2VSZXBvLnNwYWNlc2hpcC5oZWlnaHQsIEltYWdlUmVwby5zcGFjZXNoaXAud2lkdGgsIEltYWdlUmVwby5zcGFjZXNoaXAuaGVpZ2h0KTtcclxuXHJcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgc2hpcCBvYmplY3RcclxuXHRcdFx0XHR0aGlzLnNoaXAgPSBuZXcgU2hpcCgpO1xyXG5cclxuXHRcdFx0XHQvLyBTZXQgdGhlIHNoaXAgdG8gc3RhcnQgbmVhciB0aGUgYm90dG9tIG1pZGRsZSBvZiB0aGUgY2FudmFzXHJcblx0XHRcdFx0dGhpcy5zaGlwU3RhcnRYID0gdGhpcy5zaGlwQ2FudmFzLndpZHRoIC8gMiAtIEltYWdlUmVwby5zcGFjZXNoaXAud2lkdGg7XHJcblx0XHRcdFx0dGhpcy5zaGlwU3RhcnRZID0gdGhpcy5zaGlwQ2FudmFzLmhlaWdodCAvIDQgKiAzICsgSW1hZ2VSZXBvLnNwYWNlc2hpcC5oZWlnaHQgKiAyO1xyXG5cdFx0XHRcdHRoaXMuc2hpcC5pbml0KHRoaXMuc2hpcFN0YXJ0WCwgdGhpcy5zaGlwU3RhcnRZLFxyXG5cdFx0XHRcdFx0XHRcdCAgIEltYWdlUmVwby5zcGFjZXNoaXAud2lkdGgsIEltYWdlUmVwby5zcGFjZXNoaXAuaGVpZ2h0KTtcdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgdGhlIGVuZW15IHBvb2wgb2JqZWN0XHJcblx0XHRcdFx0dGhpcy5lbmVteVBvb2wgPSBuZXcgUG9vbCgzMCk7XHJcblx0XHRcdFx0dGhpcy5lbmVteVBvb2wuaW5pdChcImVuZW15XCIpO1xyXG5cdFx0XHRcdHRoaXMuc3Bhd25XYXZlKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMuZW5lbXlCdWxsZXRQb29sID0gbmV3IFBvb2woMTApO1xyXG5cdFx0XHRcdHRoaXMuZW5lbXlCdWxsZXRQb29sLmluaXQoXCJlbmVteUJ1bGxldFwiKTtcclxuXHJcblx0XHRcdFx0dGhpcy5xdWFkVHJlZSA9IG5ldyBRdWFkVHJlZSh7IHg6IDAsIHk6IDAsIHdpZHRoOiB0aGlzLm1haW5DYW52YXMud2lkdGgsIGhlaWdodDogdGhpcy5tYWluQ2FudmFzLmhlaWdodCB9KTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5zdGFydCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0Z2FtZS5zaGlwLmRyYXcoKTtcclxuXHRcdFx0YW5pbWF0ZSgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnNwYXduV2F2ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0dmFyIGhlaWdodCA9IEltYWdlUmVwby5lbmVteS5oZWlnaHQ7XHJcblx0XHRcdHZhciB3aWR0aCA9IEltYWdlUmVwby5lbmVteS53aWR0aDtcclxuXHRcdFx0dmFyIHggPSAxMDA7XHJcblx0XHRcdHZhciB5ID0gLWhlaWdodDtcclxuXHRcdFx0dmFyIHNwYWNlciA9IHkgKiAxLjU7XHJcblx0XHRcdGZvciAodmFyIGkgPSAxOyBpIDw9IDE4OyBpKyspIHtcclxuXHRcdFx0XHR0aGlzLmVuZW15UG9vbC5nZXQoeCwgeSwgMik7XHJcblx0XHRcdFx0eCArPSB3aWR0aCArIDI1O1xyXG5cdFx0XHRcdGlmIChpICUgNiA9PT0gMCkge1xyXG5cdFx0XHRcdFx0eCA9IDEwMDtcclxuXHRcdFx0XHRcdHkgKz0gc3BhY2VyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmdhbWVPdmVyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKCcjZ2FtZS1vdmVyJykuY3NzKFwiZGlzcGxheVwiLFwiYmxvY2tcIik7XHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJlc3RhcnQoKSB7XHJcblx0XHQkKCcjZ2FtZS1vdmVyJykuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcblx0XHRnYW1lLmJnQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgZ2FtZS5iZ0NhbnZhcy53aWR0aCwgZ2FtZS5iZ0NhbnZhcy5oZWlnaHQpO1xyXG5cdFx0Z2FtZS5zaGlwQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgZ2FtZS5zaGlwQ2FudmFzLndpZHRoLCBnYW1lLnNoaXBDYW52YXMuaGVpZ2h0KTtcclxuXHRcdGdhbWUubWFpbkNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGdhbWUubWFpbkNhbnZhcy53aWR0aCwgZ2FtZS5tYWluQ2FudmFzLmhlaWdodCk7XHJcblx0XHRnYW1lLnF1YWRUcmVlLmNsZWFyKCk7XHJcblx0XHRnYW1lLmJhY2tncm91bmQuaW5pdCgwLCAwKTtcclxuXHRcdGdhbWUubGl2ZXMubGlmZUNvdW50ID0gMjtcclxuXHRcdGdhbWUubGl2ZXMuaW5pdCgwLCBnYW1lLmJnQ2FudmFzLmhlaWdodCAtIEltYWdlUmVwby5zcGFjZXNoaXAuaGVpZ2h0LCBJbWFnZVJlcG8uc3BhY2VzaGlwLndpZHRoLCBJbWFnZVJlcG8uc3BhY2VzaGlwLmhlaWdodCk7XHJcblx0XHRnYW1lLnNoaXAuaW5pdChnYW1lLnNoaXBTdGFydFgsIGdhbWUuc2hpcFN0YXJ0WSxcclxuXHRcdFx0XHRcdCAgIEltYWdlUmVwby5zcGFjZXNoaXAud2lkdGgsIEltYWdlUmVwby5zcGFjZXNoaXAuaGVpZ2h0KTtcclxuXHRcdGdhbWUuZW5lbXlQb29sLmluaXQoXCJlbmVteVwiKTtcclxuXHRcdGdhbWUuc3Bhd25XYXZlKCk7XHJcblx0XHRnYW1lLmVuZW15QnVsbGV0UG9vbC5pbml0KFwiZW5lbXlCdWxsZXRcIik7XHJcblx0XHRnYW1lLnBsYXllclNjb3JlID0gMDtcclxuXHRcdGdhbWUuc3RhcnQoKTtcclxuXHR9XHJcblxyXG5cdEtFWV9DT0RFUyA9IHtcclxuXHRcdDMyOiAnc3BhY2UnLFxyXG5cdFx0Mzc6ICdsZWZ0JyxcclxuXHRcdDM5OiAncmlnaHQnXHJcblx0fTtcclxuXHRmb3IgKHZhciBjb2RlIGluIEtFWV9DT0RFUykge1xyXG5cdFx0S0VZX1NUQVRVU1tLRVlfQ09ERVNbY29kZV1dID0gZmFsc2U7XHJcblx0fVxyXG5cdGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHQvLyBGaXJlZm94IGFuZCBvcGVyYSB1c2UgY2hhckNvZGUgaW5zdGVhZCBvZiBrZXlDb2RlIHRvXHJcblx0XHQvLyByZXR1cm4gd2hpY2gga2V5IHdhcyBwcmVzc2VkLlxyXG5cdFx0dmFyIGtleUNvZGUgPSAoZS5rZXlDb2RlKSA/IGUua2V5Q29kZSA6IGUuY2hhckNvZGU7XHJcblx0XHRpZiAoS0VZX0NPREVTW2tleUNvZGVdKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0S0VZX1NUQVRVU1tLRVlfQ09ERVNba2V5Q29kZV1dID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9O1xyXG5cdGRvY3VtZW50Lm9ua2V5dXAgPSBmdW5jdGlvbiAoZSkge1xyXG5cdFx0dmFyIGtleUNvZGUgPSAoZS5rZXlDb2RlKSA/IGUua2V5Q29kZSA6IGUuY2hhckNvZGU7XHJcblx0XHRpZiAoS0VZX0NPREVTW2tleUNvZGVdKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0S0VZX1NUQVRVU1tLRVlfQ09ERVNba2V5Q29kZV1dID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRldGVjdENvbGxpc2lvbigpIHtcclxuXHR2YXIgb2JqZWN0cyA9IFtdO1xyXG5cdGdhbWUucXVhZFRyZWUuZ2V0QWxsT2JqZWN0cyhvYmplY3RzKTtcclxuXHRmb3IgKHZhciB4ID0gMCwgbGVuID0gb2JqZWN0cy5sZW5ndGg7IHggPCBsZW47IHgrKykge1xyXG5cdFx0Z2FtZS5xdWFkVHJlZS5maW5kT2JqZWN0cyhvYmogPSBbXSwgb2JqZWN0c1t4XSk7XHJcblx0XHRmb3IgKHkgPSAwLCBsZW5ndGggPSBvYmoubGVuZ3RoOyB5IDwgbGVuZ3RoOyB5KyspIHtcclxuXHRcdFx0Ly8gREVURUNUIENPTExJU0lPTiBBTEdPUklUSE1cclxuXHRcdFx0aWYgKG9iamVjdHNbeF0uY29sbGlkYWJsZVdpdGggPT09IG9ialt5XS50eXBlICYmXHJcblx0XHRcdChvYmplY3RzW3hdLnggPCBvYmpbeV0ueCArIG9ialt5XS53aWR0aCAmJlxyXG5cdFx0XHRvYmplY3RzW3hdLnggKyBvYmplY3RzW3hdLndpZHRoID4gb2JqW3ldLnggJiZcclxuXHRcdFx0b2JqZWN0c1t4XS55IDwgb2JqW3ldLnkgKyBvYmpbeV0uaGVpZ2h0ICYmXHJcblx0XHRcdG9iamVjdHNbeF0ueSArIG9iamVjdHNbeF0uaGVpZ2h0ID4gb2JqW3ldLnkpKSB7XHJcblx0XHRcdFx0b2JqZWN0c1t4XS5pc0NvbGxpZGluZyA9IHRydWU7XHJcblx0XHRcdFx0b2JqW3ldLmlzQ29sbGlkaW5nID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLy9jb25zdGFudGx5IGxvb3BzIGZvciBnYW1lIHN0YXRlXHJcbmZ1bmN0aW9uIGFuaW1hdGUoKSB7XHJcblx0Ly91cGRhdGUgc2NvcmVcclxuXHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2NvcmUnKS5pbm5lckhUTUwgPSBnYW1lLnBsYXllclNjb3JlO1xyXG5cdC8vIEluc2VydCBvYmplY3RzIGludG8gcXVhZHRyZWVcclxuXHRnYW1lLnF1YWRUcmVlLmNsZWFyKCk7XHJcblx0Z2FtZS5xdWFkVHJlZS5pbnNlcnQoZ2FtZS5zaGlwKTtcclxuXHRnYW1lLnF1YWRUcmVlLmluc2VydChnYW1lLnNoaXAuYnVsbGV0UG9vbC5nZXRQb29sKCkpO1xyXG5cdGdhbWUucXVhZFRyZWUuaW5zZXJ0KGdhbWUuZW5lbXlQb29sLmdldFBvb2woKSk7XHJcblx0Z2FtZS5xdWFkVHJlZS5pbnNlcnQoZ2FtZS5lbmVteUJ1bGxldFBvb2wuZ2V0UG9vbCgpKTtcclxuXHRkZXRlY3RDb2xsaXNpb24oKTtcclxuXHQvLyBObyBtb3JlIGVuZW1pZXNcclxuXHRpZiAoZ2FtZS5lbmVteVBvb2wuZ2V0UG9vbCgpLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0Z2FtZS5zcGF3bldhdmUoKTtcclxuXHR9XHJcblx0Ly8gQW5pbWF0ZSBnYW1lIG9iamVjdHNcclxuXHRpZiAoZ2FtZS5zaGlwLmFsaXZlKSB7XHJcblx0cmVxdWVzdEFuaW1GcmFtZShhbmltYXRlKTtcclxuXHRnYW1lLmJhY2tncm91bmQuZHJhdygpO1xyXG5cdGdhbWUuc2hpcC5tb3ZlKCk7XHJcblx0Z2FtZS5zaGlwLmJ1bGxldFBvb2wuYW5pbWF0ZSgpO1xyXG5cdGdhbWUuZW5lbXlQb29sLmFuaW1hdGUoKTtcclxuXHRnYW1lLmVuZW15QnVsbGV0UG9vbC5hbmltYXRlKCk7XHJcblx0Z2FtZS5saXZlcy5kcmF3KCk7XHJcblx0fVxyXG59XHJcblxyXG53aW5kb3cucmVxdWVzdEFuaW1GcmFtZSA9IChmdW5jdGlvbiAoKSB7XHJcblx0cmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdFx0d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG5cdFx0XHR3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG5cdFx0XHRmdW5jdGlvbiAoY2FsbGJhY2ssIGVsZW1lbnQpIHtcclxuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcclxuXHRcdFx0fTtcclxufSkoKTtcclxuXHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ0ltYWdlUmVwbycsIEltYWdlUmVwbyk7XHJcblx0SW1hZ2VSZXBvLiRpbmplY3QgPSBbJyRyb290U2NvcGUnXTtcclxuXHRmdW5jdGlvbiBJbWFnZVJlcG8oJHJvb3RTY29wZSkge1xyXG5cdFx0Ly8gRGVmaW5lIGltYWdlc1xyXG5cdFx0dGhpcy5lbXB0eSA9IG51bGw7XHJcblx0XHR0aGlzLmJhY2tncm91bmQgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMuc3BhY2VzaGlwID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLmJ1bGxldCA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0dGhpcy5lbmVteSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0dGhpcy5lbmVteUJ1bGxldCA9IG5ldyBJbWFnZSgpO1xyXG5cclxuXHRcdHZhciBudW1JbWFnZXMgPSA1O1xyXG5cdFx0dmFyIG51bUxvYWRlZCA9IDA7XHJcblx0XHRmdW5jdGlvbiBpbWFnZUxvYWRlZCgpIHtcclxuXHRcdFx0bnVtTG9hZGVkKys7XHJcblx0XHRcdGlmIChudW1Mb2FkZWQgPT09IG51bUltYWdlcykge1xyXG5cdFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdChcIkluaXRcIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMuYmFja2dyb3VuZC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGltYWdlTG9hZGVkKCk7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5zcGFjZXNoaXAub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpbWFnZUxvYWRlZCgpO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuYnVsbGV0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aW1hZ2VMb2FkZWQoKTtcclxuXHRcdH07XHJcblx0XHR0aGlzLmVuZW15Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aW1hZ2VMb2FkZWQoKTtcclxuXHRcdH07XHJcblx0XHR0aGlzLmVuZW15QnVsbGV0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aW1hZ2VMb2FkZWQoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gU2V0IGltYWdlcyBzcmNcclxuXHRcdHRoaXMuYmFja2dyb3VuZC5zcmMgPSBcImxpYi9pbWFnZXMvYmcucG5nXCI7XHJcblx0XHR0aGlzLnNwYWNlc2hpcC5zcmMgPSBcImxpYi9pbWFnZXMvc2hpcC5wbmdcIjtcclxuXHRcdHRoaXMuYnVsbGV0LnNyYyA9IFwibGliL2ltYWdlcy9idWxsZXQucG5nXCI7XHJcblx0XHR0aGlzLmVuZW15LnNyYyA9IFwibGliL2ltYWdlcy9lbmVteS5wbmdcIjtcclxuXHRcdHRoaXMuZW5lbXlCdWxsZXQuc3JjID0gXCJsaWIvaW1hZ2VzL2J1bGxldF9lbmVteS5wbmdcIjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnTGl2ZXMnLCBMaXZlcyk7XHJcblxyXG5cdExpdmVzLiRpbmplY3QgPSBbJ0RyYXdhYmxlJywgJ0ltYWdlUmVwbyddO1xyXG5cclxuXHRmdW5jdGlvbiBMaXZlcyhEcmF3YWJsZSwgSW1hZ2VSZXBvKSB7XHJcblx0XHR0aGlzLmxpZmVDb3VudCA9IDA7XHJcblx0XHRmdW5jdGlvbiBsaXZlcyh4LHkpIHtcclxuXHRcdFx0dGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdC8vRHJhdyBsaXZlcyBmb3IgZWFjaCBsaWZlIGxlZnRcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGlmZUNvdW50OyBpKyspIHtcclxuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5kcmF3SW1hZ2UoSW1hZ2VSZXBvLnNwYWNlc2hpcCwgaSAqIHRoaXMud2lkdGgsIHRoaXMueSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0bGl2ZXMucHJvdG90eXBlID0gbmV3IERyYXdhYmxlKCk7XHJcblx0XHRyZXR1cm4gbGl2ZXM7XHJcblx0fVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ1Bvb2wnLCBQb29sKTtcclxuXHRQb29sLiRpbmplY3QgPSBbJ0ltYWdlUmVwbycsJ0J1bGxldCcsJ0VuZW15J107XHJcblx0ZnVuY3Rpb24gUG9vbChJbWFnZVJlcG8sQnVsbGV0LEVuZW15KSB7XHJcblx0XHQvKipcclxuXHRcdCogQ3VzdG9tIFBvb2wgb2JqZWN0LiBIb2xkcyBCdWxsZXQgb2JqZWN0cyB0byBiZSBtYW5hZ2VkIHRvIHByZXZlbnRcclxuXHRcdCogZ2FyYmFnZSBjb2xsZWN0aW9uLlxyXG5cdFx0Ki9cclxuXHRcdGZ1bmN0aW9uIHBvb2xzKG1heFNpemUpIHtcclxuXHRcdFx0dmFyIHNpemUgPSBtYXhTaXplOyAvLyBNYXggYnVsbGV0cyBhbGxvd2VkIGluIHRoZSBwb29sXHJcblx0XHRcdHZhciBwb29sID0gW107XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFBvcHVsYXRlcyB0aGUgcG9vbCBhcnJheSB3aXRoIEJ1bGxldCBvYmplY3RzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAob2JqZWN0KSB7XHJcblx0XHRcdFx0aWYgKG9iamVjdCA9PSBcImJ1bGxldFwiKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xyXG5cdFx0XHRcdFx0XHQvLyBJbml0YWxpemUgdGhlIG9iamVjdFxyXG5cdFx0XHRcdFx0XHR2YXIgYnVsbGV0ID0gbmV3IEJ1bGxldChcImJ1bGxldFwiKTtcclxuXHRcdFx0XHRcdFx0YnVsbGV0LmluaXQoMCwgMCwgSW1hZ2VSZXBvLmJ1bGxldC53aWR0aCwgSW1hZ2VSZXBvLmJ1bGxldC5oZWlnaHQpO1xyXG5cdFx0XHRcdFx0XHRidWxsZXQuY29sbGlkYWJsZVdpdGggPSBcImVuZW15XCI7XHJcblx0XHRcdFx0XHRcdGJ1bGxldC50eXBlID0gXCJidWxsZXRcIjtcclxuXHRcdFx0XHRcdFx0cG9vbFtpXSA9IGJ1bGxldDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAob2JqZWN0ID09IFwiZW5lbXlcIikge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBzaXplOyBqKyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIGVuZW15ID0gbmV3IEVuZW15KCk7XHJcblx0XHRcdFx0XHRcdGVuZW15LmluaXQoMCwgMCwgSW1hZ2VSZXBvLmVuZW15LndpZHRoLCBJbWFnZVJlcG8uZW5lbXkuaGVpZ2h0KTtcclxuXHRcdFx0XHRcdFx0cG9vbFtqXSA9IGVuZW15O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChvYmplY3QgPT0gXCJlbmVteUJ1bGxldFwiKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBrID0gMDsgayA8IHNpemU7IGsrKykge1xyXG5cdFx0XHRcdFx0XHR2YXIgYnVsbGV0ID0gbmV3IEJ1bGxldChcImVuZW15QnVsbGV0XCIpO1xyXG5cdFx0XHRcdFx0XHRidWxsZXQuaW5pdCgwLCAwLCBJbWFnZVJlcG8uZW5lbXlCdWxsZXQud2lkdGgsIEltYWdlUmVwby5lbmVteUJ1bGxldC5oZWlnaHQpO1xyXG5cdFx0XHRcdFx0XHRidWxsZXQuY29sbGlkYWJsZVdpdGggPSBcInNoaXBcIjtcclxuXHRcdFx0XHRcdFx0YnVsbGV0LnR5cGUgPSBcImVuZW15QnVsbGV0XCI7XHJcblx0XHRcdFx0XHRcdHBvb2xba10gPSBidWxsZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR0aGlzLmdldFBvb2wgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIG9iaiA9IFtdO1xyXG5cdFx0XHRcdGZvciAodmFyIGwgPSAwOyBsIDwgc2l6ZTsgbCsrKSB7XHJcblx0XHRcdFx0XHRpZiAocG9vbFtsXS5hbGl2ZSkge1xyXG5cdFx0XHRcdFx0XHRvYmoucHVzaChwb29sW2xdKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIG9iajtcclxuXHRcdFx0fTtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogR3JhYnMgdGhlIGxhc3QgaXRlbSBpbiB0aGUgbGlzdCBhbmQgaW5pdGlhbGl6ZXMgaXQgYW5kXHJcblx0XHRcdCAqIHB1c2hlcyBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIGFycmF5LlxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5nZXQgPSBmdW5jdGlvbiAoeCwgeSwgc3BlZWQpIHtcclxuXHRcdFx0XHRpZiAoIXBvb2xbc2l6ZSAtIDFdLmFsaXZlKSB7XHJcblx0XHRcdFx0XHRwb29sW3NpemUgLSAxXS5zcGF3bih4LCB5LCBzcGVlZCk7XHJcblx0XHRcdFx0XHRwb29sLnVuc2hpZnQocG9vbC5wb3AoKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICogRHJhd3MgYW55IGluIHVzZSBCdWxsZXRzLiBJZiBhIGJ1bGxldCBnb2VzIG9mZiB0aGUgc2NyZWVuLFxyXG5cdFx0XHQgKiBjbGVhcnMgaXQgYW5kIHB1c2hlcyBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIGFycmF5LlxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5hbmltYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XHJcblx0XHRcdFx0XHQvLyBPbmx5IGRyYXcgdW50aWwgd2UgZmluZCBhIGJ1bGxldCB0aGF0IGlzIG5vdCBhbGl2ZVxyXG5cdFx0XHRcdFx0aWYgKHBvb2xbaV0uYWxpdmUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHBvb2xbaV0uZHJhdygpKSB7XHJcblx0XHRcdFx0XHRcdFx0cG9vbFtpXS5jbGVhcigpO1xyXG5cdFx0XHRcdFx0XHRcdHBvb2wucHVzaCgocG9vbC5zcGxpY2UoaSwgMSkpWzBdKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcG9vbHM7XHJcblx0fVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ1F1YWRUcmVlJywgUXVhZFRyZWUpO1xyXG5cclxuXHRmdW5jdGlvbiBRdWFkVHJlZSgpIHtcclxuXHRcdGZ1bmN0aW9uIHF1YWRUcmVlKGJvdW5kQm94LCBsdmwpIHtcclxuXHRcdFx0dmFyIG1heE9iamVjdHMgPSAxMDtcclxuXHRcdFx0dGhpcy5ib3VuZHMgPSBib3VuZEJveCB8fCB7XHJcblx0XHRcdFx0eDogMCxcclxuXHRcdFx0XHR5OiAwLFxyXG5cdFx0XHRcdHdpZHRoOiAwLFxyXG5cdFx0XHRcdGhlaWdodDogMFxyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIgb2JqZWN0cyA9IFtdO1xyXG5cdFx0XHR0aGlzLm5vZGVzID0gW107XHJcblx0XHRcdHZhciBsZXZlbCA9IGx2bCB8fCAwO1xyXG5cdFx0XHR2YXIgbWF4TGV2ZWxzID0gNTtcclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIENsZWFycyB0aGUgcXVhZFRyZWUgYW5kIGFsbCBub2RlcyBvZiBvYmplY3RzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdG9iamVjdHMgPSBbXTtcclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHR0aGlzLm5vZGVzW2ldLmNsZWFyKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLm5vZGVzID0gW107XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBHZXQgYWxsIG9iamVjdHMgaW4gdGhlIHF1YWRUcmVlXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmdldEFsbE9iamVjdHMgPSBmdW5jdGlvbiAocmV0dXJuZWRPYmplY3RzKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHR0aGlzLm5vZGVzW2ldLmdldEFsbE9iamVjdHMocmV0dXJuZWRPYmplY3RzKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBvYmplY3RzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRyZXR1cm5lZE9iamVjdHMucHVzaChvYmplY3RzW2ldKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiByZXR1cm5lZE9iamVjdHM7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBSZXR1cm4gYWxsIG9iamVjdHMgdGhhdCB0aGUgb2JqZWN0IGNvdWxkIGNvbGxpZGUgd2l0aFxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5maW5kT2JqZWN0cyA9IGZ1bmN0aW9uIChyZXR1cm5lZE9iamVjdHMsIG9iaikge1xyXG5cdFx0XHRcdGlmICh0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlVOREVGSU5FRCBPQkpFQ1RcIik7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4KG9iaik7XHJcblx0XHRcdFx0aWYgKGluZGV4ICE9IC0xICYmIHRoaXMubm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHR0aGlzLm5vZGVzW2luZGV4XS5maW5kT2JqZWN0cyhyZXR1cm5lZE9iamVjdHMsIG9iaik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gb2JqZWN0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0cmV0dXJuZWRPYmplY3RzLnB1c2gob2JqZWN0c1tpXSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gcmV0dXJuZWRPYmplY3RzO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICogSW5zZXJ0IHRoZSBvYmplY3QgaW50byB0aGUgcXVhZFRyZWUuIElmIHRoZSB0cmVlXHJcblx0XHRcdCAqIGV4Y2VkZXMgdGhlIGNhcGFjaXR5LCBpdCB3aWxsIHNwbGl0IGFuZCBhZGQgYWxsXHJcblx0XHRcdCAqIG9iamVjdHMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBub2Rlcy5cclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuaW5zZXJ0ID0gZnVuY3Rpb24gKG9iaikge1xyXG5cdFx0XHRcdGlmICh0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBvYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5pbnNlcnQob2JqW2ldKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodGhpcy5ub2Rlcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdHZhciBub2RlID0gdGhpcy5nZXRJbmRleChvYmopO1xyXG5cdFx0XHRcdFx0Ly8gT25seSBhZGQgdGhlIG9iamVjdCB0byBhIHN1Ym5vZGUgaWYgaXQgY2FuIGZpdCBjb21wbGV0ZWx5XHJcblx0XHRcdFx0XHQvLyB3aXRoaW4gb25lXHJcblx0XHRcdFx0XHRpZiAoIG5vZGUgIT0gLTEpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5ub2Rlc1tub2RlXS5pbnNlcnQob2JqKTtcclxuXHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG9iamVjdHMucHVzaChvYmopO1xyXG5cclxuXHRcdFx0XHQvLyBQcmV2ZW50IGluZmluaXRlIHNwbGl0dGluZ1xyXG5cdFx0XHRcdGlmIChvYmplY3RzLmxlbmd0aCA+IG1heE9iamVjdHMgJiYgbGV2ZWwgPCBtYXhMZXZlbHMpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLm5vZGVzWzBdID09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5zcGxpdCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBpID0gMDtcclxuXHRcdFx0XHRcdHdoaWxlIChpIDwgb2JqZWN0cy5sZW5ndGgpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBpbmRleCA9IHRoaXMuZ2V0SW5kZXgob2JqZWN0c1tpXSk7XHJcblx0XHRcdFx0XHRcdGlmIChpbmRleCAhPSAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMubm9kZXNbaW5kZXhdLmluc2VydCgob2JqZWN0cy5zcGxpY2UoaSwgMSkpWzBdKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRpKys7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBEZXRlcm1pbmUgd2hpY2ggbm9kZSB0aGUgb2JqZWN0IGJlbG9uZ3MgdG8uIC0xIG1lYW5zXHJcblx0XHRcdCAqIG9iamVjdCBjYW5ub3QgY29tcGxldGVseSBmaXQgd2l0aGluIGEgbm9kZSBhbmQgaXMgcGFydFxyXG5cdFx0XHQgKiBvZiB0aGUgY3VycmVudCBub2RlXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmdldEluZGV4ID0gZnVuY3Rpb24gKG9iaikge1xyXG5cclxuXHRcdFx0XHR2YXIgaW5kZXggPSAtMTtcclxuXHRcdFx0XHR2YXIgdmVydGljYWxNaWRwb2ludCA9IHRoaXMuYm91bmRzLnggKyB0aGlzLmJvdW5kcy53aWR0aCAvIDI7XHJcblx0XHRcdFx0dmFyIGhvcml6b250YWxNaWRwb2ludCA9IHRoaXMuYm91bmRzLnkgKyB0aGlzLmJvdW5kcy5oZWlnaHQgLyAyO1xyXG5cclxuXHRcdFx0XHQvLyBPYmplY3QgY2FuIGZpdCBjb21wbGV0ZWx5IHdpdGhpbiB0aGUgdG9wIHF1YWRyYW50XHJcblx0XHRcdFx0dmFyIHRvcFF1YWRyYW50ID0gKG9iai55IDwgaG9yaXpvbnRhbE1pZHBvaW50ICYmIG9iai55ICsgb2JqLmhlaWdodCA8IGhvcml6b250YWxNaWRwb2ludCk7XHJcblx0XHRcdFx0Ly8gT2JqZWN0IGNhbiBmaXQgY29tcGxldGVseSB3aXRoaW4gdGhlIGJvdHRvbSBxdWFuZHJhbnRcclxuXHRcdFx0XHR2YXIgYm90dG9tUXVhZHJhbnQgPSAob2JqLnkgPiBob3Jpem9udGFsTWlkcG9pbnQpO1xyXG5cclxuXHRcdFx0XHQvLyBPYmplY3QgY2FuIGZpdCBjb21wbGV0ZWx5IHdpdGhpbiB0aGUgbGVmdCBxdWFkcmFudHNcclxuXHRcdFx0XHRpZiAob2JqLnggPCB2ZXJ0aWNhbE1pZHBvaW50ICYmXHJcblx0XHRcdFx0XHRcdG9iai54ICsgb2JqLndpZHRoIDwgdmVydGljYWxNaWRwb2ludCkge1xyXG5cdFx0XHRcdFx0aWYgKHRvcFF1YWRyYW50KSB7XHJcblx0XHRcdFx0XHRcdGluZGV4ID0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKGJvdHRvbVF1YWRyYW50KSB7XHJcblx0XHRcdFx0XHRcdGluZGV4ID0gMjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBPYmplY3QgY2FuIGZpeCBjb21wbGV0ZWx5IHdpdGhpbiB0aGUgcmlnaHQgcXVhbmRyYW50c1xyXG5cdFx0XHRcdGVsc2UgaWYgKG9iai54ID4gdmVydGljYWxNaWRwb2ludCkge1xyXG5cdFx0XHRcdFx0aWYgKHRvcFF1YWRyYW50KSB7XHJcblx0XHRcdFx0XHRcdGluZGV4ID0gMDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKGJvdHRvbVF1YWRyYW50KSB7XHJcblx0XHRcdFx0XHRcdGluZGV4ID0gMztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBpbmRleDtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFNwbGl0cyB0aGUgbm9kZSBpbnRvIDQgc3Vibm9kZXNcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuc3BsaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0Ly8gQml0d2lzZSBvciBbaHRtbDVyb2Nrc11cclxuXHRcdFx0XHR2YXIgc3ViV2lkdGggPSAodGhpcy5ib3VuZHMud2lkdGggLyAyKSB8IDA7XHJcblx0XHRcdFx0dmFyIHN1YkhlaWdodCA9ICh0aGlzLmJvdW5kcy5oZWlnaHQgLyAyKSB8IDA7XHJcblxyXG5cdFx0XHRcdHRoaXMubm9kZXNbMF0gPSBuZXcgcXVhZFRyZWUoe1xyXG5cdFx0XHRcdFx0eDogdGhpcy5ib3VuZHMueCArIHN1YldpZHRoLFxyXG5cdFx0XHRcdFx0eTogdGhpcy5ib3VuZHMueSxcclxuXHRcdFx0XHRcdHdpZHRoOiBzdWJXaWR0aCxcclxuXHRcdFx0XHRcdGhlaWdodDogc3ViSGVpZ2h0XHJcblx0XHRcdFx0fSwgbGV2ZWwgKyAxKTtcclxuXHRcdFx0XHR0aGlzLm5vZGVzWzFdID0gbmV3IHF1YWRUcmVlKHtcclxuXHRcdFx0XHRcdHg6IHRoaXMuYm91bmRzLngsXHJcblx0XHRcdFx0XHR5OiB0aGlzLmJvdW5kcy55LFxyXG5cdFx0XHRcdFx0d2lkdGg6IHN1YldpZHRoLFxyXG5cdFx0XHRcdFx0aGVpZ2h0OiBzdWJIZWlnaHRcclxuXHRcdFx0XHR9LCBsZXZlbCArIDEpO1xyXG5cdFx0XHRcdHRoaXMubm9kZXNbMl0gPSBuZXcgcXVhZFRyZWUoe1xyXG5cdFx0XHRcdFx0eDogdGhpcy5ib3VuZHMueCxcclxuXHRcdFx0XHRcdHk6IHRoaXMuYm91bmRzLnkgKyBzdWJIZWlnaHQsXHJcblx0XHRcdFx0XHR3aWR0aDogc3ViV2lkdGgsXHJcblx0XHRcdFx0XHRoZWlnaHQ6IHN1YkhlaWdodFxyXG5cdFx0XHRcdH0sIGxldmVsICsgMSk7XHJcblx0XHRcdFx0dGhpcy5ub2Rlc1szXSA9IG5ldyBxdWFkVHJlZSh7XHJcblx0XHRcdFx0XHR4OiB0aGlzLmJvdW5kcy54ICsgc3ViV2lkdGgsXHJcblx0XHRcdFx0XHR5OiB0aGlzLmJvdW5kcy55ICsgc3ViSGVpZ2h0LFxyXG5cdFx0XHRcdFx0d2lkdGg6IHN1YldpZHRoLFxyXG5cdFx0XHRcdFx0aGVpZ2h0OiBzdWJIZWlnaHRcclxuXHRcdFx0XHR9LCBsZXZlbCArIDEpO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHF1YWRUcmVlO1xyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdTaGlwJywgU2hpcCk7XHJcblx0U2hpcC4kaW5qZWN0ID0gW1wiRHJhd2FibGVcIiwgXCJQb29sXCIsIFwiSW1hZ2VSZXBvXCJdO1xyXG5cdGZ1bmN0aW9uIFNoaXAoRHJhd2FibGUsIFBvb2wsIEltYWdlUmVwbykge1xyXG5cdFx0ZnVuY3Rpb24gc2hpcCgpIHtcclxuXHRcdFx0dGhpcy5zcGVlZCA9IDU7XHJcblx0XHRcdHRoaXMuYnVsbGV0UG9vbCA9IG5ldyBQb29sKDEpO1xyXG5cdFx0XHR0aGlzLmJ1bGxldFBvb2wuaW5pdChcImJ1bGxldFwiKTtcclxuXHRcdFx0dmFyIGZpcmVSYXRlID0gMTtcclxuXHRcdFx0dmFyIGNvdW50ZXIgPSAwO1xyXG5cdFx0XHR0aGlzLmNvbGxpZGFibGVXaXRoID0gXCJlbmVteUJ1bGxldFwiO1xyXG5cdFx0XHR0aGlzLnR5cGUgPSBcInNoaXBcIjtcclxuXHJcblx0XHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcblx0XHRcdFx0Ly8gRGVmYXVsdCB2YXJpYWJsZXNcclxuXHRcdFx0XHR0aGlzLnggPSB4O1xyXG5cdFx0XHRcdHRoaXMueSA9IHk7XHJcblx0XHRcdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xyXG5cdFx0XHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFx0XHRcdHRoaXMuYWxpdmUgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMuaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmJ1bGxldFBvb2wuaW5pdChcImJ1bGxldFwiKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHQvLyBGaW5pc2ggYnkgcmVkcmF3aW5nIHRoZSBzaGlwXHJcblx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uc3BhY2VzaGlwLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdH07XHJcblx0XHRcdHRoaXMubW92ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRjb3VudGVyKys7XHJcblx0XHRcdFx0Ly8gRGV0ZXJtaW5lIGlmIHRoZSBhY3Rpb24gaXMgbW92ZSBhY3Rpb25cclxuXHRcdFx0XHRpZiAoS0VZX1NUQVRVUy5sZWZ0IHx8IEtFWV9TVEFUVVMucmlnaHQpIHtcclxuXHRcdFx0XHRcdC8vIFRoZSBzaGlwIG1vdmVkLCBzbyBlcmFzZSBpdCdzIGN1cnJlbnQgaW1hZ2Ugc28gaXQgY2FuXHJcblx0XHRcdFx0XHQvLyBiZSByZWRyYXduIGluIGl0J3MgbmV3IGxvY2F0aW9uXHJcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblx0XHRcdFx0XHQvLyBVcGRhdGUgeCBhbmQgeSBhY2NvcmRpbmcgdG8gdGhlIGRpcmVjdGlvbiB0byBtb3ZlIGFuZFxyXG5cdFx0XHRcdFx0Ly8gcmVkcmF3IHRoZSBzaGlwLiBDaGFuZ2UgdGhlIGVsc2UgaWYncyB0byBpZiBzdGF0ZW1lbnRzXHJcblx0XHRcdFx0XHQvLyB0byBoYXZlIGRpYWdvbmFsIG1vdmVtZW50LlxyXG5cdFx0XHRcdFx0aWYgKEtFWV9TVEFUVVMubGVmdCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnggLT0gdGhpcy5zcGVlZDtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMueCA8PSAwKSAvLyBLZWVwIHBsYXllciB3aXRoaW4gdGhlIHNjcmVlblxyXG5cdFx0XHRcdFx0XHRcdHRoaXMueCA9IDA7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKEtFWV9TVEFUVVMucmlnaHQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy54ICs9IHRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLnggPj0gdGhpcy5jYW52YXNXaWR0aCAtIHRoaXMud2lkdGgpXHJcblx0XHRcdFx0XHRcdFx0dGhpcy54ID0gdGhpcy5jYW52YXNXaWR0aCAtIHRoaXMud2lkdGg7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNDb2xsaWRpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kcmF3KCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoS0VZX1NUQVRVUy5zcGFjZSAmJiBjb3VudGVyID49IGZpcmVSYXRlICYmICF0aGlzLmlzQ29sbGlkaW5nKSB7XHJcblx0XHRcdFx0XHR0aGlzLmZpcmUoKTtcclxuXHRcdFx0XHRcdGNvdW50ZXIgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuaXNDb2xsaWRpbmcgJiYgZ2FtZS5saXZlcy5saWZlQ291bnQgPiAwKSB7XHJcblx0XHRcdFx0XHRnYW1lLmxpdmVzLmxpZmVDb3VudCAtPSAxO1xyXG5cdFx0XHRcdFx0dGhpcy5pc0NvbGxpZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmICh0aGlzLmlzQ29sbGlkaW5nKSB7XHJcblx0XHRcdFx0XHR0aGlzLmFsaXZlID0gZmFsc2U7XHJcblx0XHRcdFx0XHRnYW1lLmdhbWVPdmVyKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBGaXJlcyB0d28gYnVsbGV0c1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5maXJlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuYnVsbGV0UG9vbC5nZXQodGhpcy54ICsgMTksIHRoaXMueSAtIDMsIDMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0c2hpcC5wcm90b3R5cGUgPSBuZXcgRHJhd2FibGUoKTtcclxuXHRcdHJldHVybiBzaGlwO1xyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdIb21lQ3RybCcsIEhvbWVDdHJsKTtcclxuXHJcbiAgICBIb21lQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckdGltZW91dCddO1xyXG5cclxuICAgICBmdW5jdGlvbiBIb21lQ3RybCgkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIGhvbWVWbSA9IHRoaXM7XHJcbiAgICAgICAgaG9tZVZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICBob21lVm0ubG9hZFBpbnMgPSBsb2FkUGlucygpO1xyXG4gICAgICAgIGhvbWVWbS5teU1hcmtlciA9IHt9O1xyXG4gICAgICAgICRyb290U2NvcGUudGl0bGUgPSBcIkhvbWVcIjtcclxuXHJcbiAgICAgICAgdmFyIGRlZmF1bHRMYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDM3LjA5MDI0LCAtOTUuNzEyODkxKTtcclxuICAgICAgICB2YXIgZGlyZWN0aW9uc0Rpc3BsYXkgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyKHtcclxuICAgICAgICAgICAgc3VwcHJlc3NNYXJrZXJzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGRpcmVjdGlvbnNTZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTZXJ2aWNlKCk7XHJcbiAgICAgICAgdmFyIHRyYWZmaWNMYXllciA9IG5ldyBnb29nbGUubWFwcy5UcmFmZmljTGF5ZXIoKTtcclxuXHJcbiAgICAgICAgaG9tZVZtLm1hcE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHpvb206IDQsXHJcbiAgICAgICAgICAgIGNlbnRlcjogZGVmYXVsdExhdExuZyxcclxuICAgICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uQ29udHJvbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHNjYWxlQ29udHJvbDogZmFsc2UsXHJcbiAgICAgICAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZERvbUxpc3RlbmVyKHdpbmRvdywgXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY2VudGVyID0gJHNjb3BlLm1hcC5nZXRDZW50ZXIoKTtcclxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcigkc2NvcGUubWFwLCBcInJlc2l6ZVwiKTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5zZXRDZW50ZXIoY2VudGVyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaW5pdCgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICAkdGltZW91dChsb2FkUGlucywgMjAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRQaW5zKCkge1xyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLm1hcCkge1xyXG4gICAgICAgICAgICAgICAgX3BsYWNlTXlzZWxmKCk7XHJcbiAgICAgICAgICAgICAgICAvL2dldCBjdXJyZW50IGxvY2F0aW9uIGFuZCBwbGFjZSB1c2VyIHBpblxyXG4gICAgICAgICAgICAgICAgaWYgKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKF9wbG90TG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfcGxhY2VNeXNlbGYoKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoXCI0Mi4yNDA4NDVcIiwgXCItODMuMjM0MDk3XCIpO1xyXG4gICAgICAgICAgICBob21lVm0ubXlNYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsb2NhdGlvbixcclxuICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRhbWlhbiBTdHJvbmdcIixcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1BcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vcmVib3VuZCB2aWV3XHJcbiAgICAgICAgICAgIGhvbWVWbS5ib3VuZHMuZXh0ZW5kKGxvY2F0aW9uKTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5maXRCb3VuZHMoaG9tZVZtLmJvdW5kcyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy9kcm9wIHBpbiBvbiBtYXAgZm9yIGxvY2F0aW9uXHJcbiAgICAgICAgZnVuY3Rpb24gX3Bsb3RMb2NhdGlvbihwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAvL2NyZWF0ZSBtYXJrZXJcclxuICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJZb3UgQXJlIEhlcmVcIixcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1BcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vcmVib3VuZCB2aWV3XHJcbiAgICAgICAgICAgIGhvbWVWbS5ib3VuZHMuZXh0ZW5kKGxvY2F0aW9uKTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5maXRCb3VuZHMoaG9tZVZtLmJvdW5kcyk7XHJcblxyXG4gICAgICAgICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZSh7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW46bG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogaG9tZVZtLm15TWFya2VyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuVHJhdmVsTW9kZS5EUklWSU5HXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3VsdCwgc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKCRzY29wZS5tYXApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsb2FkUGluczogbG9hZFBpbnNcclxuICAgICAgICB9O1xyXG4gICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01vdmVDdHJsJywgTW92ZUN0cmwpO1xyXG5cclxuXHRNb3ZlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckdGltZW91dCddO1xyXG5cclxuXHRmdW5jdGlvbiBNb3ZlQ3RybCgkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0KSB7XHJcblx0XHR2YXIgbW92ZWFibGUgPSB0aGlzO1xyXG5cdFx0bW92ZWFibGUuZG90TnVtID0gMDtcclxuXHRcdG1vdmVhYmxlLnNjb3JlID0gMDtcclxuXHRcdG1vdmVhYmxlLmRvdHMgPSBbXTtcclxuXHRcdCQod2luZG93KS5rZXlkb3duKF9rZXkpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9rZXkoZSkge1xyXG5cdFx0XHRpZiAoJCgnLm1vdmVhYmxlJykubGVuZ3RoKSB7XHJcblx0XHRcdFx0dmFyIGV2ZW50ID0gd2luZG93LmV2ZW50ID8gd2luZG93LmV2ZW50IDogZTtcclxuXHRcdFx0XHRzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuXHRcdFx0XHRcdGNhc2UgMzc6IC8vbGVmdFxyXG5cdFx0XHRcdFx0XHRfbW92ZSgnbCcpO1xyXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAzODogLy91cFxyXG5cdFx0XHRcdFx0XHRfbW92ZSgndScpO1xyXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAzOTogLy9yaWdodFxyXG5cdFx0XHRcdFx0XHRfbW92ZSgncicpO1xyXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA0MDogLy9kb3duXHJcblx0XHRcdFx0XHRcdF9tb3ZlKCdkJyk7XHJcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBfbW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdFx0XHR2YXIgc3BlZWQgPSAxNjtcclxuXHRcdFx0XHR2YXIgbWF4RG90cyA9IDM7XHJcblx0XHRcdFx0dmFyIHNpemUgPSAkKCcubW92ZWFibGUnKS5oZWlnaHQoKTtcclxuXHRcdFx0XHR2YXIgY2hhcmFjdGVyID0gJCgnLm1vdmVhYmxlJyk7XHJcblx0XHRcdFx0Ly9nZXQgY3VycmVudCBwb3NpdGlvblxyXG5cdFx0XHRcdHZhciBwb3MgPSBjaGFyYWN0ZXIub2Zmc2V0KCk7XHJcblx0XHRcdFx0Ly9tb2RpZnkgYnkgc3BlZWQgYW5kIGRpcmVjdGlvblxyXG5cdFx0XHRcdHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcblx0XHRcdFx0XHRjYXNlICdsJzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy5sZWZ0IC0gc3BlZWQgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHBvcy5sZWZ0IC0gc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IDAgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdyJzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy5sZWZ0ICsgKHNpemUgKyBzcGVlZCArIDIwKSA8IHdpbmRvdy5pbm5lcldpZHRoKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHBvcy5sZWZ0ICsgc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHdpbmRvdy5pbm5lcldpZHRoIC0gKHNpemUgKyAyMCkgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd1JzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy50b3AgLSBzcGVlZCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFyYWN0ZXIub2Zmc2V0KHsgdG9wOiBwb3MudG9wIC0gc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IHRvcDogMCB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2QnOlxyXG5cdFx0XHRcdFx0XHRpZiAocG9zLnRvcCArIChzaXplICsgc3BlZWQpIDwgd2luZG93LmlubmVySGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IHRvcDogcG9zLnRvcCArIHNwZWVkIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGNoYXJhY3Rlci5vZmZzZXQoeyB0b3A6IHdpbmRvdy5pbm5lckhlaWdodCAtIHNpemUgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vc3Bhd24gZG90IG9uIGZpcnN0IG1vdmVcclxuXHRcdFx0XHRpZiAobW92ZWFibGUuZG90cy5sZW5ndGggPCBtYXhEb3RzKSB7XHJcblx0XHRcdFx0XHRfc3Bhd25Eb3QoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb3ZlYWJsZS5kb3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRfY2hlY2tDb2xsaXNpb24obW92ZWFibGUuZG90c1tpXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2NoZWNrQ29sbGlzaW9uKGRvdCkge1xyXG5cdFx0XHR2YXIgZGJkcyA9IF9nZXRCb3VuZHMoZG90LmlkKTtcclxuXHRcdFx0dmFyIGNiZHMgPSBfZ2V0Qm91bmRzKFwiLm1vdmVhYmxlXCIpO1xyXG5cdFx0XHQvL2NoZWNrIGZvciBjb2xsaXNpb24gd2l0aCBkb3RcclxuXHRcdFx0dmFyIGNvbHMgPSBjb2xsaWRlKGRiZHMsIGNiZHMpO1xyXG5cdFx0XHRpZiAoY29scykge1xyXG5cdFx0XHRcdF9raWxsRG90KGRvdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBjb2xsaWRlKGEsIGIpIHtcclxuXHRcdFx0cmV0dXJuIChhLmxlZnQgPCBiLmxlZnQgKyBiLndpZHRoICYmIGEubGVmdCArIGEud2lkdGggPiBiLmxlZnQgJiZcclxuXHRcdGEudG9wIDwgYi50b3AgKyBiLmhlaWdodCAmJiBhLnRvcCArIGEuaGVpZ2h0ID4gYi50b3ApO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gX3NwYXduRG90KCkge1xyXG5cdFx0XHR2YXIgZG90ID0ge1xyXG5cdFx0XHRcdGFsaXZlOiB0cnVlLFxyXG5cdFx0XHRcdHBvczogX2RvdFBvcyxcclxuXHRcdFx0XHRpZDogXCIuZG90XCIgKyBtb3ZlYWJsZS5kb3ROdW1cclxuXHRcdFx0fTtcclxuXHRcdFx0Ly9hZGQgbmV3IGRvdCB0byBhcnJheVxyXG5cdFx0XHRtb3ZlYWJsZS5kb3RzLnB1c2goZG90KTtcclxuXHRcdFx0JChcIi5kb3RzXCIpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImRvdCBkb3QnICsgbW92ZWFibGUuZG90TnVtICsgJ1wiIG5nLXNob3c9XCJkb3QuYWxpdmVcIj48L2Rpdj4nKTtcclxuXHRcdFx0bW92ZWFibGUuZG90TnVtKys7XHJcblx0XHRcdC8vcG9wdWxhdGUgaWQgb2YgZG90IGZvciByZWZlcmVuY2VcclxuXHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcclxuXHRcdFx0Ly9zZXQgbmV3IGRvdHMgcG9zaXRpb25cclxuXHRcdFx0dmFyIG5ld0RvdCA9ICQoZG90LmlkKTtcclxuXHRcdFx0dmFyIHRvcFIgPSBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lckhlaWdodCAtIG5ld0RvdC5oZWlnaHQoKSkpO1xyXG5cdFx0XHR2YXIgbGVmdFIgPSBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lckhlaWdodCAtIG5ld0RvdC5oZWlnaHQoKSAtIDIwKSk7XHJcblx0XHRcdG5ld0RvdC5vZmZzZXQoeyB0b3A6IHRvcFIsIGxlZnQ6IGxlZnRSIH0pO1xyXG5cclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIF9raWxsRG90KGRvdCkge1xyXG5cdFx0XHQvL2luY3JlYXNlIHNjb3JlIGFuZCBraWxsIGRvdFxyXG5cdFx0XHRtb3ZlYWJsZS5zY29yZSsrO1xyXG5cdFx0XHRkb3QuYWxpdmUgPSBmYWxzZTtcclxuXHRcdFx0dmFyIGluZGV4ID0gbW92ZWFibGUuZG90cy5pbmRleE9mKGRvdCk7XHJcblx0XHRcdG1vdmVhYmxlLmRvdHMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdFx0JChkb3QuaWQpLnJlbW92ZSgpO1xyXG5cdFx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9kb3RQb3MoZG90KSB7XHJcblx0XHRcdHJldHVybiAkKGRvdC5pZCkub2Zmc2V0KCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBfZ2V0Qm91bmRzKG9iaikge1xyXG5cdFx0XHQvL3JldHVybiBib3VuZHMgb2YgZG90XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bGVmdDogJChvYmopLm9mZnNldCgpLmxlZnQsXHJcblx0XHRcdFx0cmlnaHQ6ICQob2JqKS5vZmZzZXQoKS5sZWZ0ICsgJChvYmopLndpZHRoKCksXHJcblx0XHRcdFx0dG9wOiAkKG9iaikub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGJvdHRvbTogJChvYmopLm9mZnNldCgpLnRvcCArICQob2JqKS5oZWlnaHQoKSxcclxuXHRcdFx0XHR3aWR0aDogJChvYmopLndpZHRoKCksXHJcblx0XHRcdFx0aGVpZ2h0OiAkKG9iaikuaGVpZ2h0KClcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdQb3J0Zm9saW9DdHJsJywgUG9ydGZvbGlvQ3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gUG9ydGZvbGlvQ3RybCgkc2NvcGUsICRyb290U2NvcGUsJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgcG9ydGZvbGlvVm0gPSB0aGlzO1xyXG4gICAgICAgIHBvcnRmb2xpb1ZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJQb3J0Zm9saW9cIjtcclxuICAgIH1cclxuXHJcbiAgICBQb3J0Zm9saW9DdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywnJHRpbWVvdXQnXTtcclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=