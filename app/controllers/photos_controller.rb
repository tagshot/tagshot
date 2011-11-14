class PhotosController < ApplicationController
  
  def index
    @photos = Photo.all
    
    respond_to do |format|
      format.html
      format.json do
        render :json => @photos.as_json(:include => {
            :tags => {}, 
            :properties => {:include => :key},
            :source => {}
          })
      end
    end
  end
end
