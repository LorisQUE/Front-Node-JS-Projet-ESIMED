class PartageAPI extends BaseAPIService{
    constructor() {
        super("partage");
    };
    //Get toute les partages de l'user connectés
    getAll() {
        return fetchJSON(this.url, this.token)
    };
    //Get tout les partages de la liste en param
    getAllFromList(id) {
        return fetchJSON(`${this.url}List/${id}`, this.token)
    };
    //Get tout les partagées de l'user en param
    //A enlever ? Inutile ? Pourquoi vouloir voir les listes partagées de quelqu'un d'autre ?
    /*getAllFromUser(id) {
        return fetchJSON(`${this.url}User/${id}`, this.token)
    };*/
    get(id) {
        return fetchJSON(`${this.url}/${id}`, this.token)
    };
    delete(id) {
        this.headers.delete('Content-Type');
        return fetch(`${this.url}/${id}`, { method: 'DELETE', headers: this.headers })
    };
    insert(partage) {
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch(this.url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(partage)
        });
    };
    update(partage) {
        this.headers.set( 'Content-Type', 'application/json' );
        return fetch(this.url, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(partage)
        });
    };
}
