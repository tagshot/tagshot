class PhotoDecorator < ApplicationDecorator
  decorates :photo

  def as_json(opts = {})
    {
      :id => model.id,
      :thumb => h.thumb_url(model, :format => model.extname),
      :image => h.photo_url(model, :format => model.extname),
      :tags => model.tags.names,
      :properties => model.data.as_json
    }
  end
end

