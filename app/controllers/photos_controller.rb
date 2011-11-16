class PhotosController < ApplicationController
  
  def index
    @photos = PhotoDecorator.all
    
    respond_to do |format|
      format.html 
      format.json do
        sleep 2
        render :json => @photos
      end
    end
  end
  
  def show
    @photo = Photo.find(params[:id])
    
    if @photo.file =~ /\.#{params[:format]}$/
      send_file @photo.file
    else
      render :json => PhotoDecorator.decorate(@photo)
    end
  end
end
