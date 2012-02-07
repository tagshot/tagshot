class Tagshot::SyncJob

  def initialize(source_id, file)
    @source_id = source_id
    @file      = file
  end

  def syncronize(options)
    @options = options.reverse_merge(write: true, read: true, block: false, force: false)
    if @options[:block]
      self.perform
    else
      Delayed::Job.enqueue self
    end
  end

  def perform
    @source = Source.find_by_id(@source_id)
    raise "Invalid source id!" unless @source

    @image = Tagshot::Image.new @file
    @photo = @source.photo_by_file @file

    # db photo not changed; file changed
    # or
    # db and file changed; override db
    if @options[:read]
      self.read! if @photo.last_sync_at.nil? or @photo.last_sync_at < File.mtime(@photo.file) or @options[:force]
    end

    if not self.class.readonly and @options[:write]
      # db photo changed; file not changed
      self.write! if @photo.last_sync_at < @photo.updated_at or @options[:force]
    end

    @image = nil
  end

  def read!
    # clean up
    @photo.transaction do
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
          Property.create photo: @photo, name: key, value: value[0..254]
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

  def self.readonly
    Tagshot::Application.config.sync_readonly
  rescue
    true
  end
end

