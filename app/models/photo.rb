class Photo < ActiveRecord::Base
  
  belongs_to :source
  has_many :properties
  has_and_belongs_to_many :tags, :uniq => true
  
  
  def as_json(opts)
    {
      :id => id,
      :file => file,
      :properties => Hash[self.properties.map { |p| [p.key.name, p.value] }],
      :tags => self.tags.map(&:name)
    }
  end
end
