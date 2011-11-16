class PhotoDecorator < ApplicationDecorator
  decorates :photo

  def as_json(opts = {})
    {
      :id => model.id,
      :thumb => "photos/#{model.id}#{File.extname(model.file)}",
      :meta => Hash[model.properties.map { |p| [p.name, p.value] }],
      :tags => model.tags.names,
      :properties => Hash[model.class.meta_property_names.map { |name| [name, model.send(name)] }]
    }
  end
end
