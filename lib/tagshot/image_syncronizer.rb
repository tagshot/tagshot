module Tagshot
  class ImageSyncronizer
    def initialize(source, image)
      @source  = source
      @image   = image
      @photo   = @source.photos.find_by_file image.file.path
      @photo ||= @source.photos.create :file => image.file.path, 
                    :size => image.file.size
    end
    
    def sync!
      # db photo not changed; file changed
      # or
      # db and file changed; override db
      self.read! if @photo.last_sync_at.nil? or @photo.last_sync_at < @image.file.mtime
                    
      # db photo changed; file not changed
      self.write! if @photo.last_sync_at < (@photo.updated_at - 1.minute)
    end
    
    def read!
      # clean up
      Photo.transaction do
        @photo.tags.delete_all
        @photo.properties.clear
        
        @image.each do |key,value|
          if key == 'Iptc.Application2.Keywords'
            value = [value] unless value.is_a?(Array)
            value.uniq.select(&:present?).each do |tag|
              #puts "  Add iptc tag #{tag.inspect}"
              @photo.tags << tag
            end
          elsif key == 'Xmp.iptc.Keywords'
            value.strip.split(/\s*,\s*/).uniq.select(&:present?).each do |tag|
              #puts "  Add xmp tag #{tag.inspect}"
              @photo.tags << tag
            end
          else
           # puts "  Add property #{key} => #{value}"
            @photo.properties.create :name => key, :value => value
          end
        end
        
        @photo.update_attributes(:last_sync_at => Time.zone.now)
      end
    end
    
    def write!
      @image['Iptc.Application2.Keywords'] = ""
      
      tags = @photo.tags.to_a
      if tags.length > 0
        puts "  Write tags #{tags.join(', ').inspect}"
        @image['Xmp.iptc.Keywords'] = tags.join ', '
        tags.each { |tag| @image.add 'Iptc.Application2.Keywords', tag }
      else
        @image['Xmp.iptc.Keywords'] = ''
      end
      @image.save!
      
      @photo.last_sync_at = Time.zone.now
      @photo.save!
    end
  end
end
