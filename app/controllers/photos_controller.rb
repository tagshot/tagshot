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

  def thumb
    @photo = Photo.find(params[:id])

    @photo.thumb.create! if params[:force] == 'true'

    respond_to do |format|
      format.jpg { send_file @photo.thumb.file.path, :disposition => 'inline' }
    end
  end

  def download
    @photo = Photo.find(params[:id])

    width = 0
    height = 0

    if params[:width] and !params[:height]
      width = params[:width].to_i
      height = params[:width].to_i
    else
      height = params[:height].to_i if params[:height]
      width = params[:width].to_i if params[:width]
    end

    if width.to_i == 0 and height.to_i == 0 or
        width.to_i > 2048 or height.to_i > 2048
      head 406
      return
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

    respond_to do |format|
      format.jpg { send_data image.to_blob,
                     :disposition => 'inline',
	                   :type => 'image/jpg' }
    end
  end

  def render_json(obj)
    render :json => PhotoDecorator.decorate(obj)
  end
end

