module Tagshot
  class ImageSyncronizer
    def initialize(source, image)
      @source  = source
      @image   = image
      @photo   = @source.photos.find_by_file image.file
      @photo ||= @source.photos.create :file => image.file,
                    :size => File.size(image.file)
    end

    def sync!
      # db photo not changed; file changed
      # or
      # db and file changed; override db
      self.read! if @photo.last_sync_at.nil? or @photo.last_sync_at < File.mtime(@image.file)

      # db photo changed; file not changed
      self.write! if @photo.last_sync_at < @photo.updated_at
    end

    def read!
      # clean up
      Photo.transaction do
        @photo.tags.destroy_all
        @photo.properties.destroy_all

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
            Property.create photo: @photo, name: key, value: value
          end
        end

        @photo.update_attributes(:last_sync_at => Time.zone.now)
        @photo.data.load_meta_properties.save
      end
    end

    def write!
      @image['Iptc.Application2.Keywords'] = ""

      tags = @photo.tags.to_a
      if tags.length > 0
        puts "  Write tags " + tags.map {|t| t.name }.join(', ').inspect
        @image['Xmp.iptc.Keywords'] = tags.map{|t|t.name}.join ', '
        tags.each { |tag| @image.add 'Iptc.Application2.Keywords', tag.name }
      else
        @image['Xmp.iptc.Keywords'] = ''
      end
      @image.save!

      @photo.update_attributes(:last_sync_at => Time.zone.now + 5.seconds)
    end
  end
end

