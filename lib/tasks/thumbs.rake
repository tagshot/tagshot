namespace :tagshot do
  namespace :thumbs do
    # Create thumbnail if no exists
    task :create => :environment do
      Photo.all.each do |photo|
        photo.thumb.create delayed: true ? print('.') : print('-')
      end
      puts
    end

    # Force thumbnail creation
    task :create! => :environment do
      Photo.all.each do |photo|
        photo.thumb.delay.create!
        print '.'
      end
      puts
    end

    namespace :b do
      task :create => :environment do
        Photo.all.each do |photo|
          photo.thumb.create
          print '.'
        end
        puts
      end

      task :create! => :environment do
        Photo.all.each do |photo|
          photo.thumb.create!
          print '.'
        end
        puts
      end
    end
  end
end
