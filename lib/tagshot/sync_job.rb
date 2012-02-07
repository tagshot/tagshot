class Tagshot::SyncJob

  def initialize(source_id, file)
    @source_id = source_id
    @file      = file
  end

  def syncronize(options)
    @options = options.reverse_merge(block: false)
    if @options[:block]
      self.perform
    else
      Delayed::Job.enqueue self
    end
  end

  def perform
    source = Source.find_by_id(@source_id)
    raise "Invalid source id (#{@source_id})!" unless source

    image = Tagshot::Image.new @file
    photo = source.photo_by_file @file

    Tagshot::Syncronizer.new(photo, image).syncronize @options
  end

  def self.readonly
    Tagshot::Application.config.sync_readonly
  rescue
    true
  end
end

