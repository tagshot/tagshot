class Property < ActiveRecord::Base

  belongs_to :photo
  belongs_to :key
end
