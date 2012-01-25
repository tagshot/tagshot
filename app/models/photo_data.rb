class PhotoData < ActiveRecord::Base
  belongs_to :photo

  include Tagshot::MetaProperties
  
  meta_property :caption, 'Xmp.dc.title', 'Iptc.Application2.Headline'
  meta_property :description, 'Xmp.dc.description', 'Iptc.Application2.Caption', 'Exif.Photo.UserComment'
  meta_property :rating, 'Iptc.Application2.Urgency', default: 0, process_with: :to_i
  meta_property :location, 'Xmp.iptc.Location', 'Iptc.Application2.LocationName'
  meta_property :date, 'Exif.Image.DateTime'
  meta_property :exposureMode, 'Exif.Photo.ExposureMode', 'Xmp.exif.ExposureMode'
  meta_property :owner, 'Xmp.aux.OwnerName'
end
