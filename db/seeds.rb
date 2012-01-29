# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Source.create!(:path => Rails.root.join(*%w{test images}).to_s, :name => "Test Images", :year => 2011)

require 'auth_source'

as = PasswordAuthSource.create!
User.create!(:login => 'admin', :password => 'admin', :admin => true, :auth_source_id => as.id)
