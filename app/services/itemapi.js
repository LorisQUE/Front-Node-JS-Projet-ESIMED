class ItemAPI extends BaseAPIService{
    constructor() {
        super("item");
    }
    getAll() {
        return fetchJSON(this.url+'s', this.token)
    }
    getAllFromList(id) {
        return fetchJSON(`${this.url}s/${id}`, this.token)
    }
    get(id) {
        return fetchJSON(`${this.url}/${id}`, this.token)
    }
    delete(id) {
        this.headers.delete('Content-Type');
        return fetch(`${this.url}/${id}`, { method: 'DELETE', headers: this.headers })
    }
    insert(item) {
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(item)
        })
    }
    update(item) {
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(item)
        })
    }
}
