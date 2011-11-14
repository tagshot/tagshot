source 'http://rubygems.org'

gem 'rails', '3.1.1'

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
gem 'exiv2', '~> 0.0.6'


# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.1.4'
  gem 'coffee-rails', '~> 3.1.1'
  gem 'uglifier', '>= 1.0.3'
  gem 'therubyracer' if RUBY_PLATFORM.downcase.include?("linux")
end

# development and testing gems
group :development, :test do
  gem 'rspec-rails'
end
group :test do
  gem 'turn', :require => false
  gem 'factory_girl_rails'
  gem 'accept_values_for'
  gem 'guard-rspec'
end

