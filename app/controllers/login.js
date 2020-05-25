class LoginController extends BaseController {
    constructor() {
        super();
        this.svc = new UserAccountAPI();
    }

    validateRequiredField(selector, name) {
        const value =  $(selector).value;
        if ((value == null) || (value === "")) {
            this.toast(`Le champs '${name}' est obligatoire`);
            $(selector).style.backgroundColor = 'antiquewhite';
            return null
        }
        return value
    }

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
                    console.log(err)
                    if (err == 401) {
                        this.toast("Adresse e-mail ou mot de passe incorrect");
                    } else {
                        this.displayServiceError();
                    }
                })
        }
    }
}

window.loginController = new LoginController();
