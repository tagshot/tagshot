class Property < ActiveRecord::Base

  belongs_to_many :photos
  has_many_and_belongs_to_many :keys  
end
