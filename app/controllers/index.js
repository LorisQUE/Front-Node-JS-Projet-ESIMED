class IndexController extends BaseController {
    constructor() {
        super();
        this.showCourse();
    }

    async showCourse() {
        let content = '';
        let listHeader = $('#lists-header');
        let listContainer = $('#lists-body');
        try {
            for (const list of await this.model.getAllLists()) {
                if (!list.isarchived){
                    const date = list.date.toLocaleDateString();
                    content += `
                        <div id="row-${list.id}" class="row row-list" onclick="indexController.openList(${list.id})">
                            <div class="col s5">${list.label}</div>
                            <div class="col s5">${date}</div>
                            <div class="col s2">
                            <a class="btn waves-effect waves-light" title="Modifier" onclick="indexController.modifCourse(${list.id});"><i class="material-icons">create</i></a>
                            <a class="btn waves-effect waves-light" title="Archiver" onclick="indexController.archiveCourse(${list.id});"><i class="material-icons">archive</i></a>
                            <a class="btn waves-effect waves-light" title="Supprimer" onclick="indexController.deleteCourse(${list.id});"><i class="material-icons">delete</i></a>
                            </div>
                        </div>
                    `
                }
            }

            listContainer.innerHTML = (content.trim() !== '' ? content : "Pas de liste");
            $('#lists-container').style.display = "block";
        } catch (err) {
            console.log(err);
            this.displayServiceError();
        }
    }

    async openList(id){
        let e = event.target;
        if (e.className !== "btn waves-effect waves-light" && e.className !== "material-icons") {
            let list = await this.model.getList(id);
            self.currentList = list;
            navigate('list');
        }
    }

    async archiveCourse(id){
        let e = $(`#row-${id}`);
        if(confirm("Êtes-vous sûr de vouloir archiver cette liste de course ? ")){
            let list = await this.model.getList(id);
            list.isarchived = true;
            this.model.updateList(list);
            e.parentNode.removeChild(e);
        }
        console.log(id)
    }

    async deleteCourse(id){
        let e = $(`#row-${id}`);
        let list = await this.model.getList(id);
        if(confirm("Êtes-vous sûr de vouloir supprimer cette liste de course ? ")){
            this.model.deleteList(id);
            this.deletedList = list;
            e.parentNode.removeChild(e);
            await this.displayDeletedMessage('indexController.undoDelete()');
            this.showCourse();
        }
        console.log(id)
    }
    async modifCourse(id){
        console.log(this.currentListUpdated)
        let list = await this.model.getList(id);
        this.currentListUpdated = list;
        console.log(this.currentListUpdated)
        const date = list.date.toLocaleDateString();
        $('#inputMagasinModif').value = list.label;
        $('#inputDateModif').value = date;
        this.getModal("#modal-modif-list").open();
    }

    async updateCourse(){
        let magasin = this.validateRequiredField('#inputMagasinModif', 'Magasin');
        let date = this.validateRequiredField('#inputDateModif', 'Date');
        this.currentListUpdated.label = magasin;
        this.currentListUpdated.date = date;
        console.log(this.currentListUpdated);
        if(magasin != null && date != null){
            await this.model.updateList(this.currentListUpdated);
            this.getModal("#modal-modif-list").close();
            this.showCourse();
        }
    }
    async ajouterCourse(){
        let magasin = this.validateRequiredField('#inputMagasin', 'Magasin');
        let date = this.validateRequiredField('#inputDate', 'Date');
        if(magasin != null && date != null){
            let list = new List(null, magasin, date, false);
            await this.model.insertList(list);
            this.showCourse()
                .then(this.toast(`La course du ${date} pour ${magasin} a été ajouté !`));
            $('#inputMagasin').value = '';
            $('#inputDate').value = '';
        }
    }

    async undoDelete() {
        if (this.deletedList) {
            this.model.insertList(this.deletedList).then(status => {
                if (status == 200) {
                    this.deletedList = null;
                    this.displayUndoDone();
                }
            }).then(this.showCourse())
                .catch(_ => this.displayServiceError());
        }
    }

}

window.indexController = new IndexController();
