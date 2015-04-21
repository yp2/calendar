if (! Session.get('showDate')){
    var today = moment();
    Session.set('showDate', today.toISOString())
}

Template.home.helpers({
    calNavCurrent: function () {
        var date = moment(Session.get('dateShow'));
        //console.log(moment().calendar(date));
        return date.format("dddd, D MMMM YYYY");
    },
    calNavPrev: function () {
        var date = moment(Session.get('dateShow'));
        return date.subtract(1, 'days').format("dddd, D MMMM YYYY")
    },
    calNavNext: function () {
        var date = moment(Session.get('dateShow'));
        return date.add(1, 'days').format("dddd, D MMMM YYYY")
    }
});

Template.home.events({
    'click .calNavPrev' : function (e){
        e.preventDefault();
        var currentDate = moment(Session.get('dateShow'));
        var date = currentDate.subtract(1, 'days');
        Session.set('dateShow', date.toISOString());
    },
    'click .calNavNext' : function (e){
        e.preventDefault();
        var currentDate = moment(Session.get('dateShow'));
        var date = currentDate.add(1, 'days');
        Session.set('dateShow', date.toISOString());
    }
});