$(function(){
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

    var photo = ErrorHandlingModel.extend({
        //methoden der photoistanz als json
        initialize: function(options) {
            console.log("initialisiere Objekt mit der Nummer: "+this.get("id"));
            ErrorHandlingModel.prototype.initialize.call(this, options);
        },
        defaults: function() {
            return {
                id: 0
            };
        },
        star: function(nr,of){}
    });

    // array von photos
    var Photoclass = Backbone.Collection.extend({
        model: photo,
        url: "http://localhost:80/fotos.js"
    });
    Photos = new Photoclass();

    var debug = function(){
        //lesen
        console.log(Photos.get(42).get("exif").date);

        //aendern
        var photo42 = Photos.get(42);
        var exif = photo42.get("exif");
        exif.date = "tomorrow";
        photo42.set({"exif":exif});

        photo42.save();

        //oder
        //photo42.save({"exif":exif});

        //ausgeben
        console.log("JSONified:");
        console.log(photo42.toJSON());
    }

    //Photos.bind("reset", debug, this);
    Photos.fetch();
    });
