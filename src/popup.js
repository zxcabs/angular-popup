/**
 * Project: angular-popup
 * File:
 * User: Evgeny Reznichenko "<kusakyky@gmail.com>"
 */


angular
    .module('ui.Popup', [])
    .factory('Popup', ['$rootScope', '$compile', '$document', function ($rootScope, $compile, $document) {
        var isString = angular.isString,
            body = $document.find('body'),
            defaultOptions = {
                style: {},
                'class': ''
            };

        /**
         * Оборачиваем нашу функцию что бы она возвращала шаблон с подключенным нашим шаблоном
         * @param url урл к шаблону
         * @returns {string}
         */
        function wrapTemplate(url) {
            return ['<div><div', ' ng-include="\'', url,'\'"></div></div>'].join('');
        }

        function Popup(opt) {
            if (!opt) throw new Error('Popup: "Should set templateUrl or options"');

            if (isString(opt)) {
                opt = {
                    templateUrl: opt
                }
            }

            opt = angular.extend({}, defaultOptions, opt);

            this.element = angular.element(wrapTemplate(opt.templateUrl));
            this.element.css(opt.style);
            this.element.addClass(opt.class);


            this.$scope = opt.scope || $rootScope.$new();
            this.$scope = angular.extend(this.$scope, opt.data);
            this.$scope.$close = this.close.bind(this);
            this.$scope.$on('finished', this.close.bind(this));

            $compile(this.element)(this.$scope);
            this.open();
        }

        Popup.prototype.open = function open() {
            body.append(this.element);
        };

        Popup.prototype.close = function close() {
            this.element.remove();
            this.$scope.$destroy();
        };

        return Popup;
    }]);