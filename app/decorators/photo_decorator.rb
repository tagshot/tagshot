class PhotoDecorator < ApplicationDecorator
  decorates :photo

  def as_json(opts = {})
    {
      id: model.id,
      thumb: h.thumb_url(model, :format => model.extname.downcase),
      image: h.photo_url(model, :format => model.extname),
      tags: model.tags.names,
      meta: model.data.meta_properties(readonly: true).as_json,
      properties: model.data.meta_properties(readonly: false).as_json
    }
  end
end

