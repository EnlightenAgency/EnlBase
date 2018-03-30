var HomePage = function () {
    this.get = function () {
        browser.get('http://localhost:16744/');
        browser.waitForAngular();
    };
    this.getMap = function () {
        return element(by.id('map_canvas'));
    };
}
describe('Example Program Homepage', function () {
    var home;
    beforeEach(function () {
        home = new HomePage();
    })

    it('should load the page', function () {
        home.get();
        expect(browser.getTitle()).toContain('Home');
    });
    it('should have a map', function () {
        home.get();
        expect(home.getMap().getAttribute('ui-map')).toBeDefined();
    });
});