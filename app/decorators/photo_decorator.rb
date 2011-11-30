class PhotoDecorator < ApplicationDecorator
  decorates :photo

  def as_json(opts = {})
    {
      :id => model.id,
      :thumb => h.thumb_url(model, :format => model.extname),
      :image => h.photo_url(model, :format => model.extname),
      :meta => Hash[model.properties.map { |p| [p.name, p.value] }],
      :tags => model.tags.names,
      :properties => Hash[model.class.meta_property_names.map { |name| [name, model.send(name)] }]
    }
  end
end
