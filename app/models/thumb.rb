class Thumb
  def initialize(photo, opts = {})
    @photo = photo.is_a?(Photo) ? photo : Photo.find(photo)
    @options = {
      :width => 100,
      :height => 100,
      :crop => true,
      :scale => false
    }.merge(opts)
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

  def exist?
    File.exists?(path)
  end
  alias_method :exists?, :exist?

  def filename
    name = [@photo.id, "#{width}x#{height}"]
    name << 'croped' if crop?
    name << 'scaled' if scale? and !crop?

      tags = @photo.tag_names.map{|tag| tag.gsub(/[^A-z0-9]+/, '')}.join('-').gsub(/\s+/, '_')
    name << "#{tags}" if tags

    "#{name.join('_')}.#{@photo.extname}"
  end

  def path
    Rails.root.join(Tagshot::Application.config.thumbs_path, @photo.id, filename)
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
end

