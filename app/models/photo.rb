class Photo < ActiveRecord::Base
  
  belongs_to :source
  has_many :properties
  has_and_belongs_to_many :tags, :uniq => true
  
end
