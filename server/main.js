/**
 * Created by daniel on 31.03.15.
 */



Meteor.startup(function () {
    // code to run on server at startup
    if (!Meteor.users.findOne({username: 'root'})) {
        var userId = Accounts.createUser({
            username: 'root',
            password: '11111111'
        });
    }



});

