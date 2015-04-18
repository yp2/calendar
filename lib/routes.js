Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
});


Router.onBeforeAction(function () {

    if (!Meteor.userId()){
        this.render('noLogin');
    } else{
        this.next();
    }
});


// Routes

Router.route('home', {
    name: 'home',
    path: '/',
    action: function () {
        if (this.ready()) {
            this.render();
        } else {
            this.render('loading')
        }
    }
});
