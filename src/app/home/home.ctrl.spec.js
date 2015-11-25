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
})();