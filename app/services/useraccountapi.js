class UserAccountAPI extends BaseAPIService {
    constructor() {
        super("useraccount")
    }
    getAll() {
        return fetchJSON(this.url, this.token)
    };
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
    }
    resendEmail(login){
        // return fetchJSON(this.url+'/resend/'+login, this.token);
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch(this.url+'/resend/'+login, {
            method: 'GET',
            headers: this.headers,
        })
    }
}
