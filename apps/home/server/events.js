Meteor.publish("Events", function(selector, options) {
    if (this.userId) {
        var data = selector || {};
        _.extend(data, {'user._id': this.userId});
        return Events.find(data, options || {})
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