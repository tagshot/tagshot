module ApplicationHelper
  def mustache_templates
    Dir[Rails.root.join(*%w{app views mustache *})].map do |file|
      id      = File.basename(file).gsub(/\..*$/, '')
      content = (render :file => file).gsub(/\s+/, ' ')

      "<script id=\"#{id}-template\" type=\"text/x-mustache\">#{content}</script>"
    end.join("\n").html_safe
  end

  def download_url(photo, opts = {})
    photo = Photo.find(photo.to_i) unless photo.is_a?(Photo)
    tags  = photo.tags.names.map{|t| t.gsub(/[^A-z0-9]+/, '').gsub(/\s+/, '_')}.join('-')

    name  = [photo.id]
    name << "#{opts[:width]}x#{opts[:height]}"
    name << "cropped" if opts[:crop]
    name << "streched" if !opts[:crop] and !opts[:scale]
    name << tags if tags.length > 0

    options = {
      :width => 100,
      :height => 100
    }
    options[:name] => name.join('_')
    options[:id]   => photo.id
    options[:crop] => 'scale' if opts[:scale]
    options[:crop] => 'crop'  if opts[:crop]
    options[:format] => 'jpg'

    download_photo_url options
  end
end

