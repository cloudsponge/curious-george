const GLOBAL = window;
const ERROR_MSG = {
    INVALID_EMAIL : 'Invalid email address',
    UNREACHABLE_API : 'API is unreachable'
}

class CuriousGeorge {
    
    lookup(email) {
        let host = this.getHostName(email);
        return new Promise((resolve, reject) => {
            if (host) {
                let id = CuriousGeorge.getId();                
                GLOBAL[`CuriousGeorge__jsonp__${id}`] = (obj) => {
                    if (!obj) {
                        reject(ERROR_MSG.UNREACHABLE_API);
                    }
                    else {
                        resolve(obj);
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

