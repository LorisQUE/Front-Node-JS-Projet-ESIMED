class ProfilController extends BaseController {
    constructor() {
        super();
        this.showProfil();
        this.svc = new UserAccountAPI();
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

        //Si aucun des champs ne sont remplis
        if(!(!!nom) && !(!!mail) && !(!!mdp) && !(!!mdpBis))
            this.getModal('#modal-profil').close();
        //Si le champs nom est modifier
        if(!!nom) user.displayname = nom;
        //Si le champs mail est modifié
        if(!!mail) user.login = mail;
        //Si le mail de l'user est valide
        if(this.emailIsValid(user.login)){
            //Si le champs mot de passe est modifié et que les deux champs ont les mêmes valeurs
            if(!!mdp && this.passIsValid(mdp, mdpBis)){
                user.challenge = mdp;
            }
            else if (!!mdp) return false; //Si le champs mdp est modifié mais que le champs répeter n'a pas la même valeur

            //on update l'user
            this.svc.update(user).then( async res => {
                if (res === 409 ) this.toast('L\'email que vous avez saisi est déjà utilisé par un autre utilisateur');
                else if (!!res.token){
                    sessionStorage.setItem("token", res.token);
                    navigate('profil')
                }
            })
        }
    }

}

window.profilController = new ProfilController();