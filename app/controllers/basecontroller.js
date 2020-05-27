class BaseController {
    constructor() {
        M.AutoInit();
        this.setBackButtonView('index');
        this.model = new Model();
        this.datepickerToFrench();
    }
    checkAuthentication() {
        if (sessionStorage.getItem("token") === null) {
            window.location.replace("login.html")
        }
    }
    checkError(obj){
        console.log('obj',obj)
        if(obj === null) return this.displayNotFoundError();
        else if(obj === undefined) return this.displayServiceError();
        else if(obj === 403) return this.displayUnauthorizedError();
        else return true;
    }
    toast(msg) {
        M.toast({html: msg, classes: 'rounded'})
    }
    displayDeletedMessage(onUndo) {
        this.toast( `<span>Supression effectuée</span><button class="btn-flat toast-action" onclick="${onUndo}">Annuler</button>`)
    }
    displayUndoDone() {
        this.toast('Opération annulée')
    }
    displayUnauthorizedError(){
        this.toast('Vous n\'avez pas les droits nécessaires');
    }
    displayNotFoundError() {
        this.toast('Entité inexistante')
    }
    displayServiceError() {
        this.toast( 'Service injoignable ou problème réseau')
    }
    getModal(selector) {
        return M.Modal.getInstance($(selector))
    }
    setBackButtonView(view) {
        window.onpopstate = function() {
            navigate(view)
        }; history.pushState({}, '');
    }
    validateRequiredField(selector, name) {
        const value =  $(selector).value.trim();
        if ((value == null) || (value === "")) {
            this.toast(`Le champs '${name}' est obligatoire`);
            $(selector).style.backgroundColor = 'antiquewhite';
            return null
        }
        return value
    }
    datepickerToFrench(){
        const Calender = $('.datepicker');
        M.Datepicker.init(Calender, {
            format: 'dd/mm/yyyy',
            autoClose: true,
            showClearBtn: true,
            i18n: {
                done: "",
                clear: "supprimer",
                cancel: "retour",
                months: ['Janvier',
                    'Février',
                    'Mars',
                    'Avril',
                    'Mai',
                    'Juin',
                    'Juillet',
                    'Août',
                    'Septemb.',
                    'Octob.',
                    'Novemb.',
                    'Décemb.'],
                weekdaysAbbrev: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
                weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
                monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Dec']
            }
        });
    }



}
