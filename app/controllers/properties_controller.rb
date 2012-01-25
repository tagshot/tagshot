class PropertiesController < ApplicationController
  
  def index
    photo = Photo.find(params[:photo_id])
    
    respond_to do |format|
      format.json { render json: photo.properties }
    end
  end
end
