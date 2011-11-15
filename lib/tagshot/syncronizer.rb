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
                      
      puts "Processing #{image.file.path}..."
      
      photo.tags.clear
      photo.properties.clear
      
      image.each do |key,value|
        if key == 'Iptc.Application2.Keywords'
          value = [value] unless value.is_a?(Array)
          value.each do |tag|
            puts "  Add iptc tag #{tag}"
            photo.tags.find_or_create_by_name(tag)
          end
        elsif key == 'Xmp.iptc.Keywords'
          value.strip.split(/\s*,\s*/).each do |tag|
            puts "  Add xmp tag #{tag}"
            photo.tags.find_or_create_by_name(tag)
          end
        else
          puts "  Add property #{key} => #{value}"
          key = Key.find_or_create_by_name key
          photo.properties.create :key_id => key.id, :value => value
        end
      end
      
      photo.save
    end
    
    def write(image)
      photo = @source.photos.find_by_file image.file.path
      
      photo.properties.each do |prop|
        image[prop.key.name] = prop.value
      end
      
      tags = photo.tags.map(&:name)
      tags.each { |tag| image.iptc_data.add 'Iptc.Application2.Keywords', tag }
      
      image.write_metadata
    end
  end
end
