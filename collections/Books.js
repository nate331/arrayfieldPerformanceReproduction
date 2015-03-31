Schemas = {};

months = ["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
years = [""];
for (var i = 2015; i > 1930; i--) {
    years.push(i);
}


Schemas.company = new SimpleSchema({
    name: {
        type: String,
        label: "company name"
    },
    position: {
        type: String,
        label: "Position"
    },
    "startDateMonth": {
        type: Number,
        label: "Start month",
        allowedValues: months,
        custom: function() {
            if (this.siblingField('startDateYear').value === this.siblingField('endDateYear').value) {
                if (this.value >= this.siblingField('endDateMonth').value) {
                    return "startDateMonthNotBeforeEndDateMonth";
                }
            }
        }
    },
    "startDateYear": {
        type: Number,
        label: "Start year",
        allowedValues: years,
        custom: function() {
            if (this.value > this.siblingField('endDateYear').value) {
                return "startDateYearAfterEndDateYear";
            }
        }
    },
    "endDateMonth": {
        type: Number,
        label: "Ende month",
        allowedValues: months,
        custom: function() {
            // End month/year is required only for past employers (not the current one)
            if (this.siblingField('isCurrent').value === false && !this.value) {
                return "required";
            }
            if (this.siblingField('startDateYear').value === this.siblingField('endDateYear').value) {
                if (this.value <= this.siblingField('startDateMonth').value) {
                    return "endDateMonthNotAfterStartDateMonth";
                }
            }
        },
        optional: true
    },
    "endDateYear": {
        type: Number,
        label: "Ende year",
        allowedValues: years,
        custom: function() {
            // End month/year is required only for past employers (not the current one)
            if (this.siblingField('isCurrent').value === false && !this.value) {
                return "required";
            }
            if (this.value < this.siblingField('startDateYear').value) {
                return "endDateYearBeforeStartDateYear";
            }
        },
        optional: true
    },
    description: {
        type: String,
        label: "description",
        optional: true
    },
    isCurrent: {
        type: Boolean,
        label: "current employer"
    }
});

Library = new Mongo.Collection("Library");
Library.attachSchema(new SimpleSchema({
  mycompanies: {
    type: [Schemas.company],
    label: "List of companies",
    optional: true,
    max: 200
  }
}));

Library.allow({
    insert: function(userId, doc) {
        return true;
    },
    update: function(userId, doc, fields, modifier) {
        return true;
    },
    remove: function(userId, doc) {
        return true;
    }
});
