class List {
    constructor(id, label, date, isarchived) {
        this.id = id;
        this.label = label;
        this.date = date;
        this.isarchived = isarchived;
    }
}

class Item {
    constructor(id, label, quantite, listId, ischecked) {
        this.id = id;
        this.quantite = quantite;
        this.label = label;
        this.ischecked = ischecked;
        this.listid = listId;
    }
}