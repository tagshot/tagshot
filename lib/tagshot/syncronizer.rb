module Tagshot
  class Syncronizer
    
    def initialize(source)
      @source = source
    end
    
    def sync!
      return if @source.nil?
      Dir[File.join(@source.path, '**')].each do |file|
        sync Image.new file
      end
    end
    
    def read!
      return if @source.nil?
      Dir[File.join(@source.path, '**')].each do |file|
        read Image.new file
      end
    end
    
    def save!
      return if @source.nil?
      Dir[File.join(@source.path, '**')].each do |file|
        save Image.new file
      end
    end
    
  private #--------------------------------------------------------------------
    def read(image)
      photo = @source.photos.find_or_create_by_file :file => image.file.path,
                      :size => image.file.size
      
      image.each do |key,value|
        key = Key.find_or_create_by_name key
        prop = photo.properties.find_or_create_by_key_id :key_id => key.id
        prop.value = value
        prop.save
      end
      
      photo.save
    end
  end
end
