class Model {
    constructor() {
        this.listApi = new ListAPI();
        this.itemApi = new ItemAPI();
    }
    async getAllLists() {
        let lists = [];
        for (let list of await this.listApi.getAll()) {
            list.date = new Date(list.date);
            lists.push(Object.assign(new List(), list));
        }
        return lists;
    }

    async getList(id) {
        try {
            const list = Object.assign(new List(), await this.listApi.get(id))[0];
            list.date = new Date(list.date);
            return list;
        } catch (e) {
            if (e === 404) return null;
            return undefined;
        }
    }
    deleteList(id) {
        return this.listApi.delete(id).then(res => res.status)
    }
    insertList(list) {
        return this.listApi.insert(list).then(res => res.status)
    }
    updateList(list) {
        return this.listApi.update(list).then(res => res.status)
    }

    async getAllItems() {
        let items = [];
        for (let item of await this.itemApi.getAll()) {
            items.push(Object.assign(new Item(), item));
        }
        return items;
    }
    async getAllItemsFromList(id) {
        let items = [];
        for (let item of await this.itemApi.getAllFromList(id)) {
            items.push(Object.assign(new Item(), item));
        }
        return items;
    }

    async getItem(id) {
        try {
            console.log(id)
            const item = Object.assign(new Item(), await this.itemApi.get(id))[0];
            console.log(item)
            return item;
        } catch (e) {
            if (e === 404) return null;
            return undefined;
        }
    }
    deleteItem(id) {
        return this.itemApi.delete(id).then(res => res.status)
    }
    insertItem(item) {
        console.log('AAAA', item)
        return this.itemApi.insert(item).then(res => res.status)
    }
    updateItem(item) {
        console.log('AAAA', item)
        return this.itemApi.update(item).then(res => res.status)
    }
}