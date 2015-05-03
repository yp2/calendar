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
    },
    eventColor: function (event) {
        var cls = 'list-group-item-danger';
        if (event.type.type === 'mine') {
            cls = 'list-group-item-success';
        } else if (event.type.type === 'planExtra') {
            cls = 'list-group-item-info'
        }
        return cls;
    }
});

Template.eventsPlaned.events({
    "click .data-delete": function (e, t) {
        e.preventDefault();
        var id = t.$(".data-delete").attr('data-id');
        if(confirm("Czy chesz usunąć zadanie ?")){
            var result = Events.remove({_id: id});
            if (result === 1) {
                Alerts.add("Zadanie zostało usunięta", "success");
            } else {
                Alerts.add("Zadanie nie mogło zostać usunięte", "danger")
            }

        }

    }
});