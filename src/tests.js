; (function () {
    describe('Module: Example', function () {
        var $controller, $rootScope
        beforeEach(function () {
            module('app');
            inject(function ($injector) {
                $rootScope = $injector.get('$rootScope');
                $controller = $injector.get('$controller');
            });
        });
        describe('Controller: HomeCtrl', function () {

            var scope, homeVm;
            beforeEach(inject(function ($controller, $rootScope) {
                scope = $rootScope.$new();
                scope.map = new google.maps.Map(document.getElementById('map_canvas'), {
                    center: { lat: -34.397, lng: 150.644 },
                    zoom: 8
                });
                homeVm = $controller('HomeCtrl as homeVm', { $scope: scope });
            }));

            it("Plots my pin and users pin", function () {
                spyOn(homeVm, "loadPins")
                console.log(homeVm);
                homeVm.loadPins();               
                expect(homeVm.loadPins).toHaveBeenCalled();
            })

        });
    });
})();;
; (function () {
    describe('Example Tests', function () {
        it('Sanity Check', function () {
            expect(true).toBeTruthy();
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvaG9tZS5jdHJsLnNwZWMuanMiLCJ0ZXN0cy9FeGFtcGxlVGVzdC5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidGVzdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyI7IChmdW5jdGlvbiAoKSB7XHJcbiAgICBkZXNjcmliZSgnTW9kdWxlOiBFeGFtcGxlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciAkY29udHJvbGxlciwgJHJvb3RTY29wZVxyXG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBtb2R1bGUoJ2FwcCcpO1xyXG4gICAgICAgICAgICBpbmplY3QoZnVuY3Rpb24gKCRpbmplY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZSA9ICRpbmplY3Rvci5nZXQoJyRyb290U2NvcGUnKTtcclxuICAgICAgICAgICAgICAgICRjb250cm9sbGVyID0gJGluamVjdG9yLmdldCgnJGNvbnRyb2xsZXInKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZGVzY3JpYmUoJ0NvbnRyb2xsZXI6IEhvbWVDdHJsJywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNjb3BlLCBob21lVm07XHJcbiAgICAgICAgICAgIGJlZm9yZUVhY2goaW5qZWN0KGZ1bmN0aW9uICgkY29udHJvbGxlciwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgICAgICAgICAgc2NvcGUgPSAkcm9vdFNjb3BlLiRuZXcoKTtcclxuICAgICAgICAgICAgICAgIHNjb3BlLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcF9jYW52YXMnKSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcjogeyBsYXQ6IC0zNC4zOTcsIGxuZzogMTUwLjY0NCB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHpvb206IDhcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaG9tZVZtID0gJGNvbnRyb2xsZXIoJ0hvbWVDdHJsIGFzIGhvbWVWbScsIHsgJHNjb3BlOiBzY29wZSB9KTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJQbG90cyBteSBwaW4gYW5kIHVzZXJzIHBpblwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzcHlPbihob21lVm0sIFwibG9hZFBpbnNcIilcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGhvbWVWbSk7XHJcbiAgICAgICAgICAgICAgICBob21lVm0ubG9hZFBpbnMoKTsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGV4cGVjdChob21lVm0ubG9hZFBpbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSkoKTsiLCI7IChmdW5jdGlvbiAoKSB7XHJcbiAgICBkZXNjcmliZSgnRXhhbXBsZSBUZXN0cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpdCgnU2FuaXR5IENoZWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBleHBlY3QodHJ1ZSkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9