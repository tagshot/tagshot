source 'http://rubygems.org'

# Choose gem depending on your database
# Create config/database.yml with required database configuration depending
# on your system. See config/database.yml.example for more information.
#
# Sqlite3
gem 'sqlite3'

# PostgressSQL
# gem 'pg'

# MySQL
# gem 'mysql2'

gem 'rails', '~> 3.2'
gem 'jquery-rails'
gem 'rails-backbone'
gem 'exiv2'
gem 'draper'
gem 'delayed_job'
gem 'delayed_job_active_record'
gem 'daemons'
gem 'rmagick'
gem 'timfel-krb5-auth', '~> 0.8'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails'
  gem 'coffee-rails'
  gem 'uglifier'
  gem 'execjs'
  gem 'therubyracer', :platform => :ruby
end
group :development, :test do
  gem 'rspec-rails'
  gem 'capistrano',        :require => false
  gem 'capistrano_colors', :require => false
  gem 'guard-rails',       :require => false
end
# testing gems
group :test do
  gem 'factory_girl_rails'
  gem 'accept_values_for'
  gem 'database_cleaner'
  gem 'spork',       :require => false
  gem 'turn',        :require => false
  gem 'guard-rspec', :require => false
  gem 'guard-spork', :require => false
end

