module Tagshot
  class ImageSyncronizer
    def initialize(source, image)
      @source  = source
      @image   = image
      @photo   = @source.photos.find_by_file image.file.path
      @photo ||= @source.photos.new :file => image.file.path, 
                    :size => image.file.size,
                    :file_mtime => image.file.mtime
    end
    
    def sync!
      # db photo not changed; file changed
      # or
      # db and file changed; override db
      self.read!  if @photo.file_mtime < @image.file.mtime
                    
      # db photo changed; file not changed
      self.write! if @photo.updated_at > @image.file.mtime and
                    @photo.file_mtime == @image.file.mtime
    end
    
    def read!
      # clean up
      @photo.tags.clear
      @photo.properties.clear
      
      @image.each do |key,value|
        if key == 'Iptc.Application2.Keywords'
          value = [value] unless value.is_a?(Array)
          value.each do |tag|
            puts "  Add iptc tag #{tag}"
            tag = Tag.find_or_create_by_name(tag)
            @photo.tags << tag unless @photo.tags.include?(tag)
          end
        elsif key == 'Xmp.iptc.Keywords'
          value.strip.split(/\s*,\s*/).each do |tag|
            puts "  Add xmp tag #{tag}"
            tag = Tag.find_or_create_by_name(tag)
            @photo.tags << tag unless @photo.tags.include?(tag)
          end
        else
          puts "  Add property #{key} => #{value}"
          key = Key.find_or_create_by_name key
          @photo.properties.create :key_id => key.id, :value => value
        end
      end
      
      @photo.file_mtime   = @image.file.mtime
      @photo.last_sync_at = Time.zone.now
      @photo.save!
    end
    
    def write!
      @image['Iptc.Application2.Keywords'] = ""
      
      tags = @photo.tags.map(&:name)
      puts "  Write tags #{tags.join ', '}"
      @image['Xmp.iptc.Keywords'] = tags.join ', '
      tags.each { |tag| @image.add 'Iptc.Application2.Keywords', tag }
      
      @image.save!
    end
  end
end
