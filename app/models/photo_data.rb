class PhotoData < ActiveRecord::Base
  belongs_to :photo

  include Tagshot::MetaProperties
  
  meta_property :caption, 'Xmp.dc.title', 'Iptc.Application2.Headline'
  meta_property :description, 'Xmp.dc.description', 'Iptc.Application2.Caption', 'Exif.Photo.UserComment'
  meta_property :rating, 'Xmp.xmp.Rating', 'Iptc.Application2.Urgency', default: 0, process_with: :to_i
  meta_property :location, 'Xmp.iptc.Location', 'Iptc.Application2.LocationName'
  meta_property :date, 'Exif.Image.DateTime', readonly: true
  meta_property :exposureMode, 'Exif.Photo.ExposureMode', 'Xmp.exif.ExposureMode', readonly: true
  meta_property :owner, 'Xmp.aux.OwnerName'
  meta_property :creator, 'Xmp.aux.OwnerName', 'Xmp.dc.creator'
  meta_property :isoSpeedRating, 'Exif.Photo.ISOSpeedRatings', readonly: true
  meta_property :aperture, 'Exif.Photo.FNumber', 'Xmp.exif.FNumber', readonly: true
  meta_property :exposureTime, 'Exif.Photo.ExposureTime', readonly: true
  meta_property :lens, 'Xmp.aux.Lens', readonly: true
end
