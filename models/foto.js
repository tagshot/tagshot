$(function(){
    var foto = Backbone.Model.extend({
        //methoden der fotoistanz als json
        star: function(nr,of){}
    });

    // array von fotos
    var Fotosklasse = Backbone.Collection.extend({
        model: foto,
        url: "http://localhost:80/fotos.js"
    });
    Fotos = new Fotosklasse();

    var debug = function(){
        console.log("geladen");
        console.log(Fotos.get(42).get("exif").date);

        //aendern
        var foto42 = Fotos.get(42);
        var exif = foto42.get("exif");
        console.log(exif);
        exif.date = "tomorrow";
        foto42.set({"exif":exif});

        foto42.save();
    }

    Fotos.bind("reset", debug, this);
    Fotos.fetch();
});
