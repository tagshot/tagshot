module Tagshot
  class Image
    attr_reader :file
    
    def initialize(file)
      @file = file.is_a?(File) ? file.path : file
      @image = Exiv2::ImageFactory.open @file
      @image.read_metadata
    end
    
    def [](key)
      return @image.exif_data[key] if key =~ /^exiv/i
      return @image.iptc_data[key] if key =~ /^iptc/i
      return @image.xmp_data[key]  if key =~ /^xmp/i
      raise "Unknown key: #{key}"
    end
    
    def []=(key, value)
      return @image.exif_data[key] = value if key =~ /^exiv/i
      return @image.iptc_data[key] = value if key =~ /^iptc/i
      return @image.xmp_data[key]  = value if key =~ /^xmp/i
      raise "Unknown key: #{key}"
    end
    
    def add(key, value)
      return @image.exif_data.add key, value if key =~ /^exiv/i
      return @image.iptc_data.add key, value if key =~ /^iptc/i
      return @image.xmp_data.add  key, value if key =~ /^xmp/i
      raise "Unknown key: #{key}"
    end
    
    def each(&block)
      @image.exif_data.each &block
      @image.iptc_data.each &block
      @image.xmp_data.each  &block
    end
    
    def save!
      @image.write_metadata
    end
  end
end
