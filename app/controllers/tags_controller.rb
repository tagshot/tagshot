class TagsController < ApplicationController
  respond_to :json
  
  def index
    @tags = Tag.scoped
    @tags = @tags.where("#{Tag.table_name}.name LIKE ?", "%#{params[:query]}%") if params[:query]
    @tags = @tags.where("#{Tag.table_name}.name LIKE ?", "#{params[:start]}%") if params[:start]
    @tags = @tags.map(&:name)
    
    respond_with @tags
  end
end
