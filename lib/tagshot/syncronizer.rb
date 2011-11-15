module Tagshot
  class Syncronizer
    
    def initialize(source)
      @source = source
    end
    
    def sync!
      return if @source.nil?
      Dir[File.join(@source.path, '**')].each do |file|
        try_action file, :sync!
      end
    end
    
    def read!
      return if @source.nil?
      Dir[File.join(@source.path, '**')].each do |file|
        try_action file, :read!
      end
    end
    
  private # -------------------------------------------------------------------
    def try_action(file, action)
      ImageSyncronizer.new(@source, Image.new(file)).send action
    rescue StandardError => e
      puts "ERROR: #{e}"
    end
  end
end
