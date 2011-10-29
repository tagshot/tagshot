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
            id: 0
        };
    },
    star: function(nr, of) {
    },
    starHTML: function(){
        return function(text, render) {
            var stars = render(text).split("/");
			var blacks = parseInt(stars[0]);
			var whites = parseInt(stars[1]) - blacks;

			var blackstar = "<a href='#'>&#9733;</a>";
			var whitestar = "<a href='#'>&#9734;</a>";

			var buildString = function(star, count) {
				starString = "";
				for(var i=0; i<count; i++) {
					starString = starString + " " + star;
				};
				return starString;
			};

			var blackstars = buildString(blackstar, blacks);
			var whitestars = buildString(whitestar, whites);

			return blackstars+whitestars;
        }
    }
});

// array von photos
App.models.PhotoList  = Backbone.Collection.extend({
    model: App.models.Photo,
    url: "http://localhost:80/fotos.js"
});
