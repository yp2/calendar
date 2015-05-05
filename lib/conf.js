moment.locale('pl');


CONF = {
    dFormat : "dddd, D MMMM YYYY",
    tFormat : "HH:00",
    dsFormat : 'DD-MM-YYYY',
    eventTypes: [
        {value: 'mine', option: "prywatne"},
        {value: 'plan', option: 'studia'},
        {value: 'planExtra', option: "zajęcia dodatkowe"}
    ]
};


parseDate = function (value) {
    if (value){
        var date = moment(value, CONF.dFormat);
        return date.format(CONF.dsFormat)
    } else {
        return null
    }
};

parseTime = function (value) {
    var time = moment(value, CONF.tFormat);
    return time.hour()
};
