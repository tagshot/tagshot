class Photo
	include MongoMapper::Document

	key :url, String
	key :thumb, String
	key :exif, Hash
	key :iptc, Hash
end
