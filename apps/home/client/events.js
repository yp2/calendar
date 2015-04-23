Template.eventsPlaned.onRendered(function () {
    var self = this;

    var data = Template.currentData();
    var more = self.$("#more"+data.event._id);
    var show = self.$("#showMore"+data.event._id + " i");
    more.hide();

    show.on('click', function (e){
        e.preventDefault();
        more.toggle(400);
        if(show.hasClass("fa-angle-down")){
            show.removeClass("fa-angle-down");
            show.addClass("fa-angle-up")
        } else {
            show.removeClass("fa-angle-up");
            show.addClass("fa-angle-down")
        }
    })
});

Template.eventsPlaned.helpers({
    makeId: function (cls) {
        var data = Template.currentData();
        return cls + data.event._id
    }
});

Template.eventsPlaned.events({

});