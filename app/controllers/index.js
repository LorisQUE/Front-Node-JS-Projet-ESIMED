class IndexController extends BaseController {
    constructor() {
        super();
        if(sessionStorage.getItem('token')) this.showCourse();
    }

    async showCourse() {
        let content = '';
        try {
            const lists = await this.model.getAllLists();
            for (const list of lists) {
                if (!list.isarchived){
                    const date = list.date.toLocaleDateString();
                    content += `
                        <div id="row-${list.id}" class="row row-list" onclick="indexController.openList(${list.id})">
                            <div class="col s5">${list.label}</div>
                            <div class="col s4">${date}</div>
                            <div class="col s3">
                            <a class="btn waves-effect waves-light" title="Modifier" onclick="indexController.modifCourse(${list.id});"><i class="material-icons">create</i></a>
                            <a class="btn waves-effect waves-light" title="Archiver" onclick="indexController.archiveCourse(${list.id});"><i class="material-icons">archive</i></a>
                            <a class="btn waves-effect waves-light" title="Partager" onclick="indexController.ajoutPartageModal(${list.id})"><i class="material-icons">share</i></a>
                            <a class="btn waves-effect waves-light" title="Information" onclick="indexController.openPartage(${list.id})"><i class="material-icons">info_outline</i></a>
                            <a class="btn waves-effect waves-light" title="Supprimer" onclick="indexController.deleteCourse(${list.id});"><i class="material-icons">delete</i></a>
                            </div>
                        </div>
                    `
                }
            }

            $('#lists-body').innerHTML = (content.trim() !== '' ? content : "Pas de liste");
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
                let list = await this.model.getList(id);
                if(!this.checkError(list)) return;
                self.currentList = list;
                self.flagDetailsProp = true;
                navigate('list');
            }
        }catch (e) {
            console.log(e);
            this.displayServiceError();
        }
    }

    async archiveCourse(id){
        let e = $(`#row-${id}`);
        let list = await this.model.getList(id);
        if(!this.checkError(list)) return;
        if(confirm("Êtes-vous sûr de vouloir archiver cette liste de course ? ")){
            list.isarchived = true;
            this.model.updateList(list);
            e.parentNode.removeChild(e);
        }
    }

    async deleteCourse(id){
        try{
            let e = $(`#row-${id}`);
            let list = await this.model.getList(id);
            if(!this.checkError(list)) return;
            if(confirm("Êtes-vous sûr de vouloir supprimer cette liste de course ? ")){
                this.deletedList = {};
                this.deletedList.List = list;
                this.deletedList.Items = [];
                for (const item of await this.model.getAllItemsFromList(list.id)){ this.deletedList.Items.push(item); }
                this.model.deleteList(id);
                e.parentNode.removeChild(e);
                this.displayDeletedMessage('indexController.undoDelete()');
                this.showCourse();
            }
        }catch (e) {
            console.log(e);
            this.displayServiceError();
        }
    }
    async modifCourse(id){
        this.model.getList(id)
            .then(list => {
                if(!this.checkError(list)) return;
                this.currentListUpdated = list;
                const date = list.date.toLocaleDateString();
                $('#inputMagasinModif').value = list.label;
                $('#inputDateModif').value = date;
                this.getModal("#modal-modif-list").open();
            }).catch( e => {
                console.log(e);
                this.displayServiceError();
            })
    }

    async updateCourse(){
        try{
            let magasin = this.validateRequiredField('#inputMagasinModif', 'Magasin');
            let date = this.validateRequiredField('#inputDateModif', 'Date');
            this.currentListUpdated.label = magasin;
            this.currentListUpdated.date = date;
            if(magasin != null && date != null){
                await this.model.updateList(this.currentListUpdated);
                this.toast(`La liste a bien été modifiée`);
                this.getModal("#modal-modif-list").close();
                this.showCourse();
            }
        }catch (e) {
            console.log(e);
            this.displayServiceError();
        }
    }
    async ajouterCourse(){
        try{
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
        }catch (e) {
            console.log(e);
            this.displayServiceError();
        }
    }

    undoDelete() {
        if (this.deletedList.List) {
            this.model.insertList(this.deletedList.List).then(status => {
                if (status == 200) {
                    Promise.all(this.deletedList.Items.map(async item => await this.model.insertItem(item))).then( _ => {
                        this.deletedList.List = null;
                        this.deletedList.Items = [];
                        this.displayUndoDone();
                    }).catch(e=> {
                        console.log(e);
                        this.displayServiceError();
                    });
                }

            }).then(_ =>this.showCourse())
                .catch(_ => this.displayServiceError());
        }
    }

    async ajoutPartageModal(id){
        this.selectedUser = null;
        this.listId = id;
        const users = await this.model.getAllUser(); //tous les users
        const sharedUsers = await this.model.getAllPartageFromList(id); //Les users qui ont déjà un partage de cette liste
        const infoSelect = $('#ajout-partage-user-selection');
        const input = $('#ajout-partage-autocomplete-input');
        const options = {};
        let result;

        //Reset les données à l'ouvertur de la modal
        infoSelect.innerHTML = 'Vous n\'avez sélectionner personne';
        input.value = null;
        $('#radio-partage-lecture').checked = true;

        for(let i = 0; i < users.length; i++){ //Parcours sur TOUS les users
            sharedUsers.map( x => { //Parcours sur les users qui ont déjà cette liste en partage
                if(users[i].id == x.user_id) users.splice(i, 1); //Si l'user est dféjà partager on le vire du tableau
            });
            if(!!users[i]) options[users[i].login] = null; //Si l'user est toujours dans le tableau on le push dans les options
        }

        var elem = $('#ajout-partage-autocomplete-input');
        M.Autocomplete.init(elem, {data:options, minLength: 3, onAutocomplete: e =>{
                result = users.filter(x => x.login === e);
                this.selectedUser = result[0];
                infoSelect.innerHTML = (`Vous avez sélectionné <label class='important-stuff'>${result[0].displayname}</label>.`);
        }});

        this.getModal('#modal-ajout-partage').open();
    }

    async ajoutPartage(){
        try{
        const radio = $('#ajout-partage-radio');
        const radioValue = radio.elements["droit"].value;
        if(!(!!this.selectedUser)) return this.toast('Aucun utilisateur renseigné, veuillez sélectionner un utilisateur dans la barre de recherche');
        let partage = new Partage(null, this.selectedUser.id, this.listId, radioValue);
        this.toast(`Le partage pour ${this.selectedUser.displayname} a bien été créer`);
        this.model.insertPartage(partage)
            .then(this.getModal('#modal-ajout-partage').close())
            .catch( e=> console.log(e))
        }catch (e) {
            console.log('Erreur : ', e)
        }

    }

    async openPartage(id){
        let content = '';
        const list = await this.model.getList(id);
        const sharedUsers = await this.model.getAllPartageFromList(id);
        const modal = this.getModal('#modal-show-partage');
        const body = $('#modal-show-partage-body');
        let droit;
        $('#modal-show-partage-title').innerHTML = `Partages pour la liste ${list.label} du ${list.date.toLocaleDateString()}`;
        modal.open();
        if(sharedUsers.length !== 0 || !(!!sharedUsers)){
            //Entête du tableau
            content += '\n' +
                '        <div class="row">\n' +
                '            <b><div class="col s4">Nom</div>\n' +
                '                <div class="col s4">Login</div>\n' +
                '                <div class="col s2">Droit</div>\n' +
                '                <div class="col s1">Actions</div></b>\n' +
                '        </div>';
            //Body du tableau -> tous les partages
            for (const sharedUser of sharedUsers) {
                droit =(sharedUser.droit ? "Lecture Écriture" : "Lecture seule");
                    content += `
                            <div id="row-${sharedUser.id}" class="row row-partage">
                                <div class="col s4">${sharedUser.displayname}</div>
                                <div class="col s4">${sharedUser.login}</div>
                                <div class="col s2">${droit}</div>
                                <div class="col s1">
                                <!--<a class="btn waves-effect waves-light" title="Modifier" onclick=""><i class="material-icons">create</i></a>-->
                                <a class="btn waves-effect waves-light" title="Supprimer" onclick="indexController.deletePartage(${sharedUser.id})"><i class="material-icons">delete</i></a>
                                </div>
                            </div>
                        `
            }
            body.innerHTML = content;
        }
        else{
            body.innerHTML = '<h5 style="margin-left: 15px;">Aucun partage disponible pour la liste.</h5>'
        }

    }
    async deletePartage(id){
        try{
            let e = $(`#row-${id}`);
            let partage = await this.model.getPartage(id);
            console.log(partage)
            if(!this.checkError(partage)) return;
            if(confirm("Êtes-vous sûr de vouloir supprimer ce partage ? ")){
                this.model.deletePartage(id);
                this.toast(`Le partage a bien été supprimé`);
                e.parentNode.removeChild(e);
            }
        }catch (e) {
            console.log(e);
            this.displayServiceError();
        }
    }

}

window.indexController = new IndexController();