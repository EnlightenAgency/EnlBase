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
						var eBullet = new Bullet("enemyBullet");
						eBullet.init(0, 0, ImageRepo.enemyBullet.width, ImageRepo.enemyBullet.height);
						eBullet.collidableWith = "ship";
						eBullet.type = "enemyBullet";
						pool[k] = eBullet;
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

				for (var j = 0, len = objects.length; j < len; j++) {
					returnedObjects.push(objects[j]);
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
					var nodeIndex = this.getIndex(obj);
					// Only add the object to a subnode if it can fit completely
					// within one
					if ( nodeIndex != -1) {
						this.nodes[ nodeIndex].insert(obj);

						return;
					}
				}

				objects.push(obj);

				// Prevent infinite splitting
				if (objects.length > maxObjects && level < maxLevels) {
					if (this.nodes[0] === null) {
						this.split();
					}

					var k = 0;
					while (k < objects.length) {

						var index = this.getIndex(objects[k]);
						if (index != -1) {
							this.nodes[index].insert((objects.splice(k, 1))[0]);
						}
						else {
							k++;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmN0cmwuanMiLCJjb250YWN0L2NvbnRhY3QuY3RybC5qcyIsImNvcmUvcGFnZS5jdHJsLmpzIiwiZ2FtZS9iYWNrZ3JvdW5kLmZhY3RvcnkuanMiLCJnYW1lL2J1bGxldC5mYWN0b3J5LmpzIiwiZ2FtZS9kcmF3YWJsZS5mYWN0b3J5LmpzIiwiZ2FtZS9lbmVteS5mYWN0b3J5LmpzIiwiZ2FtZS9nYW1lLmN0cmwuanMiLCJnYW1lL2ltYWdlcmVwby5mYWN0b3J5LmpzIiwiZ2FtZS9saXZlcy5mYWN0b3J5LmpzIiwiZ2FtZS9wb29sLmZhY3RvcnkuanMiLCJnYW1lL3F1YWR0cmVlLmZhY3RvcnkuanMiLCJnYW1lL3NoaXAuZmFjdG9yeS5qcyIsImhvbWUvaG9tZS5jdHJsLmpzIiwiaG9tZS9tb3ZlYWJsZS5qcyIsInBvcnRmb2xpby9wb3J0Zm9saW8uY3RybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZW5sQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcsIFtcbiAgICAgICAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgICAgICAgJ25nQW5pbWF0ZScsXG4gICAgICAgICAgICAnbW0uZm91bmRhdGlvbicsXG4gICAgICAgICAgICAndWkuZXZlbnQnLFxuICAgICAgICAgICAgJ3VpLm1hcCdcbiAgICAgICAgXSlcbiAgICAuY29uZmlnKGNvbmZpZylcbiAgICAucnVuKHJ1bik7XG5cblx0Y29uZmlnLiRpbmplY3QgPSBbJyR1cmxSb3V0ZXJQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsICckc3RhdGVQcm92aWRlcicsJyR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyJ107XG5cblx0ZnVuY3Rpb24gcnVuKCkge1xyXG5cclxuXHR9XG5cdGZ1bmN0aW9uIGNvbmZpZygkdXJsUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXIpIHtcclxuXHRcdCR1cmxQcm92aWRlci53aGVuKCcnLCAnLycpO1xuXHRcdCR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyLnN0cmljdE1vZGUoZmFsc2UpO1xuXHRcdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKS5oYXNoUHJlZml4KCchJyk7XG5cblx0XHQkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcclxuICAgICAgICBcdHVybDogJy8nLFxyXG4gICAgICAgIFx0dGVtcGxhdGVVcmw6ICdhcHAvaG9tZS9ob21lLnZpZXcuaHRtbCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlckFzOiAnaG9tZVZtJ1xyXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnYWJvdXQnLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvYWJvdXQnLFxyXG4gICAgICAgIFx0dGVtcGxhdGVVcmw6ICdhcHAvYWJvdXQvYWJvdXQudmlldy5odG1sJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXI6ICdBYm91dEN0cmwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlckFzOiAnYWJvdXRWbSdcclxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2NvbnRhY3QnLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvY29udGFjdCcsXHJcbiAgICAgICAgXHR0ZW1wbGF0ZVVybDogJ2FwcC9jb250YWN0L2NvbnRhY3Qudmlldy5odG1sJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXI6ICdDb250YWN0Q3RybCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyQXM6ICdjb250YWN0Vm0nXHJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdwb3J0Zm9saW8nLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvcG9ydGZvbGlvJyxcclxuICAgICAgICBcdHRlbXBsYXRlVXJsOiAnYXBwL3BvcnRmb2xpby9wb3J0Zm9saW8udmlldy5odG1sJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXI6ICdQb3J0Zm9saW9DdHJsJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXJBczogJ3BvcnRmb2xpb1ZtJ1xyXG4gICAgICAgIH0pXHJcblx0XHQuc3RhdGUoJ2dhbWUnLCB7XHJcblx0XHRcdHVybDogJy9nYW1lJyxcclxuXHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvZ2FtZS9nYW1lLnZpZXcuaHRtbCcsXHJcblx0XHRcdGNvbnRyb2xsZXI6ICdHYW1lQ3RybCcsXHJcblx0XHRcdGNvbnRyb2xsZXJBczogJ2dhbWVWbSdcclxuXHRcdH0pXHJcbiAgICAgICAgLnN0YXRlKCc0MDQnLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvNDA0JyxcclxuICAgICAgICBcdHRlbXBsYXRlVXJsOiAnYXBwLzQwNC80MDQudmlldy5odG1sJ1xyXG4gICAgICAgIH0pO1xyXG5cdFx0JHVybFByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG5cdH1cclxuXHJcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdBYm91dEN0cmwnLCBBYm91dEN0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEFib3V0Q3RybCgkc2NvcGUsICRyb290U2NvcGUsJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgYWJvdXRWbSA9IHRoaXM7XHJcbiAgICAgICAgYWJvdXRWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiQWJvdXRcIjtcclxuICAgIH1cclxuXHJcbiAgICBBYm91dEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckdGltZW91dCddO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbnRhY3RDdHJsJywgQ29udGFjdEN0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIENvbnRhY3RDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBjb250YWN0Vm0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnRhY3RWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiQ29udGFjdFwiO1xyXG4gICAgfVxyXG5cclxuICAgIENvbnRhY3RDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywnJHRpbWVvdXQnXTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAuY29udHJvbGxlcignUGFnZUN0cmwnLCBQYWdlQ3RybCk7XHJcblxyXG4gICAgUGFnZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckc3RhdGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBQYWdlQ3RybCgkc2NvcGUsICRyb290U2NvcGUsJHN0YXRlKSB7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzO1xyXG4gICAgICAgICRyb290U2NvcGUudGl0bGUgPSBcIlwiO1xyXG5cclxuICAgICAgICBwYWdlLmdldENsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnYWN0aXZlJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ0JhY2tncm91bmQnLCBCYWNrZ3JvdW5kKTtcclxuXHJcblx0QmFja2dyb3VuZC4kaW5qZWN0ID0gWydEcmF3YWJsZScsICdJbWFnZVJlcG8nXTtcclxuXHJcblx0ZnVuY3Rpb24gQmFja2dyb3VuZChEcmF3YWJsZSwgSW1hZ2VSZXBvKSB7XHJcblx0XHRmdW5jdGlvbiBiYWNrZ3JvdW5kKCkge1xyXG5cdFx0XHR0aGlzLnNwZWVkID0gMTsgXHJcblx0XHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHQvL1BhbiBiYWNrZ3JvdW5kXHJcblx0XHRcdFx0dGhpcy55ICs9IHRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uYmFja2dyb3VuZCwgdGhpcy54LCB0aGlzLnkpO1xyXG5cdFx0XHRcdC8vIERyYXcgYW5vdGhlciBpbWFnZSBhdCB0aGUgdG9wIGVkZ2Ugb2YgdGhlIGZpcnN0IGltYWdlXHJcblx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uYmFja2dyb3VuZCwgdGhpcy54LCB0aGlzLnkgLSB0aGlzLmNhbnZhc0hlaWdodCk7XHJcblx0XHRcdFx0Ly8gSWYgdGhlIGltYWdlIHNjcm9sbGVkIG9mZiB0aGUgc2NyZWVuLCByZXNldFxyXG5cdFx0XHRcdGlmICh0aGlzLnkgPj0gdGhpcy5jYW52YXNIZWlnaHQpIHtcclxuXHRcdFx0XHRcdHRoaXMueSA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0YmFja2dyb3VuZC5wcm90b3R5cGUgPSBuZXcgRHJhd2FibGUoKTtcclxuXHRcdHJldHVybiBiYWNrZ3JvdW5kO1xyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdCdWxsZXQnLCBCdWxsZXQpO1xyXG5cclxuXHRCdWxsZXQuJGluamVjdCA9IFtcIkRyYXdhYmxlXCIsXCJJbWFnZVJlcG9cIl07XHJcblx0ZnVuY3Rpb24gQnVsbGV0KERyYXdhYmxlLCBJbWFnZVJlcG8pIHtcclxuXHRcdGZ1bmN0aW9uIGJ1bGxldChvYmplY3QpIHtcclxuXHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlOyAvLyBJcyB0cnVlIGlmIHRoZSBidWxsZXQgaXMgY3VycmVudGx5IGluIHVzZVxyXG5cdFx0XHR2YXIgc2VsZiA9IG9iamVjdDtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogU2V0cyB0aGUgYnVsbGV0IHZhbHVlc1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5zcGF3biA9IGZ1bmN0aW9uICh4LCB5LCBzcGVlZCkge1xyXG5cdFx0XHRcdHRoaXMueCA9IHg7XHJcblx0XHRcdFx0dGhpcy55ID0geTtcclxuXHRcdFx0XHR0aGlzLnNwZWVkID0gc3BlZWQ7XHJcblx0XHRcdFx0dGhpcy5hbGl2ZSA9IHRydWU7XHJcblx0XHRcdH07XHJcblx0XHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KHRoaXMueCAtIDEsIHRoaXMueSAtIDEsIHRoaXMud2lkdGggKyAyLCB0aGlzLmhlaWdodCArIDIpO1xyXG5cdFx0XHRcdHRoaXMueSAtPSB0aGlzLnNwZWVkO1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzQ29sbGlkaW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoc2VsZiA9PT0gXCJidWxsZXRcIiAmJiB0aGlzLnkgPD0gMCAtIHRoaXMuaGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoc2VsZiA9PT0gXCJlbmVteUJ1bGxldFwiICYmIHRoaXMueSA+PSB0aGlzLmNhbnZhc0hlaWdodCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKHNlbGYgPT09IFwiYnVsbGV0XCIpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uYnVsbGV0LCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChzZWxmID09PSBcImVuZW15QnVsbGV0XCIpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uZW5lbXlCdWxsZXQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFJlc2V0cyB0aGUgYnVsbGV0IHZhbHVlc1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLnggPSAwO1xyXG5cdFx0XHRcdHRoaXMueSA9IDA7XHJcblx0XHRcdFx0dGhpcy5zcGVlZCA9IDA7XHJcblx0XHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMuaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGJ1bGxldC5wcm90b3R5cGUgPSBuZXcgRHJhd2FibGUoKTtcclxuXHRcdHJldHVybiBidWxsZXQ7XHJcblx0fVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ0RyYXdhYmxlJywgRHJhd2FibGUpO1xyXG5cclxuXHRmdW5jdGlvbiBEcmF3YWJsZSgpIHtcclxuXHRcdGZ1bmN0aW9uIGRyYXdhYmxlKCkge1xyXG5cdFx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG5cdFx0XHRcdC8vIERlZmF1bHQgdmFyaWFibGVzXHJcblx0XHRcdFx0dGhpcy54ID0geDtcclxuXHRcdFx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0XHRcdHRoaXMud2lkdGggPSB3aWR0aDtcclxuXHRcdFx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuXHRcdFx0fTtcclxuXHRcdFx0dGhpcy5zcGVlZCA9IDA7XHJcblx0XHRcdHRoaXMuY2FudmFzV2lkdGggPSAwO1xyXG5cdFx0XHR0aGlzLmNhbnZhc0hlaWdodCA9IDA7XHJcblx0XHRcdHRoaXMuY29sbGlkYWJsZVdpdGggPSBcIlwiO1xyXG5cdFx0XHR0aGlzLmlzQ29sbGlkaW5nID0gZmFsc2U7XHJcblx0XHRcdHRoaXMudHlwZSA9IFwiXCI7XHJcblx0XHRcdC8vIERlZmluZSBhYnN0cmFjdCBmdW5jdGlvbiB0byBiZSBpbXBsZW1lbnRlZCBpbiBjaGlsZCBvYmplY3RzXHJcblx0XHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0fTtcclxuXHRcdFx0dGhpcy5tb3ZlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR0aGlzLmlzQ29sbGlkYWJsZVdpdGggPSBmdW5jdGlvbiAob2JqZWN0KSB7XHJcblx0XHRcdFx0cmV0dXJuICh0aGlzLmNvbGxpZGFibGVXaXRoID09PSBvYmplY3QudHlwZSk7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZHJhd2FibGU7XHJcblx0fVxyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnRW5lbXknLCBFbmVteSk7XHJcblx0RW5lbXkuJGluamVjdCA9IFtcIkRyYXdhYmxlXCIsICBcIkltYWdlUmVwb1wiXTtcclxuXHRmdW5jdGlvbiBFbmVteShEcmF3YWJsZSwgSW1hZ2VSZXBvKSB7XHJcblx0XHRmdW5jdGlvbiBlbmVteSgpIHtcclxuXHRcdFx0dmFyIHBlcmNlbnRGaXJlID0gMC4wMDU7XHJcblx0XHRcdHZhciBjaGFuY2UgPSAwO1xyXG5cdFx0XHR0aGlzLmFsaXZlID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuY29sbGlkYWJsZVdpdGggPSBcImJ1bGxldFwiO1xyXG5cdFx0XHR0aGlzLnR5cGUgPSBcImVuZW15XCI7XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFNldHMgdGhlIEVuZW15IHZhbHVlc1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5zcGF3biA9IGZ1bmN0aW9uICh4LCB5LCBzcGVlZCkge1xyXG5cdFx0XHRcdHRoaXMueCA9IHg7XHJcblx0XHRcdFx0dGhpcy55ID0geTtcclxuXHRcdFx0XHR0aGlzLnNwZWVkID0gc3BlZWQ7XHJcblx0XHRcdFx0dGhpcy5zcGVlZFggPSAwO1xyXG5cdFx0XHRcdHRoaXMuc3BlZWRZID0gc3BlZWQ7XHJcblx0XHRcdFx0dGhpcy5hbGl2ZSA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5sZWZ0RWRnZSA9IHRoaXMueCAtIDkwO1xyXG5cdFx0XHRcdHRoaXMucmlnaHRFZGdlID0gdGhpcy54ICsgOTA7XHJcblx0XHRcdFx0dGhpcy5ib3R0b21FZGdlID0gdGhpcy55ICsgMTQwO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBNb3ZlIHRoZSBlbmVteVxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5kcmF3ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuY29udGV4dC5jbGVhclJlY3QodGhpcy54IC0gMSwgdGhpcy55LCB0aGlzLndpZHRoICsgMSwgdGhpcy5oZWlnaHQpO1xyXG5cdFx0XHRcdHRoaXMueCArPSB0aGlzLnNwZWVkWDtcclxuXHRcdFx0XHR0aGlzLnkgKz0gdGhpcy5zcGVlZFk7XHJcblx0XHRcdFx0aWYgKHRoaXMueCA8PSB0aGlzLmxlZnRFZGdlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNwZWVkWCA9IHRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMueCA+PSB0aGlzLnJpZ2h0RWRnZSArIHRoaXMud2lkdGgpIHtcclxuXHRcdFx0XHRcdHRoaXMuc3BlZWRYID0gLXRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMueSA+PSB0aGlzLmJvdHRvbUVkZ2UpIHtcclxuXHRcdFx0XHRcdHRoaXMuc3BlZWQgPSAxLjU7XHJcblx0XHRcdFx0XHR0aGlzLnNwZWVkWSA9IDA7XHJcblx0XHRcdFx0XHR0aGlzLnkgLT0gNTtcclxuXHRcdFx0XHRcdHRoaXMuc3BlZWRYID0gLXRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICghdGhpcy5pc0NvbGxpZGluZykge1xyXG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uZW5lbXksIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0XHRcdC8vIEVuZW15IGhhcyBhIGNoYW5jZSB0byBzaG9vdCBldmVyeSBtb3ZlbWVudFxyXG5cdFx0XHRcdFx0Y2hhbmNlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTAxKTtcclxuXHRcdFx0XHRcdGlmIChjaGFuY2UgLyAxMDAgPCBwZXJjZW50RmlyZSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmZpcmUoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRnYW1lLnBsYXllclNjb3JlICs9IDEwO1xyXG5cdFx0XHRcdFx0aWYgKGdhbWUucGxheWVyU2NvcmUgJSAyMDAgPT09IDApIC8vZXZlcnkgMjAwMCBwb2ludHMgZ2FpbiBhIGxpZmVcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0Z2FtZS5saXZlcy5saWZlQ291bnQrKztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogRmlyZXMgYSBidWxsZXRcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuZmlyZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRnYW1lLmVuZW15QnVsbGV0UG9vbC5nZXQodGhpcy54ICsgdGhpcy53aWR0aCAvIDIsIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAtMi41KTtcclxuXHRcdFx0fTtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogUmVzZXRzIHRoZSBlbmVteSB2YWx1ZXNcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy54ID0gMDtcclxuXHRcdFx0XHR0aGlzLnkgPSAwO1xyXG5cdFx0XHRcdHRoaXMuc3BlZWQgPSAwO1xyXG5cdFx0XHRcdHRoaXMuc3BlZWRYID0gMDtcclxuXHRcdFx0XHR0aGlzLnNwZWVkWSA9IDA7XHJcblx0XHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMuaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGVuZW15LnByb3RvdHlwZSA9IG5ldyBEcmF3YWJsZSgpO1xyXG5cdFx0cmV0dXJuIGVuZW15O1xyXG5cdH1cclxufSgpKTsiLCJhbmd1bGFyXHJcblx0Lm1vZHVsZSgnYXBwJylcclxuXHQuY29udHJvbGxlcignR2FtZUN0cmwnLCBHYW1lQ3RybCk7XHJcblxyXG5HYW1lQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckdGltZW91dCcsICdJbWFnZVJlcG8nLCAnQmFja2dyb3VuZCcsICdTaGlwJywgJ0J1bGxldCcsXHJcblx0J0VuZW15JywgJ1Bvb2wnLCAnUXVhZFRyZWUnLCdMaXZlcyddO1xyXG5cclxudmFyIGdhbWU7XHJcblxyXG52YXIgS0VZX1NUQVRVUyA9IHt9O1xyXG5cclxuZnVuY3Rpb24gR2FtZUN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgSW1hZ2VSZXBvLCBCYWNrZ3JvdW5kLCBTaGlwLCBCdWxsZXQsXHJcblx0RW5lbXksIFBvb2wsIFF1YWRUcmVlLCBMaXZlcykge1xyXG5cdHZhciBnYW1lVm0gPSB0aGlzO1xyXG5cdGdhbWVWbS5nYW1lT3ZlciA9IGZhbHNlO1xyXG5cdGdhbWVWbS5yZXN0YXJ0ID0gcmVzdGFydDtcclxuXHRnYW1lID0gbmV3IEdhbWUoKTtcclxuXHR2YXIgc3RhdGUgPSBcIlwiO1xyXG5cclxuXHRmdW5jdGlvbiBpbml0KCkge1xyXG5cdFx0aWYgKGdhbWUuaW5pdCgpKSB7XHJcblx0XHRcdGdhbWUuc3RhcnQoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0JHNjb3BlLiRvbihcIkluaXRcIiwgaW5pdCk7XHJcblxyXG5cdC8vc2V0dXAgZ2FtZSBsb2dpY1xyXG5cdGZ1bmN0aW9uIEdhbWUoKSB7XHJcblx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRoaXMucGxheWVyU2NvcmUgPSAwO1xyXG5cdFx0XHR0aGlzLmJnQ2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhY2tncm91bmQnKTtcclxuXHRcdFx0dGhpcy5zaGlwQ2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NoaXAnKTtcclxuXHRcdFx0dGhpcy5tYWluQ2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKTtcclxuXHRcdFx0Ly8gVGVzdCB0byBzZWUgaWYgY2FudmFzIGlzIHN1cHBvcnRlZC4gT25seSBuZWVkIHRvXHJcblx0XHRcdC8vIGNoZWNrIG9uZSBjYW52YXNcclxuXHRcdFx0aWYgKHRoaXMuYmdDYW52YXMuZ2V0Q29udGV4dCkge1xyXG5cdFx0XHRcdHRoaXMuYmdDb250ZXh0ID0gdGhpcy5iZ0NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cdFx0XHRcdHRoaXMuc2hpcENvbnRleHQgPSB0aGlzLnNoaXBDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHRcdFx0XHR0aGlzLm1haW5Db250ZXh0ID0gdGhpcy5tYWluQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSBvYmplY3RzIHRvIGNvbnRhaW4gdGhlaXIgY29udGV4dCBhbmQgY2FudmFzXHJcblx0XHRcdFx0Ly8gaW5mb3JtYXRpb25cclxuXHRcdFx0XHRCYWNrZ3JvdW5kLnByb3RvdHlwZS5jb250ZXh0ID0gdGhpcy5iZ0NvbnRleHQ7XHJcblx0XHRcdFx0QmFja2dyb3VuZC5wcm90b3R5cGUuY2FudmFzV2lkdGggPSB0aGlzLmJnQ2FudmFzLndpZHRoO1xyXG5cdFx0XHRcdEJhY2tncm91bmQucHJvdG90eXBlLmNhbnZhc0hlaWdodCA9IHRoaXMuYmdDYW52YXMuaGVpZ2h0O1xyXG5cdFx0XHRcdExpdmVzLnByb3RvdHlwZS5jb250ZXh0ID0gdGhpcy5iZ0NvbnRleHQ7XHJcblx0XHRcdFx0TGl2ZXMucHJvdG90eXBlLmNhbnZhc1dpZHRoID0gdGhpcy5iZ0NhbnZhcy53aWR0aDtcclxuXHRcdFx0XHRMaXZlcy5wcm90b3R5cGUuY2FudmFzSGVpZ2h0ID0gdGhpcy5iZ0NhbnZhcy5oZWlnaHQ7XHJcblx0XHRcdFx0U2hpcC5wcm90b3R5cGUuY29udGV4dCA9IHRoaXMuc2hpcENvbnRleHQ7XHJcblx0XHRcdFx0U2hpcC5wcm90b3R5cGUuY2FudmFzV2lkdGggPSB0aGlzLnNoaXBDYW52YXMud2lkdGg7XHJcblx0XHRcdFx0U2hpcC5wcm90b3R5cGUuY2FudmFzSGVpZ2h0ID0gdGhpcy5zaGlwQ2FudmFzLmhlaWdodDtcclxuXHRcdFx0XHRCdWxsZXQucHJvdG90eXBlLmNvbnRleHQgPSB0aGlzLm1haW5Db250ZXh0O1xyXG5cdFx0XHRcdEJ1bGxldC5wcm90b3R5cGUuY2FudmFzV2lkdGggPSB0aGlzLm1haW5DYW52YXMud2lkdGg7XHJcblx0XHRcdFx0QnVsbGV0LnByb3RvdHlwZS5jYW52YXNIZWlnaHQgPSB0aGlzLm1haW5DYW52YXMuaGVpZ2h0O1xyXG5cdFx0XHRcdEVuZW15LnByb3RvdHlwZS5jb250ZXh0ID0gdGhpcy5tYWluQ29udGV4dDtcclxuXHRcdFx0XHRFbmVteS5wcm90b3R5cGUuY2FudmFzV2lkdGggPSB0aGlzLm1haW5DYW52YXMud2lkdGg7XHJcblx0XHRcdFx0RW5lbXkucHJvdG90eXBlLmNhbnZhc0hlaWdodCA9IHRoaXMubWFpbkNhbnZhcy5oZWlnaHQ7XHJcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgYmFja2dyb3VuZCBvYmplY3RcclxuXHRcdFx0XHR0aGlzLmJhY2tncm91bmQgPSBuZXcgQmFja2dyb3VuZCgpO1xyXG5cdFx0XHRcdHRoaXMuYmFja2dyb3VuZC5pbml0KDAsIDApOyAvLyBTZXQgZHJhdyBwb2ludCB0byAwLDBcclxuXHJcblx0XHRcdFx0Ly9pbml0aWFsaXplIGxpdmVzXHJcblx0XHRcdFx0dGhpcy5saXZlcyA9IG5ldyBMaXZlcygpO1xyXG5cdFx0XHRcdHRoaXMubGl2ZXMubGlmZUNvdW50ID0gMjtcclxuXHRcdFx0XHR0aGlzLmxpdmVzLmluaXQoMCwgdGhpcy5iZ0NhbnZhcy5oZWlnaHQgLSBJbWFnZVJlcG8uc3BhY2VzaGlwLmhlaWdodCwgSW1hZ2VSZXBvLnNwYWNlc2hpcC53aWR0aCwgSW1hZ2VSZXBvLnNwYWNlc2hpcC5oZWlnaHQpO1xyXG5cclxuXHRcdFx0XHQvLyBJbml0aWFsaXplIHRoZSBzaGlwIG9iamVjdFxyXG5cdFx0XHRcdHRoaXMuc2hpcCA9IG5ldyBTaGlwKCk7XHJcblxyXG5cdFx0XHRcdC8vIFNldCB0aGUgc2hpcCB0byBzdGFydCBuZWFyIHRoZSBib3R0b20gbWlkZGxlIG9mIHRoZSBjYW52YXNcclxuXHRcdFx0XHR0aGlzLnNoaXBTdGFydFggPSB0aGlzLnNoaXBDYW52YXMud2lkdGggLyAyIC0gSW1hZ2VSZXBvLnNwYWNlc2hpcC53aWR0aDtcclxuXHRcdFx0XHR0aGlzLnNoaXBTdGFydFkgPSB0aGlzLnNoaXBDYW52YXMuaGVpZ2h0IC8gNCAqIDMgKyBJbWFnZVJlcG8uc3BhY2VzaGlwLmhlaWdodCAqIDI7XHJcblx0XHRcdFx0dGhpcy5zaGlwLmluaXQodGhpcy5zaGlwU3RhcnRYLCB0aGlzLnNoaXBTdGFydFksXHJcblx0XHRcdFx0XHRcdFx0ICAgSW1hZ2VSZXBvLnNwYWNlc2hpcC53aWR0aCwgSW1hZ2VSZXBvLnNwYWNlc2hpcC5oZWlnaHQpO1x0XHRcdFx0XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSB0aGUgZW5lbXkgcG9vbCBvYmplY3RcclxuXHRcdFx0XHR0aGlzLmVuZW15UG9vbCA9IG5ldyBQb29sKDMwKTtcclxuXHRcdFx0XHR0aGlzLmVuZW15UG9vbC5pbml0KFwiZW5lbXlcIik7XHJcblx0XHRcdFx0dGhpcy5zcGF3bldhdmUoKTtcclxuXHJcblx0XHRcdFx0dGhpcy5lbmVteUJ1bGxldFBvb2wgPSBuZXcgUG9vbCgxMCk7XHJcblx0XHRcdFx0dGhpcy5lbmVteUJ1bGxldFBvb2wuaW5pdChcImVuZW15QnVsbGV0XCIpO1xyXG5cclxuXHRcdFx0XHR0aGlzLnF1YWRUcmVlID0gbmV3IFF1YWRUcmVlKHsgeDogMCwgeTogMCwgd2lkdGg6IHRoaXMubWFpbkNhbnZhcy53aWR0aCwgaGVpZ2h0OiB0aGlzLm1haW5DYW52YXMuaGVpZ2h0IH0pO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRnYW1lLnNoaXAuZHJhdygpO1xyXG5cdFx0XHRhbmltYXRlKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc3Bhd25XYXZlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR2YXIgaGVpZ2h0ID0gSW1hZ2VSZXBvLmVuZW15LmhlaWdodDtcclxuXHRcdFx0dmFyIHdpZHRoID0gSW1hZ2VSZXBvLmVuZW15LndpZHRoO1xyXG5cdFx0XHR2YXIgeCA9IDEwMDtcclxuXHRcdFx0dmFyIHkgPSAtaGVpZ2h0O1xyXG5cdFx0XHR2YXIgc3BhY2VyID0geSAqIDEuNTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDE7IGkgPD0gMTg7IGkrKykge1xyXG5cdFx0XHRcdHRoaXMuZW5lbXlQb29sLmdldCh4LCB5LCAyKTtcclxuXHRcdFx0XHR4ICs9IHdpZHRoICsgMjU7XHJcblx0XHRcdFx0aWYgKGkgJSA2ID09PSAwKSB7XHJcblx0XHRcdFx0XHR4ID0gMTAwO1xyXG5cdFx0XHRcdFx0eSArPSBzcGFjZXI7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuZ2FtZU92ZXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQoJyNnYW1lLW92ZXInKS5jc3MoXCJkaXNwbGF5XCIsXCJibG9ja1wiKTtcclxuXHRcdH07XHJcblxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVzdGFydCgpIHtcclxuXHRcdCQoJyNnYW1lLW92ZXInKS5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcclxuXHRcdGdhbWUuYmdDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBnYW1lLmJnQ2FudmFzLndpZHRoLCBnYW1lLmJnQ2FudmFzLmhlaWdodCk7XHJcblx0XHRnYW1lLnNoaXBDb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBnYW1lLnNoaXBDYW52YXMud2lkdGgsIGdhbWUuc2hpcENhbnZhcy5oZWlnaHQpO1xyXG5cdFx0Z2FtZS5tYWluQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgZ2FtZS5tYWluQ2FudmFzLndpZHRoLCBnYW1lLm1haW5DYW52YXMuaGVpZ2h0KTtcclxuXHRcdGdhbWUucXVhZFRyZWUuY2xlYXIoKTtcclxuXHRcdGdhbWUuYmFja2dyb3VuZC5pbml0KDAsIDApO1xyXG5cdFx0Z2FtZS5saXZlcy5saWZlQ291bnQgPSAyO1xyXG5cdFx0Z2FtZS5saXZlcy5pbml0KDAsIHRoaXMuYmdDYW52YXMuaGVpZ2h0IC0gSW1hZ2VSZXBvLnNwYWNlc2hpcC5oZWlnaHQsIEltYWdlUmVwby5zcGFjZXNoaXAud2lkdGgsIEltYWdlUmVwby5zcGFjZXNoaXAuaGVpZ2h0KTtcclxuXHRcdGdhbWUuc2hpcC5pbml0KGdhbWUuc2hpcFN0YXJ0WCwgZ2FtZS5zaGlwU3RhcnRZLFxyXG5cdFx0XHRcdFx0ICAgSW1hZ2VSZXBvLnNwYWNlc2hpcC53aWR0aCwgSW1hZ2VSZXBvLnNwYWNlc2hpcC5oZWlnaHQpO1xyXG5cdFx0Z2FtZS5lbmVteVBvb2wuaW5pdChcImVuZW15XCIpO1xyXG5cdFx0Z2FtZS5zcGF3bldhdmUoKTtcclxuXHRcdGdhbWUuZW5lbXlCdWxsZXRQb29sLmluaXQoXCJlbmVteUJ1bGxldFwiKTtcclxuXHRcdGdhbWUucGxheWVyU2NvcmUgPSAwO1xyXG5cdFx0Z2FtZS5zdGFydCgpO1xyXG5cdH1cclxuXHJcblx0S0VZX0NPREVTID0ge1xyXG5cdFx0MzI6ICdzcGFjZScsXHJcblx0XHQzNzogJ2xlZnQnLFxyXG5cdFx0Mzk6ICdyaWdodCdcclxuXHR9O1xyXG5cdGZvciAodmFyIGNvZGUgaW4gS0VZX0NPREVTKSB7XHJcblx0XHRLRVlfU1RBVFVTW0tFWV9DT0RFU1tjb2RlXV0gPSBmYWxzZTtcclxuXHR9XHJcblx0ZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdC8vIEZpcmVmb3ggYW5kIG9wZXJhIHVzZSBjaGFyQ29kZSBpbnN0ZWFkIG9mIGtleUNvZGUgdG9cclxuXHRcdC8vIHJldHVybiB3aGljaCBrZXkgd2FzIHByZXNzZWQuXHJcblx0XHR2YXIga2V5Q29kZSA9IChlLmtleUNvZGUpID8gZS5rZXlDb2RlIDogZS5jaGFyQ29kZTtcclxuXHRcdGlmIChLRVlfQ09ERVNba2V5Q29kZV0pIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRLRVlfU1RBVFVTW0tFWV9DT0RFU1trZXlDb2RlXV0gPSB0cnVlO1xyXG5cdFx0fVxyXG5cdH07XHJcblx0ZG9jdW1lbnQub25rZXl1cCA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHR2YXIga2V5Q29kZSA9IChlLmtleUNvZGUpID8gZS5rZXlDb2RlIDogZS5jaGFyQ29kZTtcclxuXHRcdGlmIChLRVlfQ09ERVNba2V5Q29kZV0pIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRLRVlfU1RBVFVTW0tFWV9DT0RFU1trZXlDb2RlXV0gPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gZGV0ZWN0Q29sbGlzaW9uKCkge1xyXG5cdHZhciBvYmplY3RzID0gW107XHJcblx0Z2FtZS5xdWFkVHJlZS5nZXRBbGxPYmplY3RzKG9iamVjdHMpO1xyXG5cdGZvciAodmFyIHggPSAwLCBsZW4gPSBvYmplY3RzLmxlbmd0aDsgeCA8IGxlbjsgeCsrKSB7XHJcblx0XHRnYW1lLnF1YWRUcmVlLmZpbmRPYmplY3RzKG9iaiA9IFtdLCBvYmplY3RzW3hdKTtcclxuXHRcdGZvciAoeSA9IDAsIGxlbmd0aCA9IG9iai5sZW5ndGg7IHkgPCBsZW5ndGg7IHkrKykge1xyXG5cdFx0XHQvLyBERVRFQ1QgQ09MTElTSU9OIEFMR09SSVRITVxyXG5cdFx0XHRpZiAob2JqZWN0c1t4XS5jb2xsaWRhYmxlV2l0aCA9PT0gb2JqW3ldLnR5cGUgJiZcclxuXHRcdFx0KG9iamVjdHNbeF0ueCA8IG9ialt5XS54ICsgb2JqW3ldLndpZHRoICYmXHJcblx0XHRcdG9iamVjdHNbeF0ueCArIG9iamVjdHNbeF0ud2lkdGggPiBvYmpbeV0ueCAmJlxyXG5cdFx0XHRvYmplY3RzW3hdLnkgPCBvYmpbeV0ueSArIG9ialt5XS5oZWlnaHQgJiZcclxuXHRcdFx0b2JqZWN0c1t4XS55ICsgb2JqZWN0c1t4XS5oZWlnaHQgPiBvYmpbeV0ueSkpIHtcclxuXHRcdFx0XHRvYmplY3RzW3hdLmlzQ29sbGlkaW5nID0gdHJ1ZTtcclxuXHRcdFx0XHRvYmpbeV0uaXNDb2xsaWRpbmcgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vL2NvbnN0YW50bHkgbG9vcHMgZm9yIGdhbWUgc3RhdGVcclxuZnVuY3Rpb24gYW5pbWF0ZSgpIHtcclxuXHQvL3VwZGF0ZSBzY29yZVxyXG5cdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzY29yZScpLmlubmVySFRNTCA9IGdhbWUucGxheWVyU2NvcmU7XHJcblx0Ly8gSW5zZXJ0IG9iamVjdHMgaW50byBxdWFkdHJlZVxyXG5cdGdhbWUucXVhZFRyZWUuY2xlYXIoKTtcclxuXHRnYW1lLnF1YWRUcmVlLmluc2VydChnYW1lLnNoaXApO1xyXG5cdGdhbWUucXVhZFRyZWUuaW5zZXJ0KGdhbWUuc2hpcC5idWxsZXRQb29sLmdldFBvb2woKSk7XHJcblx0Z2FtZS5xdWFkVHJlZS5pbnNlcnQoZ2FtZS5lbmVteVBvb2wuZ2V0UG9vbCgpKTtcclxuXHRnYW1lLnF1YWRUcmVlLmluc2VydChnYW1lLmVuZW15QnVsbGV0UG9vbC5nZXRQb29sKCkpO1xyXG5cdGRldGVjdENvbGxpc2lvbigpO1xyXG5cdC8vIE5vIG1vcmUgZW5lbWllc1xyXG5cdGlmIChnYW1lLmVuZW15UG9vbC5nZXRQb29sKCkubGVuZ3RoID09PSAwKSB7XHJcblx0XHRnYW1lLnNwYXduV2F2ZSgpO1xyXG5cdH1cclxuXHQvLyBBbmltYXRlIGdhbWUgb2JqZWN0c1xyXG5cdGlmIChnYW1lLnNoaXAuYWxpdmUpIHtcclxuXHRyZXF1ZXN0QW5pbUZyYW1lKGFuaW1hdGUpO1xyXG5cdGdhbWUuYmFja2dyb3VuZC5kcmF3KCk7XHJcblx0Z2FtZS5zaGlwLm1vdmUoKTtcclxuXHRnYW1lLnNoaXAuYnVsbGV0UG9vbC5hbmltYXRlKCk7XHJcblx0Z2FtZS5lbmVteVBvb2wuYW5pbWF0ZSgpO1xyXG5cdGdhbWUuZW5lbXlCdWxsZXRQb29sLmFuaW1hdGUoKTtcclxuXHRnYW1lLmxpdmVzLmRyYXcoKTtcclxuXHR9XHJcbn1cclxuXHJcbndpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lID0gKGZ1bmN0aW9uICgpIHtcclxuXHRyZXR1cm4gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG5cdFx0XHR3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdFx0d2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdFx0d2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdGZ1bmN0aW9uIChjYWxsYmFjaywgZWxlbWVudCkge1xyXG5cdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xyXG5cdFx0XHR9O1xyXG59KSgpO1xyXG5cclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnSW1hZ2VSZXBvJywgSW1hZ2VSZXBvKTtcclxuXHRJbWFnZVJlcG8uJGluamVjdCA9IFsnJHJvb3RTY29wZSddO1xyXG5cdGZ1bmN0aW9uIEltYWdlUmVwbygkcm9vdFNjb3BlKSB7XHJcblx0XHQvLyBEZWZpbmUgaW1hZ2VzXHJcblx0XHR0aGlzLmVtcHR5ID0gbnVsbDtcclxuXHRcdHRoaXMuYmFja2dyb3VuZCA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0dGhpcy5zcGFjZXNoaXAgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMuYnVsbGV0ID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLmVuZW15ID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLmVuZW15QnVsbGV0ID0gbmV3IEltYWdlKCk7XHJcblxyXG5cdFx0dmFyIG51bUltYWdlcyA9IDU7XHJcblx0XHR2YXIgbnVtTG9hZGVkID0gMDtcclxuXHRcdGZ1bmN0aW9uIGltYWdlTG9hZGVkKCkge1xyXG5cdFx0XHRudW1Mb2FkZWQrKztcclxuXHRcdFx0aWYgKG51bUxvYWRlZCA9PT0gbnVtSW1hZ2VzKSB7XHJcblx0XHRcdFx0JHJvb3RTY29wZS4kYnJvYWRjYXN0KFwiSW5pdFwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5iYWNrZ3JvdW5kLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aW1hZ2VMb2FkZWQoKTtcclxuXHRcdH07XHJcblx0XHR0aGlzLnNwYWNlc2hpcC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGltYWdlTG9hZGVkKCk7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5idWxsZXQub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpbWFnZUxvYWRlZCgpO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuZW5lbXkub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpbWFnZUxvYWRlZCgpO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuZW5lbXlCdWxsZXQub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpbWFnZUxvYWRlZCgpO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBTZXQgaW1hZ2VzIHNyY1xyXG5cdFx0dGhpcy5iYWNrZ3JvdW5kLnNyYyA9IFwibGliL2ltYWdlcy9iZy5wbmdcIjtcclxuXHRcdHRoaXMuc3BhY2VzaGlwLnNyYyA9IFwibGliL2ltYWdlcy9zaGlwLnBuZ1wiO1xyXG5cdFx0dGhpcy5idWxsZXQuc3JjID0gXCJsaWIvaW1hZ2VzL2J1bGxldC5wbmdcIjtcclxuXHRcdHRoaXMuZW5lbXkuc3JjID0gXCJsaWIvaW1hZ2VzL2VuZW15LnBuZ1wiO1xyXG5cdFx0dGhpcy5lbmVteUJ1bGxldC5zcmMgPSBcImxpYi9pbWFnZXMvYnVsbGV0X2VuZW15LnBuZ1wiO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdMaXZlcycsIExpdmVzKTtcclxuXHJcblx0TGl2ZXMuJGluamVjdCA9IFsnRHJhd2FibGUnLCAnSW1hZ2VSZXBvJ107XHJcblxyXG5cdGZ1bmN0aW9uIExpdmVzKERyYXdhYmxlLCBJbWFnZVJlcG8pIHtcclxuXHRcdHRoaXMubGlmZUNvdW50ID0gMDtcclxuXHRcdGZ1bmN0aW9uIGxpdmVzKHgseSkge1xyXG5cdFx0XHR0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0Ly9EcmF3IGxpdmVzIGZvciBlYWNoIGxpZmUgbGVmdFxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5saWZlQ291bnQ7IGkrKykge1xyXG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uc3BhY2VzaGlwLCBpICogdGhpcy53aWR0aCwgdGhpcy55KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRsaXZlcy5wcm90b3R5cGUgPSBuZXcgRHJhd2FibGUoKTtcclxuXHRcdHJldHVybiBsaXZlcztcclxuXHR9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnUG9vbCcsIFBvb2wpO1xyXG5cdFBvb2wuJGluamVjdCA9IFsnSW1hZ2VSZXBvJywnQnVsbGV0JywnRW5lbXknXTtcclxuXHRmdW5jdGlvbiBQb29sKEltYWdlUmVwbyxCdWxsZXQsRW5lbXkpIHtcclxuXHRcdC8qKlxyXG5cdFx0KiBDdXN0b20gUG9vbCBvYmplY3QuIEhvbGRzIEJ1bGxldCBvYmplY3RzIHRvIGJlIG1hbmFnZWQgdG8gcHJldmVudFxyXG5cdFx0KiBnYXJiYWdlIGNvbGxlY3Rpb24uXHJcblx0XHQqL1xyXG5cdFx0ZnVuY3Rpb24gcG9vbHMobWF4U2l6ZSkge1xyXG5cdFx0XHR2YXIgc2l6ZSA9IG1heFNpemU7IC8vIE1heCBidWxsZXRzIGFsbG93ZWQgaW4gdGhlIHBvb2xcclxuXHRcdFx0dmFyIHBvb2wgPSBbXTtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogUG9wdWxhdGVzIHRoZSBwb29sIGFycmF5IHdpdGggQnVsbGV0IG9iamVjdHNcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChvYmplY3QpIHtcclxuXHRcdFx0XHRpZiAob2JqZWN0ID09IFwiYnVsbGV0XCIpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdC8vIEluaXRhbGl6ZSB0aGUgb2JqZWN0XHJcblx0XHRcdFx0XHRcdHZhciBidWxsZXQgPSBuZXcgQnVsbGV0KFwiYnVsbGV0XCIpO1xyXG5cdFx0XHRcdFx0XHRidWxsZXQuaW5pdCgwLCAwLCBJbWFnZVJlcG8uYnVsbGV0LndpZHRoLCBJbWFnZVJlcG8uYnVsbGV0LmhlaWdodCk7XHJcblx0XHRcdFx0XHRcdGJ1bGxldC5jb2xsaWRhYmxlV2l0aCA9IFwiZW5lbXlcIjtcclxuXHRcdFx0XHRcdFx0YnVsbGV0LnR5cGUgPSBcImJ1bGxldFwiO1xyXG5cdFx0XHRcdFx0XHRwb29sW2ldID0gYnVsbGV0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChvYmplY3QgPT0gXCJlbmVteVwiKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHNpemU7IGorKykge1xyXG5cdFx0XHRcdFx0XHR2YXIgZW5lbXkgPSBuZXcgRW5lbXkoKTtcclxuXHRcdFx0XHRcdFx0ZW5lbXkuaW5pdCgwLCAwLCBJbWFnZVJlcG8uZW5lbXkud2lkdGgsIEltYWdlUmVwby5lbmVteS5oZWlnaHQpO1xyXG5cdFx0XHRcdFx0XHRwb29sW2pdID0gZW5lbXk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKG9iamVjdCA9PSBcImVuZW15QnVsbGV0XCIpIHtcclxuXHRcdFx0XHRcdGZvciAodmFyIGsgPSAwOyBrIDwgc2l6ZTsgaysrKSB7XHJcblx0XHRcdFx0XHRcdHZhciBlQnVsbGV0ID0gbmV3IEJ1bGxldChcImVuZW15QnVsbGV0XCIpO1xyXG5cdFx0XHRcdFx0XHRlQnVsbGV0LmluaXQoMCwgMCwgSW1hZ2VSZXBvLmVuZW15QnVsbGV0LndpZHRoLCBJbWFnZVJlcG8uZW5lbXlCdWxsZXQuaGVpZ2h0KTtcclxuXHRcdFx0XHRcdFx0ZUJ1bGxldC5jb2xsaWRhYmxlV2l0aCA9IFwic2hpcFwiO1xyXG5cdFx0XHRcdFx0XHRlQnVsbGV0LnR5cGUgPSBcImVuZW15QnVsbGV0XCI7XHJcblx0XHRcdFx0XHRcdHBvb2xba10gPSBlQnVsbGV0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0dGhpcy5nZXRQb29sID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHZhciBvYmogPSBbXTtcclxuXHRcdFx0XHRmb3IgKHZhciBsID0gMDsgbCA8IHNpemU7IGwrKykge1xyXG5cdFx0XHRcdFx0aWYgKHBvb2xbbF0uYWxpdmUpIHtcclxuXHRcdFx0XHRcdFx0b2JqLnB1c2gocG9vbFtsXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBvYmo7XHJcblx0XHRcdH07XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIEdyYWJzIHRoZSBsYXN0IGl0ZW0gaW4gdGhlIGxpc3QgYW5kIGluaXRpYWxpemVzIGl0IGFuZFxyXG5cdFx0XHQgKiBwdXNoZXMgaXQgdG8gdGhlIGZyb250IG9mIHRoZSBhcnJheS5cclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuZ2V0ID0gZnVuY3Rpb24gKHgsIHksIHNwZWVkKSB7XHJcblx0XHRcdFx0aWYgKCFwb29sW3NpemUgLSAxXS5hbGl2ZSkge1xyXG5cdFx0XHRcdFx0cG9vbFtzaXplIC0gMV0uc3Bhd24oeCwgeSwgc3BlZWQpO1xyXG5cdFx0XHRcdFx0cG9vbC51bnNoaWZ0KHBvb2wucG9wKCkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIERyYXdzIGFueSBpbiB1c2UgQnVsbGV0cy4gSWYgYSBidWxsZXQgZ29lcyBvZmYgdGhlIHNjcmVlbixcclxuXHRcdFx0ICogY2xlYXJzIGl0IGFuZCBwdXNoZXMgaXQgdG8gdGhlIGZyb250IG9mIHRoZSBhcnJheS5cclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuYW5pbWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7IGkrKykge1xyXG5cdFx0XHRcdFx0Ly8gT25seSBkcmF3IHVudGlsIHdlIGZpbmQgYSBidWxsZXQgdGhhdCBpcyBub3QgYWxpdmVcclxuXHRcdFx0XHRcdGlmIChwb29sW2ldLmFsaXZlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChwb29sW2ldLmRyYXcoKSkge1xyXG5cdFx0XHRcdFx0XHRcdHBvb2xbaV0uY2xlYXIoKTtcclxuXHRcdFx0XHRcdFx0XHRwb29sLnB1c2goKHBvb2wuc3BsaWNlKGksIDEpKVswXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBvb2xzO1xyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdRdWFkVHJlZScsIFF1YWRUcmVlKTtcclxuXHJcblx0ZnVuY3Rpb24gUXVhZFRyZWUoKSB7XHJcblx0XHRmdW5jdGlvbiBxdWFkVHJlZShib3VuZEJveCwgbHZsKSB7XHJcblx0XHRcdHZhciBtYXhPYmplY3RzID0gMTA7XHJcblx0XHRcdHRoaXMuYm91bmRzID0gYm91bmRCb3ggfHwge1xyXG5cdFx0XHRcdHg6IDAsXHJcblx0XHRcdFx0eTogMCxcclxuXHRcdFx0XHR3aWR0aDogMCxcclxuXHRcdFx0XHRoZWlnaHQ6IDBcclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIG9iamVjdHMgPSBbXTtcclxuXHRcdFx0dGhpcy5ub2RlcyA9IFtdO1xyXG5cdFx0XHR2YXIgbGV2ZWwgPSBsdmwgfHwgMDtcclxuXHRcdFx0dmFyIG1heExldmVscyA9IDU7XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBDbGVhcnMgdGhlIHF1YWRUcmVlIGFuZCBhbGwgbm9kZXMgb2Ygb2JqZWN0c1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRvYmplY3RzID0gW107XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dGhpcy5ub2Rlc1tpXS5jbGVhcigpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5ub2RlcyA9IFtdO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICogR2V0IGFsbCBvYmplY3RzIGluIHRoZSBxdWFkVHJlZVxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5nZXRBbGxPYmplY3RzID0gZnVuY3Rpb24gKHJldHVybmVkT2JqZWN0cykge1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dGhpcy5ub2Rlc1tpXS5nZXRBbGxPYmplY3RzKHJldHVybmVkT2JqZWN0cyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmb3IgKHZhciBqID0gMCwgbGVuID0gb2JqZWN0cy5sZW5ndGg7IGogPCBsZW47IGorKykge1xyXG5cdFx0XHRcdFx0cmV0dXJuZWRPYmplY3RzLnB1c2gob2JqZWN0c1tqXSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gcmV0dXJuZWRPYmplY3RzO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICogUmV0dXJuIGFsbCBvYmplY3RzIHRoYXQgdGhlIG9iamVjdCBjb3VsZCBjb2xsaWRlIHdpdGhcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuZmluZE9iamVjdHMgPSBmdW5jdGlvbiAocmV0dXJuZWRPYmplY3RzLCBvYmopIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJVTkRFRklORUQgT0JKRUNUXCIpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleChvYmopO1xyXG5cdFx0XHRcdGlmIChpbmRleCAhPSAtMSAmJiB0aGlzLm5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0dGhpcy5ub2Rlc1tpbmRleF0uZmluZE9iamVjdHMocmV0dXJuZWRPYmplY3RzLCBvYmopO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IG9iamVjdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdHJldHVybmVkT2JqZWN0cy5wdXNoKG9iamVjdHNbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIHJldHVybmVkT2JqZWN0cztcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIEluc2VydCB0aGUgb2JqZWN0IGludG8gdGhlIHF1YWRUcmVlLiBJZiB0aGUgdHJlZVxyXG5cdFx0XHQgKiBleGNlZGVzIHRoZSBjYXBhY2l0eSwgaXQgd2lsbCBzcGxpdCBhbmQgYWRkIGFsbFxyXG5cdFx0XHQgKiBvYmplY3RzIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgbm9kZXMuXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmluc2VydCA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gb2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuaW5zZXJ0KG9ialtpXSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRoaXMubm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHR2YXIgbm9kZUluZGV4ID0gdGhpcy5nZXRJbmRleChvYmopO1xyXG5cdFx0XHRcdFx0Ly8gT25seSBhZGQgdGhlIG9iamVjdCB0byBhIHN1Ym5vZGUgaWYgaXQgY2FuIGZpdCBjb21wbGV0ZWx5XHJcblx0XHRcdFx0XHQvLyB3aXRoaW4gb25lXHJcblx0XHRcdFx0XHRpZiAoIG5vZGVJbmRleCAhPSAtMSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLm5vZGVzWyBub2RlSW5kZXhdLmluc2VydChvYmopO1xyXG5cclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0b2JqZWN0cy5wdXNoKG9iaik7XHJcblxyXG5cdFx0XHRcdC8vIFByZXZlbnQgaW5maW5pdGUgc3BsaXR0aW5nXHJcblx0XHRcdFx0aWYgKG9iamVjdHMubGVuZ3RoID4gbWF4T2JqZWN0cyAmJiBsZXZlbCA8IG1heExldmVscykge1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMubm9kZXNbMF0gPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5zcGxpdCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBrID0gMDtcclxuXHRcdFx0XHRcdHdoaWxlIChrIDwgb2JqZWN0cy5sZW5ndGgpIHtcclxuXHJcblx0XHRcdFx0XHRcdHZhciBpbmRleCA9IHRoaXMuZ2V0SW5kZXgob2JqZWN0c1trXSk7XHJcblx0XHRcdFx0XHRcdGlmIChpbmRleCAhPSAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMubm9kZXNbaW5kZXhdLmluc2VydCgob2JqZWN0cy5zcGxpY2UoaywgMSkpWzBdKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRrKys7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBEZXRlcm1pbmUgd2hpY2ggbm9kZSB0aGUgb2JqZWN0IGJlbG9uZ3MgdG8uIC0xIG1lYW5zXHJcblx0XHRcdCAqIG9iamVjdCBjYW5ub3QgY29tcGxldGVseSBmaXQgd2l0aGluIGEgbm9kZSBhbmQgaXMgcGFydFxyXG5cdFx0XHQgKiBvZiB0aGUgY3VycmVudCBub2RlXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmdldEluZGV4ID0gZnVuY3Rpb24gKG9iaikge1xyXG5cclxuXHRcdFx0XHR2YXIgaW5kZXggPSAtMTtcclxuXHRcdFx0XHR2YXIgdmVydGljYWxNaWRwb2ludCA9IHRoaXMuYm91bmRzLnggKyB0aGlzLmJvdW5kcy53aWR0aCAvIDI7XHJcblx0XHRcdFx0dmFyIGhvcml6b250YWxNaWRwb2ludCA9IHRoaXMuYm91bmRzLnkgKyB0aGlzLmJvdW5kcy5oZWlnaHQgLyAyO1xyXG5cclxuXHRcdFx0XHQvLyBPYmplY3QgY2FuIGZpdCBjb21wbGV0ZWx5IHdpdGhpbiB0aGUgdG9wIHF1YWRyYW50XHJcblx0XHRcdFx0dmFyIHRvcFF1YWRyYW50ID0gKG9iai55IDwgaG9yaXpvbnRhbE1pZHBvaW50ICYmIG9iai55ICsgb2JqLmhlaWdodCA8IGhvcml6b250YWxNaWRwb2ludCk7XHJcblx0XHRcdFx0Ly8gT2JqZWN0IGNhbiBmaXQgY29tcGxldGVseSB3aXRoaW4gdGhlIGJvdHRvbSBxdWFuZHJhbnRcclxuXHRcdFx0XHR2YXIgYm90dG9tUXVhZHJhbnQgPSAob2JqLnkgPiBob3Jpem9udGFsTWlkcG9pbnQpO1xyXG5cclxuXHRcdFx0XHQvLyBPYmplY3QgY2FuIGZpdCBjb21wbGV0ZWx5IHdpdGhpbiB0aGUgbGVmdCBxdWFkcmFudHNcclxuXHRcdFx0XHRpZiAob2JqLnggPCB2ZXJ0aWNhbE1pZHBvaW50ICYmXHJcblx0XHRcdFx0XHRcdG9iai54ICsgb2JqLndpZHRoIDwgdmVydGljYWxNaWRwb2ludCkge1xyXG5cdFx0XHRcdFx0aWYgKHRvcFF1YWRyYW50KSB7XHJcblx0XHRcdFx0XHRcdGluZGV4ID0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKGJvdHRvbVF1YWRyYW50KSB7XHJcblx0XHRcdFx0XHRcdGluZGV4ID0gMjtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBPYmplY3QgY2FuIGZpeCBjb21wbGV0ZWx5IHdpdGhpbiB0aGUgcmlnaHQgcXVhbmRyYW50c1xyXG5cdFx0XHRcdGVsc2UgaWYgKG9iai54ID4gdmVydGljYWxNaWRwb2ludCkge1xyXG5cdFx0XHRcdFx0aWYgKHRvcFF1YWRyYW50KSB7XHJcblx0XHRcdFx0XHRcdGluZGV4ID0gMDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKGJvdHRvbVF1YWRyYW50KSB7XHJcblx0XHRcdFx0XHRcdGluZGV4ID0gMztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBpbmRleDtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFNwbGl0cyB0aGUgbm9kZSBpbnRvIDQgc3Vibm9kZXNcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuc3BsaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0Ly8gQml0d2lzZSBvciBbaHRtbDVyb2Nrc11cclxuXHRcdFx0XHR2YXIgc3ViV2lkdGggPSAodGhpcy5ib3VuZHMud2lkdGggLyAyKSB8IDA7XHJcblx0XHRcdFx0dmFyIHN1YkhlaWdodCA9ICh0aGlzLmJvdW5kcy5oZWlnaHQgLyAyKSB8IDA7XHJcblxyXG5cdFx0XHRcdHRoaXMubm9kZXNbMF0gPSBuZXcgcXVhZFRyZWUoe1xyXG5cdFx0XHRcdFx0eDogdGhpcy5ib3VuZHMueCArIHN1YldpZHRoLFxyXG5cdFx0XHRcdFx0eTogdGhpcy5ib3VuZHMueSxcclxuXHRcdFx0XHRcdHdpZHRoOiBzdWJXaWR0aCxcclxuXHRcdFx0XHRcdGhlaWdodDogc3ViSGVpZ2h0XHJcblx0XHRcdFx0fSwgbGV2ZWwgKyAxKTtcclxuXHRcdFx0XHR0aGlzLm5vZGVzWzFdID0gbmV3IHF1YWRUcmVlKHtcclxuXHRcdFx0XHRcdHg6IHRoaXMuYm91bmRzLngsXHJcblx0XHRcdFx0XHR5OiB0aGlzLmJvdW5kcy55LFxyXG5cdFx0XHRcdFx0d2lkdGg6IHN1YldpZHRoLFxyXG5cdFx0XHRcdFx0aGVpZ2h0OiBzdWJIZWlnaHRcclxuXHRcdFx0XHR9LCBsZXZlbCArIDEpO1xyXG5cdFx0XHRcdHRoaXMubm9kZXNbMl0gPSBuZXcgcXVhZFRyZWUoe1xyXG5cdFx0XHRcdFx0eDogdGhpcy5ib3VuZHMueCxcclxuXHRcdFx0XHRcdHk6IHRoaXMuYm91bmRzLnkgKyBzdWJIZWlnaHQsXHJcblx0XHRcdFx0XHR3aWR0aDogc3ViV2lkdGgsXHJcblx0XHRcdFx0XHRoZWlnaHQ6IHN1YkhlaWdodFxyXG5cdFx0XHRcdH0sIGxldmVsICsgMSk7XHJcblx0XHRcdFx0dGhpcy5ub2Rlc1szXSA9IG5ldyBxdWFkVHJlZSh7XHJcblx0XHRcdFx0XHR4OiB0aGlzLmJvdW5kcy54ICsgc3ViV2lkdGgsXHJcblx0XHRcdFx0XHR5OiB0aGlzLmJvdW5kcy55ICsgc3ViSGVpZ2h0LFxyXG5cdFx0XHRcdFx0d2lkdGg6IHN1YldpZHRoLFxyXG5cdFx0XHRcdFx0aGVpZ2h0OiBzdWJIZWlnaHRcclxuXHRcdFx0XHR9LCBsZXZlbCArIDEpO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHF1YWRUcmVlO1xyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdTaGlwJywgU2hpcCk7XHJcblx0U2hpcC4kaW5qZWN0ID0gW1wiRHJhd2FibGVcIiwgXCJQb29sXCIsIFwiSW1hZ2VSZXBvXCJdO1xyXG5cdGZ1bmN0aW9uIFNoaXAoRHJhd2FibGUsIFBvb2wsIEltYWdlUmVwbykge1xyXG5cdFx0ZnVuY3Rpb24gc2hpcCgpIHtcclxuXHRcdFx0dGhpcy5zcGVlZCA9IDU7XHJcblx0XHRcdHRoaXMuYnVsbGV0UG9vbCA9IG5ldyBQb29sKDEpO1xyXG5cdFx0XHR0aGlzLmJ1bGxldFBvb2wuaW5pdChcImJ1bGxldFwiKTtcclxuXHRcdFx0dmFyIGZpcmVSYXRlID0gMTtcclxuXHRcdFx0dmFyIGNvdW50ZXIgPSAwO1xyXG5cdFx0XHR0aGlzLmNvbGxpZGFibGVXaXRoID0gXCJlbmVteUJ1bGxldFwiO1xyXG5cdFx0XHR0aGlzLnR5cGUgPSBcInNoaXBcIjtcclxuXHJcblx0XHRcdHRoaXMuaW5pdCA9IGZ1bmN0aW9uICh4LCB5LCB3aWR0aCwgaGVpZ2h0KSB7XHJcblx0XHRcdFx0Ly8gRGVmYXVsdCB2YXJpYWJsZXNcclxuXHRcdFx0XHR0aGlzLnggPSB4O1xyXG5cdFx0XHRcdHRoaXMueSA9IHk7XHJcblx0XHRcdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xyXG5cdFx0XHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cdFx0XHRcdHRoaXMuYWxpdmUgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMuaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR0aGlzLmJ1bGxldFBvb2wuaW5pdChcImJ1bGxldFwiKTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHQvLyBGaW5pc2ggYnkgcmVkcmF3aW5nIHRoZSBzaGlwXHJcblx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uc3BhY2VzaGlwLCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdH07XHJcblx0XHRcdHRoaXMubW92ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRjb3VudGVyKys7XHJcblx0XHRcdFx0Ly8gRGV0ZXJtaW5lIGlmIHRoZSBhY3Rpb24gaXMgbW92ZSBhY3Rpb25cclxuXHRcdFx0XHRpZiAoS0VZX1NUQVRVUy5sZWZ0IHx8IEtFWV9TVEFUVVMucmlnaHQpIHtcclxuXHRcdFx0XHRcdC8vIFRoZSBzaGlwIG1vdmVkLCBzbyBlcmFzZSBpdCdzIGN1cnJlbnQgaW1hZ2Ugc28gaXQgY2FuXHJcblx0XHRcdFx0XHQvLyBiZSByZWRyYXduIGluIGl0J3MgbmV3IGxvY2F0aW9uXHJcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KHRoaXMueCwgdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XHJcblx0XHRcdFx0XHQvLyBVcGRhdGUgeCBhbmQgeSBhY2NvcmRpbmcgdG8gdGhlIGRpcmVjdGlvbiB0byBtb3ZlIGFuZFxyXG5cdFx0XHRcdFx0Ly8gcmVkcmF3IHRoZSBzaGlwLiBDaGFuZ2UgdGhlIGVsc2UgaWYncyB0byBpZiBzdGF0ZW1lbnRzXHJcblx0XHRcdFx0XHQvLyB0byBoYXZlIGRpYWdvbmFsIG1vdmVtZW50LlxyXG5cdFx0XHRcdFx0aWYgKEtFWV9TVEFUVVMubGVmdCkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnggLT0gdGhpcy5zcGVlZDtcclxuXHRcdFx0XHRcdFx0aWYgKHRoaXMueCA8PSAwKSAvLyBLZWVwIHBsYXllciB3aXRoaW4gdGhlIHNjcmVlblxyXG5cdFx0XHRcdFx0XHRcdHRoaXMueCA9IDA7XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKEtFWV9TVEFUVVMucmlnaHQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy54ICs9IHRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLnggPj0gdGhpcy5jYW52YXNXaWR0aCAtIHRoaXMud2lkdGgpXHJcblx0XHRcdFx0XHRcdFx0dGhpcy54ID0gdGhpcy5jYW52YXNXaWR0aCAtIHRoaXMud2lkdGg7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuaXNDb2xsaWRpbmcpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5kcmF3KCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoS0VZX1NUQVRVUy5zcGFjZSAmJiBjb3VudGVyID49IGZpcmVSYXRlICYmICF0aGlzLmlzQ29sbGlkaW5nKSB7XHJcblx0XHRcdFx0XHR0aGlzLmZpcmUoKTtcclxuXHRcdFx0XHRcdGNvdW50ZXIgPSAwO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRoaXMuaXNDb2xsaWRpbmcgJiYgZ2FtZS5saXZlcy5saWZlQ291bnQgPiAwKSB7XHJcblx0XHRcdFx0XHRnYW1lLmxpdmVzLmxpZmVDb3VudCAtPSAxO1xyXG5cdFx0XHRcdFx0dGhpcy5pc0NvbGxpZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmICh0aGlzLmlzQ29sbGlkaW5nKSB7XHJcblx0XHRcdFx0XHR0aGlzLmFsaXZlID0gZmFsc2U7XHJcblx0XHRcdFx0XHRnYW1lLmdhbWVPdmVyKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBGaXJlcyB0d28gYnVsbGV0c1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5maXJlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHRoaXMuYnVsbGV0UG9vbC5nZXQodGhpcy54ICsgMTksIHRoaXMueSAtIDMsIDMpO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0c2hpcC5wcm90b3R5cGUgPSBuZXcgRHJhd2FibGUoKTtcclxuXHRcdHJldHVybiBzaGlwO1xyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdIb21lQ3RybCcsIEhvbWVDdHJsKTtcclxuXHJcbiAgICBIb21lQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckdGltZW91dCddO1xyXG5cclxuICAgICBmdW5jdGlvbiBIb21lQ3RybCgkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIGhvbWVWbSA9IHRoaXM7XHJcbiAgICAgICAgaG9tZVZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICBob21lVm0ubG9hZFBpbnMgPSBsb2FkUGlucygpO1xyXG4gICAgICAgIGhvbWVWbS5teU1hcmtlciA9IHt9O1xyXG4gICAgICAgICRyb290U2NvcGUudGl0bGUgPSBcIkhvbWVcIjtcclxuXHJcbiAgICAgICAgdmFyIGRlZmF1bHRMYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDM3LjA5MDI0LCAtOTUuNzEyODkxKTtcclxuICAgICAgICB2YXIgZGlyZWN0aW9uc0Rpc3BsYXkgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyKHtcclxuICAgICAgICAgICAgc3VwcHJlc3NNYXJrZXJzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGRpcmVjdGlvbnNTZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTZXJ2aWNlKCk7XHJcbiAgICAgICAgdmFyIHRyYWZmaWNMYXllciA9IG5ldyBnb29nbGUubWFwcy5UcmFmZmljTGF5ZXIoKTtcclxuXHJcbiAgICAgICAgaG9tZVZtLm1hcE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHpvb206IDQsXHJcbiAgICAgICAgICAgIGNlbnRlcjogZGVmYXVsdExhdExuZyxcclxuICAgICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uQ29udHJvbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHNjYWxlQ29udHJvbDogZmFsc2UsXHJcbiAgICAgICAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZERvbUxpc3RlbmVyKHdpbmRvdywgXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY2VudGVyID0gJHNjb3BlLm1hcC5nZXRDZW50ZXIoKTtcclxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcigkc2NvcGUubWFwLCBcInJlc2l6ZVwiKTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5zZXRDZW50ZXIoY2VudGVyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaW5pdCgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICAkdGltZW91dChsb2FkUGlucywgMjAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRQaW5zKCkge1xyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLm1hcCkge1xyXG4gICAgICAgICAgICAgICAgX3BsYWNlTXlzZWxmKCk7XHJcbiAgICAgICAgICAgICAgICAvL2dldCBjdXJyZW50IGxvY2F0aW9uIGFuZCBwbGFjZSB1c2VyIHBpblxyXG4gICAgICAgICAgICAgICAgaWYgKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKF9wbG90TG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfcGxhY2VNeXNlbGYoKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoXCI0Mi4yNDA4NDVcIiwgXCItODMuMjM0MDk3XCIpO1xyXG4gICAgICAgICAgICBob21lVm0ubXlNYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsb2NhdGlvbixcclxuICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRhbWlhbiBTdHJvbmdcIixcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1BcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vcmVib3VuZCB2aWV3XHJcbiAgICAgICAgICAgIGhvbWVWbS5ib3VuZHMuZXh0ZW5kKGxvY2F0aW9uKTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5maXRCb3VuZHMoaG9tZVZtLmJvdW5kcyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy9kcm9wIHBpbiBvbiBtYXAgZm9yIGxvY2F0aW9uXHJcbiAgICAgICAgZnVuY3Rpb24gX3Bsb3RMb2NhdGlvbihwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAvL2NyZWF0ZSBtYXJrZXJcclxuICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJZb3UgQXJlIEhlcmVcIixcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1BcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vcmVib3VuZCB2aWV3XHJcbiAgICAgICAgICAgIGhvbWVWbS5ib3VuZHMuZXh0ZW5kKGxvY2F0aW9uKTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5maXRCb3VuZHMoaG9tZVZtLmJvdW5kcyk7XHJcblxyXG4gICAgICAgICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZSh7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW46bG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogaG9tZVZtLm15TWFya2VyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuVHJhdmVsTW9kZS5EUklWSU5HXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3VsdCwgc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKCRzY29wZS5tYXApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsb2FkUGluczogbG9hZFBpbnNcclxuICAgICAgICB9O1xyXG4gICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01vdmVDdHJsJywgTW92ZUN0cmwpO1xyXG5cclxuXHRNb3ZlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckdGltZW91dCddO1xyXG5cclxuXHRmdW5jdGlvbiBNb3ZlQ3RybCgkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0KSB7XHJcblx0XHR2YXIgbW92ZWFibGUgPSB0aGlzO1xyXG5cdFx0bW92ZWFibGUuZG90TnVtID0gMDtcclxuXHRcdG1vdmVhYmxlLnNjb3JlID0gMDtcclxuXHRcdG1vdmVhYmxlLmRvdHMgPSBbXTtcclxuXHRcdCQod2luZG93KS5rZXlkb3duKF9rZXkpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9rZXkoZSkge1xyXG5cdFx0XHRpZiAoJCgnLm1vdmVhYmxlJykubGVuZ3RoKSB7XHJcblx0XHRcdFx0dmFyIGV2ZW50ID0gd2luZG93LmV2ZW50ID8gd2luZG93LmV2ZW50IDogZTtcclxuXHRcdFx0XHRzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuXHRcdFx0XHRcdGNhc2UgMzc6IC8vbGVmdFxyXG5cdFx0XHRcdFx0XHRfbW92ZSgnbCcpO1xyXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAzODogLy91cFxyXG5cdFx0XHRcdFx0XHRfbW92ZSgndScpO1xyXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAzOTogLy9yaWdodFxyXG5cdFx0XHRcdFx0XHRfbW92ZSgncicpO1xyXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSA0MDogLy9kb3duXHJcblx0XHRcdFx0XHRcdF9tb3ZlKCdkJyk7XHJcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBfbW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdFx0XHR2YXIgc3BlZWQgPSAxNjtcclxuXHRcdFx0XHR2YXIgbWF4RG90cyA9IDM7XHJcblx0XHRcdFx0dmFyIHNpemUgPSAkKCcubW92ZWFibGUnKS5oZWlnaHQoKTtcclxuXHRcdFx0XHR2YXIgY2hhcmFjdGVyID0gJCgnLm1vdmVhYmxlJyk7XHJcblx0XHRcdFx0Ly9nZXQgY3VycmVudCBwb3NpdGlvblxyXG5cdFx0XHRcdHZhciBwb3MgPSBjaGFyYWN0ZXIub2Zmc2V0KCk7XHJcblx0XHRcdFx0Ly9tb2RpZnkgYnkgc3BlZWQgYW5kIGRpcmVjdGlvblxyXG5cdFx0XHRcdHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcblx0XHRcdFx0XHRjYXNlICdsJzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy5sZWZ0IC0gc3BlZWQgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHBvcy5sZWZ0IC0gc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IDAgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdyJzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy5sZWZ0ICsgKHNpemUgKyBzcGVlZCArIDIwKSA8IHdpbmRvdy5pbm5lcldpZHRoKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHBvcy5sZWZ0ICsgc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHdpbmRvdy5pbm5lcldpZHRoIC0gKHNpemUgKyAyMCkgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd1JzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy50b3AgLSBzcGVlZCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFyYWN0ZXIub2Zmc2V0KHsgdG9wOiBwb3MudG9wIC0gc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IHRvcDogMCB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2QnOlxyXG5cdFx0XHRcdFx0XHRpZiAocG9zLnRvcCArIChzaXplICsgc3BlZWQpIDwgd2luZG93LmlubmVySGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IHRvcDogcG9zLnRvcCArIHNwZWVkIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGNoYXJhY3Rlci5vZmZzZXQoeyB0b3A6IHdpbmRvdy5pbm5lckhlaWdodCAtIHNpemUgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vc3Bhd24gZG90IG9uIGZpcnN0IG1vdmVcclxuXHRcdFx0XHRpZiAobW92ZWFibGUuZG90cy5sZW5ndGggPCBtYXhEb3RzKSB7XHJcblx0XHRcdFx0XHRfc3Bhd25Eb3QoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb3ZlYWJsZS5kb3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRfY2hlY2tDb2xsaXNpb24obW92ZWFibGUuZG90c1tpXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2NoZWNrQ29sbGlzaW9uKGRvdCkge1xyXG5cdFx0XHR2YXIgZGJkcyA9IF9nZXRCb3VuZHMoZG90LmlkKTtcclxuXHRcdFx0dmFyIGNiZHMgPSBfZ2V0Qm91bmRzKFwiLm1vdmVhYmxlXCIpO1xyXG5cdFx0XHQvL2NoZWNrIGZvciBjb2xsaXNpb24gd2l0aCBkb3RcclxuXHRcdFx0dmFyIGNvbHMgPSBjb2xsaWRlKGRiZHMsIGNiZHMpO1xyXG5cdFx0XHRpZiAoY29scykge1xyXG5cdFx0XHRcdF9raWxsRG90KGRvdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBjb2xsaWRlKGEsIGIpIHtcclxuXHRcdFx0cmV0dXJuIChhLmxlZnQgPCBiLmxlZnQgKyBiLndpZHRoICYmIGEubGVmdCArIGEud2lkdGggPiBiLmxlZnQgJiZcclxuXHRcdGEudG9wIDwgYi50b3AgKyBiLmhlaWdodCAmJiBhLnRvcCArIGEuaGVpZ2h0ID4gYi50b3ApO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gX3NwYXduRG90KCkge1xyXG5cdFx0XHR2YXIgZG90ID0ge1xyXG5cdFx0XHRcdGFsaXZlOiB0cnVlLFxyXG5cdFx0XHRcdHBvczogX2RvdFBvcyxcclxuXHRcdFx0XHRpZDogXCIuZG90XCIgKyBtb3ZlYWJsZS5kb3ROdW1cclxuXHRcdFx0fTtcclxuXHRcdFx0Ly9hZGQgbmV3IGRvdCB0byBhcnJheVxyXG5cdFx0XHRtb3ZlYWJsZS5kb3RzLnB1c2goZG90KTtcclxuXHRcdFx0JChcIi5kb3RzXCIpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImRvdCBkb3QnICsgbW92ZWFibGUuZG90TnVtICsgJ1wiIG5nLXNob3c9XCJkb3QuYWxpdmVcIj48L2Rpdj4nKTtcclxuXHRcdFx0bW92ZWFibGUuZG90TnVtKys7XHJcblx0XHRcdC8vcG9wdWxhdGUgaWQgb2YgZG90IGZvciByZWZlcmVuY2VcclxuXHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcclxuXHRcdFx0Ly9zZXQgbmV3IGRvdHMgcG9zaXRpb25cclxuXHRcdFx0dmFyIG5ld0RvdCA9ICQoZG90LmlkKTtcclxuXHRcdFx0dmFyIHRvcFIgPSBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lckhlaWdodCAtIG5ld0RvdC5oZWlnaHQoKSkpO1xyXG5cdFx0XHR2YXIgbGVmdFIgPSBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lckhlaWdodCAtIG5ld0RvdC5oZWlnaHQoKSAtIDIwKSk7XHJcblx0XHRcdG5ld0RvdC5vZmZzZXQoeyB0b3A6IHRvcFIsIGxlZnQ6IGxlZnRSIH0pO1xyXG5cclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIF9raWxsRG90KGRvdCkge1xyXG5cdFx0XHQvL2luY3JlYXNlIHNjb3JlIGFuZCBraWxsIGRvdFxyXG5cdFx0XHRtb3ZlYWJsZS5zY29yZSsrO1xyXG5cdFx0XHRkb3QuYWxpdmUgPSBmYWxzZTtcclxuXHRcdFx0dmFyIGluZGV4ID0gbW92ZWFibGUuZG90cy5pbmRleE9mKGRvdCk7XHJcblx0XHRcdG1vdmVhYmxlLmRvdHMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdFx0JChkb3QuaWQpLnJlbW92ZSgpO1xyXG5cdFx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9kb3RQb3MoZG90KSB7XHJcblx0XHRcdHJldHVybiAkKGRvdC5pZCkub2Zmc2V0KCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBfZ2V0Qm91bmRzKG9iaikge1xyXG5cdFx0XHQvL3JldHVybiBib3VuZHMgb2YgZG90XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bGVmdDogJChvYmopLm9mZnNldCgpLmxlZnQsXHJcblx0XHRcdFx0cmlnaHQ6ICQob2JqKS5vZmZzZXQoKS5sZWZ0ICsgJChvYmopLndpZHRoKCksXHJcblx0XHRcdFx0dG9wOiAkKG9iaikub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGJvdHRvbTogJChvYmopLm9mZnNldCgpLnRvcCArICQob2JqKS5oZWlnaHQoKSxcclxuXHRcdFx0XHR3aWR0aDogJChvYmopLndpZHRoKCksXHJcblx0XHRcdFx0aGVpZ2h0OiAkKG9iaikuaGVpZ2h0KClcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdQb3J0Zm9saW9DdHJsJywgUG9ydGZvbGlvQ3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gUG9ydGZvbGlvQ3RybCgkc2NvcGUsICRyb290U2NvcGUsJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgcG9ydGZvbGlvVm0gPSB0aGlzO1xyXG4gICAgICAgIHBvcnRmb2xpb1ZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJQb3J0Zm9saW9cIjtcclxuICAgIH1cclxuXHJcbiAgICBQb3J0Zm9saW9DdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywnJHRpbWVvdXQnXTtcclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=