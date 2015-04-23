moment.locale('pl');

CONF = {
    dFormat : "dddd, D MMMM YYYY",
    tFormat : "HH:00"
};

parseDate = function (value) {
    if (value){
        var date = moment(value, CONF.dFormat);
        return date.toISOString()
    } else {
        return null
    }
};

parseTime = function (value) {
    var time = moment(value, CONF.tFormat);
    return time.hour()
}



//T9n.setLanguage('pl');

//AccountsTemplates.configure({
//    forbidClientAccountCreation: false,
//    homeRoutePath: '/'
//});

// adding and removing fields
//AccountsTemplates.removeField('email');
//AccountsTemplates.addFields([
//  {
//      _id: "username",
//      type: "text",
//      displayName: "username",
//      required: true,
//      minLength: 4,
//  }
//]);