class InscriptionController extends BaseController {
    constructor() {
        super();
    }
    async ajoutUser(){
        const nom = $('#inscription-input-nom').value;
        const mail = $('#inscription-input-mail').value;
        const pass = $('#inscription-input-mdp').value;
        const passBis = $('#inscription-input-mdp-bis').value;

        let verNom = this.validateRequiredField('#inscription-input-nom', 'Nom d\'utilisateur');
        let verMail = this.validateRequiredField('#inscription-input-mail', 'Adresse e-mail');
        let verMdp = this.validateRequiredField('#inscription-input-mdp', 'Mot de passe');
        let verMdpBis = this.validateRequiredField('#inscription-input-mdp-bis', 'Répéter le mot de passe');

        if(!!verNom && !!verMail && !!verMdp && !!verMdpBis){ //Si les inputs sont bien remplis
            if(this.emailIsValid(mail) && this.passIsValid(pass, passBis)){ //Si l'input mail est bien un mail & que les mots de passes sont les mêmes
                const user = new User(null, nom, mail, pass, false);
                this.model.inscription(user).then(
                    (res) => {
                        if(res === 200) {this.toast('Vous allez recevoir un mail de confirmation, pour pouvoir vous connecter, il faut valider le lien.'); navigate('login');}
                        else if (res === 409) this.toast('Un compte avec cette adresse mail existe déjà !');
                        else this.displayServiceError();
                    });
            }
        }
    };

    ouvrirModal(){
        $('#inscription-input-renvoie-mail').value = "";
        this.getModal('#modal-renvoie').open();
    }

    async resendEmailModal(){
        const mail = $('#inscription-input-renvoie-mail').value;
        if(this.emailIsValid(mail))
            this.model.resendEmail(mail).then( res => {
                if (res === 404) this.toast('Aucun compte n\'a cette adresse mail');
                else if(res === 401) this.toast('Votre compte est déjà valider !');
                else if(res === 200) {this.toast('Vous allez recevoir un mail de confirmation, pour pouvoir vous connecter, il faut valider le lien.'); navigate('login');}

            })
    }
}

window.inscriptionController = new InscriptionController();