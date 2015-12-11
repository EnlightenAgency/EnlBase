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

    config.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];

    function run() {

    }
    function config($urlProvider, $locationProvider, $stateProvider) {
        $urlProvider.when('', '/');     

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
			var cols = collide(dbds, cbds)
			if (cols) {
				_killDot()
			}
		}

		function collide(a, b) {
			return (a.left < b.left + b.width && a.left + a.width > b.left &&
		a.top < b.top + b.height && a.top + a.height > b.top);
		}
		function _spawnDot() {
			//if not visible make visible and choose random starting spot
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmN0cmwuanMiLCJjb250YWN0L2NvbnRhY3QuY3RybC5qcyIsImNvcmUvcGFnZS5jdHJsLmpzIiwiaG9tZS9ob21lLmN0cmwuanMiLCJob21lL21vdmVhYmxlLmpzIiwicG9ydGZvbGlvL3BvcnRmb2xpby5jdHJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImVubEJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJywgW1xuICAgICAgICAgICAgJ3VpLnJvdXRlcicsXG4gICAgICAgICAgICAnbmdBbmltYXRlJyxcbiAgICAgICAgICAgICdtbS5mb3VuZGF0aW9uJyxcbiAgICAgICAgICAgICd1aS5ldmVudCcsXG4gICAgICAgICAgICAndWkubWFwJ1xuICAgICAgICBdKVxuICAgIC5jb25maWcoY29uZmlnKVxuICAgIC5ydW4ocnVuKTtcblxuICAgIGNvbmZpZy4kaW5qZWN0ID0gWyckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHN0YXRlUHJvdmlkZXInXTtcblxuICAgIGZ1bmN0aW9uIHJ1bigpIHtcclxuXHJcbiAgICB9XG4gICAgZnVuY3Rpb24gY29uZmlnKCR1cmxQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHVybFByb3ZpZGVyLndoZW4oJycsICcvJyk7ICAgICBcblxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSkuaGFzaFByZWZpeCgnIScpO1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvaG9tZS9ob21lLnZpZXcuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2hvbWVWbSdcclxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2Fib3V0Jywge1xyXG4gICAgICAgICAgICB1cmw6ICcvYWJvdXQnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hYm91dC9hYm91dC52aWV3Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQWJvdXRDdHJsJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYWJvdXRWbSdcclxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2NvbnRhY3QnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9jb250YWN0JyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29udGFjdC9jb250YWN0LnZpZXcuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb250YWN0Q3RybCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NvbnRhY3RWbSdcclxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3BvcnRmb2xpbycsIHtcclxuICAgICAgICAgICAgdXJsOiAnL3BvcnRmb2xpbycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BvcnRmb2xpby9wb3J0Zm9saW8udmlldy5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1BvcnRmb2xpb0N0cmwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdwb3J0Zm9saW9WbSdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zdGF0ZSgnNDA0Jywge1xyXG4gICAgICAgICAgICB1cmw6ICcvNDA0JyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvNDA0LzQwNC52aWV3Lmh0bWwnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHVybFByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG4gICAgfVxyXG5cclxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Fib3V0Q3RybCcsIEFib3V0Q3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gQWJvdXRDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBhYm91dFZtID0gdGhpcztcclxuICAgICAgICBhYm91dFZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJBYm91dFwiO1xyXG4gICAgfVxyXG5cclxuICAgIEFib3V0Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyR0aW1lb3V0J107XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignQ29udGFjdEN0cmwnLCBDb250YWN0Q3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gQ29udGFjdEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIGNvbnRhY3RWbSA9IHRoaXM7XHJcbiAgICAgICAgY29udGFjdFZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJDb250YWN0XCI7XHJcbiAgICB9XHJcblxyXG4gICAgQ29udGFjdEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckdGltZW91dCddO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwJylcclxuICAgIC5jb250cm9sbGVyKCdQYWdlQ3RybCcsIFBhZ2VDdHJsKTtcclxuXHJcbiAgICBQYWdlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyRzdGF0ZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBhZ2VDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkc3RhdGUpIHtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXM7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIHBhZ2UuZ2V0Q2xhc3MgPSBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoJHN0YXRlLmN1cnJlbnQubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdhY3RpdmUnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignSG9tZUN0cmwnLCBIb21lQ3RybCk7XHJcblxyXG4gICAgSG9tZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnXTtcclxuXHJcbiAgICAgZnVuY3Rpb24gSG9tZUN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBob21lVm0gPSB0aGlzO1xyXG4gICAgICAgIGhvbWVWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgaG9tZVZtLmxvYWRQaW5zID0gbG9hZFBpbnMoKTtcclxuICAgICAgICBob21lVm0ubXlNYXJrZXIgPSB7fTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJIb21lXCI7XHJcblxyXG4gICAgICAgIHZhciBkZWZhdWx0TGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNy4wOTAyNCwgLTk1LjcxMjg5MSk7XHJcbiAgICAgICAgdmFyIGRpcmVjdGlvbnNEaXNwbGF5ID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcih7XHJcbiAgICAgICAgICAgIHN1cHByZXNzTWFya2VyczogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBkaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xyXG4gICAgICAgIHZhciB0cmFmZmljTGF5ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuVHJhZmZpY0xheWVyKCk7XHJcblxyXG4gICAgICAgIGhvbWVWbS5tYXBPcHRpb25zID0ge1xyXG4gICAgICAgICAgICB6b29tOiA0LFxyXG4gICAgICAgICAgICBjZW50ZXI6IGRlZmF1bHRMYXRMbmcsXHJcbiAgICAgICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcclxuICAgICAgICAgICAgbmF2aWdhdGlvbkNvbnRyb2w6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY2FsZUNvbnRyb2w6IGZhbHNlLFxyXG4gICAgICAgICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lcih3aW5kb3csIFwicmVzaXplXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNlbnRlciA9ICRzY29wZS5tYXAuZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIoJHNjb3BlLm1hcCwgXCJyZXNpemVcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXAuc2V0Q2VudGVyKGNlbnRlcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGluaXQoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAgICAgJHRpbWVvdXQobG9hZFBpbnMsIDIwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkUGlucygpIHtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5tYXApIHtcclxuICAgICAgICAgICAgICAgIF9wbGFjZU15c2VsZigpO1xyXG4gICAgICAgICAgICAgICAgLy9nZXQgY3VycmVudCBsb2NhdGlvbiBhbmQgcGxhY2UgdXNlciBwaW5cclxuICAgICAgICAgICAgICAgIGlmIChcImdlb2xvY2F0aW9uXCIgaW4gbmF2aWdhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihfcGxvdExvY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX3BsYWNlTXlzZWxmKCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKFwiNDIuMjQwODQ1XCIsIFwiLTgzLjIzNDA5N1wiKTtcclxuICAgICAgICAgICAgaG9tZVZtLm15TWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJEYW1pYW4gU3Ryb25nXCIsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL3JlYm91bmQgdmlld1xyXG4gICAgICAgICAgICBob21lVm0uYm91bmRzLmV4dGVuZChsb2NhdGlvbik7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXAuZml0Qm91bmRzKGhvbWVWbS5ib3VuZHMpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vZHJvcCBwaW4gb24gbWFwIGZvciBsb2NhdGlvblxyXG4gICAgICAgIGZ1bmN0aW9uIF9wbG90TG9jYXRpb24ocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgLy9jcmVhdGUgbWFya2VyXHJcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgbWFwOiAkc2NvcGUubWFwLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiWW91IEFyZSBIZXJlXCIsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL3JlYm91bmQgdmlld1xyXG4gICAgICAgICAgICBob21lVm0uYm91bmRzLmV4dGVuZChsb2NhdGlvbik7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXAuZml0Qm91bmRzKGhvbWVWbS5ib3VuZHMpO1xyXG5cclxuICAgICAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUoe1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luOmxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb246IGhvbWVWbS5teU1hcmtlci5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLlRyYXZlbE1vZGUuRFJJVklOR1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXN1bHQsIHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcCgkc2NvcGUubWFwKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbG9hZFBpbnM6IGxvYWRQaW5zXHJcbiAgICAgICAgfTtcclxuICAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdNb3ZlQ3RybCcsIE1vdmVDdHJsKTtcclxuXHJcblx0TW92ZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnXTtcclxuXHJcblx0ZnVuY3Rpb24gTW92ZUN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdGltZW91dCkge1xyXG5cdFx0dmFyIG1vdmVhYmxlID0gdGhpcztcclxuXHRcdHZhciBkb3QgPSB7XHJcblx0XHRcdGFsaXZlOiBmYWxzZSxcclxuXHRcdFx0cG9zOiBfZG90UG9zXHJcblx0XHR9XHJcblx0XHRtb3ZlYWJsZS5zY29yZSA9IDA7XHJcblx0XHRtb3ZlYWJsZS5kb3QgPSBkb3Q7XHJcblx0XHQkKHdpbmRvdykua2V5ZG93bihfa2V5KTtcclxuXHJcblx0XHRmdW5jdGlvbiBfa2V5KGUpIHtcclxuXHRcdFx0dmFyIGV2ZW50ID0gd2luZG93LmV2ZW50ID8gd2luZG93LmV2ZW50IDogZTtcclxuXHRcdFx0c3dpdGNoIChldmVudC5rZXlDb2RlKSB7XHJcblx0XHRcdFx0Y2FzZSAzNzogLy9sZWZ0XHJcblx0XHRcdFx0XHRfbW92ZSgnbCcpO1xyXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAzODogLy91cFxyXG5cdFx0XHRcdFx0X21vdmUoJ3UnKTtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgMzk6IC8vcmlnaHRcclxuXHRcdFx0XHRcdF9tb3ZlKCdyJyk7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDQwOiAvL2Rvd25cclxuXHRcdFx0XHRcdF9tb3ZlKCdkJyk7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZnVuY3Rpb24gX21vdmUoZGlyZWN0aW9uKSB7XHJcblx0XHRcdFx0dmFyIHNwZWVkID0gMTY7XHJcblx0XHRcdFx0dmFyIHNpemUgPSAkKCcubW92ZWFibGUnKS5oZWlnaHQoKTtcclxuXHRcdFx0XHR2YXIgY2hhcmFjdGVyID0gJCgnLm1vdmVhYmxlJyk7XHJcblx0XHRcdFx0Ly9nZXQgY3VycmVudCBwb3NpdGlvblxyXG5cdFx0XHRcdHZhciBwb3MgPSBjaGFyYWN0ZXIub2Zmc2V0KCk7XHJcblx0XHRcdFx0Ly9tb2RpZnkgYnkgc3BlZWQgYW5kIGRpcmVjdGlvblxyXG5cdFx0XHRcdHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcblx0XHRcdFx0XHRjYXNlICdsJzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy5sZWZ0IC0gc3BlZWQgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHBvcy5sZWZ0IC0gc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IDAgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdyJzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy5sZWZ0ICsgKHNpemUgKyBzcGVlZCArIDIwKSA8IHdpbmRvdy5pbm5lcldpZHRoKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHBvcy5sZWZ0ICsgc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHdpbmRvdy5pbm5lcldpZHRoIC0gKHNpemUgKyAyMCkgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd1JzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy50b3AgLSBzcGVlZCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFyYWN0ZXIub2Zmc2V0KHsgdG9wOiBwb3MudG9wIC0gc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IHRvcDogMCB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2QnOlxyXG5cdFx0XHRcdFx0XHRpZiAocG9zLnRvcCArIChzaXplICsgc3BlZWQpIDwgd2luZG93LmlubmVySGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IHRvcDogcG9zLnRvcCArIHNwZWVkIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGNoYXJhY3Rlci5vZmZzZXQoeyB0b3A6IHdpbmRvdy5pbm5lckhlaWdodCAtIHNpemUgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vc3Bhd24gZG90IG9uIGZpcnN0IG1vdmVcclxuXHRcdFx0XHRfc3Bhd25Eb3QoKTtcclxuXHRcdFx0XHRfY2hlY2tDb2xsaXNpb24oKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9jaGVja0NvbGxpc2lvbigpIHtcclxuXHRcdFx0dmFyIGRiZHMgPSBfZ2V0Qm91bmRzKFwiLmRvdFwiKTtcclxuXHRcdFx0dmFyIGNiZHMgPSBfZ2V0Qm91bmRzKFwiLm1vdmVhYmxlXCIpO1xyXG5cdFx0XHQvL2NoZWNrIGZvciBjb2xsaXNpb24gd2l0aCBkb3RcclxuXHRcdFx0dmFyIGNvbHMgPSBjb2xsaWRlKGRiZHMsIGNiZHMpXHJcblx0XHRcdGlmIChjb2xzKSB7XHJcblx0XHRcdFx0X2tpbGxEb3QoKVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gY29sbGlkZShhLCBiKSB7XHJcblx0XHRcdHJldHVybiAoYS5sZWZ0IDwgYi5sZWZ0ICsgYi53aWR0aCAmJiBhLmxlZnQgKyBhLndpZHRoID4gYi5sZWZ0ICYmXHJcblx0XHRhLnRvcCA8IGIudG9wICsgYi5oZWlnaHQgJiYgYS50b3AgKyBhLmhlaWdodCA+IGIudG9wKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIF9zcGF3bkRvdCgpIHtcclxuXHRcdFx0Ly9pZiBub3QgdmlzaWJsZSBtYWtlIHZpc2libGUgYW5kIGNob29zZSByYW5kb20gc3RhcnRpbmcgc3BvdFxyXG5cdFx0XHRpZiAoIW1vdmVhYmxlLmRvdC5hbGl2ZSkge1xyXG5cdFx0XHRcdG1vdmVhYmxlLmRvdC5hbGl2ZSA9IHRydWU7XHJcblx0XHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcclxuXHRcdFx0XHR2YXIgbmV3RG90ID0gJChcIi5kb3RcIik7XHJcblx0XHRcdFx0dmFyIHRvcFIgPSBNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lckhlaWdodCAtIG5ld0RvdC5oZWlnaHQoKSlcclxuXHRcdFx0XHR2YXIgbGVmdFIgPSBNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lckhlaWdodCAtIG5ld0RvdC5oZWlnaHQoKSAtIDIwKVxyXG5cdFx0XHRcdG5ld0RvdC5vZmZzZXQoeyB0b3A6IHRvcFIsIGxlZnQ6IGxlZnRSIH0pXHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBfa2lsbERvdCgpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJDb2xsaWRlcyFcIilcclxuXHRcdFx0Ly9pbmNyZWFzZSBzY29yZSBhbmQga2lsbCBkb3RcclxuXHRcdFx0bW92ZWFibGUuc2NvcmUrKztcclxuXHRcdFx0bW92ZWFibGUuZG90LmFsaXZlID0gZmFsc2U7XHJcblx0XHRcdCRzY29wZS4kZGlnZXN0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2RvdFBvcygpIHtcclxuXHRcdFx0cmV0dXJuICQoJy5kb3QnKS5vZmZzZXQoKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIF9nZXRCb3VuZHMob2JqKSB7XHJcblx0XHRcdC8vcmV0dXJuIGJvdW5kcyBvZiBkb3RcclxuXHRcdFx0dmFyIGJvdW5kcyA9IHtcclxuXHRcdFx0XHRsZWZ0OiAkKG9iaikub2Zmc2V0KCkubGVmdCxcclxuXHRcdFx0XHRyaWdodDogJChvYmopLm9mZnNldCgpLmxlZnQgKyAkKG9iaikud2lkdGgoKSxcclxuXHRcdFx0XHR0b3A6ICQob2JqKS5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0Ym90dG9tOiAkKG9iaikub2Zmc2V0KCkudG9wICsgJChvYmopLmhlaWdodCgpLFxyXG5cdFx0XHRcdHdpZHRoOiAkKG9iaikud2lkdGgoKSxcclxuXHRcdFx0XHRoZWlnaHQ6ICQob2JqKS5oZWlnaHQoKVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBib3VuZHM7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignUG9ydGZvbGlvQ3RybCcsIFBvcnRmb2xpb0N0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBvcnRmb2xpb0N0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIHBvcnRmb2xpb1ZtID0gdGhpcztcclxuICAgICAgICBwb3J0Zm9saW9WbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiUG9ydGZvbGlvXCI7XHJcbiAgICB9XHJcblxyXG4gICAgUG9ydGZvbGlvQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyR0aW1lb3V0J107XHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9