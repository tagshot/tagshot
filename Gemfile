source 'http://rubygems.org'

gem 'rails', '3.2'

# Choose gem depending on your database
# Create config/database.yml with required database configuration depending
# on your system. See config/database.yml.example for more information.
gem 'sqlite3'
#gem 'pg'
#gem 'mysql2'

#gem 'mongo_mapper'
#gem 'bson_ext'	# better performance, MonogDB protocol in C


gem 'jquery-rails'
gem 'rails-backbone'
gem 'exiv2'
gem 'draper'
gem 'delayed_job'
gem 'rmagick'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails'
  gem 'coffee-rails'
  gem 'uglifier'
  gem 'therubyracer' if RUBY_PLATFORM.downcase.include?("linux")
end
group :development, :test do
  gem 'rspec-rails'
  gem 'capistrano'
end
# testing gems
group :test do
  gem 'turn', :require => false
  gem 'factory_girl_rails'
  gem 'accept_values_for'
  gem 'guard-rspec'
  gem 'spork'
  gem 'guard-spork'
end

