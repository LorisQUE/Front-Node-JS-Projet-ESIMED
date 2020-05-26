class HistoriqueController extends BaseController {
    constructor() {
        super();
        this.showCourse();
    }

    async showCourse() {
        try {
        let content = '';
        let listHeader = $('#lists-header');
        let listContainer = $('#lists-body');
            for (const list of await this.model.getAllLists()) {
                if (list.isarchived){
                    console.log(list);
                    const date = list.date.toLocaleDateString();
                    content += `
                        <div id="row-${list.id}" class="row row-list" onclick="historiqueController.openList(${list.id})">
                            <div class="col s5">${list.label}</div>
                            <div class="col s5">${date}</div>
                            <div class="col s2">
                            <a class="btn waves-effect waves-light" title="Supprimer" onclick="historiqueController.deleteCourse(${list.id});"><i class="material-icons">delete</i></a>
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
        try{
        let e = event.target;
        if (e.className !== "btn waves-effect waves-light" && e.className !== "material-icons") {
        let content = '';
        let chk = '';
        let list = await this.model.getList(id);
        const date = list.date.toLocaleDateString();
        $('#modal-histo-title').innerHTML = `<h4>Liste du ${date} pour ${list.label}</h4>` //'#modal-histo-body'
        if ( await this.model.getAllItemsFromList(id) == '' ) content = `<h5 style="margin-left: 15px;">Aucun item disponible pour la liste.</h5>`;
        else{
        for (const item of await this.model.getAllItemsFromList(id)) {
            item.ischecked ? chk = 'checked' : chk = '';

            console.log('item', item)
            content += `<div id='row-${item.id}' class='row'>
                <div class="col s2"><label class="input-field col s1"><input type="checkbox" ${chk} disabled="disabled"/><span></span></label></div>
                <div class="col s4">${item.quantite}</div>
                <div class="col s6">${item.label}</div>
            </div>`
        }
        }
        $('#modal-histo-body').innerHTML = content;
        this.getModal("#modal-histo-list").open();
        }
        } catch (err) {
            console.log(err);
            this.displayServiceError();
        }
    }

    deleteCourse(id){
        let e = $(`#row-${id}`);
        if(confirm("Êtes-vous sûr de vouloir supprimer cette liste de course ? ")){
            this.model.deleteList(id);
            this.toast(`${list.label} a été supprimé !`);
            e.parentNode.removeChild(e);
        }
        console.log(id)
    }
}

window.historiqueController = new HistoriqueController();
