class TagsController < ApplicationController
  respond_to :json
  
  def index
    Tag.transaction do
      tags = Tag.scoped(:include => :photos)
      tags = tags.where("#{Tag.table_name}.name LIKE ?", "%#{params[:query]}%") if params[:query]
      tags = tags.where("#{Tag.table_name}.name LIKE ?", "#{params[:start]}%")  if params[:start]
      
      @tags = {}
      tags.each do |tag|
        @tags[tag.name] = tag.photos.count
      end
    end
    
    respond_with @tags
  end
end
