class Property < ActiveRecord::Base

  belongs_to :photo
  
  validates_presence_of :name
  validates_presence_of :value
  validates_presence_of :photo
  
  def raw_value
    read_attribute :value
  end
  
  def value
    return raw_value.gsub /^lang=\".*?\"\s+/, '' if name =~ /^xmp\./i
    raw_value
  end
end
