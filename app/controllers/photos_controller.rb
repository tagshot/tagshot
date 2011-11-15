class PhotosController < ApplicationController
  
  def index
    @photos = PhotoDecorator.all
    
    respond_to do |format|
      format.html
      format.json do
        render :json => @photos.as_json
      end
    end
  end
  
  def show
    @photo = Photo.find(params[:id])
    
    render :status => :not_found and return unless @photo.file =~ /\.#{params[:format]}$/
    
    send_file @photo.file
  end
end
