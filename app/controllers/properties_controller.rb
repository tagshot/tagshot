class PropertiesController < ApplicationController
  before_filter :require_authentication

  def index
    photo = Photo.find(params[:photo_id])
    
    respond_to do |format|
      format.json { render json: photo.properties, except: [:id, :photo_id] }
    end
  end
end
