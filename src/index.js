const GLOBAL = window;
const ERROR_MSG = {
    INVALID_EMAIL : 'Invalid email address',
    UNREACHABLE_API : 'API is unreachable',
    UNKNOWN_PROVIDER : 'Unable to find CloudSponge provider',
}

const DNS_MX_MAP = {
    'gmail.com'               : 'gmail',
    'aspmx.l.google.com'      : 'gmail',
    'alt1.aspmx.l.google.com' : 'gmail',
    'alt2.aspmx.l.google.com' : 'gmail',
    'alt3.aspmx.l.google.com' : 'gmail',
    'alt4.aspmx.l.google.com' : 'gmail',
    'alt4.gmail-smtp-in.l.google.com' : 'gmail',
    'alt3.gmail-smtp-in.l.google.com' : 'gmail',
    'alt1.gmail-smtp-in.l.google.com' : 'gmail',
    'gmail-smtp-in.l.google.com'      : 'gmail',
    'alt2.gmail-smtp-in.l.google.com' : 'gmail',
    
    
    'yahoo.com'              : 'yahoo',
    'mx1.biz.mail.yahoo.com' : 'yahoo',    
    'mx5.biz.mail.yahoo.com' : 'yahoo',
    'mta5.am0.yahoodns.net'  : 'yahoo',
    'mta6.am0.yahoodns.net'  : 'yahoo',
    'mta7.am0.yahoodns.net'  : 'yahoo',
    
    'hotmail.com'     : 'windowslive',
    'outlook.com'     : 'windowslive',
    'mx1.hotmail.com' : 'windowslive',
    'mx2.hotmail.com' : 'windowslive',
    'mx3.hotmail.com' : 'windowslive',
    'mx4.hotmail.com' : 'windowslive',
    
    'aol.com'              : 'aol',
    'mailin-01.mx.aol.com' : 'aol',
    'mailin-02.mx.aol.com' : 'aol',
    'mailin-03.mx.aol.com' : 'aol',
    'mailin-04.mx.aol.com' : 'aol',
    
    'icloud.com'          : 'icloud',
    'mx1.mail.icloud.com' : 'icloud',
    'mx2.mail.icloud.com' : 'icloud',
    'mx3.mail.icloud.com' : 'icloud',
    'mx4.mail.icloud.com' : 'icloud',
    'mx5.mail.icloud.com' : 'icloud',
    'mx6.mail.icloud.com' : 'icloud',
    
    'plaxo.com'      : 'plaxo',
    'mail.plaxo.com' : 'plaxo',
    'plaxo-com.mail.protection.outlook.com' : 'plaxo',
    
    'mail.ru'     : 'mail_ru',
    'mxs.mail.ru' : 'mail_ru',
    
    'uol.com.br'       : 'uol',
    'mx-p1.uol.com.br' : 'uol',
    
    'bol.com.br'              : 'bol',
    'pro-mail-mx-001.bol.com' : 'bol',
    'pro-mail-mx-002.bol.com' : 'bol',
    
    'terra.com.br' : 'terra',
    'vip-mail-mx-gateway.terra.com' : 'terra',
    
    'rediff.com' : 'rediff',
    'mx.rediffmail.rediff.akadns.net' : 'rediff',
    
    '126.com' : 'mail126',
    '126mx00.mxmail.netease.com' : 'mail126',
    '126mx01.mxmail.netease.com' : 'mail126',
    '126mx02.mxmail.netease.com' : 'mail126',
    
    '163.com' : 'mail163',
    '163mx00.mxmail.netease.com' : 'mail163',
    '163mx01.mxmail.netease.com' : 'mail163',
    '163mx02.mxmail.netease.com' : 'mail163',
    '163mx03.mxmail.netease.com' : 'mail163',
    
    'yeah.net' : 'mail_yeah_net',
    'yeahmx00.mxmail.netease.com' : 'mail_yeah_net',
    'yeahmx01.mxmail.netease.com' : 'mail_yeah_net',
    
    'gmx.net' : 'gmx',
    'mx00.emig.gmx.net' : 'gmx',
    'mx01.emig.gmx.net' : 'gmx',
    
    'qip.ru'    : 'qip_ru',
    'mx.qip.ru' : 'qip_ru',
    
    'sapo.pt' : 'sapo',
    'mx.ptmail.sapo.pt' : 'sapo',
    
    'mail.com' : 'mail',
    'mx00.mail.com' : 'mail',
    'mx01.mail.com' : 'mail',
    
    'yandex.ru' : 'yandex_ru',
    'mx.yandex.ru' : 'yandex_ru',
}

class CuriousGeorge {
    
    lookup(email) {
        let host = this.getHostName(email);
        return new Promise((resolve, reject) => {
            if (host) {
                let id = CuriousGeorge.getId();                
                GLOBAL[`CuriousGeorge__jsonp__${id}`] = (response) => {
                    if (!response) {
                        reject(ERROR_MSG.UNREACHABLE_API);
                    }
                    else {
                        resolve(response);
                    }
                    CuriousGeorge.cleanup(id);
                }
                CuriousGeorge.injectScript(id, host);
            }
            else {
                reject(ERROR_MSG.INVALID_EMAIL);
            }
        })
    }
    
    findProvider(email) {
        let host = this.getHostName(email);
        return new Promise((resolve, reject) => {
            if (DNS_MX_MAP[host]) {
                resolve(DNS_MX_MAP[host]);
            }
            else {
                this.lookup(email)
                .then(response => {
                    let answer = response.answer || [];

                    for (let i = 0, len = answer.length; i < len; i++) {
                        if (DNS_MX_MAP[answer[i].rdata[1]]) {
                            resolve(DNS_MX_MAP[answer[i].rdata[1]]);
                            return;
                        }
                    }

                    reject(ERROR_MSG.UNKNOWN_PROVIDER);
                })
                .catch(err => {
                    reject(err);
                })
            }
        })
    }
    
    getHostName(email) {
        let match = /@(.+)$/.exec(email)
        
        if (match) {
            return match[1];
        }
        return null
    }
    
    static injectScript(id, host) {
        let script = document.createElement('script');
        let callback = `CuriousGeorge__jsonp__${id}`;
        
        script.id = `script_${id}`;
        script.async = true;
        script.onerror = GLOBAL[callback];
        script.src = `http://dig.jsondns.org/IN/${host}/MX?callback=${callback}`
        
        document.head.appendChild(script);
    }
    
    static cleanup(id) {
        var script = document.getElementById(`script_${id}`);
        
        GLOBAL[`CuriousGeorge__jsonp__${id}`] = null;
        script.parentNode.removeChild(script);
    }
    
    static getId() {
        if (!CuriousGeorge.__id__) {
            CuriousGeorge.__id__ = 0;
        }
        return ++CuriousGeorge.__id__;
    }
}

