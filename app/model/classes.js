class List {
    constructor(id, label, date, isarchived) {
        this.id = id;
        this.label = label;
        this.date = date;
        this.isarchived = isarchived;
    };
}

class Item {
    constructor(id, label, quantite, listId, ischecked) {
        this.id = id;
        this.quantite = quantite;
        this.label = label;
        this.ischecked = ischecked;
        this.listid = listId;
    };
}

class User {
    constructor(id, name, login) {
        this.id = id;
        this.displayname = name;
        this.login = login;
    };
}

class Partage {
    constructor(id, user_id, list_id, droit) {
        this.id = id;
        this.user_id = user_id;
        this.list_id = list_id;
        this.droit = droit;
    };
}