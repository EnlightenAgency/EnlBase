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
