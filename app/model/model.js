class Model {
    constructor() {
        this.listApi = new ListAPI();
        this.itemApi = new ItemAPI();
        this.userApi = new UserAccountAPI();
        this.partageApi = new PartageAPI();
    }
    /*
    REGION DES LISTES
     */
    async getAllLists() {
        let lists = [];
        for (let list of await this.listApi.getAll()) {
            list.date = new Date(list.date);
            lists.push(Object.assign(new List(), list));
        }
        return lists;
    };
    async getList(id) {
        try {
            const list = Object.assign(new List(), await this.listApi.get(id))[0];
            list.date = new Date(list.date);
            return list;
        } catch (e) {
            if (e === 404) return null;
            if (e === 403) return 403;
            return undefined;
        }
    };
    deleteList(id) {
        return this.listApi.delete(id).then(res => res.status);
    };
    insertList(list) {
        return this.listApi.insert(list).then(res => res.status);
    };
    updateList(list) {
        return this.listApi.update(list).then(res => res.status);
    };

    /*
    REGION DES ITEMS
     */
    async getAllItems() {
        let items = [];
        for (let item of await this.itemApi.getAllFromList(id)) {
            items.push(Object.assign(new Item(), item));
        }
        return items;
    };
    async getAllItemsFromList(id) {
        let items = [];
        for (let item of await this.itemApi.getAllFromList(id)) {
            items.push(Object.assign(new Item(), item));
        }
        return items;
    };

    async getItem(id) {
        try {
            const item = Object.assign(new Item(), await this.itemApi.get(id))[0];
            return item;
        } catch (e) {
            if (e === 404) return null;
            if (e === 403) return 403;
            return undefined;
        };
    };
    deleteItem(id) {
        return this.itemApi.delete(id).then(res => res.status);
    };
    insertItem(item) {
        return this.itemApi.insert(item).then(res => res.status);
    };
    updateItem(item) {
        return this.itemApi.update(item).then(res => res.status);
    };

    /*
    REGION DES USERS
     */
    async getAllUser(){
        let users = [];
        for (let user of await this.userApi.getAll()) {
            users.push(Object.assign(new User(), user));
        }
        return users;
    };

    /*
    REGION DES PARTAGES
     */
    //Get all partage lié à l'user en cours
    async getAllPartage(){
        let partages = [];
        for(let partage of await this.partageApi.getAll()){
            partages.push(Object.assign(new Partage(), partage));
        }
        return partages;
    };
    //Get all partage lié à la liste en param
    async getAllPartageFromList(id){
        let partages = [];
        for(let partage of await this.partageApi.getAllFromList(id)){
            partages.push(Object.assign(new Partage(), partage));
        }
        return partages;
    };
    //Get un partage by id
    async getPartage(id){
      try{
          const partage = Object.assign(new Partage(), await this.partageApi.get(id));
          return partage;
      }
      catch (e) {
          if (e === 404) return null;
          if (e === 403) return 403;
          return undefined;
      }
    };
    insertPartage(partage){
        return this.partageApi.insert(partage);
    };
    updatePartage(partage){
        return this.partageApi.update(partage);
    };
    deletePartage(id){
        return this.partageApi.delete(id);
    };
}
