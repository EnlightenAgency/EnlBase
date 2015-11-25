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
        var trafficLayer = new google.maps.TrafficLayer();
        var directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        var directionsService = new google.maps.DirectionsService();

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
        init()

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmN0cmwuanMiLCJjb250YWN0L2NvbnRhY3QuY3RybC5qcyIsImNvcmUvcGFnZS5jdHJsLmpzIiwiaG9tZS9ob21lLmN0cmwuanMiLCJwb3J0Zm9saW8vcG9ydGZvbGlvLmN0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJlbmxCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcsIFtcbiAgICAgICAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgICAgICAgJ25nQW5pbWF0ZScsXG4gICAgICAgICAgICAnbW0uZm91bmRhdGlvbicsXG4gICAgICAgICAgICAndWkuZXZlbnQnLFxuICAgICAgICAgICAgJ3VpLm1hcCdcbiAgICAgICAgXSlcbiAgICAuY29uZmlnKGNvbmZpZylcbiAgICAucnVuKHJ1bik7XG5cbiAgICBjb25maWcuJGluamVjdCA9IFsnJHVybFJvdXRlclByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJyRzdGF0ZVByb3ZpZGVyJ107XG5cbiAgICBmdW5jdGlvbiBydW4oKSB7XHJcblxyXG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbmZpZygkdXJsUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlcikge1xyXG4gICAgICAgICR1cmxQcm92aWRlci53aGVuKCcnLCAnLycpOyAgICAgXG5cbiAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpLmhhc2hQcmVmaXgoJyEnKTtcblxuICAgICAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnaG9tZScsIHtcclxuICAgICAgICAgICAgdXJsOiAnLycsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2hvbWUvaG9tZS52aWV3Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdob21lVm0nXHJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdhYm91dCcsIHtcclxuICAgICAgICAgICAgdXJsOiAnL2Fib3V0JyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvYWJvdXQvYWJvdXQudmlldy5odG1sJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Fib3V0Q3RybCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2Fib3V0Vm0nXHJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdjb250YWN0Jywge1xyXG4gICAgICAgICAgICB1cmw6ICcvY29udGFjdCcsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwL2NvbnRhY3QvY29udGFjdC52aWV3Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ29udGFjdEN0cmwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdjb250YWN0Vm0nXHJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdwb3J0Zm9saW8nLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9wb3J0Zm9saW8nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9wb3J0Zm9saW8vcG9ydGZvbGlvLnZpZXcuaHRtbCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQb3J0Zm9saW9DdHJsJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAncG9ydGZvbGlvVm0nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuc3RhdGUoJzQwNCcsIHtcclxuICAgICAgICAgICAgdXJsOiAnLzQwNCcsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXBwLzQwNC80MDQudmlldy5odG1sJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICR1cmxQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcclxuICAgIH1cclxuXHJcbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdBYm91dEN0cmwnLCBBYm91dEN0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIEFib3V0Q3RybCgkc2NvcGUsICRyb290U2NvcGUsJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgYWJvdXRWbSA9IHRoaXM7XHJcbiAgICAgICAgYWJvdXRWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiQWJvdXRcIjtcclxuICAgIH1cclxuXHJcbiAgICBBYm91dEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckdGltZW91dCddO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0NvbnRhY3RDdHJsJywgQ29udGFjdEN0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIENvbnRhY3RDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBjb250YWN0Vm0gPSB0aGlzO1xyXG4gICAgICAgIGNvbnRhY3RWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiQ29udGFjdFwiO1xyXG4gICAgfVxyXG5cclxuICAgIENvbnRhY3RDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywnJHRpbWVvdXQnXTtcclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAuY29udHJvbGxlcignUGFnZUN0cmwnLCBQYWdlQ3RybCk7XHJcblxyXG4gICAgUGFnZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckc3RhdGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBQYWdlQ3RybCgkc2NvcGUsICRyb290U2NvcGUsJHN0YXRlKSB7XHJcbiAgICAgICAgdmFyIHBhZ2UgPSB0aGlzO1xyXG4gICAgICAgICRyb290U2NvcGUudGl0bGUgPSBcIlwiO1xyXG5cclxuICAgICAgICBwYWdlLmdldENsYXNzID0gZnVuY3Rpb24gKG5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKCRzdGF0ZS5jdXJyZW50Lm5hbWUgPT09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnYWN0aXZlJztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJywgSG9tZUN0cmwpO1xyXG5cclxuICAgIEhvbWVDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywgJyR0aW1lb3V0J107XHJcblxyXG4gICAgIGZ1bmN0aW9uIEhvbWVDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwgJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgaG9tZVZtID0gdGhpcztcclxuICAgICAgICBob21lVm0uYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpO1xyXG4gICAgICAgIGhvbWVWbS5sb2FkUGlucyA9IGxvYWRQaW5zKCk7XHJcbiAgICAgICAgaG9tZVZtLm15TWFya2VyID0ge307XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiSG9tZVwiO1xyXG5cclxuICAgICAgICB2YXIgZGVmYXVsdExhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoMzcuMDkwMjQsIC05NS43MTI4OTEpO1xyXG4gICAgICAgIHZhciB0cmFmZmljTGF5ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuVHJhZmZpY0xheWVyKCk7XHJcbiAgICAgICAgdmFyIGRpcmVjdGlvbnNEaXNwbGF5ID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNSZW5kZXJlcih7XHJcbiAgICAgICAgICAgIHN1cHByZXNzTWFya2VyczogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZhciBkaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xyXG5cclxuICAgICAgICBob21lVm0ubWFwT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgem9vbTogNCxcclxuICAgICAgICAgICAgY2VudGVyOiBkZWZhdWx0TGF0TG5nLFxyXG4gICAgICAgICAgICBtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLFxyXG4gICAgICAgICAgICBkcmFnZ2FibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY3JvbGx3aGVlbDogZmFsc2UsXHJcbiAgICAgICAgICAgIG5hdmlnYXRpb25Db250cm9sOiBmYWxzZSxcclxuICAgICAgICAgICAgc2NhbGVDb250cm9sOiBmYWxzZSxcclxuICAgICAgICAgICAgbWFwVHlwZUNvbnRyb2w6IGZhbHNlXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbml0KClcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgICAgICAgJHRpbWVvdXQobG9hZFBpbnMsIDIwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2FkUGlucygpIHtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5tYXApIHtcclxuICAgICAgICAgICAgICAgIF9wbGFjZU15c2VsZigpO1xyXG4gICAgICAgICAgICAgICAgLy9nZXQgY3VycmVudCBsb2NhdGlvbiBhbmQgcGxhY2UgdXNlciBwaW5cclxuICAgICAgICAgICAgICAgIGlmIChcImdlb2xvY2F0aW9uXCIgaW4gbmF2aWdhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihfcGxvdExvY2F0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX3BsYWNlTXlzZWxmKCkge1xyXG4gICAgICAgICAgICB2YXIgbG9jYXRpb24gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKFwiNDIuMjQwODQ1XCIsIFwiLTgzLjIzNDA5N1wiKTtcclxuICAgICAgICAgICAgaG9tZVZtLm15TWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJEYW1pYW4gU3Ryb25nXCIsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL3JlYm91bmQgdmlld1xyXG4gICAgICAgICAgICBob21lVm0uYm91bmRzLmV4dGVuZChsb2NhdGlvbik7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXAuZml0Qm91bmRzKGhvbWVWbS5ib3VuZHMpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8vZHJvcCBwaW4gb24gbWFwIGZvciBsb2NhdGlvblxyXG4gICAgICAgIGZ1bmN0aW9uIF9wbG90TG9jYXRpb24ocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgLy9jcmVhdGUgbWFya2VyXHJcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgbWFwOiAkc2NvcGUubWFwLFxyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiWW91IEFyZSBIZXJlXCIsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvL3JlYm91bmQgdmlld1xyXG4gICAgICAgICAgICBob21lVm0uYm91bmRzLmV4dGVuZChsb2NhdGlvbik7XHJcbiAgICAgICAgICAgICRzY29wZS5tYXAuZml0Qm91bmRzKGhvbWVWbS5ib3VuZHMpO1xyXG5cclxuICAgICAgICAgICAgZGlyZWN0aW9uc1NlcnZpY2Uucm91dGUoe1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luOmxvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb246IGhvbWVWbS5teU1hcmtlci5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLlRyYXZlbE1vZGUuRFJJVklOR1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXN1bHQsIHN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldE1hcCgkc2NvcGUubWFwKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbG9hZFBpbnM6IGxvYWRQaW5zXHJcbiAgICAgICAgfTtcclxuICAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignUG9ydGZvbGlvQ3RybCcsIFBvcnRmb2xpb0N0cmwpO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBvcnRmb2xpb0N0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIHBvcnRmb2xpb1ZtID0gdGhpcztcclxuICAgICAgICBwb3J0Zm9saW9WbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiUG9ydGZvbGlvXCI7XHJcbiAgICB9XHJcblxyXG4gICAgUG9ydGZvbGlvQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyR0aW1lb3V0J107XHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9