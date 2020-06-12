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
                    } else if (err === 409){
                        this.toast("Le compte n'a pas encore été validé");
                    }else {
                        this.displayServiceError();
                    }
                });
        }
    };

    sendEmailModal(){
        const login = $('#reinitialisation-input-renvoie-mail').value;
        //Si le mail est valide
        if(this.emailIsValid(login)){
            this.svc.reinitialisation(login).then( async (err, res) => {
               if(res === 404) this.toast('Aucun compte n\'est affilié à ce mail');
               else {


                   this.getModal('#modal-envoie-mail').close();
               }
            });
        }
    }
}

window.loginController = new LoginController();