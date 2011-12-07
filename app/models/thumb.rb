class Thumb
  def initialize(photo, opts = {})
    @photo = photo.is_a?(Photo) ? photo : Photo.find(photo)
    @options = self.class.defaults.merge(opts)
  end

  def height
    @options[:height].to_i
  end

  def width
    @options[:width].to_i
  end

  def crop?
    @options[:crop] ? true : false
  end

  def scale?
    @options[:scale] ? true : false
  end

  def cached?
    File.exists?(path)
  end

  def cache?
    @options[:cache] ? true : false
  end

  def path
    options = {
      :id => @photo.id,
      :width => width,
      :filename => name,
      :format => 'jpg'
    }
    options[:height] = height if height != width
    options[:crop] = 'crop' if crop?
    options[:crop] = 'scale' if !crop? and scale?

    Rails.application.routes.url_helpers.download_photo_path options
  end

  def filename
    "#{name}.#{@photo.extname}"
  end

  def name
    name = [@photo.id, "#{width}x#{height}"]
    name << 'croped' if crop?
    name << 'scaled' if scale? and !crop?

      tags = @photo.tag_names.map{|tag| tag.gsub(/[^A-z0-9]+/, '')}.join('-').gsub(/\s+/, '_')
    name << "#{tags}" if tags.length > 0

    "#{name.join('_')}"
  end

  def file
    Rails.root.join(self.cache_path, @photo.id, filename)
  end

  def image
    return @image if @image

    require "RMagick"

    @image =  Magick::Image.read(@photo.file).first
    if crop?
      @image.crop_resized!(width, height, Magick::CenterGravity)
    else
      if scale?
        @image.change_geometry!("#{width}x#{height}") do |cols, rows, img|
          img.resize!(cols, rows)
        end
      else
        @image.resize!(width, height)
      end
    end

    @image
  end

  def self.defaults
    defaults = {
      :width => 100,
      :height => 100,
      :crop => true,
      :scale => true,
      :cache => true
    }
    begin
      defaults.merge!(Tagshot::Application.config.thumb_options)
    rescue
    end
    defaults
  end

  def self.cache_path
    Tagshot::Application.config.thumb_cache_path
  rescue
    "tmp/thumbs"
  end

  def self.cache_enabled?
    Tagshot::Application.config.thumb_cache ? true : false
  rescue
    true
  end

  def self.create(photo, opts = {})
    Thumb.new(photo, opts)
  end
end

