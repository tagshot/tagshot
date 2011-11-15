module Tagshot
  class Syncronizer
    
    def initialize(source)
      @source = source
    end
    
    def sync!
      return if @source.nil?
      Dir[File.join(@source.path, '**')].each do |file|
        ImageSyncronizer.new(@source, Image.new(file)).sync!
      end
    end
    
    def read!
      return if @source.nil?
      Dir[File.join(@source.path, '**')].each do |file|
        ImageSyncronizer.new(@source, Image.new(file)).read! 
      end
    end

  end
end
