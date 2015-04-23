Template.layout.helpers({
    today: function (){
        return moment().format("dddd, D MMMM YYYY");
    }

});

Alerts.defaultOptions.autoHide = true;
Alerts.defaultOptions.alertsLimit = 1;
Alerts.defaultOptions.fadeOut = 2000;
