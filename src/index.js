const GLOBAL = window;
const ERROR_MSG = {
    INVALID_EMAIL : 'Invalid email address',
    UNREACHABLE_API : 'API is unreachable',
    UNKNOWN_PROVIDER : 'Unable to find CloudSponge provider',
}

const DNS_MX_MAP = {
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
    
    'mx1.biz.mail.yahoo.com'  : 'yahoo',    
    'mx5.biz.mail.yahoo.com'  : 'yahoo',
    'mta5.am0.yahoodns.net'   : 'yahoo',
    'mta6.am0.yahoodns.net'   : 'yahoo',
    'mta7.am0.yahoodns.net'   : 'yahoo',
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
        return new Promise((resolve, reject) => {
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

