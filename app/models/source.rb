class Source < ActiveRecord::Base
  
  has_many :photos
  
  validates_presence_of :name, :path

  def photo_by_file(file)
    photo   = photos.find_by_file file
    photo ||= photos.create :file => file, :size => File.size(file)
    photo
  end

  def syncronize(options = {})
    file_num = 0
    files.each do |file|
      puts ">> #{file_num += 1} of #{files.length}: #{File.basename(file).from_fs_encoding} ... "
      Tagshot::SyncJob.new(self.id, file.from_fs_encoding).syncronize options
    end
  end

  def files
    @files ||= Dir[File.join(path.to_fs_encoding, '**', '*')].select{|f| File.file?(f)}
    @files
  end

  def self.syncronize_all(options = {})
    self.each do |source|
      puts "#{options[:block] ? 'Syncronize' : 'Add jobs for'} source #{source.path}"
      source.syncronize options
    end
  end
end
