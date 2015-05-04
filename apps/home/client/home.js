if (!Session.get('showDate')) {
    var today = moment();
    Session.set('showDate', today.format(CONF.dsFormat))
}

Template.home.onCreated(function () {
    var self = this;

    self.autorun(function () {
        self.subscribe("Events")
    });

});

function checkEvents (date, event) {
    var eventDuration = [];
    var otherDuration = [];
    var otherEvents = Events.find({date: date}).fetch();
    var result = true;

    for (var i = 0; i < event.duration; i++){
        eventDuration.push(event.time + i)
    }

    for(var y = 0; y < otherEvents.length; y ++){
        var otherEvent = otherEvents[y];
        for (var x = 0; x < otherEvent.duration; x ++) {
            otherDuration.push(otherEvent.time + x)
        }
    }

    if (_.intersection(eventDuration, otherDuration).length !== 0) {
        result = false
    }
    return result
}

function checkCurrentDate(event) {
    var today = moment();
    var showDate = Session.get('showDate');
    var result = true;
    if (showDate == today.format(CONF.dsFormat) && event.time < parseInt(today.format('H'))) {
        result = false
    }
    return result
}

Template.home.helpers({
    calNavCurrent: function () {
        var date = moment(Session.get('showDate'), CONF.dsFormat);
        return date.format(CONF.dFormat);
    },
    calNavPrev: function () {
        var date = moment(Session.get('showDate'), CONF.dsFormat);
        return date.subtract(1, 'days').format(CONF.dFormat)
    },
    calNavNext: function () {
        var date = moment(Session.get('showDate'), CONF.dsFormat);
        return date.add(1, 'days').format(CONF.dFormat)
    },
    checkToday: function (date) {
        var today = moment().format(CONF.dFormat);
        date = moment(date, CONF.dFormat).format(CONF.dFormat);
        return today === date
    },
    eventsForDay: function () {
        var day = Session.get('showDate');
        return Events.find({date: day}, {sort: {time: 1}})
    },
    eventsWoDay: function () {
        return Events.find({date: null}, {sort: {time: 1}})
    }
});

Template.home.onRendered(function () {
    var calNavPicker = this.$(".calNavPicker").datepicker({
        language: "pl",
        todayHighlight: true
    });

    calNavPicker.on("changeDate", function (e) {
        var selectedDate = moment(e.date);
        Session.set('showDate', selectedDate.format(CONF.dsFormat));
        $(".calNavPicker").datepicker("hide");
    });

    var dropPlaned = $('#drop-panel-planed-events');
    var dropPlan = $('#drop-panel-to-plan');

    function handleDragEnter(e) {
        $('#panel-planed-events').addClass('over')
    }

    function handleDragEnterToPlan(e) {
        $('#panel-to-plan').addClass('over')
    }

    function handleDragLeave(e) {
        $('#panel-planed-events').removeClass('over');
    }

    function handleDragLeaveToPlan(e) {
        $('#panel-to-plan').removeClass('over');
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    function handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        var id = Session.get('draged');
        var checkResult = checkEvents(Session.get('showDate'), Events.findOne({_id:id}));
        var checkDate = checkCurrentDate(Events.findOne({_id:id}));

        if (checkResult) {
            if (checkDate) {
                Events.update({_id: id}, {$set: {date: Session.get('showDate')}});
                sAlert.success("Zadanie zostało zaplanowane")

            } else {
                sAlert.error("Przeszłe zadanie - nie można zaplanować");
            }
        } else {
            sAlert.error("Zadanie nie zostało zaplanowane - zadania nachodzą się")
        }

        Session.set('draged', null);

        $('#panel-to-plan').removeClass('over');
        $('#panel-planed-events').removeClass('over');

        return false;
    }


    function handleDropToPlan(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        var id = Session.get('draged');

        Events.update({_id: id}, {$set: {date: null}});

        Session.set('draged', null);

        $('#panel-to-plan').removeClass('over');
        $('#panel-planed-events').removeClass('over');

        return falsse;
    }
    
    dropPlan.on('drop', handleDropToPlan);
    dropPlan.on('dragover', handleDragOver);
    dropPlan.on('dragenter', handleDragEnterToPlan);
    dropPlan.on('dragleave', handleDragLeaveToPlan);

    dropPlaned.on('dragover', handleDragOver);
    dropPlaned.on('dragenter', handleDragEnter);
    dropPlaned.on('dragleave', handleDragLeave);
    dropPlaned.on("drop", handleDrop);

});

Template.home.events({
    'click .calNavPrev': function (e) {
        e.preventDefault();
        var currentDate = moment(Session.get('showDate'), CONF.dsFormat);
        var date = currentDate.subtract(1, 'days');
        Session.set('showDate', date.format(CONF.dsFormat));
    },
    'click .calNavNext': function (e) {
        e.preventDefault();
        var currentDate = moment(Session.get('showDate'), CONF.dsFormat);
        var date = currentDate.add(1, 'days');
        Session.set('showDate', date.format(CONF.dsFormat));
    },
    "click .calNavCurrent": function (e) {
        e.preventDefault();
        Session.set('showDate', moment().format(CONF.dsFormat))
    }
});