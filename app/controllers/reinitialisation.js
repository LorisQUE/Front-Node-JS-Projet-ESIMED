class ReinitialisationController extends BaseController {
    constructor() {
        super();
        this.svc = new UserAccountAPI();
        this.urlParams = new URLSearchParams(window.location.search);
        this.token = this.urlParams.get('t');
        this.id = this.urlParams.get('i');
        if(!(!!this.token) || !(!!this.id)) { this.toast('Vous n\'avez pas les paramètres nécessaires'); navigate('login')}
    };

    async validate(){
        const pass = $('#input-reinit-pass').value;
        const passBis = $('#input-reinit-pass-bis').value;
        if(!!pass && this.passIsValid(pass, passBis)){
           this.svc.reinitPass(this.token, this.id, pass).then( (res, err) => {
               if (res === 200) {
                   this.toast('Votre nouveau mot de passe a été pris en compte !');
                   navigate('login');
               }
               else if (err) this.toast('Il y a eu un problème, votre mot de passe n\'a pas été pris en compte');
           }).catch(e => {
               if (e === 401) this.toast('Le token est invalide ou à expiré')
           })
       }
    }
}

window.reinitialisationController = new ReinitialisationController();