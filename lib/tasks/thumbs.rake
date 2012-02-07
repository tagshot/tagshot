namespace :tagshot do
  task :create_thumbs => :environment do
    Tagshot.create_thumbs!
  end
end
