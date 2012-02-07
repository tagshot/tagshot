namespace :tagshot do
  namespace :thumbs do
    # Create thumbnail if no exists
    task :create => :environment do
      Photo.all.each do |photo|
        photo.thumb.create delayed: true
      end
    end

    # Force thumbnail creation
    task :create! => :environment do
      Photo.all.each do |photo|
        photo.thumb.delay.create!
      end
    end

    namespace :b do
      task :create => :environment do
        Photo.all.each do |photo|
          photo.thumb.create
          prints '.'
        end
      end

      task :create! => :environment do
        Photo.all.each do |photo|
          photo.thumb.create!
          prints '.'
        end
      end
    end
  end
end
