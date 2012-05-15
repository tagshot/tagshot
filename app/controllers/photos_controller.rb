class PhotosController < ApplicationController
  before_filter :require_authentication

  def index
    limit = params[:limit].try(:to_i) || 100
    limit = limit > 100 ? 100 : limit
    offset = params[:offset].try(:to_i) || 0

    @photos = Photo.limit(limit).offset(offset)
    @photos = @photos.includes(:photo_data)
    @photos = @photos.joins().order('photo_data.date DESC')

    if params[:q] and params[:q].present?
      @photos = Tagshot::SearchParser.new(@photos, params[:q]).convert
    end
    
    # force fetch
    @photos.all(:include => [:tags])

    respond_to do |format|
      format.html
      format.json { render_json @photos }
    end
  end

  def show
    @photo = Photo.find(params[:id])

    if @photo.extname.to_s.downcase == params[:format].to_s.downcase and
        @photo.extname.to_s.present?
      send_file @photo.file
    else
      respond_to do |format|
        format.json { render_json @photo }
      end
    end
  end

  def update
    @photo = Photo.find(params[:id])

    if params[:photo].is_a?(Hash) 
      if params[:photo][:tags].is_a?(Array)
        @photo.tags = params[:photo][:tags]
      end
      if params[:photo][:properties].is_a?(Hash)
        @photo.data.update_attributes!(params[:photo][:properties])
      end
    end

    if @photo.save
      render_json @photo
    else
      render :json => @photo.errors, :status => :unprocessable_entity
    end
  end

  def thumb
    @photo = Photo.find(params[:id])

    @photo.thumb.create! if params[:force] == 'true'

    if params[:format].downcase == 'jpg'
      send_file @photo.thumb.file.path, disposition: 'inline', type: 'image/jpeg'
    end
  end

  def download
    @photo = Photo.find(params[:id])

    if params[:format].downcase == 'jpg'
      width = 0
      height = 0

      if params[:width] and !params[:height]
        width = params[:width].to_i
        height = params[:width].to_i
      else
        height = params[:height].to_i if params[:height]
        width = params[:width].to_i if params[:width]
      end

      image =  Magick::Image.read(@photo.file).first
      if params[:crop] == 'crop'
        image.crop_resized!(width, height, Magick::CenterGravity)
      else
        if params[:crop] == 'scale'
          image.change_geometry!("#{width}x#{height}") do |cols, rows, img|
            img.resize!(cols, rows)
          end
        else
          image.resize!(width, height)
        end
      end
      
      send_data image.to_blob, disposition: 'attachment', type: 'image/jpeg'
    end
  end

  def render_json(obj)
    render :json => PhotoDecorator.decorate(obj)
  end
end

