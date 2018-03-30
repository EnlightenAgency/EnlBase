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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3Quc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZTJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEhvbWVQYWdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYnJvd3Nlci5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6MTY3NDQvJyk7XHJcbiAgICAgICAgYnJvd3Nlci53YWl0Rm9yQW5ndWxhcigpO1xyXG4gICAgfTtcclxuICAgIHRoaXMuZ2V0TWFwID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50KGJ5LmlkKCdtYXBfY2FudmFzJykpO1xyXG4gICAgfTtcclxufVxyXG5kZXNjcmliZSgnRXhhbXBsZSBQcm9ncmFtIEhvbWVwYWdlJywgZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGhvbWU7XHJcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBob21lID0gbmV3IEhvbWVQYWdlKCk7XHJcbiAgICB9KVxyXG5cclxuICAgIGl0KCdzaG91bGQgbG9hZCB0aGUgcGFnZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBob21lLmdldCgpO1xyXG4gICAgICAgIGV4cGVjdChicm93c2VyLmdldFRpdGxlKCkpLnRvQ29udGFpbignSG9tZScpO1xyXG4gICAgfSk7XHJcbiAgICBpdCgnc2hvdWxkIGhhdmUgYSBtYXAnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaG9tZS5nZXQoKTtcclxuICAgICAgICBleHBlY3QoaG9tZS5nZXRNYXAoKS5nZXRBdHRyaWJ1dGUoJ3VpLW1hcCcpKS50b0JlRGVmaW5lZCgpO1xyXG4gICAgfSk7XHJcbn0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==