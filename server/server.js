Meteor.startup(function() {
    if (Library.find().count() === 0) {
        Library.insert({mycompanies: []});
    }
});
