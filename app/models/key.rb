class Key < ActiveRecord::Base
  
  has_many_and_belongs_to_many :properties
end
