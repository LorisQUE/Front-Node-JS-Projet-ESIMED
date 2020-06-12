class UserAccountAPI extends BaseAPIService {
    constructor() {
        super("useraccount")
    }
    getAll() {
        return fetchJSON(this.url+"all", this.token)
    };
    getByToken(){
        return fetchJSON(this.url, this.token)
    }
    authenticate(login, password) {
        this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
        return new Promise((resolve, reject) => fetch(`${this.url}/authenticate`, {
            method: "POST",
            headers: this.headers,
            body: `login=${login}&password=${password}`
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)))
    };
    inscription(user){
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch(this.url+'/inscription', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(user)
        });
    };
    reinitialisation(login){
        this.headers.set( 'Content-Type', 'application/json' );
        return new Promise((resolve, reject) => fetch(this.url+'/reinitialisation/'+login, {
            method: 'POST',
            headers: this.headers,
        }).then(res => {
            if (res.status === 200) {
                resolve(res.status)
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)));
    };
    resendEmail(login){
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch(this.url+'/resend/'+login, {
            method: 'GET',
            headers: this.headers,
        })
    };
    reinitPass(token, id, pass){
        this.headers.set( 'Content-Type', 'application/json' );
        return new Promise((resolve, reject) => fetch(this.url+'/change-pass', {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify({token: token , id: id, pass: pass})
        }).then(res => {
            if (res.status === 200) {
                resolve(res.status)
            } else {
                reject(res.status)
            }
        }).catch(err => reject(err)));
    }
    update(user) {
        this.headers.set( 'Content-Type', 'application/json' );
        return new Promise((resolve, reject) => fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(user)
        }).then(res => {
            if (res.status === 200) {
                resolve(res.json())
            } else {
                reject(res.status)
            }
            reject(res);
        }).catch(e => {console.log(e); reject(e)}));
    };
}