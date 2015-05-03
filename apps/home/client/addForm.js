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
        minDate: today,
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
            if (timeFrom.val()) {
                pickerTimeFrom.data("DateTimePicker").date(moment());
            }
        }
    });
});

Template.addForm.events({
    "click #createEvent" : function (e, t){
        e.preventDefault();
        // form data

        var hasErrors = [];

        var name = t.$("#name").val();
        var date = t.$("#dateFrom").val();
        var time = t.$("#timeFrom").val();

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
            console.log('nie ma');
            var formData = {
                name: name,
                date: parseDate(date),
                time: parseTime(time),
                user: {_id: Meteor.userId()}
            };
            var eventId = Events.insert(formData);
            if (eventId) {
                Alerts.add("Zadanie zostało dodane", "success", {});
                document.getElementById("addEventForm").reset();
            } else {
                Alerts.add("Zadanie nie zostało dodane", "danger")
            }
        }
    }
});