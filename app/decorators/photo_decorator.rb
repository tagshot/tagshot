class PhotoDecorator < ApplicationDecorator
  decorates :photo

  def as_json(opts)
    {
      :id => model.id,
      :thumb => "photos/#{model.id}#{File.extname(model.file)}",
      :properties => Hash[model.properties.map { |p| [p.key.name, p.value] }],
      :tags => model.tags.map(&:name)
    }
  end
end
