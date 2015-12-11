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
		$urlMatcherFactoryProvider.strictMode(false)
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
				// Defualt variables
				this.x = x;
				this.y = y;
				this.width = width;
				this.height = height;
			}
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
	Enemy.$inject = ["Drawable",  "ImageRepo"]
	function Enemy(Drawable, ImageRepo) {
		function enemy() {
			var percentFire = .005;
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
					return true;
				}
			};
			/*
			 * Fires a bullet
			 */
			this.fire = function () {
				game.enemyBulletPool.get(this.x + this.width / 2, this.y + this.height, -2.5);
			}
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

GameCtrl.$inject = ['$scope', '$rootScope', '$timeout', 'ImageRepo', 'Background', 'Ship', 'Bullet', 'Enemy', 'Pool', 'QuadTree'];

var game;

var KEY_STATUS = {};

function GameCtrl($scope, $rootScope, $timeout, ImageRepo, Background, Ship, Bullet, Enemy, Pool, QuadTree) {
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
				if (i % 6 == 0) {
					x = 100;
					y += spacer
				}
			}
		}

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
		game.ship.init(game.shipStartX, game.shipStartY,
					   ImageRepo.spaceship.width, ImageRepo.spaceship.height);
		game.enemyPool.init("enemy");
		game.spawnWave();
		game.enemyBulletPool.init("enemyBullet");
		game.playerScore = 0;
		game.start();
	};

	KEY_CODES = {
		32: 'space',
		37: 'left',
		39: 'right'
	}
	for (code in KEY_CODES) {
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
	}
	document.onkeyup = function (e) {
		var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
		if (KEY_CODES[keyCode]) {
			e.preventDefault();
			KEY_STATUS[KEY_CODES[keyCode]] = false;
		}
	}

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
};

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
		}
		this.spaceship.onload = function () {
			imageLoaded();
		}
		this.bullet.onload = function () {
			imageLoaded();
		}
		this.enemy.onload = function () {
			imageLoaded();
		}
		this.enemyBullet.onload = function () {
			imageLoaded();
		}

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
		.factory('Pool', Pool);
	Pool.$inject = ['ImageRepo','Bullet','Enemy'];
	function Pool(ImageRepo,Bullet,Enemy) {
		/**
		* Custom Pool object. Holds Bullet objects to be managed to prevent
		* garbage collection.
		*/
		function pool(maxSize) {
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
					for (var i = 0; i < size; i++) {
						var enemy = new Enemy();
						enemy.init(0, 0, ImageRepo.enemy.width, ImageRepo.enemy.height);
						pool[i] = enemy;
					}
				}
				else if (object == "enemyBullet") {
					for (var i = 0; i < size; i++) {
						var bullet = new Bullet("enemyBullet");
						bullet.init(0, 0, ImageRepo.enemyBullet.width, ImageRepo.enemyBullet.height);
						bullet.collidableWith = "ship";
						bullet.type = "enemyBullet";
						pool[i] = bullet;
					}
				}
			};
			this.getPool = function () {
				var obj = [];
				for (var i = 0; i < size; i++) {
					if (pool[i].alive) {
						obj.push(pool[i]);
					}
				}
				return obj;
			}
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
		return pool;
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
					var index = this.getIndex(obj);
					// Only add the object to a subnode if it can fit completely
					// within one
					if (index != -1) {
						this.nodes[index].insert(obj);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmN0cmwuanMiLCJjb250YWN0L2NvbnRhY3QuY3RybC5qcyIsImNvcmUvcGFnZS5jdHJsLmpzIiwiZ2FtZS9iYWNrZ3JvdW5kLmZhY3RvcnkuanMiLCJnYW1lL2J1bGxldC5mYWN0b3J5LmpzIiwiZ2FtZS9EcmF3YWJsZS5mYWN0b3J5LmpzIiwiZ2FtZS9lbmVteS5mYWN0b3J5LmpzIiwiZ2FtZS9nYW1lLmN0cmwuanMiLCJnYW1lL2ltYWdlcmVwby5mYWN0b3J5LmpzIiwiZ2FtZS9Qb29sLmZhY3RvcnkuanMiLCJnYW1lL3F1YWR0cmVlLmZhY3RvcnkuanMiLCJnYW1lL3NoaXAuZmFjdG9yeS5qcyIsImhvbWUvaG9tZS5jdHJsLmpzIiwiaG9tZS9tb3ZlYWJsZS5qcyIsInBvcnRmb2xpby9wb3J0Zm9saW8uY3RybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImVubEJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnLCBbXG4gICAgICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgICAgICduZ0FuaW1hdGUnLFxuICAgICAgICAgICAgJ21tLmZvdW5kYXRpb24nLFxuICAgICAgICAgICAgJ3VpLmV2ZW50JyxcbiAgICAgICAgICAgICd1aS5tYXAnXG4gICAgICAgIF0pXG4gICAgLmNvbmZpZyhjb25maWcpXG4gICAgLnJ1bihydW4pO1xuXG5cdGNvbmZpZy4kaW5qZWN0ID0gWyckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHN0YXRlUHJvdmlkZXInLCckdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlciddO1xuXG5cdGZ1bmN0aW9uIHJ1bigpIHtcclxuXHJcblx0fVxuXHRmdW5jdGlvbiBjb25maWcoJHVybFByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJHN0YXRlUHJvdmlkZXIsICR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyKSB7XHJcblx0XHQkdXJsUHJvdmlkZXIud2hlbignJywgJy8nKTtcblx0XHQkdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlci5zdHJpY3RNb2RlKGZhbHNlKVxuXHRcdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKS5oYXNoUHJlZml4KCchJyk7XG5cblx0XHQkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcclxuICAgICAgICBcdHVybDogJy8nLFxyXG4gICAgICAgIFx0dGVtcGxhdGVVcmw6ICdhcHAvaG9tZS9ob21lLnZpZXcuaHRtbCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlckFzOiAnaG9tZVZtJ1xyXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnYWJvdXQnLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvYWJvdXQnLFxyXG4gICAgICAgIFx0dGVtcGxhdGVVcmw6ICdhcHAvYWJvdXQvYWJvdXQudmlldy5odG1sJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXI6ICdBYm91dEN0cmwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlckFzOiAnYWJvdXRWbSdcclxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2NvbnRhY3QnLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvY29udGFjdCcsXHJcbiAgICAgICAgXHR0ZW1wbGF0ZVVybDogJ2FwcC9jb250YWN0L2NvbnRhY3Qudmlldy5odG1sJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXI6ICdDb250YWN0Q3RybCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyQXM6ICdjb250YWN0Vm0nXHJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdwb3J0Zm9saW8nLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvcG9ydGZvbGlvJyxcclxuICAgICAgICBcdHRlbXBsYXRlVXJsOiAnYXBwL3BvcnRmb2xpby9wb3J0Zm9saW8udmlldy5odG1sJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXI6ICdQb3J0Zm9saW9DdHJsJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXJBczogJ3BvcnRmb2xpb1ZtJ1xyXG4gICAgICAgIH0pXHJcblx0XHQuc3RhdGUoJ2dhbWUnLCB7XHJcblx0XHRcdHVybDogJy9nYW1lJyxcclxuXHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvZ2FtZS9nYW1lLnZpZXcuaHRtbCcsXHJcblx0XHRcdGNvbnRyb2xsZXI6ICdHYW1lQ3RybCcsXHJcblx0XHRcdGNvbnRyb2xsZXJBczogJ2dhbWVWbSdcclxuXHRcdH0pXHJcbiAgICAgICAgLnN0YXRlKCc0MDQnLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvNDA0JyxcclxuICAgICAgICBcdHRlbXBsYXRlVXJsOiAnYXBwLzQwNC80MDQudmlldy5odG1sJ1xyXG4gICAgICAgIH0pO1xyXG5cdFx0JHVybFByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG5cdH1cclxuXHJcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdBYm91dEN0cmwnLCBBYm91dEN0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEFib3V0Q3RybCgkc2NvcGUsICRyb290U2NvcGUsJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgYWJvdXRWbSA9IHRoaXM7XHJcbiAgICAgICAgYWJvdXRWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiQWJvdXRcIjtcclxuICAgIH1cclxuXHJcbiAgICBBYm91dEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckdGltZW91dCddO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbnRhY3RDdHJsJywgQ29udGFjdEN0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIENvbnRhY3RDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBjb250YWN0Vm0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnRhY3RWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiQ29udGFjdFwiO1xyXG4gICAgfVxyXG5cclxuICAgIENvbnRhY3RDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywnJHRpbWVvdXQnXTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAuY29udHJvbGxlcignUGFnZUN0cmwnLCBQYWdlQ3RybCk7XHJcblxyXG4gICAgUGFnZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckc3RhdGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBQYWdlQ3RybCgkc2NvcGUsICRyb290U2NvcGUsJHN0YXRlKSB7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzO1xyXG4gICAgICAgICRyb290U2NvcGUudGl0bGUgPSBcIlwiO1xyXG5cclxuICAgICAgICBwYWdlLmdldENsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnYWN0aXZlJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ0JhY2tncm91bmQnLCBCYWNrZ3JvdW5kKTtcclxuXHJcblx0QmFja2dyb3VuZC4kaW5qZWN0ID0gWydEcmF3YWJsZScsICdJbWFnZVJlcG8nXTtcclxuXHJcblx0ZnVuY3Rpb24gQmFja2dyb3VuZChEcmF3YWJsZSwgSW1hZ2VSZXBvKSB7XHJcblx0XHRmdW5jdGlvbiBiYWNrZ3JvdW5kKCkge1xyXG5cdFx0XHR0aGlzLnNwZWVkID0gMTsgXHJcblx0XHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHQvL1BhbiBiYWNrZ3JvdW5kXHJcblx0XHRcdFx0dGhpcy55ICs9IHRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uYmFja2dyb3VuZCwgdGhpcy54LCB0aGlzLnkpO1xyXG5cdFx0XHRcdC8vIERyYXcgYW5vdGhlciBpbWFnZSBhdCB0aGUgdG9wIGVkZ2Ugb2YgdGhlIGZpcnN0IGltYWdlXHJcblx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uYmFja2dyb3VuZCwgdGhpcy54LCB0aGlzLnkgLSB0aGlzLmNhbnZhc0hlaWdodCk7XHJcblx0XHRcdFx0Ly8gSWYgdGhlIGltYWdlIHNjcm9sbGVkIG9mZiB0aGUgc2NyZWVuLCByZXNldFxyXG5cdFx0XHRcdGlmICh0aGlzLnkgPj0gdGhpcy5jYW52YXNIZWlnaHQpIHtcclxuXHRcdFx0XHRcdHRoaXMueSA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0YmFja2dyb3VuZC5wcm90b3R5cGUgPSBuZXcgRHJhd2FibGUoKTtcclxuXHRcdHJldHVybiBiYWNrZ3JvdW5kO1xyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdCdWxsZXQnLCBCdWxsZXQpO1xyXG5cclxuXHRCdWxsZXQuJGluamVjdCA9IFtcIkRyYXdhYmxlXCIsXCJJbWFnZVJlcG9cIl07XHJcblx0ZnVuY3Rpb24gQnVsbGV0KERyYXdhYmxlLCBJbWFnZVJlcG8pIHtcclxuXHRcdGZ1bmN0aW9uIGJ1bGxldChvYmplY3QpIHtcclxuXHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlOyAvLyBJcyB0cnVlIGlmIHRoZSBidWxsZXQgaXMgY3VycmVudGx5IGluIHVzZVxyXG5cdFx0XHR2YXIgc2VsZiA9IG9iamVjdDtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogU2V0cyB0aGUgYnVsbGV0IHZhbHVlc1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5zcGF3biA9IGZ1bmN0aW9uICh4LCB5LCBzcGVlZCkge1xyXG5cdFx0XHRcdHRoaXMueCA9IHg7XHJcblx0XHRcdFx0dGhpcy55ID0geTtcclxuXHRcdFx0XHR0aGlzLnNwZWVkID0gc3BlZWQ7XHJcblx0XHRcdFx0dGhpcy5hbGl2ZSA9IHRydWU7XHJcblx0XHRcdH07XHJcblx0XHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KHRoaXMueCAtIDEsIHRoaXMueSAtIDEsIHRoaXMud2lkdGggKyAyLCB0aGlzLmhlaWdodCArIDIpO1xyXG5cdFx0XHRcdHRoaXMueSAtPSB0aGlzLnNwZWVkO1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzQ29sbGlkaW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoc2VsZiA9PT0gXCJidWxsZXRcIiAmJiB0aGlzLnkgPD0gMCAtIHRoaXMuaGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoc2VsZiA9PT0gXCJlbmVteUJ1bGxldFwiICYmIHRoaXMueSA+PSB0aGlzLmNhbnZhc0hlaWdodCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKHNlbGYgPT09IFwiYnVsbGV0XCIpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uYnVsbGV0LCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChzZWxmID09PSBcImVuZW15QnVsbGV0XCIpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uZW5lbXlCdWxsZXQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFJlc2V0cyB0aGUgYnVsbGV0IHZhbHVlc1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLnggPSAwO1xyXG5cdFx0XHRcdHRoaXMueSA9IDA7XHJcblx0XHRcdFx0dGhpcy5zcGVlZCA9IDA7XHJcblx0XHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMuaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGJ1bGxldC5wcm90b3R5cGUgPSBuZXcgRHJhd2FibGUoKTtcclxuXHRcdHJldHVybiBidWxsZXQ7XHJcblx0fVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ0RyYXdhYmxlJywgRHJhd2FibGUpO1xyXG5cclxuXHRmdW5jdGlvbiBEcmF3YWJsZSgpIHtcclxuXHRcdGZ1bmN0aW9uIGRyYXdhYmxlKCkge1xyXG5cdFx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG5cdFx0XHRcdC8vIERlZnVhbHQgdmFyaWFibGVzXHJcblx0XHRcdFx0dGhpcy54ID0geDtcclxuXHRcdFx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0XHRcdHRoaXMud2lkdGggPSB3aWR0aDtcclxuXHRcdFx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnNwZWVkID0gMDtcclxuXHRcdFx0dGhpcy5jYW52YXNXaWR0aCA9IDA7XHJcblx0XHRcdHRoaXMuY2FudmFzSGVpZ2h0ID0gMDtcclxuXHRcdFx0dGhpcy5jb2xsaWRhYmxlV2l0aCA9IFwiXCI7XHJcblx0XHRcdHRoaXMuaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy50eXBlID0gXCJcIjtcclxuXHRcdFx0Ly8gRGVmaW5lIGFic3RyYWN0IGZ1bmN0aW9uIHRvIGJlIGltcGxlbWVudGVkIGluIGNoaWxkIG9iamVjdHNcclxuXHRcdFx0dGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR0aGlzLm1vdmUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdH07XHJcblx0XHRcdHRoaXMuaXNDb2xsaWRhYmxlV2l0aCA9IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuXHRcdFx0XHRyZXR1cm4gKHRoaXMuY29sbGlkYWJsZVdpdGggPT09IG9iamVjdC50eXBlKTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBkcmF3YWJsZTtcclxuXHR9XHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdFbmVteScsIEVuZW15KTtcclxuXHRFbmVteS4kaW5qZWN0ID0gW1wiRHJhd2FibGVcIiwgIFwiSW1hZ2VSZXBvXCJdXHJcblx0ZnVuY3Rpb24gRW5lbXkoRHJhd2FibGUsIEltYWdlUmVwbykge1xyXG5cdFx0ZnVuY3Rpb24gZW5lbXkoKSB7XHJcblx0XHRcdHZhciBwZXJjZW50RmlyZSA9IC4wMDU7XHJcblx0XHRcdHZhciBjaGFuY2UgPSAwO1xyXG5cdFx0XHR0aGlzLmFsaXZlID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuY29sbGlkYWJsZVdpdGggPSBcImJ1bGxldFwiO1xyXG5cdFx0XHR0aGlzLnR5cGUgPSBcImVuZW15XCI7XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFNldHMgdGhlIEVuZW15IHZhbHVlc1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5zcGF3biA9IGZ1bmN0aW9uICh4LCB5LCBzcGVlZCkge1xyXG5cdFx0XHRcdHRoaXMueCA9IHg7XHJcblx0XHRcdFx0dGhpcy55ID0geTtcclxuXHRcdFx0XHR0aGlzLnNwZWVkID0gc3BlZWQ7XHJcblx0XHRcdFx0dGhpcy5zcGVlZFggPSAwO1xyXG5cdFx0XHRcdHRoaXMuc3BlZWRZID0gc3BlZWQ7XHJcblx0XHRcdFx0dGhpcy5hbGl2ZSA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5sZWZ0RWRnZSA9IHRoaXMueCAtIDkwO1xyXG5cdFx0XHRcdHRoaXMucmlnaHRFZGdlID0gdGhpcy54ICsgOTA7XHJcblx0XHRcdFx0dGhpcy5ib3R0b21FZGdlID0gdGhpcy55ICsgMTQwO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBNb3ZlIHRoZSBlbmVteVxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuY29udGV4dC5jbGVhclJlY3QodGhpcy54IC0gMSwgdGhpcy55LCB0aGlzLndpZHRoICsgMSwgdGhpcy5oZWlnaHQpO1xyXG5cdFx0XHRcdHRoaXMueCArPSB0aGlzLnNwZWVkWDtcclxuXHRcdFx0XHR0aGlzLnkgKz0gdGhpcy5zcGVlZFk7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA8PSB0aGlzLmxlZnRFZGdlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNwZWVkWCA9IHRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMueCA+PSB0aGlzLnJpZ2h0RWRnZSArIHRoaXMud2lkdGgpIHtcclxuXHRcdFx0XHRcdHRoaXMuc3BlZWRYID0gLXRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMueSA+PSB0aGlzLmJvdHRvbUVkZ2UpIHtcclxuXHRcdFx0XHRcdHRoaXMuc3BlZWQgPSAxLjU7XHJcblx0XHRcdFx0XHR0aGlzLnNwZWVkWSA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnkgLT0gNTtcclxuXHRcdFx0XHRcdHRoaXMuc3BlZWRYID0gLXRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICghdGhpcy5pc0NvbGxpZGluZykge1xyXG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uZW5lbXksIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0XHRcdC8vIEVuZW15IGhhcyBhIGNoYW5jZSB0byBzaG9vdCBldmVyeSBtb3ZlbWVudFxyXG5cdFx0XHRcdFx0Y2hhbmNlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAxKTtcclxuXHRcdFx0XHRcdGlmIChjaGFuY2UgLyAxMDAgPCBwZXJjZW50RmlyZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmZpcmUoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRnYW1lLnBsYXllclNjb3JlICs9IDEwO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBGaXJlcyBhIGJ1bGxldFxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5maXJlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGdhbWUuZW5lbXlCdWxsZXRQb29sLmdldCh0aGlzLnggKyB0aGlzLndpZHRoIC8gMiwgdGhpcy55ICsgdGhpcy5oZWlnaHQsIC0yLjUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFJlc2V0cyB0aGUgZW5lbXkgdmFsdWVzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMueCA9IDA7XHJcblx0XHRcdFx0dGhpcy55ID0gMDtcclxuXHRcdFx0XHR0aGlzLnNwZWVkID0gMDtcclxuXHRcdFx0XHR0aGlzLnNwZWVkWCA9IDA7XHJcblx0XHRcdFx0dGhpcy5zcGVlZFkgPSAwO1xyXG5cdFx0XHRcdHRoaXMuYWxpdmUgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmlzQ29sbGlkaW5nID0gZmFsc2U7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRlbmVteS5wcm90b3R5cGUgPSBuZXcgRHJhd2FibGUoKTtcclxuXHRcdHJldHVybiBlbmVteTtcclxuXHR9XHJcbn0oKSk7IiwiYW5ndWxhclxyXG5cdC5tb2R1bGUoJ2FwcCcpXHJcblx0LmNvbnRyb2xsZXIoJ0dhbWVDdHJsJywgR2FtZUN0cmwpO1xyXG5cclxuR2FtZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnLCAnSW1hZ2VSZXBvJywgJ0JhY2tncm91bmQnLCAnU2hpcCcsICdCdWxsZXQnLCAnRW5lbXknLCAnUG9vbCcsICdRdWFkVHJlZSddO1xyXG5cclxudmFyIGdhbWU7XHJcblxyXG52YXIgS0VZX1NUQVRVUyA9IHt9O1xyXG5cclxuZnVuY3Rpb24gR2FtZUN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgSW1hZ2VSZXBvLCBCYWNrZ3JvdW5kLCBTaGlwLCBCdWxsZXQsIEVuZW15LCBQb29sLCBRdWFkVHJlZSkge1xyXG5cdHZhciBnYW1lVm0gPSB0aGlzO1xyXG5cdGdhbWVWbS5nYW1lT3ZlciA9IGZhbHNlO1xyXG5cdGdhbWVWbS5yZXN0YXJ0ID0gcmVzdGFydDtcclxuXHRnYW1lID0gbmV3IEdhbWUoKTtcclxuXHR2YXIgc3RhdGUgPSBcIlwiO1xyXG5cclxuXHRmdW5jdGlvbiBpbml0KCkge1xyXG5cdFx0aWYgKGdhbWUuaW5pdCgpKSB7XHJcblx0XHRcdGdhbWUuc3RhcnQoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0JHNjb3BlLiRvbihcIkluaXRcIiwgaW5pdCk7XHJcblxyXG5cdC8vc2V0dXAgZ2FtZSBsb2dpY1xyXG5cdGZ1bmN0aW9uIEdhbWUoKSB7XHJcblx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRoaXMucGxheWVyU2NvcmUgPSAwO1xyXG5cdFx0XHR0aGlzLmJnQ2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tncm91bmQnKTtcclxuXHRcdFx0dGhpcy5zaGlwQ2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NoaXAnKTtcclxuXHRcdFx0dGhpcy5tYWluQ2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKTtcclxuXHRcdFx0Ly8gVGVzdCB0byBzZWUgaWYgY2FudmFzIGlzIHN1cHBvcnRlZC4gT25seSBuZWVkIHRvXHJcblx0XHRcdC8vIGNoZWNrIG9uZSBjYW52YXNcclxuXHRcdFx0aWYgKHRoaXMuYmdDYW52YXMuZ2V0Q29udGV4dCkge1xyXG5cdFx0XHRcdHRoaXMuYmdDb250ZXh0ID0gdGhpcy5iZ0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cdFx0XHRcdHRoaXMuc2hpcENvbnRleHQgPSB0aGlzLnNoaXBDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHRcdFx0XHR0aGlzLm1haW5Db250ZXh0ID0gdGhpcy5tYWluQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSBvYmplY3RzIHRvIGNvbnRhaW4gdGhlaXIgY29udGV4dCBhbmQgY2FudmFzXHJcblx0XHRcdFx0Ly8gaW5mb3JtYXRpb25cclxuXHRcdFx0XHRCYWNrZ3JvdW5kLnByb3RvdHlwZS5jb250ZXh0ID0gdGhpcy5iZ0NvbnRleHQ7XHJcblx0XHRcdFx0QmFja2dyb3VuZC5wcm90b3R5cGUuY2FudmFzV2lkdGggPSB0aGlzLmJnQ2FudmFzLndpZHRoO1xyXG5cdFx0XHRcdEJhY2tncm91bmQucHJvdG90eXBlLmNhbnZhc0hlaWdodCA9IHRoaXMuYmdDYW52YXMuaGVpZ2h0O1xyXG5cdFx0XHRcdFNoaXAucHJvdG90eXBlLmNvbnRleHQgPSB0aGlzLnNoaXBDb250ZXh0O1xyXG5cdFx0XHRcdFNoaXAucHJvdG90eXBlLmNhbnZhc1dpZHRoID0gdGhpcy5zaGlwQ2FudmFzLndpZHRoO1xyXG5cdFx0XHRcdFNoaXAucHJvdG90eXBlLmNhbnZhc0hlaWdodCA9IHRoaXMuc2hpcENhbnZhcy5oZWlnaHQ7XHJcblx0XHRcdFx0QnVsbGV0LnByb3RvdHlwZS5jb250ZXh0ID0gdGhpcy5tYWluQ29udGV4dDtcclxuXHRcdFx0XHRCdWxsZXQucHJvdG90eXBlLmNhbnZhc1dpZHRoID0gdGhpcy5tYWluQ2FudmFzLndpZHRoO1xyXG5cdFx0XHRcdEJ1bGxldC5wcm90b3R5cGUuY2FudmFzSGVpZ2h0ID0gdGhpcy5tYWluQ2FudmFzLmhlaWdodDtcclxuXHRcdFx0XHRFbmVteS5wcm90b3R5cGUuY29udGV4dCA9IHRoaXMubWFpbkNvbnRleHQ7XHJcblx0XHRcdFx0RW5lbXkucHJvdG90eXBlLmNhbnZhc1dpZHRoID0gdGhpcy5tYWluQ2FudmFzLndpZHRoO1xyXG5cdFx0XHRcdEVuZW15LnByb3RvdHlwZS5jYW52YXNIZWlnaHQgPSB0aGlzLm1haW5DYW52YXMuaGVpZ2h0O1xyXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgdGhlIGJhY2tncm91bmQgb2JqZWN0XHJcblx0XHRcdFx0dGhpcy5iYWNrZ3JvdW5kID0gbmV3IEJhY2tncm91bmQoKTtcclxuXHRcdFx0XHR0aGlzLmJhY2tncm91bmQuaW5pdCgwLCAwKTsgLy8gU2V0IGRyYXcgcG9pbnQgdG8gMCwwXHJcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgc2hpcCBvYmplY3RcclxuXHRcdFx0XHR0aGlzLnNoaXAgPSBuZXcgU2hpcCgpO1xyXG5cclxuXHRcdFx0XHQvLyBTZXQgdGhlIHNoaXAgdG8gc3RhcnQgbmVhciB0aGUgYm90dG9tIG1pZGRsZSBvZiB0aGUgY2FudmFzXHJcblx0XHRcdFx0dGhpcy5zaGlwU3RhcnRYID0gdGhpcy5zaGlwQ2FudmFzLndpZHRoIC8gMiAtIEltYWdlUmVwby5zcGFjZXNoaXAud2lkdGg7XHJcblx0XHRcdFx0dGhpcy5zaGlwU3RhcnRZID0gdGhpcy5zaGlwQ2FudmFzLmhlaWdodCAvIDQgKiAzICsgSW1hZ2VSZXBvLnNwYWNlc2hpcC5oZWlnaHQgKiAyO1xyXG5cdFx0XHRcdHRoaXMuc2hpcC5pbml0KHRoaXMuc2hpcFN0YXJ0WCwgdGhpcy5zaGlwU3RhcnRZLFxyXG5cdFx0XHRcdFx0XHRcdCAgIEltYWdlUmVwby5zcGFjZXNoaXAud2lkdGgsIEltYWdlUmVwby5zcGFjZXNoaXAuaGVpZ2h0KTtcclxuXHJcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgZW5lbXkgcG9vbCBvYmplY3RcclxuXHRcdFx0XHR0aGlzLmVuZW15UG9vbCA9IG5ldyBQb29sKDMwKTtcclxuXHRcdFx0XHR0aGlzLmVuZW15UG9vbC5pbml0KFwiZW5lbXlcIik7XHJcblx0XHRcdFx0dGhpcy5zcGF3bldhdmUoKTtcclxuXHJcblx0XHRcdFx0dGhpcy5lbmVteUJ1bGxldFBvb2wgPSBuZXcgUG9vbCgxMCk7XHJcblx0XHRcdFx0dGhpcy5lbmVteUJ1bGxldFBvb2wuaW5pdChcImVuZW15QnVsbGV0XCIpO1xyXG5cclxuXHRcdFx0XHR0aGlzLnF1YWRUcmVlID0gbmV3IFF1YWRUcmVlKHsgeDogMCwgeTogMCwgd2lkdGg6IHRoaXMubWFpbkNhbnZhcy53aWR0aCwgaGVpZ2h0OiB0aGlzLm1haW5DYW52YXMuaGVpZ2h0IH0pO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRnYW1lLnNoaXAuZHJhdygpO1xyXG5cdFx0XHRhbmltYXRlKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc3Bhd25XYXZlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgaGVpZ2h0ID0gSW1hZ2VSZXBvLmVuZW15LmhlaWdodDtcclxuXHRcdFx0dmFyIHdpZHRoID0gSW1hZ2VSZXBvLmVuZW15LndpZHRoO1xyXG5cdFx0XHR2YXIgeCA9IDEwMDtcclxuXHRcdFx0dmFyIHkgPSAtaGVpZ2h0O1xyXG5cdFx0XHR2YXIgc3BhY2VyID0geSAqIDEuNTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDE7IGkgPD0gMTg7IGkrKykge1xyXG5cdFx0XHRcdHRoaXMuZW5lbXlQb29sLmdldCh4LCB5LCAyKTtcclxuXHRcdFx0XHR4ICs9IHdpZHRoICsgMjU7XHJcblx0XHRcdFx0aWYgKGkgJSA2ID09IDApIHtcclxuXHRcdFx0XHRcdHggPSAxMDA7XHJcblx0XHRcdFx0XHR5ICs9IHNwYWNlclxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuZ2FtZU92ZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJyNnYW1lLW92ZXInKS5jc3MoXCJkaXNwbGF5XCIsXCJibG9ja1wiKTtcclxuXHRcdH07XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVzdGFydCgpIHtcclxuXHRcdCQoJyNnYW1lLW92ZXInKS5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcclxuXHRcdGdhbWUuYmdDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBnYW1lLmJnQ2FudmFzLndpZHRoLCBnYW1lLmJnQ2FudmFzLmhlaWdodCk7XHJcblx0XHRnYW1lLnNoaXBDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBnYW1lLnNoaXBDYW52YXMud2lkdGgsIGdhbWUuc2hpcENhbnZhcy5oZWlnaHQpO1xyXG5cdFx0Z2FtZS5tYWluQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgZ2FtZS5tYWluQ2FudmFzLndpZHRoLCBnYW1lLm1haW5DYW52YXMuaGVpZ2h0KTtcclxuXHRcdGdhbWUucXVhZFRyZWUuY2xlYXIoKTtcclxuXHRcdGdhbWUuYmFja2dyb3VuZC5pbml0KDAsIDApO1xyXG5cdFx0Z2FtZS5zaGlwLmluaXQoZ2FtZS5zaGlwU3RhcnRYLCBnYW1lLnNoaXBTdGFydFksXHJcblx0XHRcdFx0XHQgICBJbWFnZVJlcG8uc3BhY2VzaGlwLndpZHRoLCBJbWFnZVJlcG8uc3BhY2VzaGlwLmhlaWdodCk7XHJcblx0XHRnYW1lLmVuZW15UG9vbC5pbml0KFwiZW5lbXlcIik7XHJcblx0XHRnYW1lLnNwYXduV2F2ZSgpO1xyXG5cdFx0Z2FtZS5lbmVteUJ1bGxldFBvb2wuaW5pdChcImVuZW15QnVsbGV0XCIpO1xyXG5cdFx0Z2FtZS5wbGF5ZXJTY29yZSA9IDA7XHJcblx0XHRnYW1lLnN0YXJ0KCk7XHJcblx0fTtcclxuXHJcblx0S0VZX0NPREVTID0ge1xyXG5cdFx0MzI6ICdzcGFjZScsXHJcblx0XHQzNzogJ2xlZnQnLFxyXG5cdFx0Mzk6ICdyaWdodCdcclxuXHR9XHJcblx0Zm9yIChjb2RlIGluIEtFWV9DT0RFUykge1xyXG5cdFx0S0VZX1NUQVRVU1tLRVlfQ09ERVNbY29kZV1dID0gZmFsc2U7XHJcblx0fVxyXG5cdGRvY3VtZW50Lm9ua2V5ZG93biA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHQvLyBGaXJlZm94IGFuZCBvcGVyYSB1c2UgY2hhckNvZGUgaW5zdGVhZCBvZiBrZXlDb2RlIHRvXHJcblx0XHQvLyByZXR1cm4gd2hpY2gga2V5IHdhcyBwcmVzc2VkLlxyXG5cdFx0dmFyIGtleUNvZGUgPSAoZS5rZXlDb2RlKSA/IGUua2V5Q29kZSA6IGUuY2hhckNvZGU7XHJcblx0XHRpZiAoS0VZX0NPREVTW2tleUNvZGVdKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0S0VZX1NUQVRVU1tLRVlfQ09ERVNba2V5Q29kZV1dID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZG9jdW1lbnQub25rZXl1cCA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHR2YXIga2V5Q29kZSA9IChlLmtleUNvZGUpID8gZS5rZXlDb2RlIDogZS5jaGFyQ29kZTtcclxuXHRcdGlmIChLRVlfQ09ERVNba2V5Q29kZV0pIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRLRVlfU1RBVFVTW0tFWV9DT0RFU1trZXlDb2RlXV0gPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlY3RDb2xsaXNpb24oKSB7XHJcblx0dmFyIG9iamVjdHMgPSBbXTtcclxuXHRnYW1lLnF1YWRUcmVlLmdldEFsbE9iamVjdHMob2JqZWN0cyk7XHJcblx0Zm9yICh2YXIgeCA9IDAsIGxlbiA9IG9iamVjdHMubGVuZ3RoOyB4IDwgbGVuOyB4KyspIHtcclxuXHRcdGdhbWUucXVhZFRyZWUuZmluZE9iamVjdHMob2JqID0gW10sIG9iamVjdHNbeF0pO1xyXG5cdFx0Zm9yICh5ID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgeSA8IGxlbmd0aDsgeSsrKSB7XHJcblx0XHRcdC8vIERFVEVDVCBDT0xMSVNJT04gQUxHT1JJVEhNXHJcblx0XHRcdGlmIChvYmplY3RzW3hdLmNvbGxpZGFibGVXaXRoID09PSBvYmpbeV0udHlwZSAmJlxyXG5cdFx0XHQob2JqZWN0c1t4XS54IDwgb2JqW3ldLnggKyBvYmpbeV0ud2lkdGggJiZcclxuXHRcdFx0b2JqZWN0c1t4XS54ICsgb2JqZWN0c1t4XS53aWR0aCA+IG9ialt5XS54ICYmXHJcblx0XHRcdG9iamVjdHNbeF0ueSA8IG9ialt5XS55ICsgb2JqW3ldLmhlaWdodCAmJlxyXG5cdFx0XHRvYmplY3RzW3hdLnkgKyBvYmplY3RzW3hdLmhlaWdodCA+IG9ialt5XS55KSkge1xyXG5cdFx0XHRcdG9iamVjdHNbeF0uaXNDb2xsaWRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdG9ialt5XS5pc0NvbGxpZGluZyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG4vL2NvbnN0YW50bHkgbG9vcHMgZm9yIGdhbWUgc3RhdGVcclxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuXHQvL3VwZGF0ZSBzY29yZVxyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY29yZScpLmlubmVySFRNTCA9IGdhbWUucGxheWVyU2NvcmU7XHJcblx0Ly8gSW5zZXJ0IG9iamVjdHMgaW50byBxdWFkdHJlZVxyXG5cdGdhbWUucXVhZFRyZWUuY2xlYXIoKTtcclxuXHRnYW1lLnF1YWRUcmVlLmluc2VydChnYW1lLnNoaXApO1xyXG5cdGdhbWUucXVhZFRyZWUuaW5zZXJ0KGdhbWUuc2hpcC5idWxsZXRQb29sLmdldFBvb2woKSk7XHJcblx0Z2FtZS5xdWFkVHJlZS5pbnNlcnQoZ2FtZS5lbmVteVBvb2wuZ2V0UG9vbCgpKTtcclxuXHRnYW1lLnF1YWRUcmVlLmluc2VydChnYW1lLmVuZW15QnVsbGV0UG9vbC5nZXRQb29sKCkpO1xyXG5cdGRldGVjdENvbGxpc2lvbigpO1xyXG5cdC8vIE5vIG1vcmUgZW5lbWllc1xyXG5cdGlmIChnYW1lLmVuZW15UG9vbC5nZXRQb29sKCkubGVuZ3RoID09PSAwKSB7XHJcblx0XHRnYW1lLnNwYXduV2F2ZSgpO1xyXG5cdH1cclxuXHQvLyBBbmltYXRlIGdhbWUgb2JqZWN0c1xyXG5cdGlmIChnYW1lLnNoaXAuYWxpdmUpIHtcclxuXHRyZXF1ZXN0QW5pbUZyYW1lKGFuaW1hdGUpO1xyXG5cdGdhbWUuYmFja2dyb3VuZC5kcmF3KCk7XHJcblx0Z2FtZS5zaGlwLm1vdmUoKTtcclxuXHRnYW1lLnNoaXAuYnVsbGV0UG9vbC5hbmltYXRlKCk7XHJcblx0Z2FtZS5lbmVteVBvb2wuYW5pbWF0ZSgpO1xyXG5cdGdhbWUuZW5lbXlCdWxsZXRQb29sLmFuaW1hdGUoKTtcclxuXHR9XHJcbn1cclxuXHJcbndpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lID0gKGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG5cdFx0XHR3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdFx0d2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdFx0d2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdGZ1bmN0aW9uIChjYWxsYmFjaywgZWxlbWVudCkge1xyXG5cdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xyXG5cdFx0XHR9O1xyXG59KSgpO1xyXG5cclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnSW1hZ2VSZXBvJywgSW1hZ2VSZXBvKTtcclxuXHRJbWFnZVJlcG8uJGluamVjdCA9IFsnJHJvb3RTY29wZSddO1xyXG5cdGZ1bmN0aW9uIEltYWdlUmVwbygkcm9vdFNjb3BlKSB7XHJcblx0XHQvLyBEZWZpbmUgaW1hZ2VzXHJcblx0XHR0aGlzLmVtcHR5ID0gbnVsbDtcclxuXHRcdHRoaXMuYmFja2dyb3VuZCA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0dGhpcy5zcGFjZXNoaXAgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMuYnVsbGV0ID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLmVuZW15ID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLmVuZW15QnVsbGV0ID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0dmFyIG51bUltYWdlcyA9IDU7XHJcblx0XHR2YXIgbnVtTG9hZGVkID0gMDtcclxuXHRcdGZ1bmN0aW9uIGltYWdlTG9hZGVkKCkge1xyXG5cdFx0XHRudW1Mb2FkZWQrKztcclxuXHRcdFx0aWYgKG51bUxvYWRlZCA9PT0gbnVtSW1hZ2VzKSB7XHJcblx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiSW5pdFwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5iYWNrZ3JvdW5kLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aW1hZ2VMb2FkZWQoKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuc3BhY2VzaGlwLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aW1hZ2VMb2FkZWQoKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuYnVsbGV0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aW1hZ2VMb2FkZWQoKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuZW5lbXkub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpbWFnZUxvYWRlZCgpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5lbmVteUJ1bGxldC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGltYWdlTG9hZGVkKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2V0IGltYWdlcyBzcmNcclxuXHRcdHRoaXMuYmFja2dyb3VuZC5zcmMgPSBcImxpYi9pbWFnZXMvYmcucG5nXCI7XHJcblx0XHR0aGlzLnNwYWNlc2hpcC5zcmMgPSBcImxpYi9pbWFnZXMvc2hpcC5wbmdcIjtcclxuXHRcdHRoaXMuYnVsbGV0LnNyYyA9IFwibGliL2ltYWdlcy9idWxsZXQucG5nXCI7XHJcblx0XHR0aGlzLmVuZW15LnNyYyA9IFwibGliL2ltYWdlcy9lbmVteS5wbmdcIjtcclxuXHRcdHRoaXMuZW5lbXlCdWxsZXQuc3JjID0gXCJsaWIvaW1hZ2VzL2J1bGxldF9lbmVteS5wbmdcIjtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnUG9vbCcsIFBvb2wpO1xyXG5cdFBvb2wuJGluamVjdCA9IFsnSW1hZ2VSZXBvJywnQnVsbGV0JywnRW5lbXknXTtcclxuXHRmdW5jdGlvbiBQb29sKEltYWdlUmVwbyxCdWxsZXQsRW5lbXkpIHtcclxuXHRcdC8qKlxyXG5cdFx0KiBDdXN0b20gUG9vbCBvYmplY3QuIEhvbGRzIEJ1bGxldCBvYmplY3RzIHRvIGJlIG1hbmFnZWQgdG8gcHJldmVudFxyXG5cdFx0KiBnYXJiYWdlIGNvbGxlY3Rpb24uXHJcblx0XHQqL1xyXG5cdFx0ZnVuY3Rpb24gcG9vbChtYXhTaXplKSB7XHJcblx0XHRcdHZhciBzaXplID0gbWF4U2l6ZTsgLy8gTWF4IGJ1bGxldHMgYWxsb3dlZCBpbiB0aGUgcG9vbFxyXG5cdFx0XHR2YXIgcG9vbCA9IFtdO1xyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBQb3B1bGF0ZXMgdGhlIHBvb2wgYXJyYXkgd2l0aCBCdWxsZXQgb2JqZWN0c1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5pbml0ID0gZnVuY3Rpb24gKG9iamVjdCkge1xyXG5cdFx0XHRcdGlmIChvYmplY3QgPT0gXCJidWxsZXRcIikge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0Ly8gSW5pdGFsaXplIHRoZSBvYmplY3RcclxuXHRcdFx0XHRcdFx0dmFyIGJ1bGxldCA9IG5ldyBCdWxsZXQoXCJidWxsZXRcIik7XHJcblx0XHRcdFx0XHRcdGJ1bGxldC5pbml0KDAsIDAsIEltYWdlUmVwby5idWxsZXQud2lkdGgsIEltYWdlUmVwby5idWxsZXQuaGVpZ2h0KTtcclxuXHRcdFx0XHRcdFx0YnVsbGV0LmNvbGxpZGFibGVXaXRoID0gXCJlbmVteVwiO1xyXG5cdFx0XHRcdFx0XHRidWxsZXQudHlwZSA9IFwiYnVsbGV0XCI7XHJcblx0XHRcdFx0XHRcdHBvb2xbaV0gPSBidWxsZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKG9iamVjdCA9PSBcImVuZW15XCIpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHZhciBlbmVteSA9IG5ldyBFbmVteSgpO1xyXG5cdFx0XHRcdFx0XHRlbmVteS5pbml0KDAsIDAsIEltYWdlUmVwby5lbmVteS53aWR0aCwgSW1hZ2VSZXBvLmVuZW15LmhlaWdodCk7XHJcblx0XHRcdFx0XHRcdHBvb2xbaV0gPSBlbmVteTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAob2JqZWN0ID09IFwiZW5lbXlCdWxsZXRcIikge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIGJ1bGxldCA9IG5ldyBCdWxsZXQoXCJlbmVteUJ1bGxldFwiKTtcclxuXHRcdFx0XHRcdFx0YnVsbGV0LmluaXQoMCwgMCwgSW1hZ2VSZXBvLmVuZW15QnVsbGV0LndpZHRoLCBJbWFnZVJlcG8uZW5lbXlCdWxsZXQuaGVpZ2h0KTtcclxuXHRcdFx0XHRcdFx0YnVsbGV0LmNvbGxpZGFibGVXaXRoID0gXCJzaGlwXCI7XHJcblx0XHRcdFx0XHRcdGJ1bGxldC50eXBlID0gXCJlbmVteUJ1bGxldFwiO1xyXG5cdFx0XHRcdFx0XHRwb29sW2ldID0gYnVsbGV0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0dGhpcy5nZXRQb29sID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciBvYmogPSBbXTtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xyXG5cdFx0XHRcdFx0aWYgKHBvb2xbaV0uYWxpdmUpIHtcclxuXHRcdFx0XHRcdFx0b2JqLnB1c2gocG9vbFtpXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvYmo7XHJcblx0XHRcdH1cclxuXHRcdFx0LypcclxuXHRcdFx0ICogR3JhYnMgdGhlIGxhc3QgaXRlbSBpbiB0aGUgbGlzdCBhbmQgaW5pdGlhbGl6ZXMgaXQgYW5kXHJcblx0XHRcdCAqIHB1c2hlcyBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIGFycmF5LlxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5nZXQgPSBmdW5jdGlvbiAoeCwgeSwgc3BlZWQpIHtcclxuXHRcdFx0XHRpZiAoIXBvb2xbc2l6ZSAtIDFdLmFsaXZlKSB7XHJcblx0XHRcdFx0XHRwb29sW3NpemUgLSAxXS5zcGF3bih4LCB5LCBzcGVlZCk7XHJcblx0XHRcdFx0XHRwb29sLnVuc2hpZnQocG9vbC5wb3AoKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICogRHJhd3MgYW55IGluIHVzZSBCdWxsZXRzLiBJZiBhIGJ1bGxldCBnb2VzIG9mZiB0aGUgc2NyZWVuLFxyXG5cdFx0XHQgKiBjbGVhcnMgaXQgYW5kIHB1c2hlcyBpdCB0byB0aGUgZnJvbnQgb2YgdGhlIGFycmF5LlxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5hbmltYXRlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XHJcblx0XHRcdFx0XHQvLyBPbmx5IGRyYXcgdW50aWwgd2UgZmluZCBhIGJ1bGxldCB0aGF0IGlzIG5vdCBhbGl2ZVxyXG5cdFx0XHRcdFx0aWYgKHBvb2xbaV0uYWxpdmUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHBvb2xbaV0uZHJhdygpKSB7XHJcblx0XHRcdFx0XHRcdFx0cG9vbFtpXS5jbGVhcigpO1xyXG5cdFx0XHRcdFx0XHRcdHBvb2wucHVzaCgocG9vbC5zcGxpY2UoaSwgMSkpWzBdKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcG9vbDtcclxuXHR9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnUXVhZFRyZWUnLCBRdWFkVHJlZSk7XHJcblxyXG5cdGZ1bmN0aW9uIFF1YWRUcmVlKCkge1xyXG5cdFx0ZnVuY3Rpb24gcXVhZFRyZWUoYm91bmRCb3gsIGx2bCkge1xyXG5cdFx0XHR2YXIgbWF4T2JqZWN0cyA9IDEwO1xyXG5cdFx0XHR0aGlzLmJvdW5kcyA9IGJvdW5kQm94IHx8IHtcclxuXHRcdFx0XHR4OiAwLFxyXG5cdFx0XHRcdHk6IDAsXHJcblx0XHRcdFx0d2lkdGg6IDAsXHJcblx0XHRcdFx0aGVpZ2h0OiAwXHJcblx0XHRcdH07XHJcblx0XHRcdHZhciBvYmplY3RzID0gW107XHJcblx0XHRcdHRoaXMubm9kZXMgPSBbXTtcclxuXHRcdFx0dmFyIGxldmVsID0gbHZsIHx8IDA7XHJcblx0XHRcdHZhciBtYXhMZXZlbHMgPSA1O1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICogQ2xlYXJzIHRoZSBxdWFkVHJlZSBhbmQgYWxsIG5vZGVzIG9mIG9iamVjdHNcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0b2JqZWN0cyA9IFtdO1xyXG5cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdHRoaXMubm9kZXNbaV0uY2xlYXIoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMubm9kZXMgPSBbXTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIEdldCBhbGwgb2JqZWN0cyBpbiB0aGUgcXVhZFRyZWVcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuZ2V0QWxsT2JqZWN0cyA9IGZ1bmN0aW9uIChyZXR1cm5lZE9iamVjdHMpIHtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubm9kZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdHRoaXMubm9kZXNbaV0uZ2V0QWxsT2JqZWN0cyhyZXR1cm5lZE9iamVjdHMpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IG9iamVjdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdHJldHVybmVkT2JqZWN0cy5wdXNoKG9iamVjdHNbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIHJldHVybmVkT2JqZWN0cztcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFJldHVybiBhbGwgb2JqZWN0cyB0aGF0IHRoZSBvYmplY3QgY291bGQgY29sbGlkZSB3aXRoXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmZpbmRPYmplY3RzID0gZnVuY3Rpb24gKHJldHVybmVkT2JqZWN0cywgb2JqKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiVU5ERUZJTkVEIE9CSkVDVFwiKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBpbmRleCA9IHRoaXMuZ2V0SW5kZXgob2JqKTtcclxuXHRcdFx0XHRpZiAoaW5kZXggIT0gLTEgJiYgdGhpcy5ub2Rlcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdHRoaXMubm9kZXNbaW5kZXhdLmZpbmRPYmplY3RzKHJldHVybmVkT2JqZWN0cywgb2JqKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBsZW4gPSBvYmplY3RzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRyZXR1cm5lZE9iamVjdHMucHVzaChvYmplY3RzW2ldKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiByZXR1cm5lZE9iamVjdHM7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBJbnNlcnQgdGhlIG9iamVjdCBpbnRvIHRoZSBxdWFkVHJlZS4gSWYgdGhlIHRyZWVcclxuXHRcdFx0ICogZXhjZWRlcyB0aGUgY2FwYWNpdHksIGl0IHdpbGwgc3BsaXQgYW5kIGFkZCBhbGxcclxuXHRcdFx0ICogb2JqZWN0cyB0byB0aGVpciBjb3JyZXNwb25kaW5nIG5vZGVzLlxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5pbnNlcnQgPSBmdW5jdGlvbiAob2JqKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSkge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IG9iai5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmluc2VydChvYmpbaV0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLm5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0dmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleChvYmopO1xyXG5cdFx0XHRcdFx0Ly8gT25seSBhZGQgdGhlIG9iamVjdCB0byBhIHN1Ym5vZGUgaWYgaXQgY2FuIGZpdCBjb21wbGV0ZWx5XHJcblx0XHRcdFx0XHQvLyB3aXRoaW4gb25lXHJcblx0XHRcdFx0XHRpZiAoaW5kZXggIT0gLTEpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5ub2Rlc1tpbmRleF0uaW5zZXJ0KG9iaik7XHJcblxyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRvYmplY3RzLnB1c2gob2JqKTtcclxuXHJcblx0XHRcdFx0Ly8gUHJldmVudCBpbmZpbml0ZSBzcGxpdHRpbmdcclxuXHRcdFx0XHRpZiAob2JqZWN0cy5sZW5ndGggPiBtYXhPYmplY3RzICYmIGxldmVsIDwgbWF4TGV2ZWxzKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5ub2Rlc1swXSA9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3BsaXQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR2YXIgaSA9IDA7XHJcblx0XHRcdFx0XHR3aGlsZSAoaSA8IG9iamVjdHMubGVuZ3RoKSB7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4KG9iamVjdHNbaV0pO1xyXG5cdFx0XHRcdFx0XHRpZiAoaW5kZXggIT0gLTEpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLm5vZGVzW2luZGV4XS5pbnNlcnQoKG9iamVjdHMuc3BsaWNlKGksIDEpKVswXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aSsrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICogRGV0ZXJtaW5lIHdoaWNoIG5vZGUgdGhlIG9iamVjdCBiZWxvbmdzIHRvLiAtMSBtZWFuc1xyXG5cdFx0XHQgKiBvYmplY3QgY2Fubm90IGNvbXBsZXRlbHkgZml0IHdpdGhpbiBhIG5vZGUgYW5kIGlzIHBhcnRcclxuXHRcdFx0ICogb2YgdGhlIGN1cnJlbnQgbm9kZVxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5nZXRJbmRleCA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHJcblx0XHRcdFx0dmFyIGluZGV4ID0gLTE7XHJcblx0XHRcdFx0dmFyIHZlcnRpY2FsTWlkcG9pbnQgPSB0aGlzLmJvdW5kcy54ICsgdGhpcy5ib3VuZHMud2lkdGggLyAyO1xyXG5cdFx0XHRcdHZhciBob3Jpem9udGFsTWlkcG9pbnQgPSB0aGlzLmJvdW5kcy55ICsgdGhpcy5ib3VuZHMuaGVpZ2h0IC8gMjtcclxuXHJcblx0XHRcdFx0Ly8gT2JqZWN0IGNhbiBmaXQgY29tcGxldGVseSB3aXRoaW4gdGhlIHRvcCBxdWFkcmFudFxyXG5cdFx0XHRcdHZhciB0b3BRdWFkcmFudCA9IChvYmoueSA8IGhvcml6b250YWxNaWRwb2ludCAmJiBvYmoueSArIG9iai5oZWlnaHQgPCBob3Jpem9udGFsTWlkcG9pbnQpO1xyXG5cdFx0XHRcdC8vIE9iamVjdCBjYW4gZml0IGNvbXBsZXRlbHkgd2l0aGluIHRoZSBib3R0b20gcXVhbmRyYW50XHJcblx0XHRcdFx0dmFyIGJvdHRvbVF1YWRyYW50ID0gKG9iai55ID4gaG9yaXpvbnRhbE1pZHBvaW50KTtcclxuXHJcblx0XHRcdFx0Ly8gT2JqZWN0IGNhbiBmaXQgY29tcGxldGVseSB3aXRoaW4gdGhlIGxlZnQgcXVhZHJhbnRzXHJcblx0XHRcdFx0aWYgKG9iai54IDwgdmVydGljYWxNaWRwb2ludCAmJlxyXG5cdFx0XHRcdFx0XHRvYmoueCArIG9iai53aWR0aCA8IHZlcnRpY2FsTWlkcG9pbnQpIHtcclxuXHRcdFx0XHRcdGlmICh0b3BRdWFkcmFudCkge1xyXG5cdFx0XHRcdFx0XHRpbmRleCA9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChib3R0b21RdWFkcmFudCkge1xyXG5cdFx0XHRcdFx0XHRpbmRleCA9IDI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gT2JqZWN0IGNhbiBmaXggY29tcGxldGVseSB3aXRoaW4gdGhlIHJpZ2h0IHF1YW5kcmFudHNcclxuXHRcdFx0XHRlbHNlIGlmIChvYmoueCA+IHZlcnRpY2FsTWlkcG9pbnQpIHtcclxuXHRcdFx0XHRcdGlmICh0b3BRdWFkcmFudCkge1xyXG5cdFx0XHRcdFx0XHRpbmRleCA9IDA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChib3R0b21RdWFkcmFudCkge1xyXG5cdFx0XHRcdFx0XHRpbmRleCA9IDM7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gaW5kZXg7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBTcGxpdHMgdGhlIG5vZGUgaW50byA0IHN1Ym5vZGVzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLnNwbGl0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdC8vIEJpdHdpc2Ugb3IgW2h0bWw1cm9ja3NdXHJcblx0XHRcdFx0dmFyIHN1YldpZHRoID0gKHRoaXMuYm91bmRzLndpZHRoIC8gMikgfCAwO1xyXG5cdFx0XHRcdHZhciBzdWJIZWlnaHQgPSAodGhpcy5ib3VuZHMuaGVpZ2h0IC8gMikgfCAwO1xyXG5cclxuXHRcdFx0XHR0aGlzLm5vZGVzWzBdID0gbmV3IHF1YWRUcmVlKHtcclxuXHRcdFx0XHRcdHg6IHRoaXMuYm91bmRzLnggKyBzdWJXaWR0aCxcclxuXHRcdFx0XHRcdHk6IHRoaXMuYm91bmRzLnksXHJcblx0XHRcdFx0XHR3aWR0aDogc3ViV2lkdGgsXHJcblx0XHRcdFx0XHRoZWlnaHQ6IHN1YkhlaWdodFxyXG5cdFx0XHRcdH0sIGxldmVsICsgMSk7XHJcblx0XHRcdFx0dGhpcy5ub2Rlc1sxXSA9IG5ldyBxdWFkVHJlZSh7XHJcblx0XHRcdFx0XHR4OiB0aGlzLmJvdW5kcy54LFxyXG5cdFx0XHRcdFx0eTogdGhpcy5ib3VuZHMueSxcclxuXHRcdFx0XHRcdHdpZHRoOiBzdWJXaWR0aCxcclxuXHRcdFx0XHRcdGhlaWdodDogc3ViSGVpZ2h0XHJcblx0XHRcdFx0fSwgbGV2ZWwgKyAxKTtcclxuXHRcdFx0XHR0aGlzLm5vZGVzWzJdID0gbmV3IHF1YWRUcmVlKHtcclxuXHRcdFx0XHRcdHg6IHRoaXMuYm91bmRzLngsXHJcblx0XHRcdFx0XHR5OiB0aGlzLmJvdW5kcy55ICsgc3ViSGVpZ2h0LFxyXG5cdFx0XHRcdFx0d2lkdGg6IHN1YldpZHRoLFxyXG5cdFx0XHRcdFx0aGVpZ2h0OiBzdWJIZWlnaHRcclxuXHRcdFx0XHR9LCBsZXZlbCArIDEpO1xyXG5cdFx0XHRcdHRoaXMubm9kZXNbM10gPSBuZXcgcXVhZFRyZWUoe1xyXG5cdFx0XHRcdFx0eDogdGhpcy5ib3VuZHMueCArIHN1YldpZHRoLFxyXG5cdFx0XHRcdFx0eTogdGhpcy5ib3VuZHMueSArIHN1YkhlaWdodCxcclxuXHRcdFx0XHRcdHdpZHRoOiBzdWJXaWR0aCxcclxuXHRcdFx0XHRcdGhlaWdodDogc3ViSGVpZ2h0XHJcblx0XHRcdFx0fSwgbGV2ZWwgKyAxKTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBxdWFkVHJlZTtcclxuXHR9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnU2hpcCcsIFNoaXApO1xyXG5cdFNoaXAuJGluamVjdCA9IFtcIkRyYXdhYmxlXCIsIFwiUG9vbFwiLCBcIkltYWdlUmVwb1wiXVxyXG5cdGZ1bmN0aW9uIFNoaXAoRHJhd2FibGUsIFBvb2wsIEltYWdlUmVwbykge1xyXG5cdFx0ZnVuY3Rpb24gc2hpcCgpIHtcclxuXHRcdFx0dGhpcy5zcGVlZCA9IDU7XHJcblx0XHRcdHRoaXMuYnVsbGV0UG9vbCA9IG5ldyBQb29sKDEpO1xyXG5cdFx0XHR0aGlzLmJ1bGxldFBvb2wuaW5pdChcImJ1bGxldFwiKTtcclxuXHRcdFx0dmFyIGZpcmVSYXRlID0gMTtcclxuXHRcdFx0dmFyIGNvdW50ZXIgPSAwO1xyXG5cdFx0XHR0aGlzLmNvbGxpZGFibGVXaXRoID0gXCJlbmVteUJ1bGxldFwiO1xyXG5cdFx0XHR0aGlzLnR5cGUgPSBcInNoaXBcIjtcclxuXHJcblx0XHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcblx0XHRcdFx0Ly8gRGVmdWFsdCB2YXJpYWJsZXNcclxuXHRcdFx0XHR0aGlzLnggPSB4O1xyXG5cdFx0XHRcdHRoaXMueSA9IHk7XHJcblx0XHRcdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xyXG5cdFx0XHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFx0XHRcdHRoaXMuYWxpdmUgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMuaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmJ1bGxldFBvb2wuaW5pdChcImJ1bGxldFwiKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuY29udGV4dC5kcmF3SW1hZ2UoSW1hZ2VSZXBvLnNwYWNlc2hpcCwgdGhpcy54LCB0aGlzLnkpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR0aGlzLm1vdmUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0Y291bnRlcisrO1xyXG5cdFx0XHRcdC8vIERldGVybWluZSBpZiB0aGUgYWN0aW9uIGlzIG1vdmUgYWN0aW9uXHJcblx0XHRcdFx0aWYgKEtFWV9TVEFUVVMubGVmdCB8fCBLRVlfU1RBVFVTLnJpZ2h0KSB7XHJcblx0XHRcdFx0XHQvLyBUaGUgc2hpcCBtb3ZlZCwgc28gZXJhc2UgaXQncyBjdXJyZW50IGltYWdlIHNvIGl0IGNhblxyXG5cdFx0XHRcdFx0Ly8gYmUgcmVkcmF3biBpbiBpdCdzIG5ldyBsb2NhdGlvblxyXG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmNsZWFyUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHggYW5kIHkgYWNjb3JkaW5nIHRvIHRoZSBkaXJlY3Rpb24gdG8gbW92ZSBhbmRcclxuXHRcdFx0XHRcdC8vIHJlZHJhdyB0aGUgc2hpcC4gQ2hhbmdlIHRoZSBlbHNlIGlmJ3MgdG8gaWYgc3RhdGVtZW50c1xyXG5cdFx0XHRcdFx0Ly8gdG8gaGF2ZSBkaWFnb25hbCBtb3ZlbWVudC5cclxuXHRcdFx0XHRcdGlmIChLRVlfU1RBVFVTLmxlZnQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy54IC09IHRoaXMuc3BlZWRcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMueCA8PSAwKSAvLyBLZWVwIHBsYXllciB3aXRoaW4gdGhlIHNjcmVlblxyXG5cdFx0XHRcdFx0XHRcdHRoaXMueCA9IDA7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKEtFWV9TVEFUVVMucmlnaHQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy54ICs9IHRoaXMuc3BlZWRcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMueCA+PSB0aGlzLmNhbnZhc1dpZHRoIC0gdGhpcy53aWR0aClcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnggPSB0aGlzLmNhbnZhc1dpZHRoIC0gdGhpcy53aWR0aDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIEZpbmlzaCBieSByZWRyYXdpbmcgdGhlIHNoaXBcclxuXHRcdFx0XHRcdGlmICghdGhpcy5pc0NvbGxpZGluZykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmRyYXcoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmFsaXZlID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdGdhbWUuZ2FtZU92ZXIoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKEtFWV9TVEFUVVMuc3BhY2UgJiYgY291bnRlciA+PSBmaXJlUmF0ZSAmJiAhdGhpcy5pc0NvbGxpZGluZykge1xyXG5cdFx0XHRcdFx0dGhpcy5maXJlKCk7XHJcblx0XHRcdFx0XHRjb3VudGVyID0gMDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIEZpcmVzIHR3byBidWxsZXRzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmZpcmUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy5idWxsZXRQb29sLmdldCh0aGlzLnggKyAxOSwgdGhpcy55IC0gMywgMyk7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRzaGlwLnByb3RvdHlwZSA9IG5ldyBEcmF3YWJsZSgpO1xyXG5cdFx0cmV0dXJuIHNoaXA7XHJcblx0fVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgSG9tZUN0cmwpO1xyXG5cclxuICAgIEhvbWVDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyR0aW1lb3V0J107XHJcblxyXG4gICAgIGZ1bmN0aW9uIEhvbWVDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgaG9tZVZtID0gdGhpcztcclxuICAgICAgICBob21lVm0uYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpO1xyXG4gICAgICAgIGhvbWVWbS5sb2FkUGlucyA9IGxvYWRQaW5zKCk7XHJcbiAgICAgICAgaG9tZVZtLm15TWFya2VyID0ge307XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiSG9tZVwiO1xyXG5cclxuICAgICAgICB2YXIgZGVmYXVsdExhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoMzcuMDkwMjQsIC05NS43MTI4OTEpO1xyXG4gICAgICAgIHZhciBkaXJlY3Rpb25zRGlzcGxheSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIoe1xyXG4gICAgICAgICAgICBzdXBwcmVzc01hcmtlcnM6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgZGlyZWN0aW9uc1NlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1NlcnZpY2UoKTtcclxuICAgICAgICB2YXIgdHJhZmZpY0xheWVyID0gbmV3IGdvb2dsZS5tYXBzLlRyYWZmaWNMYXllcigpO1xyXG5cclxuICAgICAgICBob21lVm0ubWFwT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgem9vbTogNCxcclxuICAgICAgICAgICAgY2VudGVyOiBkZWZhdWx0TGF0TG5nLFxyXG4gICAgICAgICAgICBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLFxyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXHJcbiAgICAgICAgICAgIG5hdmlnYXRpb25Db250cm9sOiBmYWxzZSxcclxuICAgICAgICAgICAgc2NhbGVDb250cm9sOiBmYWxzZSxcclxuICAgICAgICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkRG9tTGlzdGVuZXIod2luZG93LCBcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjZW50ZXIgPSAkc2NvcGUubWFwLmdldENlbnRlcigpO1xyXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKCRzY29wZS5tYXAsIFwicmVzaXplXCIpO1xyXG4gICAgICAgICAgICAkc2NvcGUubWFwLnNldENlbnRlcihjZW50ZXIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpbml0KCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGxvYWRQaW5zLCAyMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZFBpbnMoKSB7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUubWFwKSB7XHJcbiAgICAgICAgICAgICAgICBfcGxhY2VNeXNlbGYoKTtcclxuICAgICAgICAgICAgICAgIC8vZ2V0IGN1cnJlbnQgbG9jYXRpb24gYW5kIHBsYWNlIHVzZXIgcGluXHJcbiAgICAgICAgICAgICAgICBpZiAoXCJnZW9sb2NhdGlvblwiIGluIG5hdmlnYXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oX3Bsb3RMb2NhdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9wbGFjZU15c2VsZigpIHtcclxuICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhcIjQyLjI0MDg0NVwiLCBcIi04My4yMzQwOTdcIik7XHJcbiAgICAgICAgICAgIGhvbWVWbS5teU1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgbWFwOiAkc2NvcGUubWFwLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiRGFtaWFuIFN0cm9uZ1wiLFxyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy9yZWJvdW5kIHZpZXdcclxuICAgICAgICAgICAgaG9tZVZtLmJvdW5kcy5leHRlbmQobG9jYXRpb24pO1xyXG4gICAgICAgICAgICAkc2NvcGUubWFwLmZpdEJvdW5kcyhob21lVm0uYm91bmRzKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvL2Ryb3AgcGluIG9uIG1hcCBmb3IgbG9jYXRpb25cclxuICAgICAgICBmdW5jdGlvbiBfcGxvdExvY2F0aW9uKHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vY3JlYXRlIG1hcmtlclxyXG4gICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XHJcbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsb2NhdGlvbixcclxuICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIllvdSBBcmUgSGVyZVwiLFxyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy9yZWJvdW5kIHZpZXdcclxuICAgICAgICAgICAgaG9tZVZtLmJvdW5kcy5leHRlbmQobG9jYXRpb24pO1xyXG4gICAgICAgICAgICAkc2NvcGUubWFwLmZpdEJvdW5kcyhob21lVm0uYm91bmRzKTtcclxuXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlKHtcclxuICAgICAgICAgICAgICAgIG9yaWdpbjpsb2NhdGlvbixcclxuICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBob21lVm0ubXlNYXJrZXIucG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgICB0cmF2ZWxNb2RlOiBnb29nbGUubWFwcy5UcmF2ZWxNb2RlLkRSSVZJTkdcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzdWx0LCBzdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldERpcmVjdGlvbnMocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXRNYXAoJHNjb3BlLm1hcCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxvYWRQaW5zOiBsb2FkUGluc1xyXG4gICAgICAgIH07XHJcbiAgICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignTW92ZUN0cmwnLCBNb3ZlQ3RybCk7XHJcblxyXG5cdE1vdmVDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyR0aW1lb3V0J107XHJcblxyXG5cdGZ1bmN0aW9uIE1vdmVDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQpIHtcclxuXHRcdHZhciBtb3ZlYWJsZSA9IHRoaXM7XHJcblx0XHRtb3ZlYWJsZS5kb3ROdW0gPSAwO1xyXG5cdFx0bW92ZWFibGUuc2NvcmUgPSAwO1xyXG5cdFx0bW92ZWFibGUuZG90cyA9IFtdO1xyXG5cdFx0JCh3aW5kb3cpLmtleWRvd24oX2tleSk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2tleShlKSB7XHJcblx0XHRcdGlmICgkKCcubW92ZWFibGUnKS5sZW5ndGgpIHtcclxuXHRcdFx0XHR2YXIgZXZlbnQgPSB3aW5kb3cuZXZlbnQgPyB3aW5kb3cuZXZlbnQgOiBlO1xyXG5cdFx0XHRcdHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xyXG5cdFx0XHRcdFx0Y2FzZSAzNzogLy9sZWZ0XHJcblx0XHRcdFx0XHRcdF9tb3ZlKCdsJyk7XHJcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDM4OiAvL3VwXHJcblx0XHRcdFx0XHRcdF9tb3ZlKCd1Jyk7XHJcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDM5OiAvL3JpZ2h0XHJcblx0XHRcdFx0XHRcdF9tb3ZlKCdyJyk7XHJcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIDQwOiAvL2Rvd25cclxuXHRcdFx0XHRcdFx0X21vdmUoJ2QnKTtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGZ1bmN0aW9uIF9tb3ZlKGRpcmVjdGlvbikge1xyXG5cdFx0XHRcdHZhciBzcGVlZCA9IDE2O1xyXG5cdFx0XHRcdHZhciBtYXhEb3RzID0gMztcclxuXHRcdFx0XHR2YXIgc2l6ZSA9ICQoJy5tb3ZlYWJsZScpLmhlaWdodCgpO1xyXG5cdFx0XHRcdHZhciBjaGFyYWN0ZXIgPSAkKCcubW92ZWFibGUnKTtcclxuXHRcdFx0XHQvL2dldCBjdXJyZW50IHBvc2l0aW9uXHJcblx0XHRcdFx0dmFyIHBvcyA9IGNoYXJhY3Rlci5vZmZzZXQoKTtcclxuXHRcdFx0XHQvL21vZGlmeSBieSBzcGVlZCBhbmQgZGlyZWN0aW9uXHJcblx0XHRcdFx0c3dpdGNoIChkaXJlY3Rpb24pIHtcclxuXHRcdFx0XHRcdGNhc2UgJ2wnOlxyXG5cdFx0XHRcdFx0XHRpZiAocG9zLmxlZnQgLSBzcGVlZCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFyYWN0ZXIub2Zmc2V0KHsgbGVmdDogcG9zLmxlZnQgLSBzcGVlZCB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFyYWN0ZXIub2Zmc2V0KHsgbGVmdDogMCB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3InOlxyXG5cdFx0XHRcdFx0XHRpZiAocG9zLmxlZnQgKyAoc2l6ZSArIHNwZWVkICsgMjApIDwgd2luZG93LmlubmVyV2lkdGgpIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFyYWN0ZXIub2Zmc2V0KHsgbGVmdDogcG9zLmxlZnQgKyBzcGVlZCB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFyYWN0ZXIub2Zmc2V0KHsgbGVmdDogd2luZG93LmlubmVyV2lkdGggLSAoc2l6ZSArIDIwKSB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ3UnOlxyXG5cdFx0XHRcdFx0XHRpZiAocG9zLnRvcCAtIHNwZWVkID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdGNoYXJhY3Rlci5vZmZzZXQoeyB0b3A6IHBvcy50b3AgLSBzcGVlZCB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFyYWN0ZXIub2Zmc2V0KHsgdG9wOiAwIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAnZCc6XHJcblx0XHRcdFx0XHRcdGlmIChwb3MudG9wICsgKHNpemUgKyBzcGVlZCkgPCB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFyYWN0ZXIub2Zmc2V0KHsgdG9wOiBwb3MudG9wICsgc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IHRvcDogd2luZG93LmlubmVySGVpZ2h0IC0gc2l6ZSB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly9zcGF3biBkb3Qgb24gZmlyc3QgbW92ZVxyXG5cdFx0XHRcdGlmIChtb3ZlYWJsZS5kb3RzLmxlbmd0aCA8IG1heERvdHMpIHtcclxuXHRcdFx0XHRcdF9zcGF3bkRvdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1vdmVhYmxlLmRvdHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcdF9jaGVja0NvbGxpc2lvbihtb3ZlYWJsZS5kb3RzW2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfY2hlY2tDb2xsaXNpb24oZG90KSB7XHJcblx0XHRcdHZhciBkYmRzID0gX2dldEJvdW5kcyhkb3QuaWQpO1xyXG5cdFx0XHR2YXIgY2JkcyA9IF9nZXRCb3VuZHMoXCIubW92ZWFibGVcIik7XHJcblx0XHRcdC8vY2hlY2sgZm9yIGNvbGxpc2lvbiB3aXRoIGRvdFxyXG5cdFx0XHR2YXIgY29scyA9IGNvbGxpZGUoZGJkcywgY2Jkcyk7XHJcblx0XHRcdGlmIChjb2xzKSB7XHJcblx0XHRcdFx0X2tpbGxEb3QoZG90KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIGNvbGxpZGUoYSwgYikge1xyXG5cdFx0XHRyZXR1cm4gKGEubGVmdCA8IGIubGVmdCArIGIud2lkdGggJiYgYS5sZWZ0ICsgYS53aWR0aCA+IGIubGVmdCAmJlxyXG5cdFx0YS50b3AgPCBiLnRvcCArIGIuaGVpZ2h0ICYmIGEudG9wICsgYS5oZWlnaHQgPiBiLnRvcCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBfc3Bhd25Eb3QoKSB7XHJcblx0XHRcdHZhciBkb3QgPSB7XHJcblx0XHRcdFx0YWxpdmU6IHRydWUsXHJcblx0XHRcdFx0cG9zOiBfZG90UG9zLFxyXG5cdFx0XHRcdGlkOiBcIi5kb3RcIiArIG1vdmVhYmxlLmRvdE51bVxyXG5cdFx0XHR9O1xyXG5cdFx0XHQvL2FkZCBuZXcgZG90IHRvIGFycmF5XHJcblx0XHRcdG1vdmVhYmxlLmRvdHMucHVzaChkb3QpO1xyXG5cdFx0XHQkKFwiLmRvdHNcIikuYXBwZW5kKCc8ZGl2IGNsYXNzPVwiZG90IGRvdCcgKyBtb3ZlYWJsZS5kb3ROdW0gKyAnXCIgbmctc2hvdz1cImRvdC5hbGl2ZVwiPjwvZGl2PicpO1xyXG5cdFx0XHRtb3ZlYWJsZS5kb3ROdW0rKztcclxuXHRcdFx0Ly9wb3B1bGF0ZSBpZCBvZiBkb3QgZm9yIHJlZmVyZW5jZVxyXG5cdFx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xyXG5cdFx0XHQvL3NldCBuZXcgZG90cyBwb3NpdGlvblxyXG5cdFx0XHR2YXIgbmV3RG90ID0gJChkb3QuaWQpO1xyXG5cdFx0XHR2YXIgdG9wUiA9IE1hdGguYWJzKE1hdGgucmFuZG9tKCkgKiAod2luZG93LmlubmVySGVpZ2h0IC0gbmV3RG90LmhlaWdodCgpKSk7XHJcblx0XHRcdHZhciBsZWZ0UiA9IE1hdGguYWJzKE1hdGgucmFuZG9tKCkgKiAod2luZG93LmlubmVySGVpZ2h0IC0gbmV3RG90LmhlaWdodCgpIC0gMjApKTtcclxuXHRcdFx0bmV3RG90Lm9mZnNldCh7IHRvcDogdG9wUiwgbGVmdDogbGVmdFIgfSk7XHJcblxyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gX2tpbGxEb3QoZG90KSB7XHJcblx0XHRcdC8vaW5jcmVhc2Ugc2NvcmUgYW5kIGtpbGwgZG90XHJcblx0XHRcdG1vdmVhYmxlLnNjb3JlKys7XHJcblx0XHRcdGRvdC5hbGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHR2YXIgaW5kZXggPSBtb3ZlYWJsZS5kb3RzLmluZGV4T2YoZG90KTtcclxuXHRcdFx0bW92ZWFibGUuZG90cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG5cdFx0XHQkKGRvdC5pZCkucmVtb3ZlKCk7XHJcblx0XHRcdCRzY29wZS4kZGlnZXN0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2RvdFBvcyhkb3QpIHtcclxuXHRcdFx0cmV0dXJuICQoZG90LmlkKS5vZmZzZXQoKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIF9nZXRCb3VuZHMob2JqKSB7XHJcblx0XHRcdC8vcmV0dXJuIGJvdW5kcyBvZiBkb3RcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRsZWZ0OiAkKG9iaikub2Zmc2V0KCkubGVmdCxcclxuXHRcdFx0XHRyaWdodDogJChvYmopLm9mZnNldCgpLmxlZnQgKyAkKG9iaikud2lkdGgoKSxcclxuXHRcdFx0XHR0b3A6ICQob2JqKS5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0Ym90dG9tOiAkKG9iaikub2Zmc2V0KCkudG9wICsgJChvYmopLmhlaWdodCgpLFxyXG5cdFx0XHRcdHdpZHRoOiAkKG9iaikud2lkdGgoKSxcclxuXHRcdFx0XHRoZWlnaHQ6ICQob2JqKS5oZWlnaHQoKVxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1BvcnRmb2xpb0N0cmwnLCBQb3J0Zm9saW9DdHJsKTtcclxuXHJcbiAgICBmdW5jdGlvbiBQb3J0Zm9saW9DdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBwb3J0Zm9saW9WbSA9IHRoaXM7XHJcbiAgICAgICAgcG9ydGZvbGlvVm0uYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpO1xyXG4gICAgICAgICRyb290U2NvcGUudGl0bGUgPSBcIlBvcnRmb2xpb1wiO1xyXG4gICAgfVxyXG5cclxuICAgIFBvcnRmb2xpb0N0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckdGltZW91dCddO1xyXG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==