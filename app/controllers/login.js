class LoginController extends BaseController {
    constructor() {
        super();
        this.svc = new UserAccountAPI();
    };
    async authenticate() {
        let login = this.validateRequiredField('#inputMail', 'Adresse e-mail');
        let password = this.validateRequiredField('#inputPass', 'Mot de passe');
        if ((login != null) && (password != null)) {
            this.svc.authenticate(login, password)
                .then(res => {
                    sessionStorage.setItem("token", res.token);
                    navigate('index');
                    $('#bandeau').style.display = "block";
                })
                .catch(err => {
                    console.log(err);
                    if (err == 401) {
                        this.toast("Adresse e-mail ou mot de passe incorrect");
                    } else {
                        this.displayServiceError();
                    }
                });
        }
    };
    async modalInscription(){
        const modal = $('#modal-ajout-user');

        const inputNom = $('#inscription-input-nom');
        const inputMail = $('#inscription-input-mail');
        const inputPass = $('#inscription-input-mdp');
        const inputPassBis = $('#inscription-input-mdp-bis');

        inputNom.value = "";
        inputMail.value = "";
        inputPass.value = "";
        inputPassBis.value = "";

        this.getModal('#modal-ajout-user').open();
    }

    async ajoutUser(){
        const inputNom = $('#inscription-input-nom');
        const inputMail = $('#inscription-input-mail');
        const inputPass = $('#inscription-input-mdp');
        const inputPassBis = $('#inscription-input-mdp-bis');

        let nom = this.validateRequiredField('#inscription-input-nom', 'Nom d\'utilisateur');
        let mail = this.validateRequiredField('#inscription-input-mail', 'Adresse e-mail');
        let mdp = this.validateRequiredField('#inscription-input-mdp', 'Mot de passe');
        let mdpBis = this.validateRequiredField('#inscription-input-mdp-bis', 'Répéter le mot de passe');

        if(!!nom && !!mail && !!mdp && !!mdpBis){ //Si les inputs sont bien remplis
            if(this.emailIsValid(inputMail.value)) //Si l'input mail est bien un mail
                this.getModal('#modal-ajout-user').close();
        }
    }
}

window.loginController = new LoginController();
