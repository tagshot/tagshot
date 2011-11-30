class PhotosController < ApplicationController
  
  def index
    limit = params[:limit].try(:to_i) || 100
    limit = limit > 100 ? 100 : limit
    offset = params[:offset].try(:to_i) || 0
    
    @photos = Photo.limit(limit).offset(offset).all(:include => [:tags, :properties])
    
    respond_to do |format|
      format.html
      format.json do
        render_json @photos
      end
    end
  end
  
  def show
    @photo = Photo.find(params[:id])
    
    if @photo.extname == params[:format]
      send_file @photo.file
    else
      respond_to do |format|
        format.json { render_json @photo }
      end
    end
  end
  
  def update
    @photo = Photo.find(params[:id])
    
    if params[:photo].is_a?(Hash) and params[:photo][:tags].present?
      @photo.tags = params[:photo][:tags]
    end
    
    if @photo.save
      render_json @photo
    else
      render :json => @photo.errors, :status => :unprocessable_entity
    end
  end
  
  def render_json(obj)
    render :json => PhotoDecorator.decorate(obj)
  end
end
