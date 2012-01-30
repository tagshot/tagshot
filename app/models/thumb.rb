require "fileutils"
require "RMagick"

class Thumb

  def initialize(photo)
    @photo_id = photo.is_a?(Photo) ? photo.id : photo.to_i
    @photo    = photo if photo.is_a?(Photo)
  end

  def photo
    @photo ||= Photo.find(@photo_id)
  end

  def file
    create! unless cached?

    File.new path
  end

  def name
    "#{@photo_id}_thumb.jpg"
  end

  def path
    @path ||= Rails.root.join(self.class.cache_path, name).to_s.to_fs_encoding
  end

  def cached?
    self.class.cache_enabled? and File.exist?(path)
  end

  def updated_at
    exist? ? File.mtime(path) : Time.utc
  end

  def create!
    Rails.logger.info "Create thumb for photo #{photo.id}..."

    width  = self.class.defaults[:width]
    height = self.class.defaults[:height]

    image =  Magick::Image.read(photo.file.to_fs_encoding).first
    if self.class.defaults[:crop]
      image.crop_resized!(width, height, Magick::CenterGravity)
    else
      if self.class.defaults[:scale]
        image.change_geometry!("#{width}x#{height}") do |cols, rows, img|
          img.resize!(cols, rows)
        end
      else
        image.resize!(width, height)
      end
    end
    FileUtils.mkpath File.dirname(path)
    image.write(path)
  end

  def purge!
    File.delete(path)
  end

  def self.defaults
    defaults = {
      :width => 100,
      :height => 100,
      :crop => true,
      :scale => true
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

  def purge!
    Dir[Rails.root, self.cache_path, '*'].each do |dir|
      FileUtils.remove_dir dir, true if File.directory?(dir)
    end
  end
end

