class Source < ActiveRecord::Base
  
  has_many :photos
  
  validates_presence_of :name, :path
end
