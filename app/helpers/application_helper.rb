module ApplicationHelper
  def mustache_templates
    Dir[Rails.root.join(*%w{app views mustache *})].map do |file|
      id      = File.basename(file).gsub(/\..*$/, '')
      content = (render :file => file).gsub(/\s+/, ' ')

      "<script id=\"#{id}-template\" type=\"text/x-mustache\">#{content}</script>"
    end.join("\n").html_safe
  end

  def download_photo_url(photo, opts = {})
    return url_for(photo.path) if photo.is_a?(Thumb)
    return url_for(photo.thumb(opts).path) if photo.is_a?(Photo)
    return nil
  end
end

