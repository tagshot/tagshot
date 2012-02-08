namespace :tagshot do
  task :index => :environment do
    Tagshot.index!
  end

  task :sync => :environment do
    Source.all.each do |source|
      puts "Add sync job for source #{source.path}"
      source.syncronize force: ENV['FORCE']
    end
  end

  task :read => :environment do
    Source.all.each do |source|
      puts "Add read jobs for source #{source.path}"
      source.syncronize write: false, force: ENV['FORCE']
    end
  end

  task :write => :environment do
    Source.all.each do |source|
      puts "Add write jobs for source #{source.path}"
      source.syncronize read: false, force: ENV['FORCE']
    end
  end

  namespace :b do
    task :sync => :environment do
      Source.all.each do |source|
        puts "Sync source #{source.path}"
        source.syncronize block: true, force: ENV['FORCE']
      end
    end

    task :read => :environment do
      Source.all.each do |source|
        puts "Read source #{source.path}"
        source.syncronize write: false, block: true, force: ENV['FORCE']
      end
    end

    task :write => :environment do
      Source.all.each do |source|
        puts "Write source #{source.path}"
        source.syncronize read: false, block: true, force: ENV['FORCE']
      end
    end
  end
end
