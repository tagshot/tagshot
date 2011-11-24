class TagsController < ApplicationController
  respond_to :json
  
  def index
    @tags = Tag.scoped
    @tags = @tags.where("name LIKE ?", "%#{params[:query]}%") if params[:query]
    @tags = @tags.where("name LIKE ?", "#{params[:start]}%") if params[:start]
    @tags = @tags.map(&:name)
    
    respond_with @tags
  end
end
