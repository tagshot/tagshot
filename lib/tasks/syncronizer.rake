namespace :tagshot do
  task :index => :environment do
    Tagshot.index!
  end
  task :sync => :environment do
    Tagshot.sync_all!
  end
  task :read => :environment do
    Tagshot.read_all!
  end
  task :save => :environment do
    Tagshot.save_all!
  end
end
