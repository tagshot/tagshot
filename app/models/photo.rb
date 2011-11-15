class Photo < ActiveRecord::Base
  
  belongs_to :source
  has_many :properties
  has_and_belongs_to_many :tags, :uniq => true

  include Tagshot::TagHelper
  include Tagshot::MetaProperties
  
  meta_property :caption, 'Xmp.dc.title', 'Iptc.Application2.Headline'
  meta_property :description, 'Xmp.dc.description', 'Iptc.Application2.Caption', 'Exif.Photo.UserComment'
  meta_property :rating, 'Iptc.Application2.Urgency', :default => 0, :do => :to_i
  meta_property :location, 'Xmp.iptc.Location', 'Iptc.Application2.LocationName'
  
end
