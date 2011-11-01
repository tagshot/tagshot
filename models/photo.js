ErrorHandlingModel = Backbone.Model.extend({
    initialize: function(attributes, options) {
        options || (options = {});
        this.bind("error", this.defaultErrorHandler);
        this.init && this.init(attributes, options);
    },
    defaultErrorHandler: function(model, error) {
        console.error(error.statusText,error);
        if (error.status == 401 || error.status == 403) {
            // trigger event or route to login here.
        } else {
            //TODO einkommentieren
            //alert("Status code: " + error.status + "\n" + error.statusText);
        }
    }
});

App.models.Photo = ErrorHandlingModel.extend({
    initialize: function(options) {
        console.log("initialisiere Objekt mit der Nummer: "+this.get("id"));
        ErrorHandlingModel.prototype.initialize.call(this, options);
    },
    defaults: function() {
        return {
            id: 0,
            selected: false
        };
    },
    star: function(nr, of) {
    },
    isSelected: function() {
        return this.get("selected");
    },
    select: function() {
        this.set({"selected": true});
    },
    deselect: function() {
        this.set({"selected": false});
    }

});

// array von photos
App.models.PhotoList  = Backbone.Collection.extend({
    model: App.models.Photo,
    url: "fotos.js",
    // return the current selection
    selection: function() {
        return this.filter(function(photo){ return photo.get('selected'); });
    }
});
