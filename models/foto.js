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

    var foto = ErrorHandlingModel.extend({
        //methoden der fotoistanz als json
        initialize: function(options) {
            console.log("initialisiere Objekt mit der Nummer: "+this.get("id"));
            ErrorHandlingModel.prototype.initialize.call(this, options);
        },
        star: function(nr,of){}
    });

    // array von fotos
    var Fotosklasse = Backbone.Collection.extend({
        model: foto,
        url: "http://localhost:80/fotos.js"
    });
    Fotos = new Fotosklasse();

    var debug = function(){
        //lesen
        console.log(Fotos.get(42).get("exif").date);

        //aendern
        var foto42 = Fotos.get(42);
        var exif = foto42.get("exif");
        exif.date = "tomorrow";
        foto42.set({"exif":exif});

        foto42.save();

        //oder
        //foto42.save({"exif":exif});

        //ausgeben
        console.log("JSONified:");
        console.log(foto42.toJSON());
    }

    //Fotos.bind("reset", debug, this);
    Fotos.fetch();
    });
