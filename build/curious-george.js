'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GLOBAL = window;
var ERROR_MSG = {
    INVALID_EMAIL: 'Invalid email address',
    UNREACHABLE_API: 'API is unreachable',
    UNKNOWN_PROVIDER: 'Unable to find CloudSponge provider'
};

var DNS_MX_MAP = {
    'aspmx.l.google.com': 'gmail',
    'alt1.aspmx.l.google.com': 'gmail',
    'alt2.aspmx.l.google.com': 'gmail',
    'alt3.aspmx.l.google.com': 'gmail',
    'alt4.aspmx.l.google.com': 'gmail',
    'alt4.gmail-smtp-in.l.google.com': 'gmail',
    'alt3.gmail-smtp-in.l.google.com': 'gmail',
    'alt1.gmail-smtp-in.l.google.com': 'gmail',
    'gmail-smtp-in.l.google.com': 'gmail',
    'alt2.gmail-smtp-in.l.google.com': 'gmail',

    'mx1.biz.mail.yahoo.com': 'yahoo',
    'mx5.biz.mail.yahoo.com': 'yahoo',
    'mta5.am0.yahoodns.net': 'yahoo',
    'mta6.am0.yahoodns.net': 'yahoo',
    'mta7.am0.yahoodns.net': 'yahoo'
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
                        GLOBAL['CuriousGeorge__jsonp__' + id] = function (response) {
                            if (!response) {
                                reject(ERROR_MSG.UNREACHABLE_API);
                            } else {
                                resolve(response);
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
        key: 'findProvider',
        value: function findProvider(email) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.lookup(email).then(function (response) {
                    var answer = response.answer || [];

                    for (var i = 0, len = answer.length; i < len; i++) {
                        if (DNS_MX_MAP[answer[i].rdata[1]]) {
                            resolve(DNS_MX_MAP[answer[i].rdata[1]]);
                            return;
                        }
                    }

                    reject(ERROR_MSG.UNKNOWN_PROVIDER);
                }).catch(function (err) {
                    reject(err);
                });
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