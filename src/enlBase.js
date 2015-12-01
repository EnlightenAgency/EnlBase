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
        .controller('PortfolioCtrl', PortfolioCtrl);

    function PortfolioCtrl($scope, $rootScope,$timeout) {
        var portfolioVm = this;
        portfolioVm.bounds = new google.maps.LatLngBounds();
        $rootScope.title = "Portfolio";
    }

    PortfolioCtrl.$inject = ['$scope', '$rootScope','$timeout'];
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmN0cmwuanMiLCJjb250YWN0L2NvbnRhY3QuY3RybC5qcyIsImNvcmUvcGFnZS5jdHJsLmpzIiwiaG9tZS9ob21lLmN0cmwuanMiLCJwb3J0Zm9saW8vcG9ydGZvbGlvLmN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImVubEJhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcbiAgICAgICAgLm1vZHVsZSgnYXBwJywgW1xuICAgICAgICAgICAgJ3VpLnJvdXRlcicsXG4gICAgICAgICAgICAnbmdBbmltYXRlJyxcbiAgICAgICAgICAgICdtbS5mb3VuZGF0aW9uJyxcbiAgICAgICAgICAgICd1aS5ldmVudCcsXG4gICAgICAgICAgICAndWkubWFwJ1xuICAgICAgICBdKVxuICAgIC5jb25maWcoY29uZmlnKVxuICAgIC5ydW4ocnVuKTtcblxuICAgIGNvbmZpZy4kaW5qZWN0ID0gWyckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCAnJHN0YXRlUHJvdmlkZXInXTtcblxuICAgIGZ1bmN0aW9uIHJ1bigpIHtcclxuXHJcbiAgICB9XG4gICAgZnVuY3Rpb24gY29uZmlnKCR1cmxQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHVybFByb3ZpZGVyLndoZW4oJycsICcvJyk7ICAgICBcblxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSkuaGFzaFByZWZpeCgnIScpO1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvaG9tZS9ob21lLnZpZXcuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ3RybCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2hvbWVWbSdcclxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2Fib3V0Jywge1xyXG4gICAgICAgICAgICB1cmw6ICcvYWJvdXQnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9hYm91dC9hYm91dC52aWV3Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQWJvdXRDdHJsJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAnYWJvdXRWbSdcclxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ2NvbnRhY3QnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9jb250YWN0JyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY29udGFjdC9jb250YWN0LnZpZXcuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb250YWN0Q3RybCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NvbnRhY3RWbSdcclxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3BvcnRmb2xpbycsIHtcclxuICAgICAgICAgICAgdXJsOiAnL3BvcnRmb2xpbycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL3BvcnRmb2xpby9wb3J0Zm9saW8udmlldy5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1BvcnRmb2xpb0N0cmwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdwb3J0Zm9saW9WbSdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5zdGF0ZSgnNDA0Jywge1xyXG4gICAgICAgICAgICB1cmw6ICcvNDA0JyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvNDA0LzQwNC52aWV3Lmh0bWwnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJHVybFByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xyXG4gICAgfVxyXG5cclxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Fib3V0Q3RybCcsIEFib3V0Q3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gQWJvdXRDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBhYm91dFZtID0gdGhpcztcclxuICAgICAgICBhYm91dFZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJBYm91dFwiO1xyXG4gICAgfVxyXG5cclxuICAgIEFib3V0Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyR0aW1lb3V0J107XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignQ29udGFjdEN0cmwnLCBDb250YWN0Q3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gQ29udGFjdEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIGNvbnRhY3RWbSA9IHRoaXM7XHJcbiAgICAgICAgY29udGFjdFZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJDb250YWN0XCI7XHJcbiAgICB9XHJcblxyXG4gICAgQ29udGFjdEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckdGltZW91dCddO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwJylcclxuICAgIC5jb250cm9sbGVyKCdQYWdlQ3RybCcsIFBhZ2VDdHJsKTtcclxuXHJcbiAgICBQYWdlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyRzdGF0ZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBhZ2VDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkc3RhdGUpIHtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXM7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIHBhZ2UuZ2V0Q2xhc3MgPSBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoJHN0YXRlLmN1cnJlbnQubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdhY3RpdmUnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignSG9tZUN0cmwnLCBIb21lQ3RybCk7XHJcblxyXG4gICAgSG9tZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnXTtcclxuXHJcbiAgICAgZnVuY3Rpb24gSG9tZUN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBob21lVm0gPSB0aGlzO1xyXG4gICAgICAgIGhvbWVWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgaG9tZVZtLmxvYWRQaW5zID0gbG9hZFBpbnMoKTtcclxuICAgICAgICBob21lVm0ubXlNYXJrZXIgPSB7fTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJIb21lXCI7XHJcblxyXG4gICAgICAgIHZhciBkZWZhdWx0TGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNy4wOTAyNCwgLTk1LjcxMjg5MSk7XHJcbiAgICAgICAgdmFyIGRpcmVjdGlvbnNEaXNwbGF5ID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcih7XHJcbiAgICAgICAgICAgIHN1cHByZXNzTWFya2VyczogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBkaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xyXG4gICAgICAgIHZhciB0cmFmZmljTGF5ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuVHJhZmZpY0xheWVyKCk7XHJcblxyXG4gICAgICAgIGhvbWVWbS5tYXBPcHRpb25zID0ge1xyXG4gICAgICAgICAgICB6b29tOiA0LFxyXG4gICAgICAgICAgICBjZW50ZXI6IGRlZmF1bHRMYXRMbmcsXHJcbiAgICAgICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcclxuICAgICAgICAgICAgbmF2aWdhdGlvbkNvbnRyb2w6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY2FsZUNvbnRyb2w6IGZhbHNlLFxyXG4gICAgICAgICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2VcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lcih3aW5kb3csIFwicmVzaXplXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNlbnRlciA9ICRzY29wZS5tYXAuZ2V0Q2VudGVyKCk7XHJcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LnRyaWdnZXIoJHNjb3BlLm1hcCwgXCJyZXNpemVcIik7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXAuc2V0Q2VudGVyKGNlbnRlcik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGluaXQoKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAgICAgJHRpbWVvdXQobG9hZFBpbnMsIDIwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkUGlucygpIHtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5tYXApIHtcclxuICAgICAgICAgICAgICAgIF9wbGFjZU15c2VsZigpO1xyXG4gICAgICAgICAgICAgICAgLy9nZXQgY3VycmVudCBsb2NhdGlvbiBhbmQgcGxhY2UgdXNlciBwaW5cclxuICAgICAgICAgICAgICAgIGlmIChcImdlb2xvY2F0aW9uXCIgaW4gbmF2aWdhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihfcGxvdExvY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX3BsYWNlTXlzZWxmKCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKFwiNDIuMjQwODQ1XCIsIFwiLTgzLjIzNDA5N1wiKTtcclxuICAgICAgICAgICAgaG9tZVZtLm15TWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJEYW1pYW4gU3Ryb25nXCIsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL3JlYm91bmQgdmlld1xyXG4gICAgICAgICAgICBob21lVm0uYm91bmRzLmV4dGVuZChsb2NhdGlvbik7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXAuZml0Qm91bmRzKGhvbWVWbS5ib3VuZHMpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vZHJvcCBwaW4gb24gbWFwIGZvciBsb2NhdGlvblxyXG4gICAgICAgIGZ1bmN0aW9uIF9wbG90TG9jYXRpb24ocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgLy9jcmVhdGUgbWFya2VyXHJcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgbWFwOiAkc2NvcGUubWFwLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiWW91IEFyZSBIZXJlXCIsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL3JlYm91bmQgdmlld1xyXG4gICAgICAgICAgICBob21lVm0uYm91bmRzLmV4dGVuZChsb2NhdGlvbik7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXAuZml0Qm91bmRzKGhvbWVWbS5ib3VuZHMpO1xyXG5cclxuICAgICAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUoe1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luOmxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb246IGhvbWVWbS5teU1hcmtlci5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLlRyYXZlbE1vZGUuRFJJVklOR1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXN1bHQsIHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcCgkc2NvcGUubWFwKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbG9hZFBpbnM6IGxvYWRQaW5zXHJcbiAgICAgICAgfTtcclxuICAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignUG9ydGZvbGlvQ3RybCcsIFBvcnRmb2xpb0N0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBvcnRmb2xpb0N0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIHBvcnRmb2xpb1ZtID0gdGhpcztcclxuICAgICAgICBwb3J0Zm9saW9WbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiUG9ydGZvbGlvXCI7XHJcbiAgICB9XHJcblxyXG4gICAgUG9ydGZvbGlvQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyR0aW1lb3V0J107XHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9