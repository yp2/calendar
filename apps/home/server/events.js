Meteor.publish("Events", function(selector, options) {
    if (this.userId) {
        var data = selector || {};
        var opt = options || {};
        _.extend(opt , {sort: {time: 1}});
        _.extend(data, {'user._id': this.userId});
        return Events.find(data, opt);
    }
});

Events.allow({
    insert: function(userId, doc) {
        if (userId === doc.user._id){
            return userId;
        }
    },
    update: function(userId, doc, fields, modifier) {
        if (userId === doc.user._id){
            return userId;
        }
    },
    remove: function(userId, doc) {
        if (userId === doc.user._id){
            return userId;
        }
    }
});
