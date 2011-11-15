class Tag < ActiveRecord::Base

  has_and_belongs_to_many :photos, :uniq => true
  
  validates_uniqueness_of :name
  validates_presence_of :name

end
