/* This module removes all existing event bindings when closing a view.
 * It prevents dangling event bindings that may occur during navigation between views.
 */


Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
}
