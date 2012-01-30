module Tagshot
  class Syncronizer
    
    def initialize(source)
      @source = source
    end
    
    def sync!
      return if @source.nil?
      file_num = 0
      files.each do |file|
        file_num += 1
        puts "Sync #{file_num} of #{files.length}: #{File.basename(file).from_fs_encoding} ... "
        sync file
      end
    end
    
    def read!
      return if @source.nil?
      file_num = 0
      files.each do |file|
        file_num += 1
        puts "Read #{file_num} of #{files.length}: #{File.basename(file).from_fs_encoding} ... "
        read file
      end
    end
    
  private # -------------------------------------------------------------------
    def files
      @files ||= Dir[File.join(@source.path.to_fs_encoding, '**', '*')].select{|f| File.file?(f)}
      @files
    end
  
    def sync(file)
      ImageSyncronizer.new(@source, Image.new(file)).sync!
    rescue StandardError => e
      puts "SYNC ERROR: #{e}"
    end
    
    def read(file)
      ImageSyncronizer.new(@source, Image.new(file)).read!
    rescue StandardError => e
      puts "READ ERROR: #{e}"
    end
  end
end
