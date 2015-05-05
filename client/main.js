accountsUIBootstrap3.setLanguage('pl');

Accounts.ui.config({
    requestPermissions: {},
    passwordSignupFields: "USERNAME_AND_OPTIONAL_EMAIL"
});

Meteor.startup(function () {

    sAlert.config({
        effect: 'bouncyflip',
        position: 'top-right',
        timeout: 5000,
        html: false
    });

});

