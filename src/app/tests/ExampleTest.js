; (function () {
    describe('Example Tests', function () {

        it('Sanity Check', function () {
            expect(true).toBeTruthy();
        });
    });
    describe('Module: Example', function () {
        var $controller, $rootScope
        beforeEach(function () {
            module('app');
            inject(function ($injector) {
                $rootScope = $injector.get('$rootScope');
                $controller = $injector.get('$controller');
            });
        });

    });
})();