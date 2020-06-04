class PartageController extends BaseController {
    constructor() {
        super();
        this.showCourse();
    }

    async showCourse() {
        let content = '';
        let listHeader = $('#lists-header');
        let listContainer = $('#lists-body');
        try {
            for (const list of await this.model.getAllPartage()) {
                let modif = list.droit ? `<a class="btn waves-effect waves-light" title="Modifier" onclick="partageController.modifCourse(${list.list_id});"><i class="material-icons">create</i></a>` : 'Modification impossible';
                if (!list.isarchived) {
                    const date = list.date.toLocaleDateString();
                    content += `
                        <div id="row-${list.list_id}" class="row row-list" onclick="partageController.openList(${list.list_id})">
                            <div class="col s3">${list.displayname}</div>
                            <div class="col s4">${list.label}</div>
                            <div class="col s4">${date}</div>
                            <div class="col s1">
                                ${modif}
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

    async openList(id) {
        try {
            let e = event.target;
            if (e.className !== "btn waves-effect waves-light" && e.className !== "material-icons") {
                let list = await this.model.getListPartage(id);
                if(!this.checkError(list)) return;
                self.currentList = list;
                self.flagDetailsProp = false;
                navigate('list');
            }
        } catch (e) {
            console.log(e);
            this.displayServiceError();
        }
    }

    async modifCourse(id) {
        this.model.getListPartage(id)
            .then(list => {
                if (!this.checkError(list)) return;
                this.currentListUpdated = list;
                const date = list.date.toLocaleDateString();
                $('#inputMagasinModif').value = list.label;
                $('#inputDateModif').value = date;
                this.getModal("#modal-modif-list").open();
            }).catch(e => {
            console.log(e);
            this.displayServiceError();
        })
    }

    async updateCourse() {
        try {
            let magasin = this.validateRequiredField('#inputMagasinModif', 'Magasin');
            let date = this.validateRequiredField('#inputDateModif', 'Date');
            this.currentListUpdated.label = magasin;
            this.currentListUpdated.date = date;
            if (magasin != null && date != null) {
                await this.model.updateListPartage(this.currentListUpdated);
                this.getModal("#modal-modif-list").close();
                this.showCourse();
            }
        } catch (e) {
            console.log(e);
            this.displayServiceError();
        }
    }
}

window.partageController = new PartageController();