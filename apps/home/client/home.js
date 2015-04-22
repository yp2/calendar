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

Template.home.onRendered(function(){
    var today = moment();
    this.$('#pickerDateFrom').datetimepicker({
        locale:"pl",
        format: "dddd, D MMMM YYYY",
        minDate: today
    });
    this.$('#pickerTimeFrom').datetimepicker({
        locale:"pl",
        format: "HH:00",
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
    })
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
    },
    //'blur #dateFrom': function (e, t){
    //    //console.log(e, t);
    //    var min = t.$("#dateFrom").val();
    //    min = moment(min, "dddd, D MMMM YYYY");
    //    //console.log(t.$('#pickerTimeFrom').data('DateTimePicker').minDate())
    //
    //
    //}
});