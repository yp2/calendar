Template.addForm.helpers({
    hourOptions: function () {
        var options = [];
        var showDate = Session.get('selectedDate') ? Session.get('selectedDate') : moment().format(CONF.dsFormat) ;
        var today = moment().format(CONF.dsFormat);
        var selectedHour = Session.get('selectedHour');
        var fromHour;
        var h;

        if (showDate !== today) {
            fromHour = 0;

        } else {
            fromHour = moment().format("H")
        }
        selectedHour ? h = selectedHour :  h = fromHour;
        h = 24 - h;
        for (var i = 1; i <= h; i++){
            options.push({value:i, option:i})
        }
        return options;
    },
    typeOptions: function () {
        return CONF.eventTypes;
    }
});

Template.addForm.onRendered(function () {
    var today = moment();
    this.$('#pickerDateFrom').datetimepicker({
        locale: "pl",
        format: CONF.dFormat,
        minDate: today
    });
    this.$('#pickerTimeFrom').datetimepicker({
        locale: "pl",
        format: CONF.tFormat,
        //minDate: today,
        maxDate: moment({hour: 23, minute: 59})
    });

    this.$('#pickerDateFrom').on('dp.change', function (e) {
        var today = moment().format('DD-MM-YYYY');
        var eventDate = e.date.format('DD-MM-YYYY');

        var pickerTimeFrom = $('#pickerTimeFrom');
        var timeFrom = $("#timeFrom");
        if (today !== eventDate) {
            pickerTimeFrom.data("DateTimePicker").maxDate(moment({hour: 23, minute: 59}));
            pickerTimeFrom.data("DateTimePicker").minDate(moment({hour: 0, minute: 0}));
        } else {
            pickerTimeFrom.data("DateTimePicker").maxDate(moment({hour: 23, minute: 59}));
            pickerTimeFrom.data("DateTimePicker").minDate(moment());
            if (timeFrom.val() && parseInt(timeFrom.val()) < moment().format('H')) {
                pickerTimeFrom.data("DateTimePicker").date(moment());
            }
        }
    });

    this.$('#pickerTimeFrom').on('dp.change', function (e) {
        var hour = e.date.format("H");
        var selectedDate = e.date.format(CONF.dsFormat);

        Session.set('selectedHour', hour);
        Session.set('selectedDate', selectedDate)
    })
});

Template.addForm.events({
    "click #createEvent" : function (e, t){
        e.preventDefault();

        var hasErrors = [];

        var name = t.$("#name").val();
        var date = t.$("#dateFrom").val();
        var time = t.$("#timeFrom").val();
        var duration = t.$("#duration").val();
        var eventType = t.$("#type").val();
        var type = {
            type: eventType,
            name: _.findWhere(CONF.eventTypes, {value: eventType}).option
        };

        console.log();
        var fgDivName = t.$("div.form-group:has(#name)");
        var helpTextName = t.$('#name~p.help-block');
        var fgDivTime = t.$("div.form-group:has(#timeFrom)");
        //var helpTextTime = t.$('#timeFrom~p.help-block');
        var helpTextTime = t.$('#help-block-time');

        if (name.length == 0) {
            fgDivName.addClass('has-error');
            helpTextName.html("Pole nie może być puste");
            helpTextName.css('display', 'inherit' );
            hasErrors.push('name');
        } else {
            fgDivName.removeClass('has-error');
            helpTextName.html("");
            helpTextName.css('display', 'none');
            _.without(hasErrors, 'name')
        }

        if (time.length == 0){
            fgDivTime.addClass('has-error');
            helpTextTime.html("Pole nie może być puste");
            helpTextTime.css('display', 'inherit' );
            hasErrors.push('time');
        } else {
            fgDivTime.removeClass('has-error');
            helpTextTime.html("");
            helpTextTime.css('display', 'none');
            _.without(hasErrors, 'time')
        }

        if (hasErrors.length == 0) {
            var formData = {
                name: name,
                date: parseDate(date),
                time: parseTime(time),
                toTime: parseTime(time) + parseInt(duration),
                user: {_id: Meteor.userId()},
                duration: duration,
                type: type
            };

            var addEvent = false;

            if(date.length != 0) {
                // dodajemy zadanie z datą
                var fakeEvent = {
                    time: parseTime(time),
                    duration: duration
                };
                var chEvents = checkEvents(parseDate(date), fakeEvent);
                var chDate = checkCurrentDate(fakeEvent);
                if (chEvents) {
                    if (chDate) {
                        addEvent = true;
                    } else {
                        sAlert.error("Przeszłe zadanie - nie można zaplanować");
                    }
                } else {
                    sAlert.error("Zadanie nie zostało zaplanowane - zadania nachodzą się")
                }
            } else {
                // dodajemy zadanie bez daty
                addEvent = true;
            }

            if (addEvent) {
                var eventId = Events.insert(formData);
                if (eventId) {
                    sAlert.success("Zadanie zostało dodane");
                    document.getElementById("addEventForm").reset();
                    t.$('#pickerTimeFrom').data("DateTimePicker").minDate(moment({
                        hour: 0,
                        minute: 0
                    }));
                    t.$('#pickerDateFrom').data("DateTimePicker").minDate(moment());
                } else {
                    sAlert.error("Zadanie nie zostało dodane")
                }
            }
        }
    }
});