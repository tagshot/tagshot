class Photo < ActiveRecord::Base
  
  has_many :properties
  has_and_belongs_to_many :tags
end
