class PhotoDecorator < ApplicationDecorator
  decorates :photo

  def as_json(opts)
    props = Hash[model.properties.map { |p| [p.key.name, p.value] }]
    {
      :id => model.id,
      :thumb => "photos/#{model.id}#{File.extname(model.file)}",
      :properties => props,
      :tags => model.tags.to_a,
      :rating => props['"Iptc.Application2.Urgency'] || 0
    }
  end
end
