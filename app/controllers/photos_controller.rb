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
    
    if @photo.file =~ /\.#{params[:format]}$/
      send_file @photo.file
    else
      render_json @photo
    end
  end
  
  def update
    @photo = Photo.find(params[:id])
    @photo.tags = params[:tags] unless params[:tags].nil?
    
    render_json @photo
  end
  
  def render_json(obj)
    render :json => PhotoDecorator.decorate(obj)
  end
end
