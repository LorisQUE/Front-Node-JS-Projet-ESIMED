class Model {
    constructor() {
        this.listApi = new ListAPI();
        this.itemApi = new ItemAPI();
        this.userApi = new UserAccountAPI();
        this.partageApi = new PartageAPI();
    };
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
            const list = Object.assign(new List(), await this.listApi.get(id));
            list.date = new Date(list.date);
            return list;
        } catch (e) {
            if (e === 404) return null;
            if (e === 403) return 403;
            return undefined;
        }
    };
    async getListPartage(id){
        try {
            const list = Object.assign(new List(), await this.listApi.getListPartage(id));
            list.date = new Date(list.date);
            return list;
        }catch (e) {
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
    updateListPartage(list){
        return this.listApi.updateListPartage(list).then(res => res.status);
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
    async getItemsPartage(id){
        let items = [];
        for (let item of await this.itemApi.getItemsPartage(id)){
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
        }
    };
    async getItemPartage(id){
        try{
            const item = Object.assign(new Item(), await this.itemApi.getItemPartage(id))[0];
            return item;
        } catch (e) {
            if (e === 404) return null;
            if (e === 403) return 403;
            return undefined;
        }
    };
    deleteItem(id) {
        return this.itemApi.delete(id).then(res => res.status);
    };
    deletePartageItem(id) {
        return this.itemApi.deletePartage(id).then(res => res.status);
    };
    insertItem(item) {
        return this.itemApi.insert(item).then(res => res.status);
    };
    updateItem(item) {
        return this.itemApi.update(item).then(res => res.status);
    };
    updatePartageItem(item) {
        return this.itemApi.updatePartage(item).then(res => res.status);
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
    async inscription(user){
            const res = await this.userApi.inscription(user);
            return res.status;
    };
    async resendEmail(login){
        const res = await this.userApi.resendEmail(login);
        return res.status;
    }
    /*
    REGION DES PARTAGES
     */
    //Get all partage lié à l'user en cours
    async getAllPartage(){
        let partages = [];
        for(let partage of await this.partageApi.getAll()){
            partage.date = new Date(partage.date);
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
        try{ return this.partageApi.insert(partage);}
        catch (e) {
            if (e === 404) return null;
            if (e === 403) return 403;
            return undefined;
        }
    };
    updatePartage(partage){
        try {return this.partageApi.update(partage);}
        catch (e) {
            if (e === 404) return null;
            if (e === 403) return 403;
            return undefined;
        }
    };
    deletePartage(id){
        try{return this.partageApi.delete(id);}
        catch (e) {
            console.log(e)
            if (e === 404) return null;
            if (e === 403) return 403;
            return undefined;
        }
    };
}
