'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GLOBAL = window;
var ERROR_MSG = {
    INVALID_EMAIL: 'Invalid email address',
    UNREACHABLE_API: 'API is unreachable'
};

var CuriousGeorge = (function () {
    function CuriousGeorge() {
        _classCallCheck(this, CuriousGeorge);
    }

    _createClass(CuriousGeorge, [{
        key: 'lookup',
        value: function lookup(email) {
            var host = this.getHostName(email);
            return new Promise(function (resolve, reject) {
                if (host) {
                    (function () {
                        var id = CuriousGeorge.getId();
                        GLOBAL['CuriousGeorge__jsonp__' + id] = function (obj) {
                            if (!obj) {
                                reject(ERROR_MSG.UNREACHABLE_API);
                            } else {
                                resolve(obj);
                            }
                            CuriousGeorge.cleanup(id);
                        };
                        CuriousGeorge.injectScript(id, host);
                    })();
                } else {
                    reject(ERROR_MSG.INVALID_EMAIL);
                }
            });
        }
    }, {
        key: 'getHostName',
        value: function getHostName(email) {
            var match = /@(.+)$/.exec(email);

            if (match) {
                return match[1];
            }
            return null;
        }
    }], [{
        key: 'injectScript',
        value: function injectScript(id, host) {
            var script = document.createElement('script');
            var callback = 'CuriousGeorge__jsonp__' + id;

            script.id = 'script_' + id;
            script.async = true;
            script.onerror = GLOBAL[callback];
            script.src = 'http://dig.jsondns.org/IN/' + host + '/MX?callback=' + callback;

            document.head.appendChild(script);
        }
    }, {
        key: 'cleanup',
        value: function cleanup(id) {
            var script = document.getElementById('script_' + id);

            GLOBAL['CuriousGeorge__jsonp__' + id] = null;
            script.parentNode.removeChild(script);
        }
    }, {
        key: 'getId',
        value: function getId() {
            if (!CuriousGeorge.__id__) {
                CuriousGeorge.__id__ = 0;
            }
            return ++CuriousGeorge.__id__;
        }
    }]);

    return CuriousGeorge;
})();

//# sourceMappingURL=curious-george.js.map