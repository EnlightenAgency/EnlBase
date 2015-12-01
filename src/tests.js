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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhvbWUvaG9tZS5jdHJsLnNwZWMuanMiLCJ0ZXN0cy9FeGFtcGxlVGVzdC5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ0ZXN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIjsgKGZ1bmN0aW9uICgpIHtcclxuICAgIGRlc2NyaWJlKCdNb2R1bGU6IEV4YW1wbGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyICRjb250cm9sbGVyLCAkcm9vdFNjb3BlXHJcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG1vZHVsZSgnYXBwJyk7XHJcbiAgICAgICAgICAgIGluamVjdChmdW5jdGlvbiAoJGluamVjdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlID0gJGluamVjdG9yLmdldCgnJHJvb3RTY29wZScpO1xyXG4gICAgICAgICAgICAgICAgJGNvbnRyb2xsZXIgPSAkaW5qZWN0b3IuZ2V0KCckY29udHJvbGxlcicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkZXNjcmliZSgnQ29udHJvbGxlcjogSG9tZUN0cmwnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2NvcGUsIGhvbWVWbTtcclxuICAgICAgICAgICAgYmVmb3JlRWFjaChpbmplY3QoZnVuY3Rpb24gKCRjb250cm9sbGVyLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgICAgICAgICBzY29wZSA9ICRyb290U2NvcGUuJG5ldygpO1xyXG4gICAgICAgICAgICAgICAgaG9tZVZtID0gJGNvbnRyb2xsZXIoJ0hvbWVDdHJsIGFzIGhvbWVWbScsIHsgJHNjb3BlOiBzY29wZSB9KTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgaXQoXCJQbG90cyBteSBwaW4gYW5kIHVzZXJzIHBpblwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzcHlPbihob21lVm0sIFwibG9hZFBpbnNcIilcclxuICAgICAgICAgICAgICAgIGhvbWVWbS5sb2FkUGlucygpOyAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZXhwZWN0KGhvbWVWbS5sb2FkUGlucykudG9IYXZlQmVlbkNhbGxlZCgpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KSgpOyIsIjsgKGZ1bmN0aW9uICgpIHtcclxuICAgIGRlc2NyaWJlKCdFeGFtcGxlIFRlc3RzJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGl0KCdTYW5pdHkgQ2hlY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGV4cGVjdCh0cnVlKS50b0JlVHJ1dGh5KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufSkoKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=