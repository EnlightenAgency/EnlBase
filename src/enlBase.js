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
		moveable.dotNum = 0;
		moveable.score = 0;
		moveable.dots = [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmN0cmwuanMiLCJjb250YWN0L2NvbnRhY3QuY3RybC5qcyIsImNvcmUvcGFnZS5jdHJsLmpzIiwiaG9tZS9ob21lLmN0cmwuanMiLCJob21lL21vdmVhYmxlLmpzIiwicG9ydGZvbGlvL3BvcnRmb2xpby5jdHJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZW5sQmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxuICAgICAgICAubW9kdWxlKCdhcHAnLCBbXG4gICAgICAgICAgICAndWkucm91dGVyJyxcbiAgICAgICAgICAgICduZ0FuaW1hdGUnLFxuICAgICAgICAgICAgJ21tLmZvdW5kYXRpb24nLFxuICAgICAgICAgICAgJ3VpLmV2ZW50JyxcbiAgICAgICAgICAgICd1aS5tYXAnXG4gICAgICAgIF0pXG4gICAgLmNvbmZpZyhjb25maWcpXG4gICAgLnJ1bihydW4pO1xuXG4gICAgY29uZmlnLiRpbmplY3QgPSBbJyR1cmxSb3V0ZXJQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsICckc3RhdGVQcm92aWRlciddO1xuXG4gICAgZnVuY3Rpb24gcnVuKCkge1xyXG5cclxuICAgIH1cbiAgICBmdW5jdGlvbiBjb25maWcoJHVybFByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICAkdXJsUHJvdmlkZXIud2hlbignJywgJy8nKTsgICAgIFxuXG4gICAgICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKS5oYXNoUHJlZml4KCchJyk7XG5cbiAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoJ2hvbWUnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy8nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9ob21lL2hvbWUudmlldy5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnaG9tZVZtJ1xyXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnYWJvdXQnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9hYm91dCcsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2Fib3V0L2Fib3V0LnZpZXcuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBYm91dEN0cmwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhYm91dFZtJ1xyXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnY29udGFjdCcsIHtcclxuICAgICAgICAgICAgdXJsOiAnL2NvbnRhY3QnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jb250YWN0L2NvbnRhY3Qudmlldy5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NvbnRhY3RDdHJsJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnY29udGFjdFZtJ1xyXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgncG9ydGZvbGlvJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvcG9ydGZvbGlvJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvcG9ydGZvbGlvL3BvcnRmb2xpby52aWV3Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUG9ydGZvbGlvQ3RybCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3BvcnRmb2xpb1ZtJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnN0YXRlKCc0MDQnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy80MDQnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC80MDQvNDA0LnZpZXcuaHRtbCdcclxuICAgICAgICB9KTtcclxuICAgICAgICAkdXJsUHJvdmlkZXIub3RoZXJ3aXNlKCcvJyk7XHJcbiAgICB9XHJcblxyXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignQWJvdXRDdHJsJywgQWJvdXRDdHJsKTtcclxuXHJcbiAgICBmdW5jdGlvbiBBYm91dEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIGFib3V0Vm0gPSB0aGlzO1xyXG4gICAgICAgIGFib3V0Vm0uYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpO1xyXG4gICAgICAgICRyb290U2NvcGUudGl0bGUgPSBcIkFib3V0XCI7XHJcbiAgICB9XHJcblxyXG4gICAgQWJvdXRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywnJHRpbWVvdXQnXTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdDb250YWN0Q3RybCcsIENvbnRhY3RDdHJsKTtcclxuXHJcbiAgICBmdW5jdGlvbiBDb250YWN0Q3RybCgkc2NvcGUsICRyb290U2NvcGUsJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgY29udGFjdFZtID0gdGhpcztcclxuICAgICAgICBjb250YWN0Vm0uYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpO1xyXG4gICAgICAgICRyb290U2NvcGUudGl0bGUgPSBcIkNvbnRhY3RcIjtcclxuICAgIH1cclxuXHJcbiAgICBDb250YWN0Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyR0aW1lb3V0J107XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgLmNvbnRyb2xsZXIoJ1BhZ2VDdHJsJywgUGFnZUN0cmwpO1xyXG5cclxuICAgIFBhZ2VDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywnJHN0YXRlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gUGFnZUN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCRzdGF0ZSkge1xyXG4gICAgICAgIHZhciBwYWdlID0gdGhpcztcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJcIjtcclxuXHJcbiAgICAgICAgcGFnZS5nZXRDbGFzcyA9IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGlmICgkc3RhdGUuY3VycmVudC5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2FjdGl2ZSc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdIb21lQ3RybCcsIEhvbWVDdHJsKTtcclxuXHJcbiAgICBIb21lQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckdGltZW91dCddO1xyXG5cclxuICAgICBmdW5jdGlvbiBIb21lQ3RybCgkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIGhvbWVWbSA9IHRoaXM7XHJcbiAgICAgICAgaG9tZVZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICBob21lVm0ubG9hZFBpbnMgPSBsb2FkUGlucygpO1xyXG4gICAgICAgIGhvbWVWbS5teU1hcmtlciA9IHt9O1xyXG4gICAgICAgICRyb290U2NvcGUudGl0bGUgPSBcIkhvbWVcIjtcclxuXHJcbiAgICAgICAgdmFyIGRlZmF1bHRMYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDM3LjA5MDI0LCAtOTUuNzEyODkxKTtcclxuICAgICAgICB2YXIgZGlyZWN0aW9uc0Rpc3BsYXkgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyKHtcclxuICAgICAgICAgICAgc3VwcHJlc3NNYXJrZXJzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGRpcmVjdGlvbnNTZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTZXJ2aWNlKCk7XHJcbiAgICAgICAgdmFyIHRyYWZmaWNMYXllciA9IG5ldyBnb29nbGUubWFwcy5UcmFmZmljTGF5ZXIoKTtcclxuXHJcbiAgICAgICAgaG9tZVZtLm1hcE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHpvb206IDQsXHJcbiAgICAgICAgICAgIGNlbnRlcjogZGVmYXVsdExhdExuZyxcclxuICAgICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgc2Nyb2xsd2hlZWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBuYXZpZ2F0aW9uQ29udHJvbDogZmFsc2UsXHJcbiAgICAgICAgICAgIHNjYWxlQ29udHJvbDogZmFsc2UsXHJcbiAgICAgICAgICAgIG1hcFR5cGVDb250cm9sOiBmYWxzZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZERvbUxpc3RlbmVyKHdpbmRvdywgXCJyZXNpemVcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY2VudGVyID0gJHNjb3BlLm1hcC5nZXRDZW50ZXIoKTtcclxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlcigkc2NvcGUubWFwLCBcInJlc2l6ZVwiKTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5zZXRDZW50ZXIoY2VudGVyKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaW5pdCgpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICAkdGltZW91dChsb2FkUGlucywgMjAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRQaW5zKCkge1xyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLm1hcCkge1xyXG4gICAgICAgICAgICAgICAgX3BsYWNlTXlzZWxmKCk7XHJcbiAgICAgICAgICAgICAgICAvL2dldCBjdXJyZW50IGxvY2F0aW9uIGFuZCBwbGFjZSB1c2VyIHBpblxyXG4gICAgICAgICAgICAgICAgaWYgKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKF9wbG90TG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfcGxhY2VNeXNlbGYoKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoXCI0Mi4yNDA4NDVcIiwgXCItODMuMjM0MDk3XCIpO1xyXG4gICAgICAgICAgICBob21lVm0ubXlNYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsb2NhdGlvbixcclxuICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRhbWlhbiBTdHJvbmdcIixcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1BcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vcmVib3VuZCB2aWV3XHJcbiAgICAgICAgICAgIGhvbWVWbS5ib3VuZHMuZXh0ZW5kKGxvY2F0aW9uKTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5maXRCb3VuZHMoaG9tZVZtLmJvdW5kcyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy9kcm9wIHBpbiBvbiBtYXAgZm9yIGxvY2F0aW9uXHJcbiAgICAgICAgZnVuY3Rpb24gX3Bsb3RMb2NhdGlvbihwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAvL2NyZWF0ZSBtYXJrZXJcclxuICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJZb3UgQXJlIEhlcmVcIixcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1BcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vcmVib3VuZCB2aWV3XHJcbiAgICAgICAgICAgIGhvbWVWbS5ib3VuZHMuZXh0ZW5kKGxvY2F0aW9uKTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5maXRCb3VuZHMoaG9tZVZtLmJvdW5kcyk7XHJcblxyXG4gICAgICAgICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZSh7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW46bG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogaG9tZVZtLm15TWFya2VyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuVHJhdmVsTW9kZS5EUklWSU5HXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3VsdCwgc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKCRzY29wZS5tYXApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsb2FkUGluczogbG9hZFBpbnNcclxuICAgICAgICB9O1xyXG4gICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0YW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ01vdmVDdHJsJywgTW92ZUN0cmwpO1xyXG5cclxuXHRNb3ZlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsICckdGltZW91dCddO1xyXG5cclxuXHRmdW5jdGlvbiBNb3ZlQ3RybCgkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0KSB7XHJcblx0XHR2YXIgbW92ZWFibGUgPSB0aGlzO1xyXG5cdFx0bW92ZWFibGUuZG90TnVtID0gMDtcclxuXHRcdG1vdmVhYmxlLnNjb3JlID0gMDtcclxuXHRcdG1vdmVhYmxlLmRvdHMgPSBbXTtcclxuXHRcdCQod2luZG93KS5rZXlkb3duKF9rZXkpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIF9rZXkoZSkge1xyXG5cdFx0XHR2YXIgZXZlbnQgPSB3aW5kb3cuZXZlbnQgPyB3aW5kb3cuZXZlbnQgOiBlO1xyXG5cdFx0XHRzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcclxuXHRcdFx0XHRjYXNlIDM3OiAvL2xlZnRcclxuXHRcdFx0XHRcdF9tb3ZlKCdsJyk7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIDM4OiAvL3VwXHJcblx0XHRcdFx0XHRfbW92ZSgndScpO1xyXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0Y2FzZSAzOTogLy9yaWdodFxyXG5cdFx0XHRcdFx0X21vdmUoJ3InKTtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgNDA6IC8vZG93blxyXG5cdFx0XHRcdFx0X21vdmUoJ2QnKTtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBfbW92ZShkaXJlY3Rpb24pIHtcclxuXHRcdFx0XHR2YXIgc3BlZWQgPSAxNjtcclxuXHRcdFx0XHR2YXIgbWF4RG90cyA9IDM7XHJcblx0XHRcdFx0dmFyIHNpemUgPSAkKCcubW92ZWFibGUnKS5oZWlnaHQoKTtcclxuXHRcdFx0XHR2YXIgY2hhcmFjdGVyID0gJCgnLm1vdmVhYmxlJyk7XHJcblx0XHRcdFx0Ly9nZXQgY3VycmVudCBwb3NpdGlvblxyXG5cdFx0XHRcdHZhciBwb3MgPSBjaGFyYWN0ZXIub2Zmc2V0KCk7XHJcblx0XHRcdFx0Ly9tb2RpZnkgYnkgc3BlZWQgYW5kIGRpcmVjdGlvblxyXG5cdFx0XHRcdHN3aXRjaCAoZGlyZWN0aW9uKSB7XHJcblx0XHRcdFx0XHRjYXNlICdsJzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy5sZWZ0IC0gc3BlZWQgPiAwKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHBvcy5sZWZ0IC0gc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IDAgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICdyJzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy5sZWZ0ICsgKHNpemUgKyBzcGVlZCArIDIwKSA8IHdpbmRvdy5pbm5lcldpZHRoKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHBvcy5sZWZ0ICsgc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IGxlZnQ6IHdpbmRvdy5pbm5lcldpZHRoIC0gKHNpemUgKyAyMCkgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlICd1JzpcclxuXHRcdFx0XHRcdFx0aWYgKHBvcy50b3AgLSBzcGVlZCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRjaGFyYWN0ZXIub2Zmc2V0KHsgdG9wOiBwb3MudG9wIC0gc3BlZWQgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IHRvcDogMCB9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgJ2QnOlxyXG5cdFx0XHRcdFx0XHRpZiAocG9zLnRvcCArIChzaXplICsgc3BlZWQpIDwgd2luZG93LmlubmVySGVpZ2h0KSB7XHJcblx0XHRcdFx0XHRcdFx0Y2hhcmFjdGVyLm9mZnNldCh7IHRvcDogcG9zLnRvcCArIHNwZWVkIH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGNoYXJhY3Rlci5vZmZzZXQoeyB0b3A6IHdpbmRvdy5pbm5lckhlaWdodCAtIHNpemUgfSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vc3Bhd24gZG90IG9uIGZpcnN0IG1vdmVcclxuXHRcdFx0XHRpZiAobW92ZWFibGUuZG90cy5sZW5ndGggPCBtYXhEb3RzKSB7XHJcblx0XHRcdFx0XHRfc3Bhd25Eb3QoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb3ZlYWJsZS5kb3RzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRfY2hlY2tDb2xsaXNpb24obW92ZWFibGUuZG90c1tpXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZnVuY3Rpb24gX2NoZWNrQ29sbGlzaW9uKGRvdCkge1xyXG5cdFx0XHR2YXIgZGJkcyA9IF9nZXRCb3VuZHMoZG90LmlkKTtcclxuXHRcdFx0dmFyIGNiZHMgPSBfZ2V0Qm91bmRzKFwiLm1vdmVhYmxlXCIpO1xyXG5cdFx0XHQvL2NoZWNrIGZvciBjb2xsaXNpb24gd2l0aCBkb3RcclxuXHRcdFx0dmFyIGNvbHMgPSBjb2xsaWRlKGRiZHMsIGNiZHMpO1xyXG5cdFx0XHRpZiAoY29scykge1xyXG5cdFx0XHRcdF9raWxsRG90KGRvdCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBjb2xsaWRlKGEsIGIpIHtcclxuXHRcdFx0cmV0dXJuIChhLmxlZnQgPCBiLmxlZnQgKyBiLndpZHRoICYmIGEubGVmdCArIGEud2lkdGggPiBiLmxlZnQgJiZcclxuXHRcdGEudG9wIDwgYi50b3AgKyBiLmhlaWdodCAmJiBhLnRvcCArIGEuaGVpZ2h0ID4gYi50b3ApO1xyXG5cdFx0fVxyXG5cdFx0ZnVuY3Rpb24gX3NwYXduRG90KCkge1xyXG5cdFx0XHR2YXIgZG90ID0ge1xyXG5cdFx0XHRcdGFsaXZlOiB0cnVlLFxyXG5cdFx0XHRcdHBvczogX2RvdFBvcyxcclxuXHRcdFx0XHRpZDogXCIuZG90XCIgKyBtb3ZlYWJsZS5kb3ROdW1cclxuXHRcdFx0fTtcclxuXHRcdFx0Ly9hZGQgbmV3IGRvdCB0byBhcnJheVxyXG5cdFx0XHRtb3ZlYWJsZS5kb3RzLnB1c2goZG90KTtcdFx0XHRcclxuXHRcdFx0JChcIi5kb3RzXCIpLmFwcGVuZCgnPGRpdiBjbGFzcz1cImRvdCBkb3QnICsgbW92ZWFibGUuZG90TnVtICsgJ1wiIG5nLXNob3c9XCJkb3QuYWxpdmVcIj48L2Rpdj4nKTtcclxuXHRcdFx0bW92ZWFibGUuZG90TnVtKys7XHJcblx0XHRcdC8vcG9wdWxhdGUgaWQgb2YgZG90IGZvciByZWZlcmVuY2VcclxuXHRcdFx0JHNjb3BlLiRkaWdlc3QoKTtcclxuXHRcdFx0Ly9zZXQgbmV3IGRvdHMgcG9zaXRpb25cclxuXHRcdFx0dmFyIG5ld0RvdCA9ICQoZG90LmlkKTtcclxuXHRcdFx0dmFyIHRvcFIgPSBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lckhlaWdodCAtIG5ld0RvdC5oZWlnaHQoKSkpO1xyXG5cdFx0XHR2YXIgbGVmdFIgPSBNYXRoLmFicyhNYXRoLnJhbmRvbSgpICogKHdpbmRvdy5pbm5lckhlaWdodCAtIG5ld0RvdC5oZWlnaHQoKSAtIDIwKSk7XHJcblx0XHRcdG5ld0RvdC5vZmZzZXQoeyB0b3A6IHRvcFIsIGxlZnQ6IGxlZnRSIH0pO1xyXG5cclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIF9raWxsRG90KGRvdCkge1xyXG5cdFx0XHQvL2luY3JlYXNlIHNjb3JlIGFuZCBraWxsIGRvdFxyXG5cdFx0XHRtb3ZlYWJsZS5zY29yZSsrO1xyXG5cdFx0XHRkb3QuYWxpdmUgPSBmYWxzZTtcclxuXHRcdFx0dmFyIGluZGV4ID0gbW92ZWFibGUuZG90cy5pbmRleE9mKGRvdCk7XHJcblx0XHRcdG1vdmVhYmxlLmRvdHMuc3BsaWNlKGluZGV4LCAxKTtcclxuXHRcdFx0JChkb3QuaWQpLnJlbW92ZSgpO1xyXG5cdFx0XHQkc2NvcGUuJGRpZ2VzdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIF9kb3RQb3MoZG90KSB7XHJcblx0XHRcdHJldHVybiAkKGRvdC5pZCkub2Zmc2V0KCk7XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBfZ2V0Qm91bmRzKG9iaikge1xyXG5cdFx0XHQvL3JldHVybiBib3VuZHMgb2YgZG90XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0bGVmdDogJChvYmopLm9mZnNldCgpLmxlZnQsXHJcblx0XHRcdFx0cmlnaHQ6ICQob2JqKS5vZmZzZXQoKS5sZWZ0ICsgJChvYmopLndpZHRoKCksXHJcblx0XHRcdFx0dG9wOiAkKG9iaikub2Zmc2V0KCkudG9wLFxyXG5cdFx0XHRcdGJvdHRvbTogJChvYmopLm9mZnNldCgpLnRvcCArICQob2JqKS5oZWlnaHQoKSxcclxuXHRcdFx0XHR3aWR0aDogJChvYmopLndpZHRoKCksXHJcblx0XHRcdFx0aGVpZ2h0OiAkKG9iaikuaGVpZ2h0KClcclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdQb3J0Zm9saW9DdHJsJywgUG9ydGZvbGlvQ3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gUG9ydGZvbGlvQ3RybCgkc2NvcGUsICRyb290U2NvcGUsJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgcG9ydGZvbGlvVm0gPSB0aGlzO1xyXG4gICAgICAgIHBvcnRmb2xpb1ZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJQb3J0Zm9saW9cIjtcclxuICAgIH1cclxuXHJcbiAgICBQb3J0Zm9saW9DdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywnJHRpbWVvdXQnXTtcclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=