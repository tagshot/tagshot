class Tagshot::ThumbJob

  def initialize(photo_id)
    @photo_id = photo_id
  end

  def perform
    Photo.find(@photo_id).thumb.create
  end
end