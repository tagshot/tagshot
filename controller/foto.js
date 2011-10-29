App = {
  models : {},
  views : {},
  init : function () {
    var photoList = new App.models.PhotoList();
    photoList.fetch({success : function () {
      var view = new App.views.PhotoListView({
        collection : photoList
      });
      view.render();
    }});
  }
};

$(document).ready(App.init);

