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
      send_file @photo.file, :disposition => 'inline'
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

    respond_to do |format|
      format.jpg { send_data @photo.thumb.image.to_blob,
                     :disposition => 'inline',
	                   :type => 'image/jpg' }
    end
  end

  def download
    @photo = Photo.find(params[:id])

    opts = {
      :width => 320,
      :height => 200,
      :crop => false,
      :scale => false
    }

    if params[:width] and !params[:height]
      opts[:width] = params[:width].to_i
      opts[:height] = params[:width].to_i
    else
      opts[:height] = params[:height].to_i if params[:height]
      opts[:width] = params[:width].to_i if params[:width]
    end
    opts[:crop] = true if params[:crop] == 'crop'
    opts[:scale] = true if params[:crop] == 'scale'

    thumb = @photo.thumb(opts)
    thumb.image

    respond_to do |format|
      format.jpg { send_data thumb.image.to_blob,
                     :disposition => 'inline',
	                   :type => 'image/jpg' }
    end
  end

  def render_json(obj)
    render :json => PhotoDecorator.decorate(obj)
  end
end

