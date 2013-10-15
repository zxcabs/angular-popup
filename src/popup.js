/**
 * Project: angular-popup
 * File:
 * User: Evgeny Reznichenko "<kusakyky@gmail.com>"
 */


angular
    .module('ui.Popup', [])
    .provider('Popup', function () {
        this.$get = ['$rootScope', '$compile', '$document', function ($rootScope, $compile, $document) {
            var isString = angular.isString,
                body = $document.find('body'),
                defaultOptions = {
                    style: {},
                    'class': '',
                    modalOverlayStyle: {
                        'background-color': '#000000',
                        'opacity': '0.6',
                        'z-index': '100',
                        'position': 'fixed',
                        'top': '0',
                        'left': '0',
                        'width': '100%',
                        'height': '100%',
                        'overflow': 'none'
                    },
                    modal: false
                };

            /**
             * Оборачиваем нашу функцию что бы она возвращала шаблон с подключенным нашим шаблоном
             * @param url урл к шаблону
             * @returns {string}
             */
            function wrapTemplate(url, opt) {
                var modalOverlay = opt.modal? angular.element('<div></div>'): '';

                if (modalOverlay) {
                    if (opt.modalOverlayClass) {
                        modalOverlay.addClass(opt.modalOverlayClass);
                    } else {
                        modalOverlay.css(opt.modalOverlayStyle);
                    }

                    modalOverlay = modalOverlay[0].outerHTML;
                }

                return ['<div>', modalOverlay, '<div', ' ng-include="\'', url,'\'"></div></div>'].join('');
            }

            function Popup(opt) {
                if (!opt) throw new Error('Popup: "Should set templateUrl or options"');

                if (isString(opt)) {
                    opt = {
                        templateUrl: opt
                    }
                }

                opt = angular.extend({}, defaultOptions, opt);

                this.element = angular.element(wrapTemplate(opt.templateUrl, opt));
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
        }]
    });