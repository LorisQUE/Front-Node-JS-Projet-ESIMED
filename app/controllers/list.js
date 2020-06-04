class ListController extends BaseController {
    constructor() {
        super();
        this.list = self.currentList;
        this.flagDetailsProp = self.flagDetailsProp;
        this.flagDetailsProp ? this.showItems() : this.showItemsPartage()
    }

    async showItems(){
        let date = this.list.date.toLocaleDateString();
        let chk = '';
        let content = '';
        $('#title-item-list').innerHTML = 'Liste du ' + date + ' pour ' + this.list.label;

        for (const item of await this.model.getAllItemsFromList(this.list.id)) {
            item.ischecked ? chk = 'checked' : chk = '';
            content += `<div id='row-${item.id}' class='row row-item'>
                <div class="col s1"><label class="input-field col s1"><input id="check-${item.id}" type="checkbox" ${chk} onclick="listController.clickCheck(this, ${item.id}, event)"/><span></span></label></div>
                <div class="col s2">${item.quantite}</div>
                <div class="col s7">${item.label}</div>
                <div class="col s2">
                            <a class="btn waves-effect waves-light" title="Modifier" onclick="listController.modifItem(${item.id})"><i class="material-icons">create</i></a>
                            <a class="btn waves-effect waves-light" title="Supprimer" onclick="listController.deleteItem(${item.id})"><i class="material-icons">delete</i></a></div>
            </div>`
        }
        $('#list-item-body').innerHTML = content;

    }

    async showItemsPartage(){
        let date = this.list.date.toLocaleDateString();
        let chk = '';
        this.list.droit ? '' : $('#adding-item').style.display = 'none';
        let checked = this.list.droit ? '' : 'disabled="disabled"';
        let content = '';
        $('#title-item-list').innerHTML = 'Liste du ' + date + ' pour ' + this.list.label;

        for (const item of await this.model.getItemsPartage(this.list.id)) {
            const actions = this.list.droit ? `<a class="btn waves-effect waves-light" title="Modifier" onclick="listController.modifItem(${item.id})"><i class="material-icons">create</i></a>\n` +
                                              `<a class="btn waves-effect waves-light" title="Supprimer" onclick="listController.deleteItem(${item.id})"><i class="material-icons">delete</i></a>`
                                            : 'Vous n\'avez pas les droits';
            item.ischecked ? chk = 'checked' : chk = '';
            content += `<div id='row-${item.id}' class='row row-item'>
                <div class="col s1"><label class="input-field col s1"><input id="check-${item.id}" type="checkbox" ${chk} ${checked} onclick="listController.clickCheck(this, ${item.id}, event)"/><span></span></label></div>
                <div class="col s2">${item.quantite}</div>
                <div class="col s7">${item.label}</div>
                <div class="col s2">
                            ${actions}
                </div>
            </div>`
        }
        $('#list-item-body').innerHTML = content;

    }

    async deleteItem(id){
        try {
            let e = $(`#row-${id}`);
            let item = this.flagDetailsProp ? await this.model.getItem(id) :  await this.model.getItemPartage(id);
            console.log(item)
            if(!this.checkError(item)) return;
            if (confirm("Êtes-vous sûr de vouloir supprimer cette liste de course ? ")) {
                this.flagDetailsProp ? await this.model.deleteItem(id) : await this.model.deletePartageItem(id);
                this.deletedItem = item;
                e.parentNode.removeChild(e);
                await this.displayDeletedMessage('listController.undoDelete()');
                this.flagDetailsProp ? this.showItems() : this.showItemsPartage();
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    undoDelete() {
        if (this.deletedItem) {
            this.model.insertItem(this.deletedItem).then(status => {
                if (status == 200) {
                    this.deletedItem = null;
                    this.displayUndoDone();
                }
            }).then(_ => this.flagDetailsProp ? this.showItems() : this.showItemsPartage())
                .catch(_ => this.displayServiceError())

        }
    }

    async ajouterItem(){
        try{
            let quantite = this.validateRequiredField('#input-item-quantite', 'Quantité');
            let label = this.validateRequiredField('#input-item-label', 'Label');
            if(quantite != null && label != null){
                let item = new Item(null, label, quantite, this.list.id, false);
                await this.model.insertItem(item).then(_ =>{
                    this.flagDetailsProp ? this.showItems() : this.showItemsPartage();
                    this.toast(quantite == 1 ? `1 ${label} ajouté.` : `${quantite} ${label} ajoutés.`);
                    $('#input-item-quantite').value = '';
                    $('#input-item-label').value = '';
                });
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    async modifItem(id){
        try{
            let item = this.flagDetailsProp ? await this.model.getItem(id) :  await this.model.getItemPartage(id);
            if(!this.checkError(item)) return;
            this.currentItemUpdated = item;
            $('#input-item-modif-quantite').value = item.quantite;
            $('#input-item-modif-label').value = item.label;
            this.getModal("#modal-modif-item").open();
        }
        catch (e) {
            console.log(e);
            this.displayServiceError();
        }
    }

    async updateItem(){
        let quantite = this.validateRequiredField('#input-item-modif-quantite', 'Quantité');
        let label = this.validateRequiredField('#input-item-modif-label', 'Label');
        this.currentItemUpdated.quantite = quantite;
        this.currentItemUpdated.label = label;
        if(quantite != null && label != null){
            this.flagDetailsProp ? await this.model.updateItem(this.currentItemUpdated) : await this.model.updatePartageItem(this.currentItemUpdated);
            this.flagDetailsProp ? this.showItems() : this.showItemsPartage();
            this.getModal("#modal-modif-item").close();
        }
    }

    async clickCheck(e, id, event){
        event.preventDefault(); //Empêche la checkbox de check/uncheck toute seule
        let item = this.flagDetailsProp ? await this.model.getItem(id) :  await this.model.getItemPartage(id);
        if(!this.checkError(item)) return;
        e.checked = (e.checked ? false : true); //Si l'item est 'bon' on peux le switcher
        item.ischecked = e.checked;
        this.flagDetailsProp ? await this.model.updateItem(item) : await this.model.updatePartageItem(item);
    }

}

window.listController = new ListController();
