class ProfilController extends BaseController {
    constructor() {
        super();
        this.showProfil();
    };

    async showProfil(){
        const user = await this.model.getUserByToken();
        $('#profil-nom').value = user.displayname;
        $('#profil-mail').value = user.login;
        M.updateTextFields();
    }

    async openProfilModal(){
        $('#profil-input-nom').value = '';
        $('#profil-input-mail').value = '';
        $('#profil-input-mdp').value = '';
        $('#profil-input-mdp-bis').value = '';
        M.updateTextFields();
        this.getModal('#modal-profil').open();
    }

    async updateProfil(){
        const user = await this.model.getUserByToken();
        //On change le password à null, il aura une valeur que si une modification est faite, et dans l'API on vérifie que si le mdp de l'objet est vide, nul besoin d'appeler l'updatePassword()
        user.challenge = '';
        const nom = $('#profil-input-nom').value.trim();
        const mail = $('#profil-input-mail').value.trim();
        const mdp = $('#profil-input-mdp').value;
        const mdpBis = $('#profil-input-mdp-bis').value;

        if(!(!!nom) && !(!!mail) && !(!!mdp) && !(!!mdpBis))
            this.getModal('#modal-profil').close();

        if(!!nom) user.displayname = nom;
        if(!!mail) user.login = mail;

        if(this.emailIsValid(user.login)){
            if(!!mdp && this.passIsValid(mdp, mdpBis)){
                user.challenge = mdp;
            }
            else if (!!mdp) return false;

            await this.model.updateUser(user);
        }
    }

}

window.profilController = new ProfilController();