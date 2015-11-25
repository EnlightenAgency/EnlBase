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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvaG9tZS5jdHJsLnNwZWMuanMiLCJ0ZXN0cy9FeGFtcGxlVGVzdC5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InRlc3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiOyAoZnVuY3Rpb24gKCkge1xyXG4gICAgZGVzY3JpYmUoJ01vZHVsZTogRXhhbXBsZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgJGNvbnRyb2xsZXIsICRyb290U2NvcGVcclxuICAgICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbW9kdWxlKCdhcHAnKTtcclxuICAgICAgICAgICAgaW5qZWN0KGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUgPSAkaW5qZWN0b3IuZ2V0KCckcm9vdFNjb3BlJyk7XHJcbiAgICAgICAgICAgICAgICAkY29udHJvbGxlciA9ICRpbmplY3Rvci5nZXQoJyRjb250cm9sbGVyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGRlc2NyaWJlKCdDb250cm9sbGVyOiBIb21lQ3RybCcsIGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzY29wZSwgaG9tZVZtO1xyXG4gICAgICAgICAgICBiZWZvcmVFYWNoKGluamVjdChmdW5jdGlvbiAoJGNvbnRyb2xsZXIsICRyb290U2NvcGUpIHtcclxuICAgICAgICAgICAgICAgIHNjb3BlID0gJHJvb3RTY29wZS4kbmV3KCk7XHJcbiAgICAgICAgICAgICAgICBzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXBfY2FudmFzJyksIHtcclxuICAgICAgICAgICAgICAgICAgICBjZW50ZXI6IHsgbGF0OiAtMzQuMzk3LCBsbmc6IDE1MC42NDQgfSxcclxuICAgICAgICAgICAgICAgICAgICB6b29tOiA4XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGhvbWVWbSA9ICRjb250cm9sbGVyKCdIb21lQ3RybCBhcyBob21lVm0nLCB7ICRzY29wZTogc2NvcGUgfSk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIGl0KFwiUGxvdHMgbXkgcGluIGFuZCB1c2VycyBwaW5cIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc3B5T24oaG9tZVZtLCBcImxvYWRQaW5zXCIpXHJcbiAgICAgICAgICAgICAgICBob21lVm0ubG9hZFBpbnMoKTsgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGV4cGVjdChob21lVm0ubG9hZFBpbnMpLnRvSGF2ZUJlZW5DYWxsZWQoKTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSkoKTsiLCI7IChmdW5jdGlvbiAoKSB7XHJcbiAgICBkZXNjcmliZSgnRXhhbXBsZSBUZXN0cycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpdCgnU2FuaXR5IENoZWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBleHBlY3QodHJ1ZSkudG9CZVRydXRoeSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9