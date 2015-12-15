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
			var percentFire = 0.001;
			var chance = 0;
			this.alive = false;
			this.collidableWith = "bullet";
			this.type = "enemy";
			/*
			 * Sets the Enemy values
			 */
			this.spawn = function (x, y, speed,size) {
				this.x = x;
				this.y = y;
				this.speed = speed;
				this.speedX = 0;
				this.speedY = speed;
				this.alive = true;
				this.leftEdge = this.x - 90;
				this.rightEdge = this.x + 90;
				this.bottomEdge = this.y + 50 * (size / 6);
			};
			/*
			 * Move the enemy
			 */
			this.draw = function () {
				this.context.clearRect(this.x - 1, this.y, this.width + 1, this.height);
				this.x += this.speedX;
				this.y += this.speedY;
				if (this.x <= this.leftEdge || this.x >= this.rightEdge + this.width) {
					//change direction
					this.speedX = -this.speedX;
					
				}
				//fly down from top and strafe
				else if (this.y >= this.bottomEdge) {
					this.speed = game.level *game.enemySpeed;
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
			this.level = 1;
			this.enemySpeed = .5;
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
				this.spawnWave();

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

			//every 3rd level spawn a boss instead!
			if (this.enemyPool && this.enemyBulletPool) {
				this.enemyPool.clear();
				this.enemyBulletPool.clear();
			}
			var enemyCount = this.level * 6;
			if (enemyCount > 30) //max out enemies at 30
			{
				enemyCount = 30;
			}
			this.enemyPool = new Pool(enemyCount);
			this.enemyPool.init("enemy");

			this.enemyBulletPool = new Pool(this.level * 10);
			this.enemyBulletPool.init("enemyBullet");

			var height = ImageRepo.enemy.height;
			var width = ImageRepo.enemy.width;
			var x = 100;
			var y = -height;
			var spacer = y * 1.5;
			for (var i = 1; i <= this.enemyPool.size; i++) {
				this.enemyPool.get(x, y,this.level * this.enemySpeed);
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

		game.level = 1;

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
		game.level++;
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
	Pool.$inject = ['ImageRepo', 'Bullet', 'Enemy'];
	function Pool(ImageRepo, Bullet, Enemy) {
		/**
		* Custom Pool object. Holds Bullet objects to be managed to prevent
		* garbage collection.
		*/
		function pools(maxSize) {
			this.size = maxSize; // Max bullets allowed in the pool
			var pool = [];
			/*
			 * Populates the pool array with Bullet objects
			 */
			this.init = function (object) {
				if (object == "bullet") {
					for (var i = 0; i < this.size; i++) {
						// Initalize the object
						var bullet = new Bullet("bullet");
						bullet.init(0, 0, ImageRepo.bullet.width, ImageRepo.bullet.height);
						bullet.collidableWith = "enemy";
						bullet.type = "bullet";
						pool[i] = bullet;
					}
				}
				else if (object == "enemy") {
					for (var j = 0; j < this.size; j++) {
						var enemy = new Enemy();
						enemy.init(0, 0, ImageRepo.enemy.width, ImageRepo.enemy.height);
						pool[j] = enemy;
					}
				}
				else if (object == "enemyBullet") {
					for (var k = 0; k < this.size; k++) {
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
				for (var l = 0; l < this.size; l++) {
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
				if (!pool[this.size - 1].alive) {
					pool[this.size - 1].spawn(x, y, speed, this.size);
					pool.unshift(pool.pop());
				}
			};

			/*
			 * Draws any in use Bullets. If a bullet goes off the screen,
			 * clears it and pushes it to the front of the array.
			 */
			this.animate = function () {
				for (var i = 0; i < this.size; i++) {
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
			this.clear = function () {
				for (var i = 0; i < this.size; i++) {
						pool[i].clear();
				}
			}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmN0cmwuanMiLCJjb250YWN0L2NvbnRhY3QuY3RybC5qcyIsImNvcmUvcGFnZS5jdHJsLmpzIiwiZ2FtZS9iYWNrZ3JvdW5kLmZhY3RvcnkuanMiLCJnYW1lL2J1bGxldC5mYWN0b3J5LmpzIiwiZ2FtZS9EcmF3YWJsZS5mYWN0b3J5LmpzIiwiZ2FtZS9lbmVteS5mYWN0b3J5LmpzIiwiZ2FtZS9nYW1lLmN0cmwuanMiLCJnYW1lL2ltYWdlcmVwby5mYWN0b3J5LmpzIiwiZ2FtZS9saXZlcy5mYWN0b3J5LmpzIiwiZ2FtZS9wb29sLmZhY3RvcnkuanMiLCJnYW1lL3F1YWR0cmVlLmZhY3RvcnkuanMiLCJnYW1lL3NoaXAuZmFjdG9yeS5qcyIsImhvbWUvaG9tZS5jdHJsLmpzIiwiaG9tZS9tb3ZlYWJsZS5qcyIsInBvcnRmb2xpby9wb3J0Zm9saW8uY3RybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImVubEJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcsIFtcclxuICAgICAgICAgICAgJ3VpLnJvdXRlcicsXHJcbiAgICAgICAgICAgICduZ0FuaW1hdGUnLFxyXG4gICAgICAgICAgICAnbW0uZm91bmRhdGlvbicsXHJcbiAgICAgICAgICAgICd1aS5ldmVudCcsXHJcbiAgICAgICAgICAgICd1aS5tYXAnXHJcbiAgICAgICAgXSlcclxuICAgIC5jb25maWcoY29uZmlnKVxyXG4gICAgLnJ1bihydW4pO1xyXG5cclxuXHRjb25maWcuJGluamVjdCA9IFsnJHVybFJvdXRlclByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJyRzdGF0ZVByb3ZpZGVyJywnJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXInXTtcclxuXHJcblx0ZnVuY3Rpb24gcnVuKCkge1xyXG5cclxuXHR9XHJcblx0ZnVuY3Rpb24gY29uZmlnKCR1cmxQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRzdGF0ZVByb3ZpZGVyLCAkdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlcikge1xyXG5cdFx0JHVybFByb3ZpZGVyLndoZW4oJycsICcvJyk7XHJcblx0XHQkdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlci5zdHJpY3RNb2RlKGZhbHNlKTtcclxuXHRcdCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKS5oYXNoUHJlZml4KCchJyk7XHJcblxyXG5cdFx0JHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvJyxcclxuICAgICAgICBcdHRlbXBsYXRlVXJsOiAnYXBwL2hvbWUvaG9tZS52aWV3Lmh0bWwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlcjogJ0hvbWVDdHJsJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXJBczogJ2hvbWVWbSdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zdGF0ZSgnYWJvdXQnLCB7XHJcbiAgICAgICAgXHR1cmw6ICcvYWJvdXQnLFxyXG4gICAgICAgIFx0dGVtcGxhdGVVcmw6ICdhcHAvYWJvdXQvYWJvdXQudmlldy5odG1sJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXI6ICdBYm91dEN0cmwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlckFzOiAnYWJvdXRWbSdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zdGF0ZSgnY29udGFjdCcsIHtcclxuICAgICAgICBcdHVybDogJy9jb250YWN0JyxcclxuICAgICAgICBcdHRlbXBsYXRlVXJsOiAnYXBwL2NvbnRhY3QvY29udGFjdC52aWV3Lmh0bWwnLFxyXG4gICAgICAgIFx0Y29udHJvbGxlcjogJ0NvbnRhY3RDdHJsJyxcclxuICAgICAgICBcdGNvbnRyb2xsZXJBczogJ2NvbnRhY3RWbSdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zdGF0ZSgncG9ydGZvbGlvJywge1xyXG4gICAgICAgIFx0dXJsOiAnL3BvcnRmb2xpbycsXHJcbiAgICAgICAgXHR0ZW1wbGF0ZVVybDogJ2FwcC9wb3J0Zm9saW8vcG9ydGZvbGlvLnZpZXcuaHRtbCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyOiAnUG9ydGZvbGlvQ3RybCcsXHJcbiAgICAgICAgXHRjb250cm9sbGVyQXM6ICdwb3J0Zm9saW9WbSdcclxuICAgICAgICB9KVxyXG5cdFx0LnN0YXRlKCdnYW1lJywge1xyXG5cdFx0XHR1cmw6ICcvZ2FtZScsXHJcblx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL2dhbWUvZ2FtZS52aWV3Lmh0bWwnLFxyXG5cdFx0XHRjb250cm9sbGVyOiAnR2FtZUN0cmwnLFxyXG5cdFx0XHRjb250cm9sbGVyQXM6ICdnYW1lVm0nXHJcblx0XHR9KVxyXG4gICAgICAgIC5zdGF0ZSgnNDA0Jywge1xyXG4gICAgICAgIFx0dXJsOiAnLzQwNCcsXHJcbiAgICAgICAgXHR0ZW1wbGF0ZVVybDogJ2FwcC80MDQvNDA0LnZpZXcuaHRtbCdcclxuICAgICAgICB9KTtcclxuXHRcdCR1cmxQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcclxuXHR9XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdBYm91dEN0cmwnLCBBYm91dEN0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEFib3V0Q3RybCgkc2NvcGUsICRyb290U2NvcGUsJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgYWJvdXRWbSA9IHRoaXM7XHJcbiAgICAgICAgYWJvdXRWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiQWJvdXRcIjtcclxuICAgIH1cclxuXHJcbiAgICBBYm91dEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckdGltZW91dCddO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbnRhY3RDdHJsJywgQ29udGFjdEN0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIENvbnRhY3RDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBjb250YWN0Vm0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnRhY3RWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiQ29udGFjdFwiO1xyXG4gICAgfVxyXG5cclxuICAgIENvbnRhY3RDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywnJHRpbWVvdXQnXTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAuY29udHJvbGxlcignUGFnZUN0cmwnLCBQYWdlQ3RybCk7XHJcblxyXG4gICAgUGFnZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckc3RhdGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBQYWdlQ3RybCgkc2NvcGUsICRyb290U2NvcGUsJHN0YXRlKSB7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzO1xyXG4gICAgICAgICRyb290U2NvcGUudGl0bGUgPSBcIlwiO1xyXG5cclxuICAgICAgICBwYWdlLmdldENsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnYWN0aXZlJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ0JhY2tncm91bmQnLCBCYWNrZ3JvdW5kKTtcclxuXHJcblx0QmFja2dyb3VuZC4kaW5qZWN0ID0gWydEcmF3YWJsZScsICdJbWFnZVJlcG8nXTtcclxuXHJcblx0ZnVuY3Rpb24gQmFja2dyb3VuZChEcmF3YWJsZSwgSW1hZ2VSZXBvKSB7XHJcblx0XHRmdW5jdGlvbiBiYWNrZ3JvdW5kKCkge1xyXG5cdFx0XHR0aGlzLnNwZWVkID0gMTsgXHJcblx0XHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHQvL1BhbiBiYWNrZ3JvdW5kXHJcblx0XHRcdFx0dGhpcy55ICs9IHRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uYmFja2dyb3VuZCwgdGhpcy54LCB0aGlzLnkpO1xyXG5cdFx0XHRcdC8vIERyYXcgYW5vdGhlciBpbWFnZSBhdCB0aGUgdG9wIGVkZ2Ugb2YgdGhlIGZpcnN0IGltYWdlXHJcblx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uYmFja2dyb3VuZCwgdGhpcy54LCB0aGlzLnkgLSB0aGlzLmNhbnZhc0hlaWdodCk7XHJcblx0XHRcdFx0Ly8gSWYgdGhlIGltYWdlIHNjcm9sbGVkIG9mZiB0aGUgc2NyZWVuLCByZXNldFxyXG5cdFx0XHRcdGlmICh0aGlzLnkgPj0gdGhpcy5jYW52YXNIZWlnaHQpIHtcclxuXHRcdFx0XHRcdHRoaXMueSA9IDA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0YmFja2dyb3VuZC5wcm90b3R5cGUgPSBuZXcgRHJhd2FibGUoKTtcclxuXHRcdHJldHVybiBiYWNrZ3JvdW5kO1xyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdCdWxsZXQnLCBCdWxsZXQpO1xyXG5cclxuXHRCdWxsZXQuJGluamVjdCA9IFtcIkRyYXdhYmxlXCIsXCJJbWFnZVJlcG9cIl07XHJcblx0ZnVuY3Rpb24gQnVsbGV0KERyYXdhYmxlLCBJbWFnZVJlcG8pIHtcclxuXHRcdGZ1bmN0aW9uIGJ1bGxldChvYmplY3QpIHtcclxuXHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlOyAvLyBJcyB0cnVlIGlmIHRoZSBidWxsZXQgaXMgY3VycmVudGx5IGluIHVzZVxyXG5cdFx0XHR2YXIgc2VsZiA9IG9iamVjdDtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogU2V0cyB0aGUgYnVsbGV0IHZhbHVlc1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5zcGF3biA9IGZ1bmN0aW9uICh4LCB5LCBzcGVlZCkge1xyXG5cdFx0XHRcdHRoaXMueCA9IHg7XHJcblx0XHRcdFx0dGhpcy55ID0geTtcclxuXHRcdFx0XHR0aGlzLnNwZWVkID0gc3BlZWQ7XHJcblx0XHRcdFx0dGhpcy5hbGl2ZSA9IHRydWU7XHJcblx0XHRcdH07XHJcblx0XHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KHRoaXMueCAtIDEsIHRoaXMueSAtIDEsIHRoaXMud2lkdGggKyAyLCB0aGlzLmhlaWdodCArIDIpO1xyXG5cdFx0XHRcdHRoaXMueSAtPSB0aGlzLnNwZWVkO1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzQ29sbGlkaW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoc2VsZiA9PT0gXCJidWxsZXRcIiAmJiB0aGlzLnkgPD0gMCAtIHRoaXMuaGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoc2VsZiA9PT0gXCJlbmVteUJ1bGxldFwiICYmIHRoaXMueSA+PSB0aGlzLmNhbnZhc0hlaWdodCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKHNlbGYgPT09IFwiYnVsbGV0XCIpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uYnVsbGV0LCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChzZWxmID09PSBcImVuZW15QnVsbGV0XCIpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5jb250ZXh0LmRyYXdJbWFnZShJbWFnZVJlcG8uZW5lbXlCdWxsZXQsIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFJlc2V0cyB0aGUgYnVsbGV0IHZhbHVlc1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLnggPSAwO1xyXG5cdFx0XHRcdHRoaXMueSA9IDA7XHJcblx0XHRcdFx0dGhpcy5zcGVlZCA9IDA7XHJcblx0XHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMuaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGJ1bGxldC5wcm90b3R5cGUgPSBuZXcgRHJhd2FibGUoKTtcclxuXHRcdHJldHVybiBidWxsZXQ7XHJcblx0fVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ0RyYXdhYmxlJywgRHJhd2FibGUpO1xyXG5cclxuXHRmdW5jdGlvbiBEcmF3YWJsZSgpIHtcclxuXHRcdGZ1bmN0aW9uIGRyYXdhYmxlKCkge1xyXG5cdFx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG5cdFx0XHRcdC8vIERlZmF1bHQgdmFyaWFibGVzXHJcblx0XHRcdFx0dGhpcy54ID0geDtcclxuXHRcdFx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0XHRcdHRoaXMud2lkdGggPSB3aWR0aDtcclxuXHRcdFx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuXHRcdFx0fTtcclxuXHRcdFx0dGhpcy5zcGVlZCA9IDA7XHJcblx0XHRcdHRoaXMuY2FudmFzV2lkdGggPSAwO1xyXG5cdFx0XHR0aGlzLmNhbnZhc0hlaWdodCA9IDA7XHJcblx0XHRcdHRoaXMuY29sbGlkYWJsZVdpdGggPSBcIlwiO1xyXG5cdFx0XHR0aGlzLmlzQ29sbGlkaW5nID0gZmFsc2U7XHJcblx0XHRcdHRoaXMudHlwZSA9IFwiXCI7XHJcblx0XHRcdC8vIERlZmluZSBhYnN0cmFjdCBmdW5jdGlvbiB0byBiZSBpbXBsZW1lbnRlZCBpbiBjaGlsZCBvYmplY3RzXHJcblx0XHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0fTtcclxuXHRcdFx0dGhpcy5tb3ZlID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR0aGlzLmlzQ29sbGlkYWJsZVdpdGggPSBmdW5jdGlvbiAob2JqZWN0KSB7XHJcblx0XHRcdFx0cmV0dXJuICh0aGlzLmNvbGxpZGFibGVXaXRoID09PSBvYmplY3QudHlwZSk7XHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZHJhd2FibGU7XHJcblx0fVxyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnRW5lbXknLCBFbmVteSk7XHJcblx0RW5lbXkuJGluamVjdCA9IFtcIkRyYXdhYmxlXCIsICBcIkltYWdlUmVwb1wiXTtcclxuXHRmdW5jdGlvbiBFbmVteShEcmF3YWJsZSwgSW1hZ2VSZXBvKSB7XHJcblx0XHRmdW5jdGlvbiBlbmVteSgpIHtcclxuXHRcdFx0dmFyIHBlcmNlbnRGaXJlID0gMC4wMDE7XHJcblx0XHRcdHZhciBjaGFuY2UgPSAwO1xyXG5cdFx0XHR0aGlzLmFsaXZlID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuY29sbGlkYWJsZVdpdGggPSBcImJ1bGxldFwiO1xyXG5cdFx0XHR0aGlzLnR5cGUgPSBcImVuZW15XCI7XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFNldHMgdGhlIEVuZW15IHZhbHVlc1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5zcGF3biA9IGZ1bmN0aW9uICh4LCB5LCBzcGVlZCxzaXplKSB7XHJcblx0XHRcdFx0dGhpcy54ID0geDtcclxuXHRcdFx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0XHRcdHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuXHRcdFx0XHR0aGlzLnNwZWVkWCA9IDA7XHJcblx0XHRcdFx0dGhpcy5zcGVlZFkgPSBzcGVlZDtcclxuXHRcdFx0XHR0aGlzLmFsaXZlID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLmxlZnRFZGdlID0gdGhpcy54IC0gOTA7XHJcblx0XHRcdFx0dGhpcy5yaWdodEVkZ2UgPSB0aGlzLnggKyA5MDtcclxuXHRcdFx0XHR0aGlzLmJvdHRvbUVkZ2UgPSB0aGlzLnkgKyA1MCAqIChzaXplIC8gNik7XHJcblx0XHRcdH07XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIE1vdmUgdGhlIGVuZW15XHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy5jb250ZXh0LmNsZWFyUmVjdCh0aGlzLnggLSAxLCB0aGlzLnksIHRoaXMud2lkdGggKyAxLCB0aGlzLmhlaWdodCk7XHJcblx0XHRcdFx0dGhpcy54ICs9IHRoaXMuc3BlZWRYO1xyXG5cdFx0XHRcdHRoaXMueSArPSB0aGlzLnNwZWVkWTtcclxuXHRcdFx0XHRpZiAodGhpcy54IDw9IHRoaXMubGVmdEVkZ2UgfHwgdGhpcy54ID49IHRoaXMucmlnaHRFZGdlICsgdGhpcy53aWR0aCkge1xyXG5cdFx0XHRcdFx0Ly9jaGFuZ2UgZGlyZWN0aW9uXHJcblx0XHRcdFx0XHR0aGlzLnNwZWVkWCA9IC10aGlzLnNwZWVkWDtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL2ZseSBkb3duIGZyb20gdG9wIGFuZCBzdHJhZmVcclxuXHRcdFx0XHRlbHNlIGlmICh0aGlzLnkgPj0gdGhpcy5ib3R0b21FZGdlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnNwZWVkID0gZ2FtZS5sZXZlbCAqZ2FtZS5lbmVteVNwZWVkO1xyXG5cdFx0XHRcdFx0dGhpcy5zcGVlZFkgPSAwO1xyXG5cdFx0XHRcdFx0dGhpcy55IC09IDU7XHJcblx0XHRcdFx0XHR0aGlzLnNwZWVkWCA9IC10aGlzLnNwZWVkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoIXRoaXMuaXNDb2xsaWRpbmcpIHtcclxuXHRcdFx0XHRcdHRoaXMuY29udGV4dC5kcmF3SW1hZ2UoSW1hZ2VSZXBvLmVuZW15LCB0aGlzLngsIHRoaXMueSk7XHJcblx0XHRcdFx0XHQvLyBFbmVteSBoYXMgYSBjaGFuY2UgdG8gc2hvb3QgZXZlcnkgbW92ZW1lbnRcclxuXHRcdFx0XHRcdGNoYW5jZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMSk7XHJcblx0XHRcdFx0XHRpZiAoY2hhbmNlIC8gMTAwIDwgcGVyY2VudEZpcmUpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5maXJlKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0Z2FtZS5wbGF5ZXJTY29yZSArPSAxMDA7XHJcblx0XHRcdFx0XHRpZiAoZ2FtZS5wbGF5ZXJTY29yZSAlIDIwMDAgPT09IDApIC8vZXZlcnkgMjAwMCBwb2ludHMgZ2FpbiBhIGxpZmVcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0Z2FtZS5saXZlcy5saWZlQ291bnQrKztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogRmlyZXMgYSBidWxsZXRcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuZmlyZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRnYW1lLmVuZW15QnVsbGV0UG9vbC5nZXQodGhpcy54ICsgdGhpcy53aWR0aCAvIDIsIHRoaXMueSArIHRoaXMuaGVpZ2h0LCAtMi41KTtcclxuXHRcdFx0fTtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogUmVzZXRzIHRoZSBlbmVteSB2YWx1ZXNcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dGhpcy54ID0gMDtcclxuXHRcdFx0XHR0aGlzLnkgPSAwO1xyXG5cdFx0XHRcdHRoaXMuc3BlZWQgPSAwO1xyXG5cdFx0XHRcdHRoaXMuc3BlZWRYID0gMDtcclxuXHRcdFx0XHR0aGlzLnNwZWVkWSA9IDA7XHJcblx0XHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMuaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGVuZW15LnByb3RvdHlwZSA9IG5ldyBEcmF3YWJsZSgpO1xyXG5cdFx0cmV0dXJuIGVuZW15O1xyXG5cdH1cclxufSgpKTsiLCJhbmd1bGFyXHJcblx0Lm1vZHVsZSgnYXBwJylcclxuXHQuY29udHJvbGxlcignR2FtZUN0cmwnLCBHYW1lQ3RybCk7XHJcblxyXG5HYW1lQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckdGltZW91dCcsICdJbWFnZVJlcG8nLCAnQmFja2dyb3VuZCcsICdTaGlwJywgJ0J1bGxldCcsXHJcblx0J0VuZW15JywgJ1Bvb2wnLCAnUXVhZFRyZWUnLCdMaXZlcyddO1xyXG5cclxudmFyIGdhbWU7XHJcblxyXG52YXIgS0VZX1NUQVRVUyA9IHt9O1xyXG5cclxuZnVuY3Rpb24gR2FtZUN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdGltZW91dCwgSW1hZ2VSZXBvLCBCYWNrZ3JvdW5kLCBTaGlwLCBCdWxsZXQsXHJcblx0RW5lbXksIFBvb2wsIFF1YWRUcmVlLCBMaXZlcykge1xyXG5cdHZhciBnYW1lVm0gPSB0aGlzO1xyXG5cdGdhbWVWbS5nYW1lT3ZlciA9IGZhbHNlO1xyXG5cdGdhbWVWbS5yZXN0YXJ0ID0gcmVzdGFydDtcclxuXHRnYW1lID0gbmV3IEdhbWUoKTtcclxuXHR2YXIgc3RhdGUgPSBcIlwiO1xyXG5cclxuXHRmdW5jdGlvbiBpbml0KCkge1xyXG5cdFx0aWYgKGdhbWUuaW5pdCgpKSB7XHJcblx0XHRcdGdhbWUuc3RhcnQoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0JHNjb3BlLiRvbihcIkluaXRcIiwgaW5pdCk7XHJcblxyXG5cdC8vc2V0dXAgZ2FtZSBsb2dpY1xyXG5cdGZ1bmN0aW9uIEdhbWUoKSB7XHJcblx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHRoaXMucGxheWVyU2NvcmUgPSAwO1xyXG5cdFx0XHR0aGlzLmxldmVsID0gMTtcclxuXHRcdFx0dGhpcy5lbmVteVNwZWVkID0gLjU7XHJcblx0XHRcdHRoaXMuYmdDYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmFja2dyb3VuZCcpO1xyXG5cdFx0XHR0aGlzLnNoaXBDYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2hpcCcpO1xyXG5cdFx0XHR0aGlzLm1haW5DYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xyXG5cdFx0XHQvLyBUZXN0IHRvIHNlZSBpZiBjYW52YXMgaXMgc3VwcG9ydGVkLiBPbmx5IG5lZWQgdG9cclxuXHRcdFx0Ly8gY2hlY2sgb25lIGNhbnZhc1xyXG5cdFx0XHRpZiAodGhpcy5iZ0NhbnZhcy5nZXRDb250ZXh0KSB7XHJcblx0XHRcdFx0dGhpcy5iZ0NvbnRleHQgPSB0aGlzLmJnQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XHJcblx0XHRcdFx0dGhpcy5zaGlwQ29udGV4dCA9IHRoaXMuc2hpcENhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG5cdFx0XHRcdHRoaXMubWFpbkNvbnRleHQgPSB0aGlzLm1haW5DYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuXHRcdFx0XHQvLyBJbml0aWFsaXplIG9iamVjdHMgdG8gY29udGFpbiB0aGVpciBjb250ZXh0IGFuZCBjYW52YXNcclxuXHRcdFx0XHQvLyBpbmZvcm1hdGlvblxyXG5cdFx0XHRcdEJhY2tncm91bmQucHJvdG90eXBlLmNvbnRleHQgPSB0aGlzLmJnQ29udGV4dDtcclxuXHRcdFx0XHRCYWNrZ3JvdW5kLnByb3RvdHlwZS5jYW52YXNXaWR0aCA9IHRoaXMuYmdDYW52YXMud2lkdGg7XHJcblx0XHRcdFx0QmFja2dyb3VuZC5wcm90b3R5cGUuY2FudmFzSGVpZ2h0ID0gdGhpcy5iZ0NhbnZhcy5oZWlnaHQ7XHJcblx0XHRcdFx0TGl2ZXMucHJvdG90eXBlLmNvbnRleHQgPSB0aGlzLmJnQ29udGV4dDtcclxuXHRcdFx0XHRMaXZlcy5wcm90b3R5cGUuY2FudmFzV2lkdGggPSB0aGlzLmJnQ2FudmFzLndpZHRoO1xyXG5cdFx0XHRcdExpdmVzLnByb3RvdHlwZS5jYW52YXNIZWlnaHQgPSB0aGlzLmJnQ2FudmFzLmhlaWdodDtcclxuXHRcdFx0XHRTaGlwLnByb3RvdHlwZS5jb250ZXh0ID0gdGhpcy5zaGlwQ29udGV4dDtcclxuXHRcdFx0XHRTaGlwLnByb3RvdHlwZS5jYW52YXNXaWR0aCA9IHRoaXMuc2hpcENhbnZhcy53aWR0aDtcclxuXHRcdFx0XHRTaGlwLnByb3RvdHlwZS5jYW52YXNIZWlnaHQgPSB0aGlzLnNoaXBDYW52YXMuaGVpZ2h0O1xyXG5cdFx0XHRcdEJ1bGxldC5wcm90b3R5cGUuY29udGV4dCA9IHRoaXMubWFpbkNvbnRleHQ7XHJcblx0XHRcdFx0QnVsbGV0LnByb3RvdHlwZS5jYW52YXNXaWR0aCA9IHRoaXMubWFpbkNhbnZhcy53aWR0aDtcclxuXHRcdFx0XHRCdWxsZXQucHJvdG90eXBlLmNhbnZhc0hlaWdodCA9IHRoaXMubWFpbkNhbnZhcy5oZWlnaHQ7XHJcblx0XHRcdFx0RW5lbXkucHJvdG90eXBlLmNvbnRleHQgPSB0aGlzLm1haW5Db250ZXh0O1xyXG5cdFx0XHRcdEVuZW15LnByb3RvdHlwZS5jYW52YXNXaWR0aCA9IHRoaXMubWFpbkNhbnZhcy53aWR0aDtcclxuXHRcdFx0XHRFbmVteS5wcm90b3R5cGUuY2FudmFzSGVpZ2h0ID0gdGhpcy5tYWluQ2FudmFzLmhlaWdodDtcclxuXHRcdFx0XHQvLyBJbml0aWFsaXplIHRoZSBiYWNrZ3JvdW5kIG9iamVjdFxyXG5cdFx0XHRcdHRoaXMuYmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kKCk7XHJcblx0XHRcdFx0dGhpcy5iYWNrZ3JvdW5kLmluaXQoMCwgMCk7IC8vIFNldCBkcmF3IHBvaW50IHRvIDAsMFxyXG5cclxuXHRcdFx0XHQvL2luaXRpYWxpemUgbGl2ZXNcclxuXHRcdFx0XHR0aGlzLmxpdmVzID0gbmV3IExpdmVzKCk7XHJcblx0XHRcdFx0dGhpcy5saXZlcy5saWZlQ291bnQgPSAyO1xyXG5cdFx0XHRcdHRoaXMubGl2ZXMuaW5pdCgwLCB0aGlzLmJnQ2FudmFzLmhlaWdodCAtIEltYWdlUmVwby5zcGFjZXNoaXAuaGVpZ2h0LCBJbWFnZVJlcG8uc3BhY2VzaGlwLndpZHRoLCBJbWFnZVJlcG8uc3BhY2VzaGlwLmhlaWdodCk7XHJcblxyXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgdGhlIHNoaXAgb2JqZWN0XHJcblx0XHRcdFx0dGhpcy5zaGlwID0gbmV3IFNoaXAoKTtcclxuXHJcblx0XHRcdFx0Ly8gU2V0IHRoZSBzaGlwIHRvIHN0YXJ0IG5lYXIgdGhlIGJvdHRvbSBtaWRkbGUgb2YgdGhlIGNhbnZhc1xyXG5cdFx0XHRcdHRoaXMuc2hpcFN0YXJ0WCA9IHRoaXMuc2hpcENhbnZhcy53aWR0aCAvIDIgLSBJbWFnZVJlcG8uc3BhY2VzaGlwLndpZHRoO1xyXG5cdFx0XHRcdHRoaXMuc2hpcFN0YXJ0WSA9IHRoaXMuc2hpcENhbnZhcy5oZWlnaHQgLyA0ICogMyArIEltYWdlUmVwby5zcGFjZXNoaXAuaGVpZ2h0ICogMjtcclxuXHRcdFx0XHR0aGlzLnNoaXAuaW5pdCh0aGlzLnNoaXBTdGFydFgsIHRoaXMuc2hpcFN0YXJ0WSxcclxuXHRcdFx0XHRcdFx0XHQgICBJbWFnZVJlcG8uc3BhY2VzaGlwLndpZHRoLCBJbWFnZVJlcG8uc3BhY2VzaGlwLmhlaWdodCk7XHRcdFx0XHRcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvLyBJbml0aWFsaXplIHRoZSBlbmVteSBwb29sIG9iamVjdFxyXG5cdFx0XHRcdHRoaXMuc3Bhd25XYXZlKCk7XHJcblxyXG5cdFx0XHRcdHRoaXMucXVhZFRyZWUgPSBuZXcgUXVhZFRyZWUoeyB4OiAwLCB5OiAwLCB3aWR0aDogdGhpcy5tYWluQ2FudmFzLndpZHRoLCBoZWlnaHQ6IHRoaXMubWFpbkNhbnZhcy5oZWlnaHQgfSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGdhbWUuc2hpcC5kcmF3KCk7XHJcblx0XHRcdGFuaW1hdGUoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5zcGF3bldhdmUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHQvL2V2ZXJ5IDNyZCBsZXZlbCBzcGF3biBhIGJvc3MgaW5zdGVhZCFcclxuXHRcdFx0aWYgKHRoaXMuZW5lbXlQb29sICYmIHRoaXMuZW5lbXlCdWxsZXRQb29sKSB7XHJcblx0XHRcdFx0dGhpcy5lbmVteVBvb2wuY2xlYXIoKTtcclxuXHRcdFx0XHR0aGlzLmVuZW15QnVsbGV0UG9vbC5jbGVhcigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBlbmVteUNvdW50ID0gdGhpcy5sZXZlbCAqIDY7XHJcblx0XHRcdGlmIChlbmVteUNvdW50ID4gMzApIC8vbWF4IG91dCBlbmVtaWVzIGF0IDMwXHJcblx0XHRcdHtcclxuXHRcdFx0XHRlbmVteUNvdW50ID0gMzA7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5lbmVteVBvb2wgPSBuZXcgUG9vbChlbmVteUNvdW50KTtcclxuXHRcdFx0dGhpcy5lbmVteVBvb2wuaW5pdChcImVuZW15XCIpO1xyXG5cclxuXHRcdFx0dGhpcy5lbmVteUJ1bGxldFBvb2wgPSBuZXcgUG9vbCh0aGlzLmxldmVsICogMTApO1xyXG5cdFx0XHR0aGlzLmVuZW15QnVsbGV0UG9vbC5pbml0KFwiZW5lbXlCdWxsZXRcIik7XHJcblxyXG5cdFx0XHR2YXIgaGVpZ2h0ID0gSW1hZ2VSZXBvLmVuZW15LmhlaWdodDtcclxuXHRcdFx0dmFyIHdpZHRoID0gSW1hZ2VSZXBvLmVuZW15LndpZHRoO1xyXG5cdFx0XHR2YXIgeCA9IDEwMDtcclxuXHRcdFx0dmFyIHkgPSAtaGVpZ2h0O1xyXG5cdFx0XHR2YXIgc3BhY2VyID0geSAqIDEuNTtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDE7IGkgPD0gdGhpcy5lbmVteVBvb2wuc2l6ZTsgaSsrKSB7XHJcblx0XHRcdFx0dGhpcy5lbmVteVBvb2wuZ2V0KHgsIHksdGhpcy5sZXZlbCAqIHRoaXMuZW5lbXlTcGVlZCk7XHJcblx0XHRcdFx0eCArPSB3aWR0aCArIDI1O1xyXG5cdFx0XHRcdGlmIChpICUgNiA9PT0gMCkge1xyXG5cdFx0XHRcdFx0eCA9IDEwMDtcclxuXHRcdFx0XHRcdHkgKz0gc3BhY2VyO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmdhbWVPdmVyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKCcjZ2FtZS1vdmVyJykuY3NzKFwiZGlzcGxheVwiLFwiYmxvY2tcIik7XHJcblx0XHR9O1xyXG5cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHJlc3RhcnQoKSB7XHJcblx0XHQkKCcjZ2FtZS1vdmVyJykuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcblxyXG5cdFx0Z2FtZS5sZXZlbCA9IDE7XHJcblxyXG5cdFx0Z2FtZS5iZ0NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGdhbWUuYmdDYW52YXMud2lkdGgsIGdhbWUuYmdDYW52YXMuaGVpZ2h0KTtcclxuXHRcdGdhbWUuc2hpcENvbnRleHQuY2xlYXJSZWN0KDAsIDAsIGdhbWUuc2hpcENhbnZhcy53aWR0aCwgZ2FtZS5zaGlwQ2FudmFzLmhlaWdodCk7XHJcblx0XHRnYW1lLm1haW5Db250ZXh0LmNsZWFyUmVjdCgwLCAwLCBnYW1lLm1haW5DYW52YXMud2lkdGgsIGdhbWUubWFpbkNhbnZhcy5oZWlnaHQpO1xyXG5cdFx0Z2FtZS5xdWFkVHJlZS5jbGVhcigpO1xyXG5cdFx0Z2FtZS5iYWNrZ3JvdW5kLmluaXQoMCwgMCk7XHJcblx0XHRnYW1lLmxpdmVzLmxpZmVDb3VudCA9IDI7XHJcblx0XHRnYW1lLmxpdmVzLmluaXQoMCwgZ2FtZS5iZ0NhbnZhcy5oZWlnaHQgLSBJbWFnZVJlcG8uc3BhY2VzaGlwLmhlaWdodCwgSW1hZ2VSZXBvLnNwYWNlc2hpcC53aWR0aCwgSW1hZ2VSZXBvLnNwYWNlc2hpcC5oZWlnaHQpO1xyXG5cdFx0Z2FtZS5zaGlwLmluaXQoZ2FtZS5zaGlwU3RhcnRYLCBnYW1lLnNoaXBTdGFydFksXHJcblx0XHRcdFx0XHQgICBJbWFnZVJlcG8uc3BhY2VzaGlwLndpZHRoLCBJbWFnZVJlcG8uc3BhY2VzaGlwLmhlaWdodCk7XHJcblx0XHRnYW1lLmVuZW15UG9vbC5pbml0KFwiZW5lbXlcIik7XHJcblx0XHRnYW1lLnNwYXduV2F2ZSgpO1xyXG5cdFx0Z2FtZS5lbmVteUJ1bGxldFBvb2wuaW5pdChcImVuZW15QnVsbGV0XCIpO1xyXG5cdFx0Z2FtZS5wbGF5ZXJTY29yZSA9IDA7XHJcblx0XHRnYW1lLnN0YXJ0KCk7XHJcblx0fVxyXG5cclxuXHRLRVlfQ09ERVMgPSB7XHJcblx0XHQzMjogJ3NwYWNlJyxcclxuXHRcdDM3OiAnbGVmdCcsXHJcblx0XHQzOTogJ3JpZ2h0J1xyXG5cdH07XHJcblx0Zm9yICh2YXIgY29kZSBpbiBLRVlfQ09ERVMpIHtcclxuXHRcdEtFWV9TVEFUVVNbS0VZX0NPREVTW2NvZGVdXSA9IGZhbHNlO1xyXG5cdH1cclxuXHRkb2N1bWVudC5vbmtleWRvd24gPSBmdW5jdGlvbiAoZSkge1xyXG5cdFx0Ly8gRmlyZWZveCBhbmQgb3BlcmEgdXNlIGNoYXJDb2RlIGluc3RlYWQgb2Yga2V5Q29kZSB0b1xyXG5cdFx0Ly8gcmV0dXJuIHdoaWNoIGtleSB3YXMgcHJlc3NlZC5cclxuXHRcdHZhciBrZXlDb2RlID0gKGUua2V5Q29kZSkgPyBlLmtleUNvZGUgOiBlLmNoYXJDb2RlO1xyXG5cdFx0aWYgKEtFWV9DT0RFU1trZXlDb2RlXSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdEtFWV9TVEFUVVNbS0VZX0NPREVTW2tleUNvZGVdXSA9IHRydWU7XHJcblx0XHR9XHJcblx0fTtcclxuXHRkb2N1bWVudC5vbmtleXVwID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdHZhciBrZXlDb2RlID0gKGUua2V5Q29kZSkgPyBlLmtleUNvZGUgOiBlLmNoYXJDb2RlO1xyXG5cdFx0aWYgKEtFWV9DT0RFU1trZXlDb2RlXSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdEtFWV9TVEFUVVNbS0VZX0NPREVTW2tleUNvZGVdXSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlY3RDb2xsaXNpb24oKSB7XHJcblx0dmFyIG9iamVjdHMgPSBbXTtcclxuXHRnYW1lLnF1YWRUcmVlLmdldEFsbE9iamVjdHMob2JqZWN0cyk7XHJcblx0Zm9yICh2YXIgeCA9IDAsIGxlbiA9IG9iamVjdHMubGVuZ3RoOyB4IDwgbGVuOyB4KyspIHtcclxuXHRcdGdhbWUucXVhZFRyZWUuZmluZE9iamVjdHMob2JqID0gW10sIG9iamVjdHNbeF0pO1xyXG5cdFx0Zm9yICh5ID0gMCwgbGVuZ3RoID0gb2JqLmxlbmd0aDsgeSA8IGxlbmd0aDsgeSsrKSB7XHJcblx0XHRcdC8vIERFVEVDVCBDT0xMSVNJT04gQUxHT1JJVEhNXHJcblx0XHRcdGlmIChvYmplY3RzW3hdLmNvbGxpZGFibGVXaXRoID09PSBvYmpbeV0udHlwZSAmJlxyXG5cdFx0XHQob2JqZWN0c1t4XS54IDwgb2JqW3ldLnggKyBvYmpbeV0ud2lkdGggJiZcclxuXHRcdFx0b2JqZWN0c1t4XS54ICsgb2JqZWN0c1t4XS53aWR0aCA+IG9ialt5XS54ICYmXHJcblx0XHRcdG9iamVjdHNbeF0ueSA8IG9ialt5XS55ICsgb2JqW3ldLmhlaWdodCAmJlxyXG5cdFx0XHRvYmplY3RzW3hdLnkgKyBvYmplY3RzW3hdLmhlaWdodCA+IG9ialt5XS55KSkge1xyXG5cdFx0XHRcdG9iamVjdHNbeF0uaXNDb2xsaWRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdG9ialt5XS5pc0NvbGxpZGluZyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8vY29uc3RhbnRseSBsb29wcyBmb3IgZ2FtZSBzdGF0ZVxyXG5mdW5jdGlvbiBhbmltYXRlKCkge1xyXG5cdC8vdXBkYXRlIHNjb3JlXHJcblx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Njb3JlJykuaW5uZXJIVE1MID0gZ2FtZS5wbGF5ZXJTY29yZTtcclxuXHQvLyBJbnNlcnQgb2JqZWN0cyBpbnRvIHF1YWR0cmVlXHJcblx0Z2FtZS5xdWFkVHJlZS5jbGVhcigpO1xyXG5cdGdhbWUucXVhZFRyZWUuaW5zZXJ0KGdhbWUuc2hpcCk7XHJcblx0Z2FtZS5xdWFkVHJlZS5pbnNlcnQoZ2FtZS5zaGlwLmJ1bGxldFBvb2wuZ2V0UG9vbCgpKTtcclxuXHRnYW1lLnF1YWRUcmVlLmluc2VydChnYW1lLmVuZW15UG9vbC5nZXRQb29sKCkpO1xyXG5cdGdhbWUucXVhZFRyZWUuaW5zZXJ0KGdhbWUuZW5lbXlCdWxsZXRQb29sLmdldFBvb2woKSk7XHJcblx0ZGV0ZWN0Q29sbGlzaW9uKCk7XHJcblx0Ly8gTm8gbW9yZSBlbmVtaWVzXHJcblx0aWYgKGdhbWUuZW5lbXlQb29sLmdldFBvb2woKS5sZW5ndGggPT09IDApIHtcclxuXHRcdGdhbWUubGV2ZWwrKztcclxuXHRcdGdhbWUuc3Bhd25XYXZlKCk7XHJcblx0fVxyXG5cdC8vIEFuaW1hdGUgZ2FtZSBvYmplY3RzXHJcblx0aWYgKGdhbWUuc2hpcC5hbGl2ZSkge1xyXG5cdHJlcXVlc3RBbmltRnJhbWUoYW5pbWF0ZSk7XHJcblx0Z2FtZS5iYWNrZ3JvdW5kLmRyYXcoKTtcclxuXHRnYW1lLnNoaXAubW92ZSgpO1xyXG5cdGdhbWUuc2hpcC5idWxsZXRQb29sLmFuaW1hdGUoKTtcclxuXHRnYW1lLmVuZW15UG9vbC5hbmltYXRlKCk7XHJcblx0Z2FtZS5lbmVteUJ1bGxldFBvb2wuYW5pbWF0ZSgpO1xyXG5cdGdhbWUubGl2ZXMuZHJhdygpO1xyXG5cdH1cclxufVxyXG5cclxud2luZG93LnJlcXVlc3RBbmltRnJhbWUgPSAoZnVuY3Rpb24gKCkge1xyXG5cdHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcblx0XHRcdHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdFx0d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG5cdFx0XHR3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG5cdFx0XHR3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuXHRcdFx0ZnVuY3Rpb24gKGNhbGxiYWNrLCBlbGVtZW50KSB7XHJcblx0XHRcdFx0d2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XHJcblx0XHRcdH07XHJcbn0pKCk7XHJcblxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdJbWFnZVJlcG8nLCBJbWFnZVJlcG8pO1xyXG5cdEltYWdlUmVwby4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJ107XHJcblx0ZnVuY3Rpb24gSW1hZ2VSZXBvKCRyb290U2NvcGUpIHtcclxuXHRcdC8vIERlZmluZSBpbWFnZXNcclxuXHRcdHRoaXMuZW1wdHkgPSBudWxsO1xyXG5cdFx0dGhpcy5iYWNrZ3JvdW5kID0gbmV3IEltYWdlKCk7XHJcblx0XHR0aGlzLnNwYWNlc2hpcCA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0dGhpcy5idWxsZXQgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMuZW5lbXkgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdHRoaXMuZW5lbXlCdWxsZXQgPSBuZXcgSW1hZ2UoKTtcclxuXHJcblx0XHR2YXIgbnVtSW1hZ2VzID0gNTtcclxuXHRcdHZhciBudW1Mb2FkZWQgPSAwO1xyXG5cdFx0ZnVuY3Rpb24gaW1hZ2VMb2FkZWQoKSB7XHJcblx0XHRcdG51bUxvYWRlZCsrO1xyXG5cdFx0XHRpZiAobnVtTG9hZGVkID09PSBudW1JbWFnZXMpIHtcclxuXHRcdFx0XHQkcm9vdFNjb3BlLiRicm9hZGNhc3QoXCJJbml0XCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aGlzLmJhY2tncm91bmQub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpbWFnZUxvYWRlZCgpO1xyXG5cdFx0fTtcclxuXHRcdHRoaXMuc3BhY2VzaGlwLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aW1hZ2VMb2FkZWQoKTtcclxuXHRcdH07XHJcblx0XHR0aGlzLmJ1bGxldC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGltYWdlTG9hZGVkKCk7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5lbmVteS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGltYWdlTG9hZGVkKCk7XHJcblx0XHR9O1xyXG5cdFx0dGhpcy5lbmVteUJ1bGxldC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGltYWdlTG9hZGVkKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIFNldCBpbWFnZXMgc3JjXHJcblx0XHR0aGlzLmJhY2tncm91bmQuc3JjID0gXCJsaWIvaW1hZ2VzL2JnLnBuZ1wiO1xyXG5cdFx0dGhpcy5zcGFjZXNoaXAuc3JjID0gXCJsaWIvaW1hZ2VzL3NoaXAucG5nXCI7XHJcblx0XHR0aGlzLmJ1bGxldC5zcmMgPSBcImxpYi9pbWFnZXMvYnVsbGV0LnBuZ1wiO1xyXG5cdFx0dGhpcy5lbmVteS5zcmMgPSBcImxpYi9pbWFnZXMvZW5lbXkucG5nXCI7XHJcblx0XHR0aGlzLmVuZW15QnVsbGV0LnNyYyA9IFwibGliL2ltYWdlcy9idWxsZXRfZW5lbXkucG5nXCI7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRhbmd1bGFyXHJcblx0XHQubW9kdWxlKCdhcHAnKVxyXG5cdFx0LmZhY3RvcnkoJ0xpdmVzJywgTGl2ZXMpO1xyXG5cclxuXHRMaXZlcy4kaW5qZWN0ID0gWydEcmF3YWJsZScsICdJbWFnZVJlcG8nXTtcclxuXHJcblx0ZnVuY3Rpb24gTGl2ZXMoRHJhd2FibGUsIEltYWdlUmVwbykge1xyXG5cdFx0dGhpcy5saWZlQ291bnQgPSAwO1xyXG5cdFx0ZnVuY3Rpb24gbGl2ZXMoeCx5KSB7XHJcblx0XHRcdHRoaXMuZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHQvL0RyYXcgbGl2ZXMgZm9yIGVhY2ggbGlmZSBsZWZ0XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxpZmVDb3VudDsgaSsrKSB7XHJcblx0XHRcdFx0XHR0aGlzLmNvbnRleHQuZHJhd0ltYWdlKEltYWdlUmVwby5zcGFjZXNoaXAsIGkgKiB0aGlzLndpZHRoLCB0aGlzLnkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdGxpdmVzLnByb3RvdHlwZSA9IG5ldyBEcmF3YWJsZSgpO1xyXG5cdFx0cmV0dXJuIGxpdmVzO1xyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdQb29sJywgUG9vbCk7XHJcblx0UG9vbC4kaW5qZWN0ID0gWydJbWFnZVJlcG8nLCAnQnVsbGV0JywgJ0VuZW15J107XHJcblx0ZnVuY3Rpb24gUG9vbChJbWFnZVJlcG8sIEJ1bGxldCwgRW5lbXkpIHtcclxuXHRcdC8qKlxyXG5cdFx0KiBDdXN0b20gUG9vbCBvYmplY3QuIEhvbGRzIEJ1bGxldCBvYmplY3RzIHRvIGJlIG1hbmFnZWQgdG8gcHJldmVudFxyXG5cdFx0KiBnYXJiYWdlIGNvbGxlY3Rpb24uXHJcblx0XHQqL1xyXG5cdFx0ZnVuY3Rpb24gcG9vbHMobWF4U2l6ZSkge1xyXG5cdFx0XHR0aGlzLnNpemUgPSBtYXhTaXplOyAvLyBNYXggYnVsbGV0cyBhbGxvd2VkIGluIHRoZSBwb29sXHJcblx0XHRcdHZhciBwb29sID0gW107XHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIFBvcHVsYXRlcyB0aGUgcG9vbCBhcnJheSB3aXRoIEJ1bGxldCBvYmplY3RzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAob2JqZWN0KSB7XHJcblx0XHRcdFx0aWYgKG9iamVjdCA9PSBcImJ1bGxldFwiKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc2l6ZTsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdC8vIEluaXRhbGl6ZSB0aGUgb2JqZWN0XHJcblx0XHRcdFx0XHRcdHZhciBidWxsZXQgPSBuZXcgQnVsbGV0KFwiYnVsbGV0XCIpO1xyXG5cdFx0XHRcdFx0XHRidWxsZXQuaW5pdCgwLCAwLCBJbWFnZVJlcG8uYnVsbGV0LndpZHRoLCBJbWFnZVJlcG8uYnVsbGV0LmhlaWdodCk7XHJcblx0XHRcdFx0XHRcdGJ1bGxldC5jb2xsaWRhYmxlV2l0aCA9IFwiZW5lbXlcIjtcclxuXHRcdFx0XHRcdFx0YnVsbGV0LnR5cGUgPSBcImJ1bGxldFwiO1xyXG5cdFx0XHRcdFx0XHRwb29sW2ldID0gYnVsbGV0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChvYmplY3QgPT0gXCJlbmVteVwiKSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IHRoaXMuc2l6ZTsgaisrKSB7XHJcblx0XHRcdFx0XHRcdHZhciBlbmVteSA9IG5ldyBFbmVteSgpO1xyXG5cdFx0XHRcdFx0XHRlbmVteS5pbml0KDAsIDAsIEltYWdlUmVwby5lbmVteS53aWR0aCwgSW1hZ2VSZXBvLmVuZW15LmhlaWdodCk7XHJcblx0XHRcdFx0XHRcdHBvb2xbal0gPSBlbmVteTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAob2JqZWN0ID09IFwiZW5lbXlCdWxsZXRcIikge1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLnNpemU7IGsrKykge1xyXG5cdFx0XHRcdFx0XHR2YXIgYnVsbGV0ID0gbmV3IEJ1bGxldChcImVuZW15QnVsbGV0XCIpO1xyXG5cdFx0XHRcdFx0XHRidWxsZXQuaW5pdCgwLCAwLCBJbWFnZVJlcG8uZW5lbXlCdWxsZXQud2lkdGgsIEltYWdlUmVwby5lbmVteUJ1bGxldC5oZWlnaHQpO1xyXG5cdFx0XHRcdFx0XHRidWxsZXQuY29sbGlkYWJsZVdpdGggPSBcInNoaXBcIjtcclxuXHRcdFx0XHRcdFx0YnVsbGV0LnR5cGUgPSBcImVuZW15QnVsbGV0XCI7XHJcblx0XHRcdFx0XHRcdHBvb2xba10gPSBidWxsZXQ7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR0aGlzLmdldFBvb2wgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0dmFyIG9iaiA9IFtdO1xyXG5cdFx0XHRcdGZvciAodmFyIGwgPSAwOyBsIDwgdGhpcy5zaXplOyBsKyspIHtcclxuXHRcdFx0XHRcdGlmIChwb29sW2xdLmFsaXZlKSB7XHJcblx0XHRcdFx0XHRcdG9iai5wdXNoKHBvb2xbbF0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gb2JqO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBHcmFicyB0aGUgbGFzdCBpdGVtIGluIHRoZSBsaXN0IGFuZCBpbml0aWFsaXplcyBpdCBhbmRcclxuXHRcdFx0ICogcHVzaGVzIGl0IHRvIHRoZSBmcm9udCBvZiB0aGUgYXJyYXkuXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmdldCA9IGZ1bmN0aW9uICh4LCB5LCBzcGVlZCkge1xyXG5cdFx0XHRcdGlmICghcG9vbFt0aGlzLnNpemUgLSAxXS5hbGl2ZSkge1xyXG5cdFx0XHRcdFx0cG9vbFt0aGlzLnNpemUgLSAxXS5zcGF3bih4LCB5LCBzcGVlZCwgdGhpcy5zaXplKTtcclxuXHRcdFx0XHRcdHBvb2wudW5zaGlmdChwb29sLnBvcCgpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBEcmF3cyBhbnkgaW4gdXNlIEJ1bGxldHMuIElmIGEgYnVsbGV0IGdvZXMgb2ZmIHRoZSBzY3JlZW4sXHJcblx0XHRcdCAqIGNsZWFycyBpdCBhbmQgcHVzaGVzIGl0IHRvIHRoZSBmcm9udCBvZiB0aGUgYXJyYXkuXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmFuaW1hdGUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnNpemU7IGkrKykge1xyXG5cdFx0XHRcdFx0Ly8gT25seSBkcmF3IHVudGlsIHdlIGZpbmQgYSBidWxsZXQgdGhhdCBpcyBub3QgYWxpdmVcclxuXHRcdFx0XHRcdGlmIChwb29sW2ldLmFsaXZlKSB7XHJcblx0XHRcdFx0XHRcdGlmIChwb29sW2ldLmRyYXcoKSkge1xyXG5cdFx0XHRcdFx0XHRcdHBvb2xbaV0uY2xlYXIoKTtcclxuXHRcdFx0XHRcdFx0XHRwb29sLnB1c2goKHBvb2wuc3BsaWNlKGksIDEpKVswXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cdFx0XHR0aGlzLmNsZWFyID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zaXplOyBpKyspIHtcclxuXHRcdFx0XHRcdFx0cG9vbFtpXS5jbGVhcigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBvb2xzO1xyXG5cdH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG5cdFx0Lm1vZHVsZSgnYXBwJylcclxuXHRcdC5mYWN0b3J5KCdRdWFkVHJlZScsIFF1YWRUcmVlKTtcclxuXHJcblx0ZnVuY3Rpb24gUXVhZFRyZWUoKSB7XHJcblx0XHRmdW5jdGlvbiBxdWFkVHJlZShib3VuZEJveCwgbHZsKSB7XHJcblx0XHRcdHZhciBtYXhPYmplY3RzID0gMTA7XHJcblx0XHRcdHRoaXMuYm91bmRzID0gYm91bmRCb3ggfHwge1xyXG5cdFx0XHRcdHg6IDAsXHJcblx0XHRcdFx0eTogMCxcclxuXHRcdFx0XHR3aWR0aDogMCxcclxuXHRcdFx0XHRoZWlnaHQ6IDBcclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIG9iamVjdHMgPSBbXTtcclxuXHRcdFx0dGhpcy5ub2RlcyA9IFtdO1xyXG5cdFx0XHR2YXIgbGV2ZWwgPSBsdmwgfHwgMDtcclxuXHRcdFx0dmFyIG1heExldmVscyA9IDU7XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBDbGVhcnMgdGhlIHF1YWRUcmVlIGFuZCBhbGwgbm9kZXMgb2Ygb2JqZWN0c1xyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5jbGVhciA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRvYmplY3RzID0gW107XHJcblxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dGhpcy5ub2Rlc1tpXS5jbGVhcigpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5ub2RlcyA9IFtdO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICogR2V0IGFsbCBvYmplY3RzIGluIHRoZSBxdWFkVHJlZVxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5nZXRBbGxPYmplY3RzID0gZnVuY3Rpb24gKHJldHVybmVkT2JqZWN0cykge1xyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ub2Rlcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0dGhpcy5ub2Rlc1tpXS5nZXRBbGxPYmplY3RzKHJldHVybmVkT2JqZWN0cyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gb2JqZWN0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cdFx0XHRcdFx0cmV0dXJuZWRPYmplY3RzLnB1c2gob2JqZWN0c1tpXSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gcmV0dXJuZWRPYmplY3RzO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICogUmV0dXJuIGFsbCBvYmplY3RzIHRoYXQgdGhlIG9iamVjdCBjb3VsZCBjb2xsaWRlIHdpdGhcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuZmluZE9iamVjdHMgPSBmdW5jdGlvbiAocmV0dXJuZWRPYmplY3RzLCBvYmopIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJVTkRFRklORUQgT0JKRUNUXCIpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleChvYmopO1xyXG5cdFx0XHRcdGlmIChpbmRleCAhPSAtMSAmJiB0aGlzLm5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0dGhpcy5ub2Rlc1tpbmRleF0uZmluZE9iamVjdHMocmV0dXJuZWRPYmplY3RzLCBvYmopO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IG9iamVjdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHRcdFx0XHRcdHJldHVybmVkT2JqZWN0cy5wdXNoKG9iamVjdHNbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIHJldHVybmVkT2JqZWN0cztcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdC8qXHJcblx0XHRcdCAqIEluc2VydCB0aGUgb2JqZWN0IGludG8gdGhlIHF1YWRUcmVlLiBJZiB0aGUgdHJlZVxyXG5cdFx0XHQgKiBleGNlZGVzIHRoZSBjYXBhY2l0eSwgaXQgd2lsbCBzcGxpdCBhbmQgYWRkIGFsbFxyXG5cdFx0XHQgKiBvYmplY3RzIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgbm9kZXMuXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLmluc2VydCA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gb2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuaW5zZXJ0KG9ialtpXSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKHRoaXMubm9kZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHR2YXIgbm9kZSA9IHRoaXMuZ2V0SW5kZXgob2JqKTtcclxuXHRcdFx0XHRcdC8vIE9ubHkgYWRkIHRoZSBvYmplY3QgdG8gYSBzdWJub2RlIGlmIGl0IGNhbiBmaXQgY29tcGxldGVseVxyXG5cdFx0XHRcdFx0Ly8gd2l0aGluIG9uZVxyXG5cdFx0XHRcdFx0aWYgKCBub2RlICE9IC0xKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMubm9kZXNbbm9kZV0uaW5zZXJ0KG9iaik7XHJcblxyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRvYmplY3RzLnB1c2gob2JqKTtcclxuXHJcblx0XHRcdFx0Ly8gUHJldmVudCBpbmZpbml0ZSBzcGxpdHRpbmdcclxuXHRcdFx0XHRpZiAob2JqZWN0cy5sZW5ndGggPiBtYXhPYmplY3RzICYmIGxldmVsIDwgbWF4TGV2ZWxzKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5ub2Rlc1swXSA9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3BsaXQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR2YXIgaSA9IDA7XHJcblx0XHRcdFx0XHR3aGlsZSAoaSA8IG9iamVjdHMubGVuZ3RoKSB7XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4KG9iamVjdHNbaV0pO1xyXG5cdFx0XHRcdFx0XHRpZiAoaW5kZXggIT0gLTEpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLm5vZGVzW2luZGV4XS5pbnNlcnQoKG9iamVjdHMuc3BsaWNlKGksIDEpKVswXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aSsrO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0LypcclxuXHRcdFx0ICogRGV0ZXJtaW5lIHdoaWNoIG5vZGUgdGhlIG9iamVjdCBiZWxvbmdzIHRvLiAtMSBtZWFuc1xyXG5cdFx0XHQgKiBvYmplY3QgY2Fubm90IGNvbXBsZXRlbHkgZml0IHdpdGhpbiBhIG5vZGUgYW5kIGlzIHBhcnRcclxuXHRcdFx0ICogb2YgdGhlIGN1cnJlbnQgbm9kZVxyXG5cdFx0XHQgKi9cclxuXHRcdFx0dGhpcy5nZXRJbmRleCA9IGZ1bmN0aW9uIChvYmopIHtcclxuXHJcblx0XHRcdFx0dmFyIGluZGV4ID0gLTE7XHJcblx0XHRcdFx0dmFyIHZlcnRpY2FsTWlkcG9pbnQgPSB0aGlzLmJvdW5kcy54ICsgdGhpcy5ib3VuZHMud2lkdGggLyAyO1xyXG5cdFx0XHRcdHZhciBob3Jpem9udGFsTWlkcG9pbnQgPSB0aGlzLmJvdW5kcy55ICsgdGhpcy5ib3VuZHMuaGVpZ2h0IC8gMjtcclxuXHJcblx0XHRcdFx0Ly8gT2JqZWN0IGNhbiBmaXQgY29tcGxldGVseSB3aXRoaW4gdGhlIHRvcCBxdWFkcmFudFxyXG5cdFx0XHRcdHZhciB0b3BRdWFkcmFudCA9IChvYmoueSA8IGhvcml6b250YWxNaWRwb2ludCAmJiBvYmoueSArIG9iai5oZWlnaHQgPCBob3Jpem9udGFsTWlkcG9pbnQpO1xyXG5cdFx0XHRcdC8vIE9iamVjdCBjYW4gZml0IGNvbXBsZXRlbHkgd2l0aGluIHRoZSBib3R0b20gcXVhbmRyYW50XHJcblx0XHRcdFx0dmFyIGJvdHRvbVF1YWRyYW50ID0gKG9iai55ID4gaG9yaXpvbnRhbE1pZHBvaW50KTtcclxuXHJcblx0XHRcdFx0Ly8gT2JqZWN0IGNhbiBmaXQgY29tcGxldGVseSB3aXRoaW4gdGhlIGxlZnQgcXVhZHJhbnRzXHJcblx0XHRcdFx0aWYgKG9iai54IDwgdmVydGljYWxNaWRwb2ludCAmJlxyXG5cdFx0XHRcdFx0XHRvYmoueCArIG9iai53aWR0aCA8IHZlcnRpY2FsTWlkcG9pbnQpIHtcclxuXHRcdFx0XHRcdGlmICh0b3BRdWFkcmFudCkge1xyXG5cdFx0XHRcdFx0XHRpbmRleCA9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChib3R0b21RdWFkcmFudCkge1xyXG5cdFx0XHRcdFx0XHRpbmRleCA9IDI7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gT2JqZWN0IGNhbiBmaXggY29tcGxldGVseSB3aXRoaW4gdGhlIHJpZ2h0IHF1YW5kcmFudHNcclxuXHRcdFx0XHRlbHNlIGlmIChvYmoueCA+IHZlcnRpY2FsTWlkcG9pbnQpIHtcclxuXHRcdFx0XHRcdGlmICh0b3BRdWFkcmFudCkge1xyXG5cdFx0XHRcdFx0XHRpbmRleCA9IDA7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChib3R0b21RdWFkcmFudCkge1xyXG5cdFx0XHRcdFx0XHRpbmRleCA9IDM7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRyZXR1cm4gaW5kZXg7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHQvKlxyXG5cdFx0XHQgKiBTcGxpdHMgdGhlIG5vZGUgaW50byA0IHN1Ym5vZGVzXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR0aGlzLnNwbGl0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdC8vIEJpdHdpc2Ugb3IgW2h0bWw1cm9ja3NdXHJcblx0XHRcdFx0dmFyIHN1YldpZHRoID0gKHRoaXMuYm91bmRzLndpZHRoIC8gMikgfCAwO1xyXG5cdFx0XHRcdHZhciBzdWJIZWlnaHQgPSAodGhpcy5ib3VuZHMuaGVpZ2h0IC8gMikgfCAwO1xyXG5cclxuXHRcdFx0XHR0aGlzLm5vZGVzWzBdID0gbmV3IHF1YWRUcmVlKHtcclxuXHRcdFx0XHRcdHg6IHRoaXMuYm91bmRzLnggKyBzdWJXaWR0aCxcclxuXHRcdFx0XHRcdHk6IHRoaXMuYm91bmRzLnksXHJcblx0XHRcdFx0XHR3aWR0aDogc3ViV2lkdGgsXHJcblx0XHRcdFx0XHRoZWlnaHQ6IHN1YkhlaWdodFxyXG5cdFx0XHRcdH0sIGxldmVsICsgMSk7XHJcblx0XHRcdFx0dGhpcy5ub2Rlc1sxXSA9IG5ldyBxdWFkVHJlZSh7XHJcblx0XHRcdFx0XHR4OiB0aGlzLmJvdW5kcy54LFxyXG5cdFx0XHRcdFx0eTogdGhpcy5ib3VuZHMueSxcclxuXHRcdFx0XHRcdHdpZHRoOiBzdWJXaWR0aCxcclxuXHRcdFx0XHRcdGhlaWdodDogc3ViSGVpZ2h0XHJcblx0XHRcdFx0fSwgbGV2ZWwgKyAxKTtcclxuXHRcdFx0XHR0aGlzLm5vZGVzWzJdID0gbmV3IHF1YWRUcmVlKHtcclxuXHRcdFx0XHRcdHg6IHRoaXMuYm91bmRzLngsXHJcblx0XHRcdFx0XHR5OiB0aGlzLmJvdW5kcy55ICsgc3ViSGVpZ2h0LFxyXG5cdFx0XHRcdFx0d2lkdGg6IHN1YldpZHRoLFxyXG5cdFx0XHRcdFx0aGVpZ2h0OiBzdWJIZWlnaHRcclxuXHRcdFx0XHR9LCBsZXZlbCArIDEpO1xyXG5cdFx0XHRcdHRoaXMubm9kZXNbM10gPSBuZXcgcXVhZFRyZWUoe1xyXG5cdFx0XHRcdFx0eDogdGhpcy5ib3VuZHMueCArIHN1YldpZHRoLFxyXG5cdFx0XHRcdFx0eTogdGhpcy5ib3VuZHMueSArIHN1YkhlaWdodCxcclxuXHRcdFx0XHRcdHdpZHRoOiBzdWJXaWR0aCxcclxuXHRcdFx0XHRcdGhlaWdodDogc3ViSGVpZ2h0XHJcblx0XHRcdFx0fSwgbGV2ZWwgKyAxKTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBxdWFkVHJlZTtcclxuXHR9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuXHRcdC5tb2R1bGUoJ2FwcCcpXHJcblx0XHQuZmFjdG9yeSgnU2hpcCcsIFNoaXApO1xyXG5cdFNoaXAuJGluamVjdCA9IFtcIkRyYXdhYmxlXCIsIFwiUG9vbFwiLCBcIkltYWdlUmVwb1wiXTtcclxuXHRmdW5jdGlvbiBTaGlwKERyYXdhYmxlLCBQb29sLCBJbWFnZVJlcG8pIHtcclxuXHRcdGZ1bmN0aW9uIHNoaXAoKSB7XHJcblx0XHRcdHRoaXMuc3BlZWQgPSA1O1xyXG5cdFx0XHR0aGlzLmJ1bGxldFBvb2wgPSBuZXcgUG9vbCgxKTtcclxuXHRcdFx0dGhpcy5idWxsZXRQb29sLmluaXQoXCJidWxsZXRcIik7XHJcblx0XHRcdHZhciBmaXJlUmF0ZSA9IDE7XHJcblx0XHRcdHZhciBjb3VudGVyID0gMDtcclxuXHRcdFx0dGhpcy5jb2xsaWRhYmxlV2l0aCA9IFwiZW5lbXlCdWxsZXRcIjtcclxuXHRcdFx0dGhpcy50eXBlID0gXCJzaGlwXCI7XHJcblxyXG5cdFx0XHR0aGlzLmluaXQgPSBmdW5jdGlvbiAoeCwgeSwgd2lkdGgsIGhlaWdodCkge1xyXG5cdFx0XHRcdC8vIERlZmF1bHQgdmFyaWFibGVzXHJcblx0XHRcdFx0dGhpcy54ID0geDtcclxuXHRcdFx0XHR0aGlzLnkgPSB5O1xyXG5cdFx0XHRcdHRoaXMud2lkdGggPSB3aWR0aDtcclxuXHRcdFx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuXHRcdFx0XHR0aGlzLmFsaXZlID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLmlzQ29sbGlkaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5idWxsZXRQb29sLmluaXQoXCJidWxsZXRcIik7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR0aGlzLmRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0Ly8gRmluaXNoIGJ5IHJlZHJhd2luZyB0aGUgc2hpcFxyXG5cdFx0XHRcdHRoaXMuY29udGV4dC5kcmF3SW1hZ2UoSW1hZ2VSZXBvLnNwYWNlc2hpcCwgdGhpcy54LCB0aGlzLnkpO1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR0aGlzLm1vdmUgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0Y291bnRlcisrO1xyXG5cdFx0XHRcdC8vIERldGVybWluZSBpZiB0aGUgYWN0aW9uIGlzIG1vdmUgYWN0aW9uXHJcblx0XHRcdFx0aWYgKEtFWV9TVEFUVVMubGVmdCB8fCBLRVlfU1RBVFVTLnJpZ2h0KSB7XHJcblx0XHRcdFx0XHQvLyBUaGUgc2hpcCBtb3ZlZCwgc28gZXJhc2UgaXQncyBjdXJyZW50IGltYWdlIHNvIGl0IGNhblxyXG5cdFx0XHRcdFx0Ly8gYmUgcmVkcmF3biBpbiBpdCdzIG5ldyBsb2NhdGlvblxyXG5cdFx0XHRcdFx0dGhpcy5jb250ZXh0LmNsZWFyUmVjdCh0aGlzLngsIHRoaXMueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIHggYW5kIHkgYWNjb3JkaW5nIHRvIHRoZSBkaXJlY3Rpb24gdG8gbW92ZSBhbmRcclxuXHRcdFx0XHRcdC8vIHJlZHJhdyB0aGUgc2hpcC4gQ2hhbmdlIHRoZSBlbHNlIGlmJ3MgdG8gaWYgc3RhdGVtZW50c1xyXG5cdFx0XHRcdFx0Ly8gdG8gaGF2ZSBkaWFnb25hbCBtb3ZlbWVudC5cclxuXHRcdFx0XHRcdGlmIChLRVlfU1RBVFVTLmxlZnQpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy54IC09IHRoaXMuc3BlZWQ7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLnggPD0gMCkgLy8gS2VlcCBwbGF5ZXIgd2l0aGluIHRoZSBzY3JlZW5cclxuXHRcdFx0XHRcdFx0XHR0aGlzLnggPSAwO1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChLRVlfU1RBVFVTLnJpZ2h0KSB7XHJcblx0XHRcdFx0XHRcdHRoaXMueCArPSB0aGlzLnNwZWVkO1xyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy54ID49IHRoaXMuY2FudmFzV2lkdGggLSB0aGlzLndpZHRoKVxyXG5cdFx0XHRcdFx0XHRcdHRoaXMueCA9IHRoaXMuY2FudmFzV2lkdGggLSB0aGlzLndpZHRoO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmlzQ29sbGlkaW5nKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuZHJhdygpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKEtFWV9TVEFUVVMuc3BhY2UgJiYgY291bnRlciA+PSBmaXJlUmF0ZSAmJiAhdGhpcy5pc0NvbGxpZGluZykge1xyXG5cdFx0XHRcdFx0dGhpcy5maXJlKCk7XHJcblx0XHRcdFx0XHRjb3VudGVyID0gMDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmlzQ29sbGlkaW5nICYmIGdhbWUubGl2ZXMubGlmZUNvdW50ID4gMCkge1xyXG5cdFx0XHRcdFx0Z2FtZS5saXZlcy5saWZlQ291bnQgLT0gMTtcclxuXHRcdFx0XHRcdHRoaXMuaXNDb2xsaWRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAodGhpcy5pc0NvbGxpZGluZykge1xyXG5cdFx0XHRcdFx0dGhpcy5hbGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0Z2FtZS5nYW1lT3ZlcigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0LypcclxuXHRcdFx0ICogRmlyZXMgdHdvIGJ1bGxldHNcclxuXHRcdFx0ICovXHJcblx0XHRcdHRoaXMuZmlyZSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR0aGlzLmJ1bGxldFBvb2wuZ2V0KHRoaXMueCArIDE5LCB0aGlzLnkgLSAzLCAzKTtcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdHNoaXAucHJvdG90eXBlID0gbmV3IERyYXdhYmxlKCk7XHJcblx0XHRyZXR1cm4gc2hpcDtcclxuXHR9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignSG9tZUN0cmwnLCBIb21lQ3RybCk7XHJcblxyXG4gICAgSG9tZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnXTtcclxuXHJcbiAgICAgZnVuY3Rpb24gSG9tZUN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBob21lVm0gPSB0aGlzO1xyXG4gICAgICAgIGhvbWVWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgaG9tZVZtLmxvYWRQaW5zID0gbG9hZFBpbnMoKTtcclxuICAgICAgICBob21lVm0ubXlNYXJrZXIgPSB7fTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJIb21lXCI7XHJcblxyXG4gICAgICAgIHZhciBkZWZhdWx0TGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNy4wOTAyNCwgLTk1LjcxMjg5MSk7XHJcbiAgICAgICAgdmFyIGRpcmVjdGlvbnNEaXNwbGF5ID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcih7XHJcbiAgICAgICAgICAgIHN1cHByZXNzTWFya2VyczogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBkaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xyXG4gICAgICAgIHZhciB0cmFmZmljTGF5ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuVHJhZmZpY0xheWVyKCk7XHJcblxyXG4gICAgICAgIGhvbWVWbS5tYXBPcHRpb25zID0ge1xyXG4gICAgICAgICAgICB6b29tOiA0LFxyXG4gICAgICAgICAgICBjZW50ZXI6IGRlZmF1bHRMYXRMbmcsXHJcbiAgICAgICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcclxuICAgICAgICAgICAgbmF2aWdhdGlvbkNvbnRyb2w6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY2FsZUNvbnRyb2w6IGZhbHNlLFxyXG4gICAgICAgICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lcih3aW5kb3csIFwicmVzaXplXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNlbnRlciA9ICRzY29wZS5tYXAuZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIoJHNjb3BlLm1hcCwgXCJyZXNpemVcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXAuc2V0Q2VudGVyKGNlbnRlcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGluaXQoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAgICAgJHRpbWVvdXQobG9hZFBpbnMsIDIwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkUGlucygpIHtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5tYXApIHtcclxuICAgICAgICAgICAgICAgIF9wbGFjZU15c2VsZigpO1xyXG4gICAgICAgICAgICAgICAgLy9nZXQgY3VycmVudCBsb2NhdGlvbiBhbmQgcGxhY2UgdXNlciBwaW5cclxuICAgICAgICAgICAgICAgIGlmIChcImdlb2xvY2F0aW9uXCIgaW4gbmF2aWdhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihfcGxvdExvY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX3BsYWNlTXlzZWxmKCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKFwiNDIuMjQwODQ1XCIsIFwiLTgzLjIzNDA5N1wiKTtcclxuICAgICAgICAgICAgaG9tZVZtLm15TWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJEYW1pYW4gU3Ryb25nXCIsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL3JlYm91bmQgdmlld1xyXG4gICAgICAgICAgICBob21lVm0uYm91bmRzLmV4dGVuZChsb2NhdGlvbik7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXAuZml0Qm91bmRzKGhvbWVWbS5ib3VuZHMpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vZHJvcCBwaW4gb24gbWFwIGZvciBsb2NhdGlvblxyXG4gICAgICAgIGZ1bmN0aW9uIF9wbG90TG9jYXRpb24ocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgLy9jcmVhdGUgbWFya2VyXHJcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgbWFwOiAkc2NvcGUubWFwLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiWW91IEFyZSBIZXJlXCIsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL3JlYm91bmQgdmlld1xyXG4gICAgICAgICAgICBob21lVm0uYm91bmRzLmV4dGVuZChsb2NhdGlvbik7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXAuZml0Qm91bmRzKGhvbWVWbS5ib3VuZHMpO1xyXG5cclxuICAgICAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUoe1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luOmxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb246IGhvbWVWbS5teU1hcmtlci5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLlRyYXZlbE1vZGUuRFJJVklOR1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXN1bHQsIHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcCgkc2NvcGUubWFwKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbG9hZFBpbnM6IGxvYWRQaW5zXHJcbiAgICAgICAgfTtcclxuICAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdNb3ZlQ3RybCcsIE1vdmVDdHJsKTtcclxuXHJcblx0TW92ZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnXTtcclxuXHJcblx0ZnVuY3Rpb24gTW92ZUN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdGltZW91dCkge1xyXG5cdFx0dmFyIG1vdmVhYmxlID0gdGhpcztcclxuXHRcdG1vdmVhYmxlLmRvdE51bSA9IDA7XHJcblx0XHRtb3ZlYWJsZS5zY29yZSA9IDA7XHJcblx0XHRtb3ZlYWJsZS5kb3RzID0gW107XHJcblx0XHQkKHdpbmRvdykua2V5ZG93bihfa2V5KTtcclxuXHJcblx0XHRmdW5jdGlvbiBfa2V5KGUpIHtcclxuXHRcdFx0aWYgKCQoJy5tb3ZlYWJsZScpLmxlbmd0aCkge1xyXG5cdFx0XHRcdHZhciBldmVudCA9IHdpbmRvdy5ldmVudCA/IHdpbmRvdy5ldmVudCA6IGU7XHJcblx0XHRcdFx0c3dpdGNoIChldmVudC5rZXlDb2RlKSB7XHJcblx0XHRcdFx0XHRjYXNlIDM3OiAvL2xlZnRcclxuXHRcdFx0XHRcdFx0X21vdmUoJ2wnKTtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMzg6IC8vdXBcclxuXHRcdFx0XHRcdFx0X21vdmUoJ3UnKTtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgMzk6IC8vcmlnaHRcclxuXHRcdFx0XHRcdFx0X21vdmUoJ3InKTtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgNDA6IC8vZG93blxyXG5cdFx0XHRcdFx0XHRfbW92ZSgnZCcpO1xyXG5cdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gX21vdmUoZGlyZWN0aW9uKSB7XHJcblx0XHRcdFx0dmFyIHNwZWVkID0gMTY7XHJcblx0XHRcdFx0dmFyIG1heERvdHMgPSAzO1xyXG5cdFx0XHRcdHZhciBzaXplID0gJCgnLm1vdmVhYmxlJykuaGVpZ2h0KCk7XHJcblx0XHRcdFx0dmFyIGNoYXJhY3RlciA9ICQoJy5tb3ZlYWJsZScpO1xyXG5cdFx0XHRcdC8vZ2V0IGN1cnJlbnQgcG9zaXRpb25cclxuXHRcdFx0XHR2YXIgcG9zID0gY2hhcmFjdGVyLm9mZnNldCgpO1xyXG5cdFx0XHRcdC8vbW9kaWZ5IGJ5IHNwZWVkIGFuZCBkaXJlY3Rpb25cclxuXHRcdFx0XHRzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG5cdFx0XHRcdFx0Y2FzZSAnbCc6XHJcblx0XHRcdFx0XHRcdGlmIChwb3MubGVmdCAtIHNwZWVkID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdGNoYXJhY3Rlci5vZmZzZXQoeyBsZWZ0OiBwb3MubGVmdCAtIHNwZWVkIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGNoYXJhY3Rlci5vZmZzZXQoeyBsZWZ0OiAwIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAncic6XHJcblx0XHRcdFx0XHRcdGlmIChwb3MubGVmdCArIChzaXplICsgc3BlZWQgKyAyMCkgPCB3aW5kb3cuaW5uZXJXaWR0aCkge1xyXG5cdFx0XHRcdFx0XHRcdGNoYXJhY3Rlci5vZmZzZXQoeyBsZWZ0OiBwb3MubGVmdCArIHNwZWVkIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGNoYXJhY3Rlci5vZmZzZXQoeyBsZWZ0OiB3aW5kb3cuaW5uZXJXaWR0aCAtIChzaXplICsgMjApIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSAndSc6XHJcblx0XHRcdFx0XHRcdGlmIChwb3MudG9wIC0gc3BlZWQgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IHRvcDogcG9zLnRvcCAtIHNwZWVkIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGNoYXJhY3Rlci5vZmZzZXQoeyB0b3A6IDAgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdkJzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy50b3AgKyAoc2l6ZSArIHNwZWVkKSA8IHdpbmRvdy5pbm5lckhlaWdodCkge1xyXG5cdFx0XHRcdFx0XHRcdGNoYXJhY3Rlci5vZmZzZXQoeyB0b3A6IHBvcy50b3AgKyBzcGVlZCB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFyYWN0ZXIub2Zmc2V0KHsgdG9wOiB3aW5kb3cuaW5uZXJIZWlnaHQgLSBzaXplIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvL3NwYXduIGRvdCBvbiBmaXJzdCBtb3ZlXHJcblx0XHRcdFx0aWYgKG1vdmVhYmxlLmRvdHMubGVuZ3RoIDwgbWF4RG90cykge1xyXG5cdFx0XHRcdFx0X3NwYXduRG90KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbW92ZWFibGUuZG90cy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdFx0X2NoZWNrQ29sbGlzaW9uKG1vdmVhYmxlLmRvdHNbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9jaGVja0NvbGxpc2lvbihkb3QpIHtcclxuXHRcdFx0dmFyIGRiZHMgPSBfZ2V0Qm91bmRzKGRvdC5pZCk7XHJcblx0XHRcdHZhciBjYmRzID0gX2dldEJvdW5kcyhcIi5tb3ZlYWJsZVwiKTtcclxuXHRcdFx0Ly9jaGVjayBmb3IgY29sbGlzaW9uIHdpdGggZG90XHJcblx0XHRcdHZhciBjb2xzID0gY29sbGlkZShkYmRzLCBjYmRzKTtcclxuXHRcdFx0aWYgKGNvbHMpIHtcclxuXHRcdFx0XHRfa2lsbERvdChkb3QpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gY29sbGlkZShhLCBiKSB7XHJcblx0XHRcdHJldHVybiAoYS5sZWZ0IDwgYi5sZWZ0ICsgYi53aWR0aCAmJiBhLmxlZnQgKyBhLndpZHRoID4gYi5sZWZ0ICYmXHJcblx0XHRhLnRvcCA8IGIudG9wICsgYi5oZWlnaHQgJiYgYS50b3AgKyBhLmhlaWdodCA+IGIudG9wKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIF9zcGF3bkRvdCgpIHtcclxuXHRcdFx0dmFyIGRvdCA9IHtcclxuXHRcdFx0XHRhbGl2ZTogdHJ1ZSxcclxuXHRcdFx0XHRwb3M6IF9kb3RQb3MsXHJcblx0XHRcdFx0aWQ6IFwiLmRvdFwiICsgbW92ZWFibGUuZG90TnVtXHJcblx0XHRcdH07XHJcblx0XHRcdC8vYWRkIG5ldyBkb3QgdG8gYXJyYXlcclxuXHRcdFx0bW92ZWFibGUuZG90cy5wdXNoKGRvdCk7XHJcblx0XHRcdCQoXCIuZG90c1wiKS5hcHBlbmQoJzxkaXYgY2xhc3M9XCJkb3QgZG90JyArIG1vdmVhYmxlLmRvdE51bSArICdcIiBuZy1zaG93PVwiZG90LmFsaXZlXCI+PC9kaXY+Jyk7XHJcblx0XHRcdG1vdmVhYmxlLmRvdE51bSsrO1xyXG5cdFx0XHQvL3BvcHVsYXRlIGlkIG9mIGRvdCBmb3IgcmVmZXJlbmNlXHJcblx0XHRcdCRzY29wZS4kZGlnZXN0KCk7XHJcblx0XHRcdC8vc2V0IG5ldyBkb3RzIHBvc2l0aW9uXHJcblx0XHRcdHZhciBuZXdEb3QgPSAkKGRvdC5pZCk7XHJcblx0XHRcdHZhciB0b3BSID0gTWF0aC5hYnMoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJIZWlnaHQgLSBuZXdEb3QuaGVpZ2h0KCkpKTtcclxuXHRcdFx0dmFyIGxlZnRSID0gTWF0aC5hYnMoTWF0aC5yYW5kb20oKSAqICh3aW5kb3cuaW5uZXJIZWlnaHQgLSBuZXdEb3QuaGVpZ2h0KCkgLSAyMCkpO1xyXG5cdFx0XHRuZXdEb3Qub2Zmc2V0KHsgdG9wOiB0b3BSLCBsZWZ0OiBsZWZ0UiB9KTtcclxuXHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBfa2lsbERvdChkb3QpIHtcclxuXHRcdFx0Ly9pbmNyZWFzZSBzY29yZSBhbmQga2lsbCBkb3RcclxuXHRcdFx0bW92ZWFibGUuc2NvcmUrKztcclxuXHRcdFx0ZG90LmFsaXZlID0gZmFsc2U7XHJcblx0XHRcdHZhciBpbmRleCA9IG1vdmVhYmxlLmRvdHMuaW5kZXhPZihkb3QpO1xyXG5cdFx0XHRtb3ZlYWJsZS5kb3RzLnNwbGljZShpbmRleCwgMSk7XHJcblx0XHRcdCQoZG90LmlkKS5yZW1vdmUoKTtcclxuXHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBfZG90UG9zKGRvdCkge1xyXG5cdFx0XHRyZXR1cm4gJChkb3QuaWQpLm9mZnNldCgpO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gX2dldEJvdW5kcyhvYmopIHtcclxuXHRcdFx0Ly9yZXR1cm4gYm91bmRzIG9mIGRvdFxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGxlZnQ6ICQob2JqKS5vZmZzZXQoKS5sZWZ0LFxyXG5cdFx0XHRcdHJpZ2h0OiAkKG9iaikub2Zmc2V0KCkubGVmdCArICQob2JqKS53aWR0aCgpLFxyXG5cdFx0XHRcdHRvcDogJChvYmopLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0XHRib3R0b206ICQob2JqKS5vZmZzZXQoKS50b3AgKyAkKG9iaikuaGVpZ2h0KCksXHJcblx0XHRcdFx0d2lkdGg6ICQob2JqKS53aWR0aCgpLFxyXG5cdFx0XHRcdGhlaWdodDogJChvYmopLmhlaWdodCgpXHJcblx0XHRcdH07XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignUG9ydGZvbGlvQ3RybCcsIFBvcnRmb2xpb0N0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBvcnRmb2xpb0N0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIHBvcnRmb2xpb1ZtID0gdGhpcztcclxuICAgICAgICBwb3J0Zm9saW9WbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiUG9ydGZvbGlvXCI7XHJcbiAgICB9XHJcblxyXG4gICAgUG9ydGZvbGlvQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyR0aW1lb3V0J107XHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9