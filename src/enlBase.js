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
        $urlProvider.otherwise('/');

        $locationProvider.html5Mode(true).hashPrefix('!');

        $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "app/home/home.view.html",
            controller: 'HomeCtrl',
            controllerAs: 'homeVm'
        })
        .state('about', {
            url: "/about",
            templateUrl: "app/about/about.view.html",
            controller: 'AboutCtrl',
            controllerAs: 'aboutVm'
        })
        .state('contact', {
            url: "/contact",
            templateUrl: "app/contact/contact.view.html",
            controller: 'ContactCtrl',
            controllerAs: 'contactVm'
        })
        .state('portfolio', {
            url: "/portfolio",
            templateUrl: "app/portfolio/portfolio.view.html",
            controller: 'PortfolioCtrl',
            controllerAs: 'portfolioVm'
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmN0cmwuanMiLCJjb250YWN0L2Fib3V0LmN0cmwuanMiLCJjb3JlL3BhZ2UuY3RybC5qcyIsImhvbWUvaG9tZS5jdHJsLmpzIiwicG9ydGZvbGlvL3BvcnRmb2xpby5jdHJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJlbmxCYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcsIFtcbiAgICAgICAgICAgICd1aS5yb3V0ZXInLFxuICAgICAgICAgICAgJ25nQW5pbWF0ZScsXG4gICAgICAgICAgICAnbW0uZm91bmRhdGlvbicsXG4gICAgICAgICAgICAndWkuZXZlbnQnLFxuICAgICAgICAgICAgJ3VpLm1hcCcgICAgICAgICBcbiAgICAgICAgXSlcbiAgICAuY29uZmlnKGNvbmZpZylcbiAgICAucnVuKHJ1bik7XG5cbiAgICBjb25maWcuJGluamVjdCA9IFsnJHVybFJvdXRlclByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJyRzdGF0ZVByb3ZpZGVyJ107XG5cbiAgICBmdW5jdGlvbiBydW4oKSB7XHJcblxyXG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbmZpZygkdXJsUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlcikge1xyXG4gICAgICAgICR1cmxQcm92aWRlci5vdGhlcndpc2UoJy8nKTtcblxuICAgICAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSkuaGFzaFByZWZpeCgnIScpO1xuXG4gICAgICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdob21lJywge1xyXG4gICAgICAgICAgICB1cmw6IFwiL1wiLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJhcHAvaG9tZS9ob21lLnZpZXcuaHRtbFwiLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUN0cmwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdob21lVm0nXHJcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdhYm91dCcsIHtcclxuICAgICAgICAgICAgdXJsOiBcIi9hYm91dFwiLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJhcHAvYWJvdXQvYWJvdXQudmlldy5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBYm91dEN0cmwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICdhYm91dFZtJ1xyXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgnY29udGFjdCcsIHtcclxuICAgICAgICAgICAgdXJsOiBcIi9jb250YWN0XCIsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcImFwcC9jb250YWN0L2NvbnRhY3Qudmlldy5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDb250YWN0Q3RybCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ2NvbnRhY3RWbSdcclxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3BvcnRmb2xpbycsIHtcclxuICAgICAgICAgICAgdXJsOiBcIi9wb3J0Zm9saW9cIixcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwiYXBwL3BvcnRmb2xpby9wb3J0Zm9saW8udmlldy5odG1sXCIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdQb3J0Zm9saW9DdHJsJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAncG9ydGZvbGlvVm0nXHJcbiAgICAgICAgfSk7XG4gICAgfVxyXG5cclxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2FwcCcpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0Fib3V0Q3RybCcsIEFib3V0Q3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gQWJvdXRDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBhYm91dFZtID0gdGhpcztcclxuICAgICAgICBhYm91dFZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJBYm91dFwiO1xyXG4gICAgfVxyXG5cclxuICAgIEFib3V0Q3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyR0aW1lb3V0J107XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignQ29udGFjdEN0cmwnLCBDb250YWN0Q3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gQ29udGFjdEN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCR0aW1lb3V0KSB7XHJcbiAgICAgICAgdmFyIGNvbnRhY3RWbSA9IHRoaXM7XHJcbiAgICAgICAgY29udGFjdFZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJDb250YWN0XCI7XHJcbiAgICB9XHJcblxyXG4gICAgQ29udGFjdEN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckdGltZW91dCddO1xyXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgLm1vZHVsZSgnYXBwJylcclxuICAgIC5jb250cm9sbGVyKCdQYWdlQ3RybCcsIFBhZ2VDdHJsKTtcclxuXHJcbiAgICBQYWdlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHJvb3RTY29wZScsJyRzdGF0ZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIFBhZ2VDdHJsKCRzY29wZSwgJHJvb3RTY29wZSwkc3RhdGUpIHtcclxuICAgICAgICB2YXIgcGFnZSA9IHRoaXM7XHJcbiAgICAgICAgJHJvb3RTY29wZS50aXRsZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIHBhZ2UuZ2V0Q2xhc3MgPSBmdW5jdGlvbiAobmFtZSkge1xyXG4gICAgICAgICAgICBpZiAoJHN0YXRlLmN1cnJlbnQubmFtZSA9PT0gbmFtZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdhY3RpdmUnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXBwJylcclxuICAgICAgICAuY29udHJvbGxlcignSG9tZUN0cmwnLCBIb21lQ3RybCk7XHJcblxyXG4gICAgSG9tZUN0cmwuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCAnJHRpbWVvdXQnXTtcclxuXHJcbiAgICAgZnVuY3Rpb24gSG9tZUN0cmwoJHNjb3BlLCAkcm9vdFNjb3BlLCAkdGltZW91dCkge1xyXG4gICAgICAgIHZhciBob21lVm0gPSB0aGlzO1xyXG4gICAgICAgIGhvbWVWbS5ib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XHJcbiAgICAgICAgaG9tZVZtLmxvYWRQaW5zID0gbG9hZFBpbnMoKTtcclxuICAgICAgICBob21lVm0ubXlNYXJrZXIgPSB7fTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJIb21lXCI7XHJcblxyXG4gICAgICAgIHZhciBkZWZhdWx0TGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZygzNy4wOTAyNCwgLTk1LjcxMjg5MSk7XHJcbiAgICAgICAgdmFyIHRyYWZmaWNMYXllciA9IG5ldyBnb29nbGUubWFwcy5UcmFmZmljTGF5ZXIoKTtcclxuICAgICAgICB2YXIgZGlyZWN0aW9uc0Rpc3BsYXkgPSBuZXcgZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1JlbmRlcmVyKHtcclxuICAgICAgICAgICAgc3VwcHJlc3NNYXJrZXJzOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIGRpcmVjdGlvbnNTZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTZXJ2aWNlKCk7XHJcblxyXG4gICAgICAgIGhvbWVWbS5tYXBPcHRpb25zID0ge1xyXG4gICAgICAgICAgICB6b29tOiA0LFxyXG4gICAgICAgICAgICBjZW50ZXI6IGRlZmF1bHRMYXRMbmcsXHJcbiAgICAgICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXHJcbiAgICAgICAgICAgIGRyYWdnYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHNjcm9sbHdoZWVsOiBmYWxzZSxcclxuICAgICAgICAgICAgbmF2aWdhdGlvbkNvbnRyb2w6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY2FsZUNvbnRyb2w6IGZhbHNlLFxyXG4gICAgICAgICAgICBtYXBUeXBlQ29udHJvbDogZmFsc2VcclxuICAgICAgICB9O1xyXG4gICAgICAgIGluaXQoKVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgICAgICAgICAkdGltZW91dChsb2FkUGlucywgMjAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRQaW5zKCkge1xyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLm1hcCkge1xyXG4gICAgICAgICAgICAgICAgX3BsYWNlTXlzZWxmKCk7XHJcbiAgICAgICAgICAgICAgICAvL2dldCBjdXJyZW50IGxvY2F0aW9uIGFuZCBwbGFjZSB1c2VyIHBpblxyXG4gICAgICAgICAgICAgICAgaWYgKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKF9wbG90TG9jYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfcGxhY2VNeXNlbGYoKSB7XHJcbiAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoXCI0Mi4yNDA4NDVcIiwgXCItODMuMjM0MDk3XCIpO1xyXG4gICAgICAgICAgICBob21lVm0ubXlNYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsb2NhdGlvbixcclxuICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBcIkRhbWlhbiBTdHJvbmdcIixcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1BcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vcmVib3VuZCB2aWV3XHJcbiAgICAgICAgICAgIGhvbWVWbS5ib3VuZHMuZXh0ZW5kKGxvY2F0aW9uKTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5maXRCb3VuZHMoaG9tZVZtLmJvdW5kcyk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy9kcm9wIHBpbiBvbiBtYXAgZm9yIGxvY2F0aW9uXHJcbiAgICAgICAgZnVuY3Rpb24gX3Bsb3RMb2NhdGlvbihwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAvL2NyZWF0ZSBtYXJrZXJcclxuICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJZb3UgQXJlIEhlcmVcIixcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1BcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vcmVib3VuZCB2aWV3XHJcbiAgICAgICAgICAgIGhvbWVWbS5ib3VuZHMuZXh0ZW5kKGxvY2F0aW9uKTtcclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5maXRCb3VuZHMoaG9tZVZtLmJvdW5kcyk7XHJcblxyXG4gICAgICAgICAgICBkaXJlY3Rpb25zU2VydmljZS5yb3V0ZSh7XHJcbiAgICAgICAgICAgICAgICBvcmlnaW46bG9jYXRpb24sXHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogaG9tZVZtLm15TWFya2VyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgICAgdHJhdmVsTW9kZTogZ29vZ2xlLm1hcHMuVHJhdmVsTW9kZS5EUklWSU5HXHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3VsdCwgc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spIHtcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zRGlzcGxheS5zZXREaXJlY3Rpb25zKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKCRzY29wZS5tYXApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7ICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsb2FkUGluczogbG9hZFBpbnNcclxuICAgICAgICB9O1xyXG4gICAgIH1cclxufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhcHAnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdQb3J0Zm9saW9DdHJsJywgUG9ydGZvbGlvQ3RybCk7XHJcblxyXG4gICAgZnVuY3Rpb24gUG9ydGZvbGlvQ3RybCgkc2NvcGUsICRyb290U2NvcGUsJHRpbWVvdXQpIHtcclxuICAgICAgICB2YXIgcG9ydGZvbGlvVm0gPSB0aGlzO1xyXG4gICAgICAgIHBvcnRmb2xpb1ZtLmJvdW5kcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmdCb3VuZHMoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gXCJQb3J0Zm9saW9cIjtcclxuICAgIH1cclxuXHJcbiAgICBQb3J0Zm9saW9DdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckcm9vdFNjb3BlJywnJHRpbWVvdXQnXTtcclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=