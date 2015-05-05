checkEvents = function  (date, event) {
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
};

checkCurrentDate = function (event) {
    var today = moment();
    var showDate = Session.get('showDate');
    var result = true;

    if (showDate < today.format(CONF.dsFormat)) {
        result = false;
    } else if (showDate == today.format(CONF.dsFormat) && event.time < parseInt(today.format('H')) ) {
        result = false;
    }

    return result
};