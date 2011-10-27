$(function(){
    var foto = Backbone.Model.extend({
        //methoden der fotoistanz als json    
    });

    // array von fotos
    var Fotosklasse = Backbone.Collection.extend({
        model: foto,
        url: "http://localhost:8888/fotos.json"

    });
    Fotos = new Fotosklasse();


    Fotos.bind("reset", function(){console.log("geladen")}, this);
    Fotos.fetch();
});
