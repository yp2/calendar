if (! Session.get('showDate')){
    var today = moment();
    console.log(today.format(CONF.dsFormat));
    Session.set('showDate', today.format(CONF.dsFormat))
}

Template.home.onCreated(function () {
    var self = this;

    self.autorun(function () {
        self.subscribe("Events")
    });

});

Template.home.helpers({
    calNavCurrent: function () {
        var date = moment(Session.get('showDate'), CONF.dsFormat);
        //console.log(moment().calendar(date));
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
    eventsForDay : function () {
        var day = Session.get('showDate');
        return Events.find({date: day}, {sort: {time: 1}})
    },
    eventsWoDay : function () {
        //console.log(Events.find({date: null}).fetch());
        return Events.find({date: null}, {sort: {time: 1}})
    }
});

Template.home.onRendered(function(){
    var today = moment();
    this.$('#pickerDateFrom').datetimepicker({
        locale:"pl",
        format: CONF.dFormat,
        minDate: today
    });
    this.$('#pickerTimeFrom').datetimepicker({
        locale:"pl",
        format: CONF.tFormat,
        minDate: today,
        maxDate: moment({hour: 23, minute: 59})
    });

    this.$('#pickerDateFrom').on('dp.change', function(e){
        var today = moment().format('DD-MM-YYYY');
        var eventDate = e.date.format('DD-MM-YYYY');

        var pickerTimeFrom = $('#pickerTimeFrom');
        var timeFrom = $("#timeFrom");
        if (today !== eventDate){
            pickerTimeFrom.data("DateTimePicker").maxDate(moment({hour: 23, minute: 59}));
            pickerTimeFrom.data("DateTimePicker").minDate(moment({hour: 0, minute: 0}));
        } else {
            pickerTimeFrom.data("DateTimePicker").maxDate(moment({hour: 23, minute: 59}));
            pickerTimeFrom.data("DateTimePicker").minDate(moment());
            if(timeFrom.val()){
                    pickerTimeFrom.data("DateTimePicker").date(moment());
            }
        }
    });

    var calNavPicker = this.$(".calNavPicker").datepicker({
        language: "pl",
        todayHighlight: true
    });

    calNavPicker.on("changeDate", function(e){
        var selectedDate = moment(e.date);
        Session.set('showDate', selectedDate.format(CONF.dsFormat));
        $(".calNavPicker").datepicker("hide");
    })
});

Template.home.events({
    'click .calNavPrev' : function (e){
        e.preventDefault();
        var currentDate = moment(Session.get('showDate'), CONF.dsFormat);
        var date = currentDate.subtract(1, 'days');
        Session.set('showDate', date.format(CONF.dsFormat));
    },
    'click .calNavNext' : function (e){
        e.preventDefault();
        var currentDate = moment(Session.get('showDate'), CONF.dsFormat);
        var date = currentDate.add(1, 'days');
        Session.set('showDate', date.format(CONF.dsFormat));
    },
    "click .calNavCurrent" : function (e) {
        e.preventDefault();
        Session.set('showDate', moment().format(CONF.dsFormat))
    },
    "click #createEvent" : function (e, t){
        e.preventDefault();
        // form data
        var formData = {
            name: t.$("#name").val(),
            date: parseDate(t.$("#dateFrom").val()),
            time: parseTime(t.$("#timeFrom").val()),
            user: {_id: Meteor.userId()}
        };
        var eventId = Events.insert(formData);
        if (eventId) {
            Alerts.add("Zadanie zostało dodane", "success", {})
        } else {
            Alerts.add("Zadanie nie zostało dodane", "danger")
        }
    }
});